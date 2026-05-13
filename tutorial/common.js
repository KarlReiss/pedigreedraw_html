/**
 * PedigreeDraw - 公共组件：导航栏 + 页脚注入 + 菜单高亮 + 用户状态
 */

// ============================================================
// 当前页面检测
// ============================================================
const _currentPage = (function () {
  let path = location.pathname.split('/').pop() || 'index.html';
  // serve clean URLs: /tutorial → 没有 .html 后缀，补上
  if (path && !path.includes('.') && path !== 'index') {
    path = path + '.html';
  }
  if (path === '' || path === 'index.html') return 'home';
  if (path === 'editor.html') return 'editor';
  if (path === 'tutorial.html') return 'tutorial';
  if (path === 'faq.html') return 'faq';
  if (path === 'login.html') return 'login';
  if (path === 'profile.html') return 'profile';
  if (path === 'account.html') return 'account';
  if (path === 'contact.html') return 'contact';
  if (path === 'feedback.html') return 'feedback';
  if (path === 'vip.html') return 'vip';
  if (path === 'terms.html') return 'terms';
  if (path === 'privacy.html') return 'privacy';
  if (path === 'cookie.html') return 'cookie';
  return 'home';
})();

// ============================================================
// 登录状态管理（localStorage 模拟）
// ============================================================
const _auth = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('pd_user'));
    } catch { return null; }
  },
  setUser(user) {
    localStorage.setItem('pd_user', JSON.stringify(user));
  },
  getPlan() {
    // 用户版本：'free' 或 'pro'
    try {
      return localStorage.getItem('pd_plan') || 'free';
    } catch { return 'free'; }
  },
  setPlan(plan) {
    localStorage.setItem('pd_plan', plan);
  },
  isPro() {
    return this.getPlan() === 'pro';
  },
  // VIP 会员管理
  getVip() {
    try {
      const v = JSON.parse(localStorage.getItem('pd_vip'));
      if (!v) return { level: 'free', expire: null };
      // 检查是否已过期
      if (v.expire && v.expire !== 'lifetime') {
        if (new Date(v.expire) < new Date()) {
          localStorage.removeItem('pd_vip');
          return { level: 'free', expire: null };
        }
      }
      return v;
    } catch { return { level: 'free', expire: null }; }
  },
  setVip(vipInfo) {
    localStorage.setItem('pd_vip', JSON.stringify(vipInfo));
    // 同步旧 plan 字段（兼容旧代码）
    localStorage.setItem('pd_plan', vipInfo.level === 'free' ? 'free' : 'pro');
  },
  isVip() {
    const v = this.getVip();
    return v.level !== 'free';
  },
  getVipLevelName() {
    const v = this.getVip();
    const map = {
      free:         '免费版',
      vip_half:     '半年VIP',
      vip_year:     '年度VIP',
      vip_2year:    '两年VIP',
      vip_lifetime: '终生VIP',
    };
    return map[v.level] || '免费版';
  },
  logout() {
    // 调用后端退出接口（不等待结果）
    if (window.AuthApi) {
      AuthApi.logout().catch(() => {});
    }
    // 清除所有用户相关的本地存储
    const keysToRemove = [
      'pd_user', 'pd_vip', 'pd_plan', 
      'pd_access_token', 'pd_refresh_token', 'pd_token_expire'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    // 广播登出事件，各页面可监听
    window.dispatchEvent(new CustomEvent('pd:logout'));
    location.href = 'index.html';
  },
  /**
   * 检查登录状态
   * 同时检查 Token 和用户信息
   */
  isLoggedIn() {
    const hasToken = !!localStorage.getItem('pd_access_token');
    const hasUser = !!this.getUser();
    return hasToken && hasUser;
  }
};

