const $dagre = require('./dagre.js')

/**
 * 数据格式转换模块
 * 负责在后端数据格式和项目内部格式之间进行转换
 */

// 延迟加载mock数据，避免循环依赖
let mockPedigrees = null

function getMockPedigrees() {
  if (mockPedigrees === null) {
    try {
      // 尝试从全局变量获取
      if (window.mockPedigrees) {
        mockPedigrees = window.mockPedigrees
      } else {
        // 尝试动态导入
        const module = require('./api')
        mockPedigrees = module.mockPedigrees || []
      }
    } catch (e) {
      mockPedigrees = []
    }
  }
  return mockPedigrees
}

/**
 * 从URL参数获取家谱ID
 * @returns {number|null} 家谱ID
 */
export function getPedigreeIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('pedigreeId') || params.get('id')
  return id ? parseInt(id) : null
}

/**
 * 从导航栏获取家谱ID（通过页面元素）
 * @returns {number|null} 家谱ID
 */
export function getPedigreeIdFromNavbar() {
  // 尝试从导航栏元素获取
  const navbarElement = document.getElementById('pedigree-nav-id') || 
                        document.querySelector('[data-pedigree-id]') ||
                        document.querySelector('.pedigree-nav-item.active') ||
                        document.querySelector('.nav-item.active [data-id]')
  
  if (navbarElement) {
    const id = navbarElement.getAttribute('data-pedigree-id') || 
               navbarElement.getAttribute('pedigree-id') ||
               navbarElement.getAttribute('data-id') ||
               navbarElement.dataset.pedigreeId ||
               navbarElement.dataset.id
    
    if (id) {
      const parsed = parseInt(id)
      if (!isNaN(parsed)) {
        return parsed
      }
    }
  }
  
  // 如果导航栏没有，尝试从URL获取
  return getPedigreeIdFromUrl()
}

/**
 * 性别映射：后端格式 -> 项目格式
 */
export const genderMap = {
  1: 'M',  // 男
  2: 'F',  // 女
  0: 'U',  // 未知
  'M': 'M',
  'F': 'F',
  'U': 'U'
}

/**
 * 性别映射：项目格式 -> 后端格式
 */
export const genderReverseMap = {
  'M': 1,
  'F': 2,
  'U': 0,
  1: 1,
  2: 2,
  0: 0
}

/**
 * 将后端数据格式转换为项目内部格式（用于加载）
 * 
 * 层级结构规范（参考模板数据）：
 * - rank 0: 关系节点(rel+hub) 和 childhub节点（先证者的父母关系层）
 * - rank 1: 人员节点（先证者层）
 * - rank 2: 仅 childhub节点（先证者父母的父母关系层）
 * - rank 3: 人员节点（先证者父母层）
 * - rank 4: 仅 childhub节点（先证者祖父母的父母关系层）
 * - rank 5: 人员节点（先证者祖父母层）
 * - ...
 * 
 * 规则：
 * - 人员节点: rank = 1, 3, 5, 7...（奇数层级）
 * - 关系节点(rel+hub): rank = 0（所有关系节点都在最顶层）
 * - childhub节点: rank = 0, 2, 4, 6...（所有偶数层级）
 * - 断言检查: rank=2,4,6... 层级上的所有非虚拟节点必须是childhub节点
 * 
 * @param {object} backendData - 后端返回的数据
 * @returns {object} 项目内部格式对象
 */
