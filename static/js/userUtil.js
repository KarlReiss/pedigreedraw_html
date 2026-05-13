/**
 * 用户工具模块
 * 处理用户登录状态和本地家系图数据存储
 * 本地按用户隔离，每个用户只保存一份当前家系图数据
 */

(function() {
    'use strict';

    // ==================== 本地存储键名 ====================
    var BASE_KEYS = {
        USER_INFO: 'pedigree_user_info',      // 用户信息
        TOKEN: 'pedigree_token',               // 认证令牌
        CURRENT_PEDIGREE: 'pedigree_current',  // 当前家系图数据（带用户ID后缀）
        CURRENT_TITLE: 'pedigree_current_title' // 当前家系图标题（带用户ID后缀）
    };

    // ==================== 旧数据迁移（V1→V2，只执行一次）====================
    (function migrateOldKeys() {
        var migrated = localStorage.getItem('pedigree_storage_migrated');
        if (migrated === 'v2') return;  // 已迁移

        // 读取旧的无后缀 key
        var oldPedigree = localStorage.getItem('pedigree_current');
        var oldTitle = localStorage.getItem('pedigree_current_title');

        if (oldPedigree || oldTitle) {
            // 获取当前用户ID，决定迁移到哪个 key 下
            var uid = 'guest';
            try {
                var userInfo = localStorage.getItem('pedigree_user_info');
                if (userInfo) {
                    var user = JSON.parse(userInfo);
                    uid = user.id || user.userId || 'guest';
                }
                if (uid === 'guest') {
                    // 尝试从 pd_user 获取
                    var pdUser = localStorage.getItem('pd_user');
                    if (pdUser) {
                        var pdObj = JSON.parse(pdUser);
                        uid = pdObj.id || 'guest';
                    }
                }
            } catch (e) {}

            // 迁移到带用户ID的 key
            if (oldPedigree) {
                localStorage.setItem('pedigree_current_' + uid, oldPedigree);
                localStorage.removeItem('pedigree_current');
            }
            if (oldTitle) {
                localStorage.setItem('pedigree_current_title_' + uid, oldTitle);
                localStorage.removeItem('pedigree_current_title');
            }
            console.log('[userUtil] 旧数据已迁移到用户', uid, '的存储空间');
        }

        localStorage.setItem('pedigree_storage_migrated', 'v2');
    })();

    /**
     * 获取带用户ID的存储键，实现多用户数据隔离
     * 未登录时返回 null，调用方应判断
     */
    function _getUserId() {
        var user = _getUserData();
        return user ? (user.id || user.userId || null) : null;
    }

    /**
     * 获取带用户ID后缀的存储键
     * @param {string} baseKey 基础键名
     * @returns {string} 带 _<userId> 后缀的键名，未登录用 _guest
     */
    function _userKey(baseKey) {
        var uid = _getUserId();
        return baseKey + '_' + (uid || 'guest');
    }

    // ==================== 用户数据管理 ====================

    /**
     * 获取当前登录用户信息（内部版本，不依赖导出API）
     * @returns {Object|null} 用户信息对象或null
     */
    function _getUserData() {
        try {
            var userInfo = localStorage.getItem(BASE_KEYS.USER_INFO);
            if (userInfo) {
                return JSON.parse(userInfo);
            }
            // 兼容 _auth 对象
            if (typeof _auth !== 'undefined' && _auth.isLoggedIn()) {
                var user = _auth.getUser();
                if (user) {
                    return {
                        id: user.id || user.userId,
                        username: user.username || user.name,
                        email: user.email || '',
                        displayName: user.displayName || user.nickname || user.username
                    };
                }
            }
        } catch (e) {
            console.error('获取用户信息失败:', e);
        }
        return null;
    }

    /**
     * 获取当前登录用户信息（公共API）
     * @returns {Object|null} 用户信息对象或null
     */
    function userData() {
        return _getUserData();
    }

    /**
     * 获取认证令牌
     * @returns {string|null} 令牌字符串或null
     */
    function tokenData() {
        try {
            var token = localStorage.getItem(BASE_KEYS.TOKEN);
            if (token) {
                return token;
            }
            // 兼容 _auth 对象
            if (typeof _auth !== 'undefined' && _auth.isLoggedIn()) {
                var user = _auth.getUser();
                if (user && user.token) {
                    return user.token;
                }
            }
        } catch (e) {
            console.error('获取令牌失败:', e);
        }
        return null;
    }

    /**
     * 检查用户是否已登录
     * @returns {boolean}
     */
    function isLoggedIn() {
        return _getUserData() !== null && tokenData() !== null;
    }

    // ==================== 家系图本地存储管理 ====================

    /**
     * 获取当前保存的家系图数据（按用户隔离）
     * @returns {Object|null} 家系图数据对象，包含 data 和 updatedAt
     */
    function getCurrentPedigree() {
        try {
            var key = _userKey(BASE_KEYS.CURRENT_PEDIGREE);
            var data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('获取当前家系图失败:', e);
            return null;
        }
    }

    /**
     * 获取当前家系图标题（按用户隔离）
     * @returns {string}
     */
    function getCurrentPedigreeTitle() {
        var key = _userKey(BASE_KEYS.CURRENT_TITLE);
        return localStorage.getItem(key) || '家系图';
    }

    /**
     * 设置当前家系图标题（按用户隔离）
     * @param {string} title 新的标题
     */
    function setCurrentPedigreeTitle(title) {
        var key = _userKey(BASE_KEYS.CURRENT_TITLE);
        localStorage.setItem(key, title || '家系图');
        // 同步更新家系图数据中的标题
        var pedigreeKey = _userKey(BASE_KEYS.CURRENT_PEDIGREE);
        var dataStr = localStorage.getItem(pedigreeKey);
        if (dataStr) {
            try {
                var data = JSON.parse(dataStr);
                data.title = title || '家系图';
                localStorage.setItem(pedigreeKey, JSON.stringify(data));
            } catch (e) {
                console.error('[userUtil] 更新标题失败:', e);
            }
        }
    }

    /**
     * 检查是否有本地保存的家系图（按用户隔离）
     * @returns {boolean}
     */
    function hasLocalPedigree() {
        return getCurrentPedigree() !== null;
    }

    /**
     * 保存当前家系图到本地（覆盖模式，按用户隔离）
     * @param {Array|Object} jsonData 家系图JSON数据
     * @param {string} title 家系图标题
     * @param {Object} options 额外选项 { source: 'manual'|'template'|'cloud', cloudId: 123 }
     */
    function saveCurrentPedigree(jsonData, title, options) {
        options = options || {};
        var pedigreeKey = _userKey(BASE_KEYS.CURRENT_PEDIGREE);
        var titleKey = _userKey(BASE_KEYS.CURRENT_TITLE);

        var now = new Date().toISOString();

        // 确保 jsonData 是有效的对象、数组或字符串
        if (!jsonData || (typeof jsonData !== 'object' && typeof jsonData !== 'string')) {
            console.error('[LocalStorage] 保存失败：数据无效', typeof jsonData);
            return false;
        }

        // 如果 jsonData 已经是字符串，尝试解析
        var dataObj = jsonData;
        if (typeof jsonData === 'string') {
            try {
                dataObj = JSON.parse(jsonData);
            } catch (e) {
                console.error('[LocalStorage] 保存失败：JSON格式无效', e);
                return false;
            }
        }

        var data = {
            data: dataObj,
            updatedAt: now,
            source: options.source || 'manual',  // manual: 手动保存, template: 模板创建, cloud: 云端导入, autosave: 自动保存
            cloudId: options.cloudId || null     // 云端ID（如果有）
        };

        try {
            localStorage.setItem(pedigreeKey, JSON.stringify(data));
            localStorage.setItem(titleKey, title || '家系图');

            return true;
        } catch (e) {
            console.error('保存家系图到本地失败:', e);
            return false;
        }
    }

    /**
     * 清除本地保存的家系图（按用户隔离）
     */
    function clearLocalPedigree() {
        try {
            var pedigreeKey = _userKey(BASE_KEYS.CURRENT_PEDIGREE);
            var titleKey = _userKey(BASE_KEYS.CURRENT_TITLE);
            localStorage.removeItem(pedigreeKey);
            localStorage.removeItem(titleKey);
            return true;
        } catch (e) {
            console.error('清除本地家系图失败:', e);
            return false;
        }
    }

    // ==================== 导出公共API ====================

    // 将函数挂载到 window 对象，供外部调用
    window.userUtil = {
        // 用户相关
        userData: userData,
        tokenData: tokenData,
        isLoggedIn: isLoggedIn,

        // 家系图本地存储（按用户隔离）
        getCurrentPedigree: getCurrentPedigree,
        getCurrentPedigreeTitle: getCurrentPedigreeTitle,
        setCurrentPedigreeTitle: setCurrentPedigreeTitle,
        hasLocalPedigree: hasLocalPedigree,
        saveCurrentPedigree: saveCurrentPedigree,
        clearLocalPedigree: clearLocalPedigree,

        // 向后兼容别名（已废弃，但保留以避免代码报错）
        getPedigreeList: function() { return hasLocalPedigree() ? [{ id: 'current', title: getCurrentPedigreeTitle() }] : []; },
        getPedigreeById: function(id) {
            if (id === 'current' || hasLocalPedigree()) {
                return getCurrentPedigree();
            }
            return null;
        },
        setCurrentPedigreeId: function(id) { /* 向后兼容，无需操作 */ },
        getCurrentPedigreeId: function() { return hasLocalPedigree() ? 'current' : null; },
        deletePedigree: function(id) { clearLocalPedigree(); return true; },
        savePedigreeToLocal: function(data) { return saveCurrentPedigree(data.data || data, data.title); },

        // 版本信息
        VERSION: '2.0.0'
    };

})();