// ============================================================
// 导航栏 HTML（根据登录状态动态生成）
// ============================================================
function _buildNavActions() {
  if (_auth.isLoggedIn()) {
    const user = _auth.getUser();
    const initial = (user.name || '用').charAt(0);
    const vip = _auth.getVip();
    const isVip = vip.level !== 'free';
    const vipBadgeHtml = isVip
      ? `<span class="nav-vip-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><path d="M3 17l3-8 6 5 6-5 3 8H3z"/></svg>${_auth.getVipLevelName()}</span>`
      : '';
    return `
      <div class="nav-user-wrapper">
        <button class="nav-user-btn" id="navUserBtn" onclick="toggleUserDropdown()">
          <div class="nav-user-avatar${isVip ? ' nav-user-avatar-vip' : ''}">${initial}</div>
          <span class="nav-user-name">${user.name || '用户'}${vipBadgeHtml}</span>
          <svg class="nav-user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="user-dropdown" id="userDropdown">
          <div class="dropdown-user-info">
            <div class="dropdown-user-avatar${isVip ? ' nav-user-avatar-vip' : ''}">${initial}</div>
            <div class="dropdown-user-detail">
              <span class="dropdown-user-name">${user.name || '用户'}</span>
              <span class="dropdown-user-email">${user.email || ''}</span>
              ${isVip ? `<span class="dropdown-vip-tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B"><path d="M3 17l3-8 6 5 6-5 3 8H3z"/></svg>${_auth.getVipLevelName()}</span>` : ''}
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="profile.html">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            我的家系图
          </a>
          <a class="dropdown-item" href="editor.html">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            新建家系图
          </a>
          <a class="dropdown-item dropdown-item-vip" href="vip.html" style="display:none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17l3-8 6 5 6-5 3 8H3z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/><line x1="3" y1="20" x2="21" y2="20" stroke="#D97706" stroke-width="2" stroke-linecap="round"/></svg>
            <span class="vip-dropdown-label">${isVip ? '会员中心' : '升级 VIP'}</span>
          </a>
          <a class="dropdown-item" href="account.html">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            个人设置
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item danger" href="javascript:void(0)" onclick="_auth.logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            退出登录
          </a>
        </div>
      </div>`;
  }
  return `
    <a class="btn btn-ghost" href="login.html">登录</a>
    <a class="btn btn-primary" href="editor.html" onclick="goEditor(event)">免费使用</a>`;
}

