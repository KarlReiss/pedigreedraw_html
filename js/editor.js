/**
 * FamilyTree Editor - 家系图编辑器键盘快捷键
 * 挂载到现有的 controller.js 事件系统
 */

window.state = { members: [] };

// 立即注册键盘监听器（capture 模式）
window.addEventListener('keydown', function(e) {
  var key = e.key.toLowerCase();
  var isCtrl = e.ctrlKey || e.metaKey;

  // Ctrl+Z - 撤销
  if (isCtrl && key === 'z' && !e.shiftKey) {
    e.preventDefault();
    document.fire('pedigree:undo');
    return;
  }

  // Ctrl+Y 或 Ctrl+Shift+Z - 重做
  if (isCtrl && (key === 'y' || (e.shiftKey && key === 'z'))) {
    e.preventDefault();
    document.fire('pedigree:redo');
    return;
  }

  // Ctrl+S - 保存
  if (isCtrl && key === 's') {
    e.preventDefault();
      console.log('save');
    // 触发保存菜单操作
    var saveBtn = $('action-save');
    if (saveBtn) {
      saveBtn.click();
    }
    return;
  }
}, true);

// ============================================================
// 示例数据
// ============================================================
function loadSampleData() {
  // 新格式：单一数组，每个成员包含 father/mother 字段表示关系
  window.state.members = [
    { id: 1, name: '张志远', sex: 'male', birth: '1945-03-12', note: '退休教师', x: 280, y: 80 },
    { id: 2, name: '王秀华', sex: 'female', birth: '1948-07-22', note: '', x: 440, y: 80 },
    { id: 3, name: '张建国', sex: 'male', birth: '1972-05-18', note: '工程师', x: 200, y: 200, father: 1, mother: 2 },
    { id: 4, name: '李美琴', sex: 'female', birth: '1975-11-03', note: '', x: 340, y: 200 },
    { id: 5, name: '张磊', sex: 'male', birth: '2000-08-25', note: '在读大学', x: 150, y: 320, father: 3, mother: 4, isProband: true },
    { id: 6, name: '张敏', sex: 'female', birth: '2003-02-14', note: '', x: 320, y: 320, father: 3, mother: 4, isProband: true },
    { id: 7, name: '张强', sex: 'male', birth: '1976-09-15', note: '律师', x: 500, y: 200, father: 1, mother: 2 },
  ];
  window.state.nextId = 200;
  updateCounters();
  pushHistory();
}

// ============================================================
// 渲染引擎
// ============================================================
function render() {
  const group = document.getElementById('canvasGroup');
  if (!group) return;

  group.setAttribute('transform', `translate(${window.state.translateX},${window.state.translateY}) scale(${window.state.scale})`);

  renderLinks();
  renderNodes();
  updateCounters();

  const empty = document.getElementById('canvasEmpty');
  if (empty) {
    empty.classList.toggle('hidden', window.state.members.length > 0);
  }
}

// 辅助函数：获取所有关系链接（从 father/mother 字段推导）
function getLinksFromMembers() {
  const links = [];
  const processedCouples = new Set();

  window.state.members.forEach(member => {
    // 处理亲子关系
    if (member.father !== undefined && member.father !== null) {
      links.push({
        id: `parent-${member.father}-${member.id}`,
        type: 'parent',
        sourceId: member.father,
        targetId: member.id
      });
    }
    if (member.mother !== undefined && member.mother !== null) {
      links.push({
        id: `parent-${member.mother}-${member.id}`,
        type: 'parent',
        sourceId: member.mother,
        targetId: member.id
      });

      // 处理夫妻关系（从共同子女推导）
      if (member.father !== undefined && member.father !== null) {
        const coupleKey = [member.father, member.mother].sort().join('-');
        if (!processedCouples.has(coupleKey)) {
          processedCouples.add(coupleKey);
          links.push({
            id: `couple-${coupleKey}`,
            type: 'couple',
            sourceId: member.father,
            targetId: member.mother
          });
        }
      }
    }
  });

  return links;
}