export function backendToProjectFormat(backendData) {
  if (!backendData || !backendData.members || !Array.isArray(backendData.members)) {
    console.warn('backendToProjectFormat: 无效的后端数据')
    return null
  }

  const { members, relations = [] } = backendData
  
  if (members.length === 0) {
    return { GG: [], ranks: [], order: [], positions: [] }
  }

  // ========== 布局参数配置（与dagre.js保持一致）==========
  // 参考 dagre.js 中的默认配置：
  // - ranksep: 层级间距，默认50
  // - nodesep: 节点间距，默认50
  // - rankdir: 布局方向，默认"TB"(从上到下)
  // - rankalign: 层级对齐方式，默认"center"
  const LAYOUT_CONFIG = {
    rankSep: 50,      // 层级之间的垂直间距
    nodeSep: 50,      // 同一层级内节点之间的水平间距
    nodeWidth: 60,    // 节点宽度（人员节点）
    nodeHeight: 80,   // 节点高度（人员节点）
    hubWidth: 20,     // 关系节点/childhub节点宽度
    hubHeight: 20,    // 关系节点/childhub节点高度
    rankDir: 'TB',    // Top-Bottom 布局方向
    rankAlign: 'center' // 层级对齐方式
  }

  const genderMap = { 1: 'M', 2: 'F', 0: 'U', 'M': 'M', 'F': 'F', 'U': 'U' }
  
  const proband = members.find(m => m.isProband) || members[0]
  
  const parentChildRels = relations.filter(r => r.type === 'parent-child' || r.relationType === 2)
  
  const personIdToNodeId = new Map()
  const GG = []
  
  const nodesByRank = new Map()
  
  function ensureRankGroup(rank) {
    if (!nodesByRank.has(rank)) nodesByRank.set(rank, [])
  }
  
  function addNodeToRank(nodeId, rank) {
    ensureRankGroup(rank)
    nodesByRank.get(rank).push(nodeId)
  }
  
  const childToParentPairs = new Map()
  parentChildRels.forEach(r => {
    if (!childToParentPairs.has(r.toMemberId)) childToParentPairs.set(r.toMemberId, [])
    childToParentPairs.get(r.toMemberId).push(r.fromMemberId)
  })
  
  const processedMembers = new Set()
  const processedRelations = new Set()
  let nextNodeId = 0
  
  /**
   * 递归处理人员节点
   * @param {string} memberId - 人员ID
   * @param {number} personRank - 人员节点所在层级（奇数: 1, 3, 5...）
   * @returns {number} 生成的节点ID
   */
  function processMember(memberId, personRank = 1) {
    if (processedMembers.has(memberId)) return null
    
    const member = members.find(m => m.id === memberId)
    if (!member) return null
    
    const personNodeId = nextNodeId++
    
    personIdToNodeId.set(member.id, personNodeId)
    processedMembers.add(member.id)
    
    // 添加人员节点，包含尺寸信息（与dagre.js节点模型一致）
    GG.push({
      id: personNodeId,
      prop: {
        gender: genderMap[member.gender] || 'U',
        name: member.name || ''
      },
      // 节点尺寸信息，用于布局计算（参考dagre.js的节点模型）
      width: LAYOUT_CONFIG.nodeWidth,
      height: LAYOUT_CONFIG.nodeHeight
    })
    
    addNodeToRank(personNodeId, personRank)
    
    const parentIds = childToParentPairs.get(memberId) || []
    
    if (parentIds.length >= 2) {
      const parent1 = members.find(m => m.id === parentIds[0])
      const parent2 = members.find(m => m.id === parentIds[1])
      
      if (parent1 && parent2) {
        const parent1Id = processMember(parent1.id, personRank + 2)
        const parent2Id = processMember(parent2.id, personRank + 2)
        
        if (parent1Id !== null && parent2Id !== null) {
          const relationKey = [parent1.id, parent2.id].sort().join('-')
          
          if (!processedRelations.has(relationKey)) {
            processedRelations.add(relationKey)
            
            const relNodeId = nextNodeId++
            const chhubNodeId = nextNodeId++
            
            // 添加关系节点（rel+hub）
            GG.push({
              id: relNodeId,
              rel: true,
              hub: true,
              prop: {},
              outedges: [{ to: chhubNodeId }],
              // 关系节点尺寸（hub节点较小）
              width: LAYOUT_CONFIG.hubWidth,
              height: LAYOUT_CONFIG.hubHeight
            })
            
            // 添加childhub节点
            GG.push({
              id: chhubNodeId,
              chhub: true,
              prop: {},
              outedges: [{ to: personNodeId }],
              // childhub节点尺寸
              width: LAYOUT_CONFIG.hubWidth,
              height: LAYOUT_CONFIG.hubHeight
            })
            
            // 关键改动：
            // - 关系节点(rel+hub): 放在 rank = 0（所有关系节点都在最顶层）
            // - childhub节点: 放在 rank = personRank - 1
            const relationRank = 0
            const chhubRank = personRank - 1
            
            addNodeToRank(relNodeId, relationRank)
            addNodeToRank(chhubNodeId, chhubRank)
            
            // 父节点指向关系节点（父节点在 personRank + 2 层级）
            const parent1Node = GG.find(n => n.id === parent1Id)
            const parent2Node = GG.find(n => n.id === parent2Id)
            
            if (parent1Node) {
              if (!parent1Node.outedges) parent1Node.outedges = []
              parent1Node.outedges.push({ to: relNodeId })
            }
            if (parent2Node) {
              if (!parent2Node.outedges) parent2Node.outedges = []
              parent2Node.outedges.push({ to: relNodeId })
            }
          }
        }
      }
    }
    
    return personNodeId
  }
  
  processMember(proband.id)
  
  // ========== 坐标计算逻辑（与dagre.js的positionY/positionX保持一致）==========
  // dagre.js布局规则：
  // 1. 坐标原点：左上角 (0, 0)
  // 2. Y轴向下递增，X轴向右递增
  // 3. Y坐标计算：基于rank和ranksep，考虑节点高度的居中对齐
  // 4. X坐标计算：基于节点顺序和nodesep，考虑节点宽度
  
  const allRanks = Array.from(nodesByRank.keys())
  const maxRank = allRanks.length > 0 ? Math.max(...allRanks) : 0
  const minRank = allRanks.length > 0 ? Math.min(...allRanks) : 0
  
  // 确保rank从0开始（调整偏移）
  let rankOffset = 0
  if (minRank < 0) {
    rankOffset = -minRank
  }
  
  const adjustedMaxRank = maxRank + rankOffset
  
  const ggIndexMap = new Map()
  GG.forEach((node, idx) => {
    ggIndexMap.set(node.id, idx)
  })
  
  const ranks = new Array(GG.length).fill(0)
  const order = []
  
  // ========== Y坐标计算（参考dagre.js positionY函数）==========
  // Y坐标计算规则：
  // - 每个层级的Y坐标 = prevY + maxHeight/2（居中对齐）
  // - prevY递增 = maxHeight + rankSep
  
  const yPositions = new Array(GG.length).fill(0)
  
  // 按rank从低到高排序（从顶层到底层）
  const sortedRanksAsc = Array.from(nodesByRank.keys()).sort((a, b) => a - b)
  
  let prevY = 0
  
  sortedRanksAsc.forEach(rank => {
    const nodeIds = nodesByRank.get(rank)
    
    // 计算当前层级的最大节点高度
    const maxHeight = nodeIds.reduce((acc, nodeId) => {
      const node = GG.find(n => n.id === nodeId)
      const height = node ? (node.height || LAYOUT_CONFIG.hubHeight) : LAYOUT_CONFIG.hubHeight
      return Math.max(acc, height)
    }, 0)
    
    // 为当前层级的每个节点分配Y坐标
    nodeIds.forEach(nodeId => {
      const idx = ggIndexMap.get(nodeId)
      const node = GG.find(n => n.id === nodeId)
      const nodeHeight = node ? (node.height || LAYOUT_CONFIG.hubHeight) : LAYOUT_CONFIG.hubHeight
      
      // 根据对齐方式计算Y坐标（参考dagre.js rankAlign）
      if (LAYOUT_CONFIG.rankAlign === 'top') {
        yPositions[idx] = prevY + nodeHeight / 2
      } else if (LAYOUT_CONFIG.rankAlign === 'bottom') {
        yPositions[idx] = prevY + maxHeight - nodeHeight / 2
      } else {
        // center（默认）
        yPositions[idx] = prevY + maxHeight / 2
      }
    })
    
    // 更新prevY为下一层级的起始位置
    prevY += maxHeight + LAYOUT_CONFIG.rankSep
  })
  
  // ========== X坐标计算（参考dagre.js positionX函数思想）==========
  // X坐标计算规则：
  // - 同一层级内节点按顺序排列
  // - 节点间距 = nodeSep
  // - X坐标 = 前一个节点的右边界 + nodeSep/2 + 当前节点宽度/2
  
  const xPositions = new Array(GG.length).fill(0)
  
  // 按rank从0到adjustedMaxRank构建order数组并计算X坐标
  for (let r = 0; r <= adjustedMaxRank; r++) {
    const originalRank = r - rankOffset
    
    if (nodesByRank.has(originalRank)) {
      const nodeIds = [...nodesByRank.get(originalRank)]
      
      // 对偶数层级的节点排序：关系节点在前，childhub节点在后
      if (r % 2 === 0) {
        nodeIds.sort((a, b) => {
          const nodeA = GG.find(n => n.id === a)
          const nodeB = GG.find(n => n.id === b)
          const aIsRel = nodeA && nodeA.rel && nodeA.hub
          const bIsRel = nodeB && nodeB.rel && nodeB.hub
          const aIsChhub = nodeA && nodeA.chhub
          const bIsChhub = nodeB && nodeB.chhub
          
          if (aIsRel && bIsChhub) return -1
          if (aIsChhub && bIsRel) return 1
          return 0
        })
      } else {
        // 人员节点按创建顺序排序
        nodeIds.sort((a, b) => ggIndexMap.get(a) - ggIndexMap.get(b))
      }
      
      // 计算当前层级的X坐标
      let prevX = 0
      nodeIds.forEach((nodeId, idxInLayer) => {
        const node = GG.find(n => n.id === nodeId)
        const nodeWidth = node ? (node.width || LAYOUT_CONFIG.nodeWidth) : LAYOUT_CONFIG.nodeWidth
        
        if (idxInLayer === 0) {
          // 第一个节点：X = width/2
          xPositions[ggIndexMap.get(nodeId)] = nodeWidth / 2
        } else {
          // 后续节点：X = prevX + nodeSep + nodeWidth/2
          xPositions[ggIndexMap.get(nodeId)] = prevX + LAYOUT_CONFIG.nodeSep + nodeWidth / 2
        }
        
        // 更新prevX为当前节点的右边界
        prevX = xPositions[ggIndexMap.get(nodeId)] + nodeWidth / 2
      })
      
      order.push(nodeIds)
      
      // 同时更新ranks数组
      nodeIds.forEach(nodeId => {
        ranks[ggIndexMap.get(nodeId)] = r
      })
    } else {
      order.push([])
    }
  }
  
  // positions数组保持原有格式：仅存储Y坐标（与模板数据格式一致）
  // positions[idx] = yPosition (number)
  const positions = yPositions
  
  return { GG, ranks, order, positions }
}

