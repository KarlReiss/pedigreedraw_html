/**
 * FamilyTree Editor - 家系图编辑器键盘快捷键
 * 挂载到现有的 controller.js 事件系统
 */

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
  state.members = [
    { id: 1, name: '张志远', gender: 'male', birth: '1945-03-12', note: '退休教师', x: 280, y: 80 },
    { id: 2, name: '王秀华', gender: 'female', birth: '1948-07-22', note: '', x: 440, y: 80 },
    { id: 3, name: '张建国', gender: 'male', birth: '1972-05-18', note: '工程师', x: 200, y: 200 },
    { id: 4, name: '李美琴', gender: 'female', birth: '1975-11-03', note: '', x: 340, y: 200 },
    { id: 5, name: '张磊', gender: 'male', birth: '2000-08-25', note: '在读大学', x: 150, y: 320 },
    { id: 6, name: '张敏', gender: 'female', birth: '2003-02-14', note: '', x: 320, y: 320 },
    { id: 7, name: '张强', gender: 'male', birth: '1976-09-15', note: '律师', x: 500, y: 200 },
  ];
  state.links = [
    { id: 101, type: 'couple', sourceId: 1, targetId: 2 },
    { id: 102, type: 'parent', sourceId: 1, targetId: 3 },
    { id: 103, type: 'parent', sourceId: 2, targetId: 3 },
    { id: 104, type: 'couple', sourceId: 3, targetId: 4 },
    { id: 105, type: 'parent', sourceId: 3, targetId: 5 },
    { id: 106, type: 'parent', sourceId: 3, targetId: 6 },
    { id: 107, type: 'parent', sourceId: 1, targetId: 7 },
    { id: 108, type: 'parent', sourceId: 2, targetId: 7 },
  ];
  state.nextId = 200;
  updateCounters();
  pushHistory();
}

// ============================================================
// 渲染引擎
// ============================================================
function render() {
  const group = document.getElementById('canvasGroup');
  if (!group) return;

  group.setAttribute('transform', `translate(${state.translateX},${state.translateY}) scale(${state.scale})`);

  renderLinks();
  renderNodes();
  updateCounters();

  const empty = document.getElementById('canvasEmpty');
  if (empty) {
    empty.classList.toggle('hidden', state.members.length > 0);
  }
}