function renderLinks() {
  const container = document.getElementById('linksGroup');
  if (!container) return;
  container.innerHTML = '';

  // 从成员数据动态获取关系链接
  const links = getLinksFromMembers();

  links.forEach(link => {
    const src = window.state.members.find(m => m.id === link.sourceId);
    const tgt = window.state.members.find(m => m.id === link.targetId);
    if (!src || !tgt) return;

    const x1 = src.x + NODE_W / 2, y1 = src.y + NODE_H / 2;
    const x2 = tgt.x + NODE_W / 2, y2 = tgt.y + NODE_H / 2;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const mx = (x1 + x2) / 2;
    const d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    path.setAttribute('d', d);
    path.setAttribute('class', `link-line ${link.type === 'couple' ? 'link-couple' : 'link-child'}`);
    container.appendChild(path);
  });
}

function renderNodes() {
  const container = document.getElementById('nodesGroup');
  if (!container) return;
  container.innerHTML = '';

  const theme = THEMES[window.state.theme];

  window.state.members.forEach(member => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `node-group${member.id === window.state.selectedId ? ' selected' : ''}`);
    g.setAttribute('transform', `translate(${member.x},${member.y})`);
    g.setAttribute('data-id', member.id);

    // 支持新格式的 sex 字段和旧格式的 gender 字段
    const sex = member.sex || member.gender || 'male';
    const color = sex === 'female' ? theme.female : theme.male;
    const strokeColor = window.state.selectedId === member.id ? '#1E293B' : color;

    // 背景矩形
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'node-rect');
    rect.setAttribute('width', NODE_W);
    rect.setAttribute('height', NODE_H);
    rect.setAttribute('rx', 14);
    rect.setAttribute('fill', color);
    rect.setAttribute('stroke', strokeColor);
    rect.setAttribute('stroke-width', window.state.selectedId === member.id ? '2.5' : '0');
    g.appendChild(rect);

    // 性别图标
    const genderIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    genderIcon.setAttribute('x', 12);
    genderIcon.setAttribute('y', 20);
    genderIcon.setAttribute('class', 'node-gender-icon');
    genderIcon.textContent = sex === 'female' ? '♀' : '♂';
    g.appendChild(genderIcon);

    // 姓名
    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('x', NODE_W / 2);
    nameText.setAttribute('y', member.birth ? 22 : 30);
    nameText.setAttribute('text-anchor', 'middle');
    nameText.setAttribute('class', 'node-name');
    nameText.textContent = member.name.length > 6 ? member.name.slice(0, 6) + '…' : member.name;
    g.appendChild(nameText);

    // 出生年份
    if (member.birth) {
      const year = member.birth.split('-')[0];
      const subText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      subText.setAttribute('x', NODE_W / 2);
      subText.setAttribute('y', 37);
      subText.setAttribute('text-anchor', 'middle');
      subText.setAttribute('class', 'node-sub');
      subText.textContent = year + '年生';
      g.appendChild(subText);
    }

    // 拖拽 & 选择事件
    g.addEventListener('mousedown', (e) => onNodeMouseDown(e, member.id));
    g.addEventListener('touchstart', (e) => onNodeTouchStart(e, member.id), { passive: false });
    g.addEventListener('contextmenu', (e) => onNodeContextMenu(e, member.id));

    container.appendChild(g);
  });
}

// ============================================================
// 鼠标 / 触摸事件处理
// ============================================================
let _nodeStartX = 0, _nodeStartY = 0;

function onNodeMouseDown(e, id) {
  e.stopPropagation();
  if (e.button !== 0) return;
  selectMember(id);
  window.state.isDragging = true;
  window.state.dragTarget = id;
  const member = window.state.members.find(m => m.id === id);
  _nodeStartX = e.clientX / window.state.scale - member.x;
  _nodeStartY = e.clientY / window.state.scale - member.y;
}

function onCanvasMouseDown(e) {
  if (e.button === 1 || (e.button === 0 && !window.state.isDragging)) {
    window.state.isPanning = true;
    window.state.panStartX = e.clientX - window.state.translateX;
    window.state.panStartY = e.clientY - window.state.translateY;
    document.getElementById('canvasContainer').classList.add('grabbing');
  }
}