/**
 * 使用 dagre.js 自动计算家系图谱布局
 * @param {array} GG - 节点数组
 * @param {array} ranks - 层级数组
 * @returns {object} 包含布局信息的对象 { positionsX, positionsY }
 */
function calculateLayoutWithDagre(GG, ranks) {
  const { Graph, layout } = $dagre
  
  // 创建 dagre 图实例
  const graph = new Graph({
    directed: true,
    multigraph: false
  })
  
  // 设置布局参数（参考 dagre 默认配置）
  graph.setGraph({
    rankdir: 'TB',      // Top-Bottom 方向
    ranksep: 80,        // 层级间距
    nodesep: 60,        // 节点间距
    edgesep: 20,        // 边间距
    rankalign: 'center' // 层级对齐方式
  })
  
  // 设置节点默认尺寸
  graph.setDefaultNodeLabel(() => ({
    width: 60,   // 默认节点宽度（人员节点）
    height: 80   // 默认节点高度（人员节点）
  }))
  
  // 添加所有节点到 dagre 图
  GG.forEach(node => {
    const isPersonNode = !node.rel && !node.hub && !node.chhub
    const width = isPersonNode ? (node.width || 60) : (node.width || 20)
    const height = isPersonNode ? (node.height || 80) : (node.height || 20)
    
    graph.setNode(node.id, {
      width,
      height,
      rank: ranks[node.id]
    })
  })
  
  // 添加所有边到 dagre 图
  GG.forEach(node => {
    if (node.outedges && node.outedges.length > 0) {
      node.outedges.forEach(edge => {
        graph.setEdge(node.id, edge.to)
      })
    }
  })
  
  // 执行布局计算
  layout(graph)
  
  // 提取计算后的位置
  const positionsX = {}
  const positionsY = {}
  
  GG.forEach(node => {
    const nodeLabel = graph.node(node.id)
    if (nodeLabel) {
      positionsX[node.id] = nodeLabel.x || 0
      positionsY[node.id] = nodeLabel.y || 0
    }
  })
  
  return { positionsX, positionsY }
}

