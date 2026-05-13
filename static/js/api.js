/**
 * PedigreeDraw - API 模块
 * 负责与后端 API 通信，包含 Token 管理和请求封装
 */

// ============================================================
// API 配置
// ============================================================
const API_CONFIG = {
  //  baseUrl: 'http://localhost:8089',
  //  线上环境
    baseUrl: 'https://api.pedigreedraw.cn',
  
  // API 前缀路径
  paths: {
    auth: '/auth',
    user: '/api/pedigree',
    vip: '/api/vip/order',
    feedback: '/api/feedback',
    pedigree: '/pedigree/info',
    pedigreeData: '/api/pedigree/data'
  }
};

// ============================================================
// Token 管理
// ============================================================
const TokenManager = {
  // localStorage key
  KEYS: {
    ACCESS_TOKEN: 'pd_access_token',
    REFRESH_TOKEN: 'pd_refresh_token',
    TOKEN_EXPIRE: 'pd_token_expire'
  },

  /**
   * 保存 Token
   * @param {Object} tokens - { accessToken, refreshToken, expiresIn, refreshExpiresIn }
   */
  setTokens(tokens) {
    if (tokens.accessToken) {
      localStorage.setItem(this.KEYS.ACCESS_TOKEN, tokens.accessToken);
      // 计算过期时间
      const expireTime = Date.now() + (tokens.expiresIn || 7200) * 1000;
      localStorage.setItem(this.KEYS.TOKEN_EXPIRE, String(expireTime));
    } else {
      console.error('[TokenManager] 警告: accessToken 为空!');
    }
    if (tokens.refreshToken) {
      localStorage.setItem(this.KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
  },

  /**
   * 获取 Access Token
   */
  getAccessToken() {
    return localStorage.getItem(this.KEYS.ACCESS_TOKEN);
  },

  /**
   * 获取 Refresh Token
   */
  getRefreshToken() {
    return localStorage.getItem(this.KEYS.REFRESH_TOKEN);
  },

  /**
   * 检查 Token 是否过期
   */
  isTokenExpired() {
    const expireStr = localStorage.getItem(this.KEYS.TOKEN_EXPIRE);
    if (!expireStr) return true;
    const expireTime = parseInt(expireStr);
    // 提前5分钟认为过期
    return Date.now() >= expireTime - 5 * 60 * 1000;
  },

  /**
   * 清除所有 Token
   */
  clearTokens() {
    localStorage.removeItem(this.KEYS.ACCESS_TOKEN);
    localStorage.removeItem(this.KEYS.REFRESH_TOKEN);
    localStorage.removeItem(this.KEYS.TOKEN_EXPIRE);
  }
};

// ============================================================
// API 请求封装
// ============================================================
class ApiClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
  }

  /**
   * 通用请求方法
   * @param {string} path - 请求路径
   * @param {Object} options - fetch 选项
   * @returns {Promise<Object>} 响应数据
   */
  async request(path, options = {}) {
    const url = this.baseUrl + path;
    
    // 默认配置
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      // 开发环境跨域时不要使用 'include'，会导致 Authorization header 被浏览器阻止
      credentials: 'omit'
    };

    // 添加 Token
    const token = TokenManager.getAccessToken();
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[API] 请求路径:', path, '| 未找到 Token');
    }

    // 合并选项
    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, finalOptions);

      // 处理 429 请求过于频繁（如登录锁定）
      if (response.status === 429) {
        let data;
        try { data = await response.json(); } catch { data = { msg: '操作过于频繁，请稍后再试' }; }
        console.error('[API] 请求被限流, status: 429, msg:', data.msg);
        throw new ApiError(429, data.msg || '操作过于频繁，请稍后再试');
      }

      const data = await response.json();

      // 处理业务错误
      if (data.code !== 200) {
        console.log('[API] 请求失败, code:', data.code, 'msg:', data.msg);

        // 410: 旧系统用户需重置密码（携带 email 数据）
        if (data.code === 410) {
          throw new ApiError(410, data.msg || '请修改密码后再登录', data.data);
        }
        // Token 过期，尝试刷新
        if (data.code === 401 && TokenManager.getRefreshToken()) {
          console.log('[API] Token过期，尝试刷新...');
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // 重新请求
            finalOptions.headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
            const retryResponse = await fetch(url, finalOptions);
            const retryData = await retryResponse.json();
            if (retryData.code !== 200) {
              console.error('[API] 重试失败, code:', retryData.code, 'msg:', retryData.msg);
              throw new ApiError(retryData.code, retryData.msg || '请求失败');
            }
            return retryData;
          } else {
            console.error('[API] Token刷新失败');
          }
        }
        throw new ApiError(data.code, data.msg || '请求失败');
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // 网络错误
      throw new ApiError(-1, '网络连接失败，请检查网络');
    }
  }

  /**
   * GET 请求
   */
  async get(path, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    return this.request(fullPath, { method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post(path, data = {}) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT 请求
   */
  async put(path, data = {}) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH 请求
   */
  async patch(path, data = {}) {
    return this.request(path, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE 请求
   */
  async delete(path, data = {}) {
    return this.request(path, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * 刷新 Token
   */
  async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(this.baseUrl + this.config.paths.auth + '/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        TokenManager.setTokens(data.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// ============================================================
// API 错误类
// ============================================================
class ApiError extends Error {
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
    this.data = data || null;
  }
}

// ============================================================
// 创建 API 客户端实例
// ============================================================
const api = new ApiClient(API_CONFIG);

// ============================================================
// 认证相关 API
// ============================================================
const AuthApi = {
  /**
   * 登录
   * @param {string} account - 用户名或邮箱
   * @param {string} password - 密码
   */
  async login(account, password) {
    const response = await api.post(`${API_CONFIG.paths.auth}/login`, {
      account,
      password
    });
    
    // 保存 Token
    if (response.data) {
      TokenManager.setTokens(response.data);
    } else {
      console.error('[AuthApi.login] 警告: response.data 为空!');
    }
    
    return response;
  },

  /**
   * 发送注册验证码
   * @param {string} email - 邮箱
   */
  async sendRegisterCode(email) {
    return api.post(`${API_CONFIG.paths.auth}/register/send-code`, { email });
  },

  /**
   * 注册
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} email - 邮箱
   * @param {string} code - 邮箱验证码
   */
  async register(username, password, email, code) {
    const response = await api.post(`${API_CONFIG.paths.auth}/register`, {
      username,
      password,
      email,
      code
    });
    return response;
  },

  /**
   * 发送忘记密码验证码
   * @param {string} email - 邮箱
   */
  async sendForgotPasswordCode(email) {
    return api.post(`${API_CONFIG.paths.auth}/forgot-password/send-code`, { email });
  },

  /**
   * 重置密码
   * @param {string} email - 邮箱
   * @param {string} code - 验证码
   * @param {string} newPassword - 新密码
   */
  async resetPassword(email, code, newPassword) {
    return api.post(`${API_CONFIG.paths.auth}/forgot-password/reset`, {
      email,
      code,
      newPassword
    });
  },

  /**
   * 退出登录
   */
  async logout() {
    try {
      await api.post(`${API_CONFIG.paths.auth}/logout`);
    } finally {
      TokenManager.clearTokens();
    }
  },

  /**
   * 检查登录状态
   * 同时检查 Token 和用户信息是否存在
   */
  isLoggedIn() {
    const hasToken = !!TokenManager.getAccessToken();
    const hasUser = (function() {
      try {
        return !!JSON.parse(localStorage.getItem('pd_user'));
      } catch { return false; }
    })();
    return hasToken && hasUser;
  }
};

// ============================================================
// 用户相关 API
// ============================================================
const UserApi = {
  /**
   * 获取当前用户信息
   */
  async getUserInfo() {
    return api.get(`${API_CONFIG.paths.user}/userinfo`, { _t: Date.now() });
  },

  /**
   * 修改密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   */
  async changePassword(oldPassword, newPassword) {
    return api.post(`${API_CONFIG.paths.user}/change-password`, {
      currentPassword: oldPassword,
      newPassword
    });
  },

  /**
   * 修改昵称
   * @param {string} nickname - 新昵称
   */
  async changeNickname(nickname) {
    console.log('[UserApi.changeNickname] 发送请求, nickname:', nickname);
    return api.put(`${API_CONFIG.paths.user}/change-nickname`, { nickname });
  }
};

// ============================================================
// VIP 订单相关 API
// ============================================================
const VipApi = {
  /**
   * 获取 VIP 套餐列表
   */
  async getPlans() {
    return api.get(`${API_CONFIG.paths.vip}/plans`);
  },

  /**
   * 创建 VIP 订单
   * @param {string} planId - 套餐 ID
   */
  async createOrder(planId) {
    return api.post(`${API_CONFIG.paths.vip}/create`, { planId });
  },

  /**
   * 查询订单状态
   * @param {string} orderId - 订单号
   */
  async queryOrderStatus(orderId) {
    return api.get(`${API_CONFIG.paths.vip}/status/${orderId}`);
  },

  /**
   * 虚拟支付确认（开发测试用）
   * @param {string} orderId - 订单号
   */
  async mockPay(orderId) {
    return api.post(`${API_CONFIG.paths.vip}/mock-pay`, { orderId });
  }
};

// ============================================================
// 反馈相关 API
// ============================================================
const FeedbackApi = {
  /**
   * 提交反馈
   * @param {Object} data - { type, content, contact }
   */
  async submit(data) {
    return api.post(`${API_CONFIG.paths.feedback}`, data);
  },

  /**
   * 获取我的反馈列表
   */
  async getMyFeedback() {
    return api.get(`${API_CONFIG.paths.feedback}/my`);
  }
};

// ============================================================
// 家系图相关 API
// ============================================================
const PedigreeApi = {
  /**
   * 获取家系图列表
   * 后端使用 POST /pedigree/info/list
   */
  async getList(params = {}) {
    return api.post(`${API_CONFIG.paths.pedigree}/list`, params);
  },

  /**
   * 获取家系图详情
   * @param {number} id - 家系图 ID
   */
  async getById(id) {
    return api.get(`${API_CONFIG.paths.pedigree}/${id}`);
  },

  /**
   * 创建家系图
   * @param {Object} data - 家系图数据
   */
  async create(data) {
    return api.post(`${API_CONFIG.paths.pedigree}`, data);
  },

  /**
   * 更新家系图
   * @param {number} id - 家系图 ID
   * @param {Object} data - 家系图数据
   */
  async update(id, data) {
    return api.patch(`${API_CONFIG.paths.pedigree}/${id}`, data);
  },

  /**
   * 删除家系图
   * @param {number} id - 家系图 ID
   */
  async delete(id) {
    return api.delete(`${API_CONFIG.paths.pedigree}/${id}`);
  },

  /**
   * 复制家系图
   * @param {number} id - 家系图 ID
   */
  async copy(id) {
    return api.post(`${API_CONFIG.paths.pedigree}/copy/${id}`);
  },

  /**
   * 获取统计概览
   * GET /pedigree/info/stats
   */
  async getStats() {
    return api.get(`${API_CONFIG.paths.pedigree}/stats`);
  },

  /**
   * SVG 转 PNG
   * @param {string} svgData - SVG 字符串
   * @param {Object} options - 转换选项
   */
  async svgToPng(svgData, options = {}) {
    return api.post(`${API_CONFIG.paths.pedigreeData}/convert/svg-to-png`, {
      svgData,
      ...options
    });
  },

  /**
   * SVG 转 PDF
   * @param {string} svgData - SVG 字符串
   * @param {Object} options - 转换选项
   */
  async svgToPdf(svgData, options = {}) {
    return api.post(`${API_CONFIG.paths.pedigreeData}/convert/svg-to-pdf`, {
      svgData,
      ...options
    });
  }
};

// ============================================================
// 导出 API 供全局使用
// ============================================================
window.ApiClient = ApiClient;
window.ApiError = ApiError;
window.TokenManager = TokenManager;
window.api = api;
window.AuthApi = AuthApi;
window.UserApi = UserApi;
window.VipApi = VipApi;
window.FeedbackApi = FeedbackApi;
window.PedigreeApi = PedigreeApi;