function onCanvasMouseMove(e) {
  if (window.state.isDragging && window.state.dragTarget !== null) {
    const member = window.state.members.find(m => m.id === window.state.dragTarget);
    if (member) {
      member.x = e.clientX / window.state.scale - _nodeStartX;
      member.y = e.clientY / window.state.scale - _nodeStartY;
      render();
    }
  } else if (window.state.isPanning) {
    window.state.translateX = e.clientX - window.state.panStartX;
    window.state.translateY = e.clientY - window.state.panStartY;
    render();
  }
}

function onCanvasMouseUp() {
  if (window.state.isDragging) {
    pushHistory();
    autoSave();
  }
  window.state.isDragging = false;
  window.state.dragTarget = null;
  window.state.isPanning = false;
  document.getElementById('canvasContainer').classList.remove('grabbing');
}

function onCanvasClick(e) {
  if (e.target === document.getElementById('mainCanvas') || e.target.tagName === 'svg') {
    selectMember(null);
  }
}

function onCanvasWheel(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.min(Math.max(window.state.scale * delta, 0.2), 3);

  const rect = e.currentTarget.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  window.state.translateX = mx - (mx - window.state.translateX) * (newScale / window.state.scale);
  window.state.translateY = my - (my - window.state.translateY) * (newScale / window.state.scale);
  window.state.scale = newScale;

  document.getElementById('zoomDisplay').textContent = Math.round(window.state.scale * 100) + '%';
  render();
}

// 触摸支持
let _touch = { startX: 0, startY: 0, dist: 0 };
function onNodeTouchStart(e, id) {
  e.preventDefault();
  const t = e.touches[0];
  selectMember(id);
  window.state.isDragging = true;
  window.state.dragTarget = id;
  const member = window.state.members.find(m => m.id === id);
  _nodeStartX = t.clientX / window.state.scale - member.x;
  _nodeStartY = t.clientY / window.state.scale - member.y;
}
function onTouchStart(e) {
  if (e.touches.length === 1) {
    _touch.startX = e.touches[0].clientX - window.state.translateX;
    _touch.startY = e.touches[0].clientY - window.state.translateY;
    window.state.isPanning = true;
  }
}
function onTouchMove(e) {
  e.preventDefault();
  if (window.state.isDragging && window.state.dragTarget !== null && e.touches.length === 1) {
    const t = e.touches[0];
    const member = window.state.members.find(m => m.id === window.state.dragTarget);
    if (member) {
      member.x = t.clientX / window.state.scale - _nodeStartX;
      member.y = t.clientY / window.state.scale - _nodeStartY;
      render();
    }
  } else if (window.state.isPanning && e.touches.length === 1) {
    window.state.translateX = e.touches[0].clientX - _touch.startX;
    window.state.translateY = e.touches[0].clientY - _touch.startY;
    render();
  }
}
function onTouchEnd() {
  if (window.state.isDragging) pushHistory();
  window.state.isDragging = false;
  window.state.dragTarget = null;
  window.state.isPanning = false;
  autoSave();
}

// ============================================================
// 选中成员
// ============================================================
function selectMember(id) {
  window.state.selectedId = id;
  render();
}

// ============================================================
// 右键菜单
// ============================================================
function onCanvasContextMenu(e) {
  e.preventDefault();
}
function onNodeContextMenu(e, id) {
  e.preventDefault();
  e.stopPropagation();
  window.state.contextTarget = id;
  selectMember(id);
  showContextMenu(e.clientX, e.clientY);
}
function showContextMenu(x, y) {
  const menu = document.getElementById('contextMenu');
  if (!menu) return;
  menu.style.display = 'block';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  // 防止超出视口
  const r = menu.getBoundingClientRect();
  if (r.right > window.innerWidth) menu.style.left = (x - r.width) + 'px';
  if (r.bottom > window.innerHeight) menu.style.top = (y - r.height) + 'px';
}
function hideContextMenu() {
  const menu = document.getElementById('contextMenu');
  if (menu) menu.style.display = 'none';
}
function ctxEditMember() {
  hideContextMenu();
  if (window.state.contextTarget) openEditModal(window.state.contextTarget);
}
function ctxAddChild() {
  hideContextMenu();
  if (window.state.contextTarget) addChildTo(window.state.contextTarget);
}
function ctxAddSpouse() {
  hideContextMenu();
  if (window.state.contextTarget) addSpouseTo(window.state.contextTarget);
}
function ctxDelete() {
  hideContextMenu();
  if (window.state.contextTarget) {
    deleteById(window.state.contextTarget);
    window.state.contextTarget = null;
  }
}