function renderLinks() {
  const container = document.getElementById('linksGroup');
  if (!container) return;
  container.innerHTML = '';

  state.links.forEach(link => {
    const src = state.members.find(m => m.id === link.sourceId);
    const tgt = state.members.find(m => m.id === link.targetId);
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

  const theme = THEMES[state.theme];

  state.members.forEach(member => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `node-group${member.id === state.selectedId ? ' selected' : ''}`);
    g.setAttribute('transform', `translate(${member.x},${member.y})`);
    g.setAttribute('data-id', member.id);

    const color = member.gender === 'female' ? theme.female : theme.male;
    const strokeColor = state.selectedId === member.id ? '#1E293B' : color;

    // 背景矩形
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'node-rect');
    rect.setAttribute('width', NODE_W);
    rect.setAttribute('height', NODE_H);
    rect.setAttribute('rx', 14);
    rect.setAttribute('fill', color);
    rect.setAttribute('stroke', strokeColor);
    rect.setAttribute('stroke-width', state.selectedId === member.id ? '2.5' : '0');
    g.appendChild(rect);

    // 性别图标
    const genderIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    genderIcon.setAttribute('x', 12);
    genderIcon.setAttribute('y', 20);
    genderIcon.setAttribute('class', 'node-gender-icon');
    genderIcon.textContent = member.gender === 'female' ? '♀' : '♂';
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
  state.isDragging = true;
  state.dragTarget = id;
  const member = state.members.find(m => m.id === id);
  _nodeStartX = e.clientX / state.scale - member.x;
  _nodeStartY = e.clientY / state.scale - member.y;
}

function onCanvasMouseDown(e) {
  if (e.button === 1 || (e.button === 0 && !state.isDragging)) {
    state.isPanning = true;
    state.panStartX = e.clientX - state.translateX;
    state.panStartY = e.clientY - state.translateY;
    document.getElementById('canvasContainer').classList.add('grabbing');
  }
}

function onCanvasMouseMove(e) {
  if (state.isDragging && state.dragTarget !== null) {
    const member = state.members.find(m => m.id === state.dragTarget);
    if (member) {
      member.x = e.clientX / state.scale - _nodeStartX;
      member.y = e.clientY / state.scale - _nodeStartY;
      render();
    }
  } else if (state.isPanning) {
    state.translateX = e.clientX - state.panStartX;
    state.translateY = e.clientY - state.panStartY;
    render();
  }
}

function onCanvasMouseUp() {
  if (state.isDragging) {
    pushHistory();
    autoSave();
  }
  state.isDragging = false;
  state.dragTarget = null;
  state.isPanning = false;
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
  const newScale = Math.min(Math.max(state.scale * delta, 0.2), 3);

  const rect = e.currentTarget.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  state.translateX = mx - (mx - state.translateX) * (newScale / state.scale);
  state.translateY = my - (my - state.translateY) * (newScale / state.scale);
  state.scale = newScale;

  document.getElementById('zoomDisplay').textContent = Math.round(state.scale * 100) + '%';
  render();
}

// 触摸支持
let _touch = { startX: 0, startY: 0, dist: 0 };
function onNodeTouchStart(e, id) {
  e.preventDefault();
  const t = e.touches[0];
  selectMember(id);
  state.isDragging = true;
  state.dragTarget = id;
  const member = state.members.find(m => m.id === id);
  _nodeStartX = t.clientX / state.scale - member.x;
  _nodeStartY = t.clientY / state.scale - member.y;
}
function onTouchStart(e) {
  if (e.touches.length === 1) {
    _touch.startX = e.touches[0].clientX - state.translateX;
    _touch.startY = e.touches[0].clientY - state.translateY;
    state.isPanning = true;
  }
}
function onTouchMove(e) {
  e.preventDefault();
  if (state.isDragging && state.dragTarget !== null && e.touches.length === 1) {
    const t = e.touches[0];
    const member = state.members.find(m => m.id === state.dragTarget);
    if (member) {
      member.x = t.clientX / state.scale - _nodeStartX;
      member.y = t.clientY / state.scale - _nodeStartY;
      render();
    }
  } else if (state.isPanning && e.touches.length === 1) {
    state.translateX = e.touches[0].clientX - _touch.startX;
    state.translateY = e.touches[0].clientY - _touch.startY;
    render();
  }
}
function onTouchEnd() {
  if (state.isDragging) pushHistory();
  state.isDragging = false;
  state.dragTarget = null;
  state.isPanning = false;
  autoSave();
}

// ============================================================
// 选中成员
// ============================================================
function selectMember(id) {
  state.selectedId = id;
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
  state.contextTarget = id;
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
  if (state.contextTarget) openEditModal(state.contextTarget);
}
function ctxAddChild() {
  hideContextMenu();
  if (state.contextTarget) addChildTo(state.contextTarget);
}
function ctxAddSpouse() {
  hideContextMenu();
  if (state.contextTarget) addSpouseTo(state.contextTarget);
}
function ctxDelete() {
  hideContextMenu();
  if (state.contextTarget) {
    deleteById(state.contextTarget);
    state.contextTarget = null;
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
  const m = state.members.find(x => x.id === id);
  if (!m) return;
  document.getElementById('modalTitle').textContent = '编辑成员';
  document.getElementById('memberId').value = id;
  document.getElementById('memberName').value = m.name;
  document.getElementById('memberGender').value = m.gender;
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

  const data = {
    name,
    gender: document.getElementById('memberGender').value,
    birth: document.getElementById('memberBirth').value,
    death: document.getElementById('memberDeath').value,
    note: document.getElementById('memberNote').value.trim(),
  };

  if (id) {
    const m = state.members.find(x => x.id === parseInt(id));
    if (m) Object.assign(m, data);
    showToast('成员信息已更新', 'success');
  } else {
    const canvas = document.getElementById('mainCanvas');
    const cx = canvas ? canvas.clientWidth / 2 / state.scale - NODE_W / 2 - state.translateX / state.scale : 300;
    const cy = canvas ? canvas.clientHeight / 2 / state.scale - NODE_H / 2 - state.translateY / state.scale : 200;
    state.members.push({ id: state.nextId++, ...data, x: cx + (Math.random() - 0.5) * 100, y: cy + (Math.random() - 0.5) * 60 });
    showToast('成员添加成功', 'success');
  }

  document.getElementById('memberModal').style.display = 'none';
  pushHistory();
  autoSave();
  render();
}

function addChildTo(parentId) {
  const parent = state.members.find(m => m.id === parentId);
  if (!parent) return;

  const child = {
    id: state.nextId++,
    name: '新成员',
    gender: 'male',
    birth: '',
    death: '',
    note: '',
    x: parent.x + (Math.random() - 0.5) * 120,
    y: parent.y + 120,
  };
  state.members.push(child);
  state.links.push({ id: state.nextId++, type: 'parent', sourceId: parentId, targetId: child.id });
  pushHistory();
  autoSave();
  render();
  selectMember(child.id);
  openEditModal(child.id);
}

function addSpouseTo(memberId) {
  const member = state.members.find(m => m.id === memberId);
  if (!member) return;

  const spouse = {
    id: state.nextId++,
    name: '配偶',
    gender: member.gender === 'male' ? 'female' : 'male',
    birth: '',
    death: '',
    note: '',
    x: member.x + 160,
    y: member.y,
  };
  state.members.push(spouse);
  state.links.push({ id: state.nextId++, type: 'couple', sourceId: memberId, targetId: spouse.id });
  pushHistory();
  autoSave();
  render();
  selectMember(spouse.id);
  openEditModal(spouse.id);
}

function addCouple() {
  const cx = 300 / state.scale - state.translateX / state.scale;
  const cy = 200 / state.scale - state.translateY / state.scale;
  const m1 = { id: state.nextId++, name: '丈夫', gender: 'male', birth: '', death: '', note: '', x: cx, y: cy };
  const m2 = { id: state.nextId++, name: '妻子', gender: 'female', birth: '', death: '', note: '', x: cx + 160, y: cy };
  state.members.push(m1, m2);
  state.links.push({ id: state.nextId++, type: 'couple', sourceId: m1.id, targetId: m2.id });
  pushHistory();
  autoSave();
  render();
  showToast('已添加夫妻节点', 'success');
}

function deleteSelected() {
  if (state.selectedId) {
    deleteById(state.selectedId);
    state.selectedId = null;
  }
}

function deleteById(id) {
  state.members = state.members.filter(m => m.id !== id);
  state.links = state.links.filter(l => l.sourceId !== id && l.targetId !== id);
  if (state.selectedId === id) state.selectedId = null;
  pushHistory();
  autoSave();
  render();
  showToast('成员已删除');
}

// ============================================================
// 视图操作
// ============================================================
function zoomIn() {
  state.scale = Math.min(state.scale * 1.15, 3);
  document.getElementById('zoomDisplay').textContent = Math.round(state.scale * 100) + '%';
  render();
}
function zoomOut() {
  state.scale = Math.max(state.scale * 0.87, 0.2);
  document.getElementById('zoomDisplay').textContent = Math.round(state.scale * 100) + '%';
  render();
}
function zoomReset() {
  state.scale = 1; state.translateX = 0; state.translateY = 0;
  document.getElementById('zoomDisplay').textContent = '100%';
  render();
}

function fitToScreen() {
  if (state.members.length === 0) return;
  const canvas = document.getElementById('mainCanvas');
  const cw = canvas.clientWidth - 80, ch = canvas.clientHeight - 80;

  const xs = state.members.map(m => m.x);
  const ys = state.members.map(m => m.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs) + NODE_W;
  const minY = Math.min(...ys), maxY = Math.max(...ys) + NODE_H;
  const dw = maxX - minX, dh = maxY - minY;

  const scaleX = cw / dw, scaleY = ch / dh;
  state.scale = Math.min(scaleX, scaleY, 1.5);
  state.translateX = (canvas.clientWidth - dw * state.scale) / 2 - minX * state.scale;
  state.translateY = (canvas.clientHeight - dh * state.scale) / 2 - minY * state.scale;
  document.getElementById('zoomDisplay').textContent = Math.round(state.scale * 100) + '%';
  render();
}

function autoLayout() {
  if (state.members.length === 0) return;

  // 简单层级布局：按父子关系分层
  const childIds = new Set(state.links.filter(l => l.type === 'parent').map(l => l.targetId));
  const roots = state.members.filter(m => !childIds.has(m.id));

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
    const children = state.links
      .filter(l => l.type === 'parent' && ids.includes(l.sourceId))
      .map(l => l.targetId);
    placeLevel([...new Set(children)], lv + 1);
  }

  placeLevel(roots.map(r => r.id), 0);

  // 应用坐标
  const GAP_X = 160, GAP_Y = 120, BASE_X = 60, BASE_Y = 60;
  Object.entries(levelMap).forEach(([lv, ids]) => {
    ids.forEach((id, i) => {
      const m = state.members.find(x => x.id === id);
      if (m) {
        m.x = BASE_X + i * GAP_X;
        m.y = BASE_Y + parseInt(lv) * GAP_Y;
      }
    });
  });

  // 未分层的成员
  const unplaced = state.members.filter(m => !placed.has(m.id));
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
  state.theme = theme;
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
  const data = JSON.stringify({ members: state.members, links: state.links, nextId: state.nextId, theme: state.theme });
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
        state.members = data.members || [];
        state.links = data.links || [];
        state.nextId = data.nextId || 200;
        state.theme = data.theme || 'blue';
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
      members: state.members, links: state.links,
      nextId: state.nextId, theme: state.theme
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
        state.members = data.members;
        state.links = data.links || [];
        state.nextId = data.nextId || 200;
        state.theme = data.theme || 'blue';
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
  const snap = JSON.stringify({ members: state.members, links: state.links });
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snap);
  if (state.history.length > 50) state.history.shift();
  state.historyIndex = state.history.length - 1;
}