/**
 * 将项目内部格式转换为后端数据格式（用于保存）
 * 
 * 项目内部格式规范：
 * - 人员节点: rank = 1, 3, 5...（奇数层级）
 * - 关系/childhub节点: rank = 0, 2, 4...（偶数层级）
 * - 先证者(proband): rank = 1 的节点（最底层人员）
 * 
 * @param {string} projectJson - 项目内部JSON格式字符串
 * @returns {object} 后端数据格式
 */
export function projectToBackendFormat(projectJson) {
  if (!projectJson) {
    console.warn('projectToBackendFormat: 无效的项目数据')
    return null
  }
  
  try {
    const data = typeof projectJson === 'string' ? JSON.parse(projectJson) : projectJson
    
    if (!data.GG) {
      console.warn('projectToBackendFormat: 缺少GG数据')
      return null
    }
    
    const GG = data.GG
    const ranks = data.ranks || []
    
    // 使用 dagre.js 自动计算布局
    const { positionsX, positionsY } = calculateLayoutWithDagre(GG, ranks)
    
    // 提取人员节点（非关系、非hub、非childhub节点）
    const members = []
    const relations = []
    
    // 存储节点映射
    const personNodes = GG.filter(n => !n.rel && !n.hub && !n.chhub)
    const relationNodes = GG.filter(n => n.rel && n.hub)
    
    let memberIdCounter = 1000
    let relationIdCounter = 2000
    
    // 创建人员映射
    const nodeIdToMemberId = new Map()
    
    // 找到rank=1的人员节点作为先证者候选
    const probandCandidates = personNodes.filter(node => ranks[node.id] === 1)
    
    // 创建人员
    personNodes.forEach((node) => {
      const prop = node.prop || {}
      const memberId = memberIdCounter++
      nodeIdToMemberId.set(node.id, memberId)
      
      // 计算世代：rank=1 是第1代，rank=3 是第2代，rank=5 是第3代...
      const rank = ranks[node.id] || 1
      const generation = Math.floor((rank + 1) / 2)
      
      // 判断是否为先证者：rank=1 的节点且没有子节点
      const isProband = probandCandidates.includes(node) && 
        !GG.some(n => n.chhub && n.outedges?.some(e => e.to === node.id))
      
      // 使用 dagre 计算的位置
      const posX = positionsX[node.id] !== undefined ? positionsX[node.id] : (data.positions?.[node.id] || 100 + members.length * 150)
      const posY = positionsY[node.id] !== undefined ? positionsY[node.id] : (rank * 120)
      
      members.push({
        id: memberId,
        name: prop.name || '',
        gender: genderReverseMap[prop.gender] || 0,
        idCard: prop.idCard || '',
        generation: generation,
        healthStatus: prop.lifeStatus === 'dead' ? 2 : 1,
        isProband: isProband,
        positionX: posX,
        positionY: posY,
        birthDate: prop.birthDate || null,
        deathDate: prop.deathDate || null,
        isAdopted: prop.adopted || false
      })
    })
    
    // 处理关系节点
    const processedRelations = new Set()
    
    relationNodes.forEach(relNode => {
      // 找到连接到这个关系节点的人员（父母）
      const connectedPersons = []
      
      GG.forEach(node => {
        if (node.outedges) {
          node.outedges.forEach(edge => {
            if (edge.to === relNode.id && !node.rel && !node.hub && !node.chhub) {
              connectedPersons.push(node.id)
            }
          })
        }
      })
      
      // 如果有两个人连接到这个关系节点，创建婚姻关系
      if (connectedPersons.length >= 2) {
        const fromId = nodeIdToMemberId.get(connectedPersons[0])
        const toId = nodeIdToMemberId.get(connectedPersons[1])
        
        if (fromId && toId) {
          const relationKey = [fromId, toId].sort().join('-')
          if (!processedRelations.has(relationKey)) {
            processedRelations.add(relationKey)
            relations.push({
              id: relationIdCounter++,
              type: 'marriage',
              relationType: 1,
              fromMemberId: fromId,
              toMemberId: toId
            })
          }
        }
      }
      
      // 处理子节点中心连接（关系 -> childhub -> 子节点）
      const outedges = relNode.outedges || []
      outedges.forEach(edge => {
        const childHubNode = GG.find(n => n.id === edge.to && n.chhub)
        if (childHubNode) {
          const childHubEdges = childHubNode.outedges || []
          childHubEdges.forEach(childEdge => {
            const childNode = GG.find(n => n.id === childEdge.to && !n.rel && !n.hub && !n.chhub)
            if (childNode) {
              connectedPersons.forEach(personNodeId => {
                const parentId = nodeIdToMemberId.get(personNodeId)
                const childId = nodeIdToMemberId.get(childNode.id)
                
                if (parentId && childId) {
                  const relKey = `${parentId}-${childId}`
                  if (!processedRelations.has(relKey)) {
                    processedRelations.add(relKey)
                    relations.push({
                      id: relationIdCounter++,
                      type: 'parent-child',
                      relationType: 2,
                      fromMemberId: parentId,
                      toMemberId: childId
                    })
                  }
                }
              })
            }
          })
        }
      })
    })
    
    // 计算最大世代数
    const maxGeneration = members.length > 0 ? Math.max(...members.map(m => m.generation)) : 1
    
    return {
      members,
      relations,
      memberCount: members.length,
      generationCount: maxGeneration
    }
    
  } catch (error) {
    console.error('projectToBackendFormat error:', error)
    return null
  }
}