const _navHTML = `
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a class="nav-logo" href="index.html" aria-label="PedigreeDraw 首页">
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <rect x="16" y="4" width="8" height="8" rx="1" fill="#1A56A0"/>
        <line x1="20" y1="12" x2="20" y2="18" stroke="#1A56A0" stroke-width="1.5"/>
        <line x1="10" y1="18" x2="30" y2="18" stroke="#1A56A0" stroke-width="1.5"/>
        <rect x="4" y="22" width="8" height="8" rx="4" fill="#0B8A6B"/>
        <rect x="16" y="22" width="8" height="8" rx="1" fill="none" stroke="#0B8A6B" stroke-width="1.5"/>
        <rect x="28" y="22" width="8" height="8" rx="1" fill="#0B8A6B" opacity="0.4" stroke="#0B8A6B" stroke-width="1.5"/>
        <line x1="10" y1="18" x2="8" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
        <line x1="20" y1="18" x2="20" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
        <line x1="30" y1="18" x2="32" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
      </svg>
      <span>PedigreeDraw</span>
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html"   class="nav-link" data-page="home">首页</a></li>
      <li><a href="editor.html" class="nav-link" data-page="editor" onclick="goEditor(event)">开始绘制</a></li>
      <li><a href="tutorial.html" class="nav-link" data-page="tutorial">教程</a></li>
      <li><a href="faq.html"     class="nav-link" data-page="faq">FAQ</a></li>
    </ul>
    <div class="nav-actions" id="navActions">
      ${_buildNavActions()}
    </div>
    <button class="hamburger" id="hamburger" aria-label="打开菜单" aria-expanded="false" aria-controls="navLinks" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

// ============================================================
// 页脚 HTML
// ============================================================
const _footerHTML = `
<footer class="footer" id="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="nav-logo" href="index.html" aria-label="PedigreeDraw 首页">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect x="16" y="4" width="8" height="8" rx="1" fill="#1A56A0"/>
            <line x1="20" y1="12" x2="20" y2="18" stroke="#1A56A0" stroke-width="1.5"/>
            <line x1="10" y1="18" x2="30" y2="18" stroke="#1A56A0" stroke-width="1.5"/>
            <rect x="4" y="22" width="8" height="8" rx="4" fill="#0B8A6B"/>
            <rect x="16" y="22" width="8" height="8" rx="1" fill="none" stroke="#0B8A6B" stroke-width="1.5"/>
            <rect x="28" y="22" width="8" height="8" rx="1" fill="#0B8A6B" opacity="0.4" stroke="#0B8A6B" stroke-width="1.5"/>
            <line x1="10" y1="18" x2="8" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
            <line x1="20" y1="18" x2="20" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
            <line x1="30" y1="18" x2="32" y2="22" stroke="#1A56A0" stroke-width="1.5"/>
          </svg>
          <span>PedigreeDraw</span>
        </a>
        <p>专业的在线遗传家系图绘制工具，遵循 ACMG/ESHG 国际标准，面向临床遗传科与科研工作者。</p>
      </div>
      <div class="footer-col">
        <h4>产品</h4>
        <ul>
          <li><a href="editor.html">开始绘制</a></li>
          <li><a href="tutorial.html">使用教程</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>帮助与支持</h4>
        <ul>
          <li><a href="faq.html">常见问题</a></li>
          <li><a href="contact.html">联系我们</a></li>
          <li><a href="feedback.html">意见反馈</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>法律条款</h4>
        <ul>
          <li><a href="terms.html">用户协议</a></li>
          <li><a href="privacy.html">隐私政策</a></li>
          <li><a href="cookie.html">Cookie 政策</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 PedigreeDraw. 保留所有权利。</span>
      <div class="footer-bottom-links">
        <a href="terms.html">用户协议</a>
        <a href="privacy.html">隐私政策</a>
        <a href="cookie.html">Cookie 政策</a>
      </div>
    </div>
    <div class="footer-icp">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">湘ICP备2025113475号-1</a>
    </div>
  </div>
</footer>`;

// ============================================================
// 注入导航 + 页脚
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // 注入导航栏
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.outerHTML = _navHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', _navHTML);
  }

  // 高亮当前页菜单
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === _currentPage);
  });

  // 编辑器页不注入页脚
  if (_currentPage !== 'editor') {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = _footerHTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', _footerHTML);
    }
  }

  // 监听用户信息更新事件（其他页面修改用户信息后通知导航栏刷新）
  window.addEventListener('pd:user-updated', () => {
    const navActions = document.getElementById('navActions');
    if (navActions) {
      navActions.innerHTML = _buildNavActions();
    }
  });
});

  // 导航滚动阴影
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });

// 点击页面空白区域关闭用户下拉菜单
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.nav-user-wrapper');
  const dropdown = document.getElementById('userDropdown');
  const btn = document.getElementById('navUserBtn');
  if (wrapper && !wrapper.contains(e.target)) {
    if (dropdown) dropdown.classList.remove('show');
    if (btn) btn.classList.remove('open');
  }
});

// ============================================================
// 汉堡菜单
// ============================================================
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (hamburger) {
    const isOpen = links && links.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  }
}

// ============================================================
// 用户下拉菜单
// ============================================================
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  const btn = document.getElementById('navUserBtn');
  if (dropdown) dropdown.classList.toggle('show');
  if (btn) btn.classList.toggle('open');
}

// ============================================================
// 跳转编辑器（需登录校验）
// ============================================================
function goEditor(e) {
  if (!_auth.isLoggedIn()) {
    e.preventDefault();
    location.href = 'login.html?redirect=' + encodeURIComponent('editor.html');
    return;
  }
  // 已登录，正常跳转
}

// ============================================================
// Toast 通知（全局可用）
// ============================================================
function showToast(msg, type = '') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' ' + type : ''}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  toast.innerHTML = `${icons[type] || 'ℹ️'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