// ============================================================
// 成员增删改
// ============================================================
function openMemberModal() {
  document.getElementById('modalTitle').textContent = '添加成员';
  document.getElementById('memberId').value = '';
  document.getElementById('memberName').value = '';
  document.getElementById('memberGender').value = 'male';
  document.getElementById('memberBirth').value = '';
  document.getElementById('memberDeath').value = '';
  document.getElementById('memberNote').value = '';
  document.getElementById('memberModal').style.display = 'flex';
  setTimeout(() => document.getElementById('memberName').focus(), 100);
}

function openEditModal(id) {
  const m = window.state.members.find(x => x.id === id);
  if (!m) return;
  document.getElementById('modalTitle').textContent = '编辑成员';
  document.getElementById('memberId').value = id;
  document.getElementById('memberName').value = m.name;
  // 支持新格式的 sex 字段和旧格式的 gender 字段
  document.getElementById('memberGender').value = m.sex || m.gender || 'male';
  document.getElementById('memberBirth').value = m.birth || '';
  document.getElementById('memberDeath').value = m.death || '';
  document.getElementById('memberNote').value = m.note || '';
  document.getElementById('memberModal').style.display = 'flex';
}

function closeMemberModal(e) {
  if (e && e.target !== document.getElementById('memberModal')) return;
  document.getElementById('memberModal').style.display = 'none';
}

function saveMember(e) {
  e.preventDefault();
  const id = document.getElementById('memberId').value;
  const name = document.getElementById('memberName').value.trim();
  if (!name) { showToast('请输入姓名', 'warning'); return; }

  // 使用新格式的 sex 字段
  const data = {
    name,
    sex: document.getElementById('memberGender').value,
    birth: document.getElementById('memberBirth').value,
    death: document.getElementById('memberDeath').value,
    note: document.getElementById('memberNote').value.trim(),
  };

  if (id) {
    const m = window.state.members.find(x => x.id === parseInt(id));
    if (m) {
      // 保留原有字段（father, mother, x, y, isProband）
      const preserved = { father: m.father, mother: m.mother, x: m.x, y: m.y, isProband: m.isProband };
      Object.assign(m, preserved, data);
    }
    showToast('成员信息已更新', 'success');
  } else {
    const canvas = document.getElementById('mainCanvas');
    const cx = canvas ? canvas.clientWidth / 2 / window.state.scale - NODE_W / 2 - window.state.translateX / window.state.scale : 300;
    const cy = canvas ? canvas.clientHeight / 2 / window.state.scale - NODE_H / 2 - window.state.translateY / window.state.scale : 200;
    window.state.members.push({ id: window.state.nextId++, ...data, x: cx + (Math.random() - 0.5) * 100, y: cy + (Math.random() - 0.5) * 60 });
    showToast('成员添加成功', 'success');
  }

  document.getElementById('memberModal').style.display = 'none';
  pushHistory();
  autoSave();
  render();
}

function addChildTo(parentId) {
  const parent = window.state.members.find(m => m.id === parentId);
  if (!parent) return;

  const child = {
    id: window.state.nextId++,
    name: '新成员',
    sex: 'male',
    birth: '',
    death: '',
    note: '',
    x: parent.x + (Math.random() - 0.5) * 120,
    y: parent.y + 120,
  };

  // 根据父母性别设置 father 或 mother
  const parentSex = parent.sex || parent.gender || 'male';
  if (parentSex === 'male') {
    child.father = parentId;
  } else {
    child.mother = parentId;
  }

  // 查找配偶并设置另一个父母
  const spouse = findSpouse(parentId);
  if (spouse) {
    if (parentSex === 'male') {
      child.mother = spouse.id;
    } else {
      child.father = spouse.id;
    }
  }

  window.state.members.push(child);
  pushHistory();
  autoSave();
  render();
  selectMember(child.id);
  openEditModal(child.id);
}