function undo() {
  console.log('[undo] historyIndex:', state.historyIndex, 'history.length:', state.history.length);
  if (state.historyIndex > 0) {
    state.historyIndex--;
    const snap = JSON.parse(state.history[state.historyIndex]);
    state.members = snap.members;
    state.links = snap.links;
    render();
    showToast('已撤销');
  } else {
    showToast('没有可撤销的操作');
  }
  updateUndoRedoButtons();
}

function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    const snap = JSON.parse(state.history[state.historyIndex]);
    state.members = snap.members;
    state.links = snap.links;
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
    if (state.selectedId && document.getElementById('page-editor') && document.getElementById('page-editor').classList.contains('active')) {
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
  if (mc) mc.textContent = state.members.length;
  if (lc) lc.textContent = state.links.length;
}

// 更新撤销/重做按钮的禁用状态
function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');
  
  if (undoBtn) {
    undoBtn.disabled = state.historyIndex <= 0;
    undoBtn.classList.toggle('disabled', state.historyIndex <= 0);
  }
  if (redoBtn) {
    redoBtn.disabled = state.historyIndex >= state.history.length - 1;
    redoBtn.classList.toggle('disabled', state.historyIndex >= state.history.length - 1);
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

function showHelp() {
  showToast('快捷键：Ctrl+Z 撤销 · Ctrl+Y 重做 · Ctrl+S 保存 · Delete 删除 · 滚轮缩放');
}