/**
 * 从mock数据获取家谱详情
 * @param {number} pedigreeId - 家谱ID
 * @returns {object|null} 家谱数据
 */
export function getPedigreeFromMockData(pedigreeId) {
  const pedigrees = getMockPedigrees()
  return pedigrees.find(p => p.id === parseInt(pedigreeId)) || null
}

/**
 * 加载家谱数据（结合ID获取和格式转换）
 * @param {number|string} pedigreeId - 家谱ID（可选，不传则从导航栏/URL获取）
 * @returns {string|null} 项目内部格式JSON字符串
 */
export async function loadPedigreeData(pedigreeId) {
  // 如果没有提供ID，从导航栏/URL获取
  const targetId = pedigreeId || getPedigreeIdFromNavbar()
  
  if (!targetId) {
    console.warn('loadPedigreeData: 无法获取家谱ID')
    return null
  }
  
  console.log(`[DataConverter] Loading pedigree: ${targetId}`)
  
  // 从mock数据获取
  const backendData = getPedigreeFromMockData(targetId)
  
  if (!backendData) {
    console.warn(`[DataConverter] 未找到家谱数据: ${targetId}`)
    return null
  }
  
  // 转换为项目格式
  const projectFormat = backendToProjectFormat(backendData)
  
  if (projectFormat) {
    console.log('[DataConverter] 数据转换成功')
  }
  
  return projectFormat
}