// 辅助函数：查找配偶
function findSpouse(memberId) {
  const member = window.state.members.find(m => m.id === memberId);
  if (!member) return null;

  // 通过共同子女查找配偶
  const memberSex = member.sex || member.gender || 'male';
  const children = window.state.members.filter(m => {
    if (memberSex === 'male') {
      return m.father === memberId && m.mother !== undefined && m.mother !== null;
    } else {
      return m.mother === memberId && m.father !== undefined && m.father !== null;
    }
  });

  if (children.length > 0) {
    const child = children[0];
    const spouseId = memberSex === 'male' ? child.mother : child.father;
    return window.state.members.find(m => m.id === spouseId);
  }

  return null;
}

function addSpouseTo(memberId) {
  const member = window.state.members.find(m => m.id === memberId);
  if (!member) return;

  const memberSex = member.sex || member.gender || 'male';
  const spouse = {
    id: window.state.nextId++,
    name: '配偶',
    sex: memberSex === 'male' ? 'female' : 'male',
    birth: '',
    death: '',
    note: '',
    x: member.x + 160,
    y: member.y,
  };
  window.state.members.push(spouse);

  // 更新所有该成员的子女，添加新配偶为另一方父母
  window.state.members.forEach(child => {
    if (memberSex === 'male' && child.father === memberId && !child.mother) {
      child.mother = spouse.id;
    } else if (memberSex === 'female' && child.mother === memberId && !child.father) {
      child.father = spouse.id;
    }
  });

  pushHistory();
  autoSave();
  render();
  selectMember(spouse.id);
  openEditModal(spouse.id);
}

function addCouple() {
  const cx = 300 / window.state.scale - window.state.translateX / window.state.scale;
  const cy = 200 / window.state.scale - window.state.translateY / window.state.scale;
  const m1 = { id: window.state.nextId++, name: '丈夫', sex: 'male', birth: '', death: '', note: '', x: cx, y: cy };
  const m2 = { id: window.state.nextId++, name: '妻子', sex: 'female', birth: '', death: '', note: '', x: cx + 160, y: cy };
  window.state.members.push(m1, m2);
  pushHistory();
  autoSave();
  render();
  showToast('已添加夫妻节点', 'success');
}

function deleteSelected() {
  if (window.state.selectedId) {
    deleteById(window.state.selectedId);
    window.state.selectedId = null;
  }
}

function deleteById(id) {
  // 删除成员
  window.state.members = window.state.members.filter(m => m.id !== id);
  // 清理其他成员对该成员的引用（father/mother 字段）
  window.state.members.forEach(m => {
    if (m.father === id) delete m.father;
    if (m.mother === id) delete m.mother;
  });
  if (window.state.selectedId === id) window.state.selectedId = null;
  pushHistory();
  autoSave();
  render();
  showToast('成员已删除');
}

// ============================================================
// 视图操作
// ============================================================
function zoomIn() {
  window.state.scale = Math.min(window.state.scale * 1.15, 3);
  document.getElementById('zoomDisplay').textContent = Math.round(window.state.scale * 100) + '%';
  render();
}
function zoomOut() {
  window.state.scale = Math.max(window.state.scale * 0.87, 0.2);
  document.getElementById('zoomDisplay').textContent = Math.round(window.state.scale * 100) + '%';
  render();
}
function zoomReset() {
  window.state.scale = 1; window.state.translateX = 0; window.state.translateY = 0;
  document.getElementById('zoomDisplay').textContent = '100%';
  render();
}

function fitToScreen() {
  if (window.state.members.length === 0) return;
  const canvas = document.getElementById('mainCanvas');
  const cw = canvas.clientWidth - 80, ch = canvas.clientHeight - 80;

  const xs = window.state.members.map(m => m.x);
  const ys = window.state.members.map(m => m.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs) + NODE_W;
  const minY = Math.min(...ys), maxY = Math.max(...ys) + NODE_H;
  const dw = maxX - minX, dh = maxY - minY;

  const scaleX = cw / dw, scaleY = ch / dh;
  window.state.scale = Math.min(scaleX, scaleY, 1.5);
  window.state.translateX = (canvas.clientWidth - dw * window.state.scale) / 2 - minX * window.state.scale;
  window.state.translateY = (canvas.clientHeight - dh * window.state.scale) / 2 - minY * window.state.scale;
  document.getElementById('zoomDisplay').textContent = Math.round(window.state.scale * 100) + '%';
  render();
}

function autoLayout() {
  if (window.state.members.length === 0) return;

  // 简单层级布局：按父子关系分层（从 father/mother 字段推导）
  // 找出所有有父母的成员（即子节点）
  const childIds = new Set(window.state.members.filter(m => m.father !== undefined || m.mother !== undefined).map(m => m.id));
  const roots = window.state.members.filter(m => !childIds.has(m.id));

  let level = 0;
  const placed = new Set();
  const levelMap = {};

  function placeLevel(ids, lv) {
    if (ids.length === 0) return;
    levelMap[lv] = levelMap[lv] || [];
    ids.forEach(id => {
      if (!placed.has(id)) {
        placed.add(id);
        levelMap[lv].push(id);
      }
    });
    // 找出当前层级成员的所有子节点
    const children = window.state.members
      .filter(m => m.father !== undefined && ids.includes(m.father) || 
                   m.mother !== undefined && ids.includes(m.mother))
      .map(m => m.id);
    placeLevel([...new Set(children)], lv + 1);
  }

  placeLevel(roots.map(r => r.id), 0);

  // 应用坐标
  const GAP_X = 160, GAP_Y = 120, BASE_X = 60, BASE_Y = 60;
  Object.entries(levelMap).forEach(([lv, ids]) => {
    ids.forEach((id, i) => {
      const m = window.state.members.find(x => x.id === id);
      if (m) {
        m.x = BASE_X + i * GAP_X;
        m.y = BASE_Y + parseInt(lv) * GAP_Y;
      }
    });
  });

  // 未分层的成员
  const unplaced = window.state.members.filter(m => !placed.has(m.id));
  unplaced.forEach((m, i) => {
    m.x = BASE_X + i * GAP_X;
    m.y = BASE_Y + (Object.keys(levelMap).length) * GAP_Y;
  });

  pushHistory();
  render();
  showToast('布局已优化', 'success');
}

// ============================================================
// 主题
// ============================================================
function setTheme(theme) {
  window.state.theme = theme;
  document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
  const themeMap = { blue: 0, green: 1, amber: 2, pink: 3, purple: 4, gray: 5 };
  const idx = themeMap[theme];
  const btns = document.querySelectorAll('.theme-btn');
  if (btns[idx]) btns[idx].classList.add('active');
  render();
  showToast('主题已更换');
}

// ============================================================
// 保存 / 加载
// ============================================================
function saveProject() {
  // 新格式：只保存 members（包含 father/mother 关系），不再需要单独的 links
  const data = JSON.stringify({ members: window.state.members, nextId: window.state.nextId, theme: window.state.theme });
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const title = document.getElementById('projectTitle');
  a.download = (title ? title.textContent.trim() : '家系图') + '.ftree';
  a.click();
  showToast('项目已下载', 'success');
}

function loadProject() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ftree,.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        window.state.members = data.members || [];
        window.state.nextId = data.nextId || 200;
        window.state.theme = data.theme || 'blue';
        render();
        showToast('项目加载成功', 'success');
      } catch {
        showToast('文件格式错误', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function autoSave() {
  console.log('[autoSave] 被调用');
  try {
    localStorage.setItem('familytree_autosave', JSON.stringify({
      members: window.state.members,
      nextId: window.state.nextId,
      theme: window.state.theme
    }));
    showToast('已保存到本地', 'success');
    updateSaveButton();
  } catch (e) {
    showToast('保存失败', 'error');
  }
}

function loadAutoSave() {
  try {
    const raw = localStorage.getItem('familytree_autosave');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.members && data.members.length > 0) {
        window.state.members = data.members;
        window.state.nextId = data.nextId || 200;
        window.state.theme = data.theme || 'blue';
        // 初始化历史记录
        pushHistory();
      }
    }
  } catch {}
}