/**
 * 保存家谱数据（结合格式转换）
 * @param {string} projectJson - 项目内部格式JSON字符串
 * @param {number|string} pedigreeId - 家谱ID（可选，不传则从导航栏/URL获取）
 * @returns {object|null} 保存后的后端数据
 */
export function savePedigreeData(projectJson, pedigreeId) {
  const targetId = pedigreeId || getPedigreeIdFromNavbar()
  
  if (!targetId) {
    console.warn('savePedigreeData: 无法获取家谱ID')
    return null
  }
  
  console.log(`[DataConverter] Saving pedigree: ${targetId}`)
  
  // 转换为后端格式
  const backendFormat = projectToBackendFormat(projectJson)
  
  if (!backendFormat) {
    console.error('[DataConverter] 数据转换失败')
    return null
  }
  
  // 更新mock数据
  const pedigrees = getMockPedigrees()
  const index = pedigrees.findIndex(p => p.id === parseInt(targetId))
  
  if (index !== -1) {
    pedigrees[index] = {
      ...pedigrees[index],
      ...backendFormat,
      updateTime: new Date().toISOString()
    }
    console.log('[DataConverter] Mock数据更新成功')
  } else {
    // 创建新家谱
    const newPedigree = {
      id: parseInt(targetId),
      title: 'Untitled Pedigree',
      patientId: 1,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      ...backendFormat
    }
    pedigrees.push(newPedigree)
    console.log('[DataConverter] 新家谱创建成功')
  }
  
  return backendFormat
}

// 导出全局方法供传统代码使用
window.PedigreeDataConverter = {
  getPedigreeIdFromUrl,
  getPedigreeIdFromNavbar,
  backendToProjectFormat,
  projectToBackendFormat,
  getPedigreeFromMockData,
  loadPedigreeData,
  savePedigreeData,
  genderMap,
  genderReverseMap
}

export default {
  getPedigreeIdFromUrl,
  getPedigreeIdFromNavbar,
  backendToProjectFormat,
  projectToBackendFormat,
  getPedigreeFromMockData,
  loadPedigreeData,
  savePedigreeData,
  genderMap,
  genderReverseMap
}