// ============================================================
// 导出（专业版功能）
// ============================================================
function exportImage() {
  // 普通版用户拦截：弹出升级提示
  if (typeof _auth !== 'undefined' && !_auth.isPro()) {
    showUpgradeModal();
    return;
  }

  _doExportImage();
}

function _doExportImage() {
  const svgEl = document.getElementById('mainCanvas');
  if (!svgEl) return;

  const serializer = new XMLSerializer();
  let svgStr = serializer.serializeToString(svgEl);

  // 内联样式
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .node-name { font-size:13px; font-weight:600; fill:white; font-family:sans-serif; }
    .node-sub { font-size:10px; fill:rgba(255,255,255,0.8); font-family:sans-serif; }
    .link-line { stroke:#94A3B8; stroke-width:1.5; fill:none; }
    .link-couple { stroke:#F59E0B; stroke-dasharray:4 3; }
  `;
  svgStr = svgStr.replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg"`);

  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = svgEl.clientWidth * scale;
  canvas.height = svgEl.clientHeight * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  img.onload = () => {
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    const title = document.getElementById('projectTitle');
    a.download = (title ? title.textContent.trim() : '家系图') + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast('图片导出成功', 'success');
  };
  img.src = URL.createObjectURL(blob);
}

// ============================================================
// 历史（撤销 / 重做）
// ============================================================
function pushHistory() {
  // 新格式：只保存 members（包含 father/mother 关系）
  const snap = JSON.stringify({ members: window.state.members });
  window.state.history = window.state.history.slice(0, window.state.historyIndex + 1);
  window.state.history.push(snap);
  if (window.state.history.length > 50) window.state.history.shift();
  window.state.historyIndex = window.state.history.length - 1;
}

function undo() {
  console.log('[undo] historyIndex:', window.state.historyIndex, 'history.length:', window.state.history.length);
  if (window.state.historyIndex > 0) {
    window.state.historyIndex--;
    const snap = JSON.parse(window.state.history[window.state.historyIndex]);
    window.state.members = snap.members;
    render();
    showToast('已撤销');
  } else {
    showToast('没有可撤销的操作');
  }
  updateUndoRedoButtons();
}

function redo() {
  if (window.state.historyIndex < window.state.history.length - 1) {
    window.state.historyIndex++;
    const snap = JSON.parse(window.state.history[window.state.historyIndex]);
    window.state.members = snap.members;
    render();
    showToast('已重做');
  } else {
    showToast('没有可重做的操作');
  }
  updateUndoRedoButtons();
}

// ============================================================
// 键盘快捷键
// ============================================================
function onKeyDown(e) {
  // 调试：打印按键信息
  console.log('[快捷键调试]', e.key, 'ctrl:', e.ctrlKey, 'meta:', e.metaKey, 'shift:', e.shiftKey);
  
  // 如果焦点在输入框或文本域，忽略快捷键（除非是 Ctrl+S 保存）
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
    // 只允许 Ctrl+S 在输入框中保存
    if (!((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's')) {
      return;
    }
  }
  
  const key = e.key.toLowerCase();
  const isCtrl = e.ctrlKey || e.metaKey;

  // Ctrl+Z - 撤销
  if (isCtrl && key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }

  // Ctrl+Y 或 Ctrl+Shift+Z - 重做
  if (isCtrl && (key === 'y' || (e.shiftKey && key === 'z'))) {
    e.preventDefault();
    redo();
    return;
  }

  // Ctrl+S - 保存
  if (isCtrl && key === 's') {
    e.preventDefault();
    autoSave();
    return;
  }

  // Delete 或 Backspace - 删除选中成员
  if (key === 'delete' || key === 'backspace') {
    if (window.state.selectedId && document.getElementById('page-editor') && document.getElementById('page-editor').classList.contains('active')) {
      e.preventDefault();
      deleteSelected();
    }
    return;
  }

  // Escape - 取消选中、关闭弹窗
  if (key === 'escape') {
    selectMember(null);
    const modal = document.getElementById('memberModal');
    if (modal) modal.style.display = 'none';
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu) contextMenu.style.display = 'none';
    return;
  }
}

// ============================================================
// 辅助函数
// ============================================================
function updateCounters() {
  const mc = document.getElementById('memberCount');
  const lc = document.getElementById('linkCount');
  if (mc) mc.textContent = window.state.members.length;
  if (lc) lc.textContent = window.state.links.length;
}

// 更新撤销/重做按钮的禁用状态
function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  
  if (undoBtn) {
    undoBtn.disabled = window.state.historyIndex <= 0;
    undoBtn.classList.toggle('disabled', window.state.historyIndex <= 0);
  }
  if (redoBtn) {
    redoBtn.disabled = window.state.historyIndex >= window.state.history.length - 1;
    redoBtn.classList.toggle('disabled', window.state.historyIndex >= window.state.history.length - 1);
  }
}

// 更新保存按钮状态（显示保存时间）
function updateSaveButton() {
  const saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    saveBtn.dataset.saved = timeStr;
  }
}

// ============================================================
// 数据格式转换 - 将编辑器数据转换为标准家系图格式
// ============================================================

/**
 * 将编辑器内部格式转换为标准家系图格式
 * @returns {Array} 转换后的家系成员数组
 */
function convertToStandardFormat() {
  const result = [];
  
  // 遍历所有成员生成结果（新格式直接包含 father/mother 字段）
  window.state.members.forEach(member => {
    const sex = member.sex || member.gender || 'male';
    
    const item = {
      id: member.id,
      x: member.x,
      y: member.y,
      sex: sex === 'male' ? 'male' : 'female'
    };
    
    // 添加父母关系
    if (member.father !== undefined && member.father !== null) {
      item.father = member.father;
    }
    if (member.mother !== undefined && member.mother !== null) {
      item.mother = member.mother;
    }
    
    // 判断是否为先证者（最底层的成员，没有子节点）
    const hasChildren = window.state.members.some(m => m.father === member.id || m.mother === member.id);
    if (!hasChildren) {
      item.isProband = true;
    }
    
    // 保留其他字段
    if (member.name) item.name = member.name;
    
    result.push(item);
  });
  
  return result;
}

/**
 * 从标准家系图格式导入数据
 * @param {Array} data - 标准格式的家系成员数组
 */
function importFromStandardFormat(data) {
  if (!Array.isArray(data) || data.length === 0) return;
  
  // 清空现有数据
  window.state.members = [];
  
  // 记录最高ID
  let maxId = 0;
  
  // 创建成员（新格式直接包含 father/mother 字段）
  data.forEach(item => {
    const member = {
      id: item.id,
      name: item.name || '',
      sex: item.sex === 'male' ? 'male' : 'female',
      birth: '',
      death: '',
      note: '',
      x: item.x || 0,
      y: item.y || 0
    };
    
    // 添加父母关系
    if (item.father !== undefined && item.father !== null) {
      member.father = item.father;
    }
    if (item.mother !== undefined && item.mother !== null) {
      member.mother = item.mother;
    }
    
    // 添加先证者标记
    if (item.isProband) {
      member.isProband = true;
    }
    
    window.state.members.push(member);
    maxId = Math.max(maxId, item.id);
  });
  
  window.state.nextId = maxId + 1;
  pushHistory();
  render();
  showToast('数据导入成功', 'success');
}

/**
 * 导出为标准家系图格式
 */
function exportToStandardFormat() {
  const data = convertToStandardFormat();
  const jsonStr = JSON.stringify(data, null, 2);
  
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const title = document.getElementById('projectTitle');
  a.download = (title ? title.textContent.trim() : '家系图') + '_standard.json';
  a.click();
  showToast('标准格式导出成功', 'success');
}

/**
 * 从标准格式文件导入
 */
function importFromStandardFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        importFromStandardFormat(data);
      } catch (err) {
        showToast('文件格式错误', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// 暴露全局方法供外部调用
window.FamilyTreeEditor = {
  convertToStandardFormat,
  importFromStandardFormat,
  exportToStandardFormat,
  importFromStandardFile,
  getMembers: () => window.state.members,
  // 新格式不再使用单独的 links，通过 father/mother 字段获取关系
  getLinks: () => getLinksFromMembers()
};

function showHelp() {
  showToast('快捷键：Ctrl+Z 撤销 · Ctrl+Y 重做 · Ctrl+S 保存 · Delete 删除 · 滚轮缩放');
}

