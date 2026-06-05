var XWiki = function (_0x2ff34d) {
    var _0x1d5918 = (function () {
            var _0x422b67 = !![];
            return function (_0x6ed191, _0x48474e) {
                var _0x415227 = _0x422b67 ? function () {
                    if (_0x48474e) {
                        var _0x53036d = _0x48474e['apply'](_0x6ed191, arguments);
                        return _0x48474e = null, _0x53036d;
                    }
                } : function () {};
                return _0x422b67 = ![], _0x415227;
            };
        }()),
        _0x59ac26 = (function () {
            var _0x1331dc = !![];
            return function (_0x5b379b, _0x2620cb) {
                var _0x7bb2c9 = _0x1331dc ? function () {
                    if (_0x2620cb) {
                        var _0x49e6d6 = _0x2620cb['apply'](_0x5b379b, arguments);
                        return _0x2620cb = null, _0x49e6d6;
                    }
                } : function () {};
                return _0x1331dc = ![], _0x7bb2c9;
            };
        }()),
        _0xc75ac5 = _0x2ff34d['actionButtons'] = _0x2ff34d['actionButtons'] || {};
    _0xc75ac5['EditActions'] = Class['create']({
        'initialize': function () {
            this['addListeners'](), this['addShortcuts'](), this['addValidators']();
        },
        'addListeners': function () {
            $$('input[name=action_cancel]')['each'](function (_0x5c3d52) {
                _0x5c3d52['observe']('click', this['onCancel']['bindAsEventListener'](this));
            } ['bind'](this)), $$('input[name=action_preview]')['each'](function (_0x51d528) {
                _0x51d528['observe']('click', this['onPreview']['bindAsEventListener'](this));
            } ['bind'](this)), $$('input[name=action_save]')['each'](function (_0x377be4) {
                _0x377be4['observe']('click', this['onSaveAndView']['bindAsEventListener'](this));
            } ['bind'](this)), $$('input[name=action_saveandcontinue]')['each'](function (_0x4f4a6e) {
                _0x4f4a6e['observe']('click', this['onSaveAndContinue']['bindAsEventListener'](this));
            } ['bind'](this));
        },
        'addShortcuts': function () {
            var _0x26642d = {};
            _0x26642d['action_cancel'] = 'Alt+C', _0x26642d['action_preview'] = 'Alt+P', _0x26642d['action_edit'] = 'Alt+B', _0x26642d['action_inline'] = 'Alt+B', _0x26642d['action_save'] = 'Alt+S', _0x26642d['action_propupdate'] = 'Alt+S', _0x26642d['action_saveandcontinue'] = 'Alt+Shift+S';
            var _0x5347a9 = _0x26642d;
            for (var _0xaf7ea1 in _0x5347a9) {
                var _0x44fbd7 = $$('input[name=' + _0xaf7ea1 + ']');
                if (_0x44fbd7['size']() > 0x0) {
                    var _0x3da033 = {};
                    _0x3da033['propagate'] = ![], shortcut['add'](_0x5347a9[_0xaf7ea1], function () {
                        this['click']();
                    } ['bind'](_0x44fbd7['first']()), _0x3da033);
                }
            }
        },
        'validators': new Array(),
        'addValidators': function () {
            var _0x2a2fba = $('body')['select']('input.required');
            for (var _0x5e170f = 0x0; _0x5e170f < _0x2a2fba['length']; _0x5e170f++) {
                var _0x597733 = _0x2a2fba[_0x5e170f],
                    _0x182a92 = {};
                _0x182a92['validMessage'] = '';
                var _0x529e38 = new LiveValidation(_0x597733, _0x182a92),
                    _0x559b2d = {};
                _0x559b2d['failureMessage'] = 'This field is required.', _0x529e38['add'](Validate['Presence'], _0x559b2d), _0x529e38['validate'](), this['validators']['push'](_0x529e38);
            }
        },
        'validateForm': function (_0x18a235) {
            for (var _0x195dbe = 0x0; _0x195dbe < this['validators']['length']; _0x195dbe++) {
                if (!this['validators'][_0x195dbe]['validate']()) return ![];
            }
            var _0x1155d8 = _0x18a235['comment'];
            if (_0x1155d8 && (![] || ![]))
                while (_0x1155d8['value'] == '') {
                    var _0x225fdf = prompt('Enter a brief description of your changes', '');
                    if (_0x225fdf === null) return ![];
                    _0x1155d8['value'] = _0x225fdf;
                    if (!![]) break;
                }
            return !![];
        },
        'onCancel': function (_0x17b174) {
            _0x17b174['stop'](), this['notify'](_0x17b174, 'cancel');
            var _0x194b81 = _0x17b174['element']()['form']['action'];
            typeof _0x194b81 != 'string' && (_0x194b81 = _0x17b174['element']()['form']['attributes']['getNamedItem']('action'), _0x194b81 ? _0x194b81 = _0x194b81['nodeValue'] : _0x194b81 = window['self']['location']['href']);
            var _0x377134 = _0x194b81['split']('#', 0x2),
                _0x138e75 = _0x377134['length'] == 0x2 ? _0x377134[0x1] : '';
            _0x194b81 = _0x377134[0x0], _0x194b81['indexOf']('?') == -0x1 && (_0x194b81 += '?'), _0x2ff34d['EditLock'] && _0x2ff34d['EditLock']['setLocked'](![]), window['location'] = _0x194b81 + '&action_cancel=true' + _0x138e75;
        },
        'onPreview': function (_0x537f70) {
            !this['validateForm'](_0x537f70['element']()['form']) ? _0x537f70['stop']() : this['notify'](_0x537f70, 'preview');
        },
        'onSaveAndView': function (_0x484589) {
            if (!this['validateForm'](_0x484589['element']()['form'])) _0x484589['stop']();
            else {
                var _0x4e1708 = {};
                _0x4e1708['continue'] = ![], this['notify'](_0x484589, 'save', _0x4e1708);
            }
        },
        'onSaveAndContinue': function (_0x36b908) {
            if (!this['validateForm'](_0x36b908['element']()['form'])) _0x36b908['stop']();
            else {
                var _0x4df9a4 = {};
                _0x4df9a4['continue'] = !![], this['notify'](_0x36b908, 'save', _0x4df9a4);
            }
        },
        'notify': function (_0x37f7af, _0x428daf, _0x24e8df) {
            document['fire']('xwiki:actions:' + _0x428daf, Object['extend']({
                'originalEvent': _0x37f7af,
                'form': _0x37f7af['element']()['form']
            }, _0x24e8df || {})), _0x37f7af['stopped'] && _0x37f7af['stop']();
        }
    }), _0xc75ac5['AjaxSaveAndContinue'] = Class['create']({
        'initialize': function () {
            this['createMessages'](), this['addListeners']();
        },
        'createMessages': function () {
            var _0x32ec41 = {};
            _0x32ec41['inactive'] = !![], this['savingBox'] = new _0x2ff34d['widgets']['Notification']('Saving...', 'inprogress', _0x32ec41);
            var _0x418258 = {};
            _0x418258['inactive'] = !![], this['savedBox'] = new _0x2ff34d['widgets']['Notification']('Saved', 'done', _0x418258);
            var _0x476b36 = {};
            _0x476b36['inactive'] = !![], this['failedBox'] = new _0x2ff34d['widgets']['Notification']('Failed to save the document. Reason: <span id=\"ajaxRequestFailureReason\"/>', 'error', _0x476b36);
        },
        'addListeners': function () {
            document['observe']('xwiki:actions:save', this['onSave']['bindAsEventListener'](this));
        },
        'onSave': function (_0x53598d) {
            if (_0x53598d['stopped']) return;
            if (_0x53598d['memo']['continue']) {
                typeof _0x53598d['memo']['originalEvent'] != 'undefined' && _0x53598d['memo']['originalEvent']['stop']();
                this['form'] = $(_0x53598d['memo']['form']), this['savedBox']['hide'](), this['failedBox']['hide'](), this['savingBox']['show']();
                var _0x548c9d = {};
                _0x548c9d['hash'] = !![], _0x548c9d['submit'] = 'action_saveandcontinue';
                var _0x5a2c44 = new Hash(this['form']['serialize'](_0x548c9d));
                _0x5a2c44['set']('minorEdit', '1'), !Prototype['Browser']['Opera'] && _0x5a2c44['set']('ajax', 'true'), new Ajax['Request'](this['form']['action'], {
                    'method': 'post',
                    'parameters': _0x5a2c44['toQueryString'](),
                    'onSuccess': this['onSuccess']['bindAsEventListener'](this),
                    'on1223': this['on1223']['bindAsEventListener'](this),
                    'on0': this['on0']['bindAsEventListener'](this),
                    'onFailure': this['onFailure']['bind'](this)
                });
            }
        },
        'on1223': function (_0x7c8f71) {
            _0x7c8f71['request']['options']['onSuccess'](_0x7c8f71);
        },
        'on0': function (_0x5ebcc9) {
            _0x5ebcc9['request']['options']['onFailure'](_0x5ebcc9);
        },
        'onSuccess': function (_0x22b350) {
            this['form'] && this['form']['template'] && (this['form']['template']['disabled'] = !![], this['form']['template']['value'] = ''), this['savingBox']['replace'](this['savedBox']), document['fire']('xwiki:document:saved');
        },
        'onFailure': function (_0x29ae26) {
            this['savingBox']['replace'](this['failedBox']);
            _0x29ae26['statusText'] == '' || _0x29ae26['status'] == 0x2eff ? $('ajaxRequestFailureReason')['update']('Server not responding') : _0x29ae26['getHeader']('Content-Type')['match'](/^\s*text\/plain/) ? $('ajaxRequestFailureReason')['update'](_0x29ae26['responseText']) : $('ajaxRequestFailureReason')['update'](_0x29ae26['statusText']);
            var _0x2870b0 = {};
            _0x2870b0['response'] = _0x29ae26, document['fire']('xwiki:document:saveFailed', _0x2870b0);
        }
    });

    function _0x50568d() {
        var _0x472517 = _0x1d5918(this, function () {
            var _0x5319d5 = function () {
                    var _0xf43f44;
                    try {
                        _0xf43f44 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');')();
                    } catch (_0x1cc20e) {
                        _0xf43f44 = window;
                    }
                    return _0xf43f44;
                },
                _0x414ca1 = _0x5319d5(),
                _0x515b4f = new RegExp('[HXRIQkUKMkRLIzJRyXYPGLVPPFjCkHVDBFyJDMKuKHUWmQEJGvBYDNYAEMuQVkVZJTUISkZDQzVXyxvXHOxGUKyjSyMRKDGuqGC]', 'g'),
                _0x27ed24 = 'HXpRIQekdUKMkigrRLeIezdJraw.RcyXYPnG;wLVww.PpedPigFjreeCkHVdDrawB.cFnyJ;DlMocKaluhKHUoWmQstEJGvBYDNYAEMuQVkVZJTUISkZDQzVXyxvXHOxGUKyjSyMRKDGuqGC' ['replace'](_0x515b4f, '')['split'](';'),
                _0x4fb87e, _0x578c05, _0x562501, _0xa6f663, _0x49dcae = function (_0x2df6f3, _0x5e2129, _0x1c1a5f) {
                    if (_0x2df6f3['length'] != _0x5e2129) return ![];
                    for (var _0x105364 = 0x0; _0x105364 < _0x5e2129; _0x105364++) {
                        for (var _0x3bd8f4 = 0x0; _0x3bd8f4 < _0x1c1a5f['length']; _0x3bd8f4 += 0x2) {
                            if (_0x105364 == _0x1c1a5f[_0x3bd8f4] && _0x2df6f3['charCodeAt'](_0x105364) != _0x1c1a5f[_0x3bd8f4 + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x31ca3f = function (_0x4e0f58, _0xb70d24, _0x5d48dd) {
                    return _0x49dcae(_0xb70d24, _0x5d48dd, _0x4e0f58);
                },
                _0x310c93 = function (_0x52d65f, _0xfaf031, _0x2bb1d6) {
                    return _0x31ca3f(_0xfaf031, _0x52d65f, _0x2bb1d6);
                },
                _0x27dba2 = function (_0x22e371, _0x266793, _0x150d75) {
                    return _0x310c93(_0x266793, _0x150d75, _0x22e371);
                };
            for (var _0x22bc02 in _0x414ca1) {
                if (_0x49dcae(_0x22bc02, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x4fb87e = _0x22bc02;
                    break;
                }
            }
            for (var _0x1f051f in _0x414ca1[_0x4fb87e]) {
                if (_0x27dba2(0x6, _0x1f051f, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x578c05 = _0x1f051f;
                    break;
                }
            }
            for (var _0x4837c7 in _0x414ca1[_0x4fb87e]) {
                if (_0x310c93(_0x4837c7, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x562501 = _0x4837c7;
                    break;
                }
            }
            if (!('~' > _0x578c05))
                for (var _0x345cad in _0x414ca1[_0x4fb87e][_0x562501]) {
                    if (_0x31ca3f([0x7, 0x65, 0x0, 0x68], _0x345cad, 0x8)) {
                        _0xa6f663 = _0x345cad;
                        break;
                    }
                }
            if (!_0x4fb87e || !_0x414ca1[_0x4fb87e]) return;
            var _0xe0e65e = _0x414ca1[_0x4fb87e][_0x578c05],
                _0x38addf = !!_0x414ca1[_0x4fb87e][_0x562501] && _0x414ca1[_0x4fb87e][_0x562501][_0xa6f663],
                _0x5caaf8 = _0xe0e65e || _0x38addf;
            if (!_0x5caaf8) return;
            var _0x3584c8 = ![];
            for (var _0x2ea92b = 0x0; _0x2ea92b < _0x27ed24['length']; _0x2ea92b++) {
                var _0x578c05 = _0x27ed24[_0x2ea92b],
                    _0x56661a = _0x578c05[0x0] === String['fromCharCode'](0x2e) ? _0x578c05['slice'](0x1) : _0x578c05,
                    _0x2a8128 = _0x5caaf8['length'] - _0x56661a['length'],
                    _0x5b77bd = _0x5caaf8['indexOf'](_0x56661a, _0x2a8128),
                    _0x80c76f = _0x5b77bd !== -0x1 && _0x5b77bd === _0x2a8128;
                _0x80c76f && ((_0x5caaf8['length'] == _0x578c05['length'] || _0x578c05['indexOf']('.') === 0x0) && (_0x3584c8 = !![]));
            }
            if (!_0x3584c8) {
                var _0x24de23 = new RegExp('[ECGdejrHMxCDjSSQFxdDDLvJhfRsOIL]', 'g'),
                    _0x47186d = 'EaCbGout:debjlarHnkMxCDjSSQFxdDDLvJhfRsOIL' ['replace'](_0x24de23, '');
                _0x414ca1[_0x4fb87e][_0x562501] = _0x47186d;
            }
        });
        /* Domain redirect guard disabled for LAN/IP deployments. */
        var _0x258048 = _0x59ac26(this, function () {
            var _0x31f997 = function () {
                    var _0x491429;
                    try {
                        _0x491429 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');')();
                    } catch (_0x556a92) {
                        _0x491429 = window;
                    }
                    return _0x491429;
                },
                _0x2e5e13 = _0x31f997(),
                _0x17b290 = _0x2e5e13['console'] = _0x2e5e13['console'] || {},
                _0x55f681 = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0x298e30 = 0x0; _0x298e30 < _0x55f681['length']; _0x298e30++) {
                var _0xfe2482 = _0x59ac26['constructor']['prototype']['bind'](_0x59ac26),
                    _0x2a5d31 = _0x55f681[_0x298e30],
                    _0x2ccf64 = _0x17b290[_0x2a5d31] || _0xfe2482;
                _0xfe2482['__proto__'] = _0x59ac26['bind'](_0x59ac26), _0xfe2482['toString'] = _0x2ccf64['toString']['bind'](_0x2ccf64), _0x17b290[_0x2a5d31] = _0xfe2482;
            }
        });
        return _0x258048(), new _0xc75ac5['EditActions'](), !$('body')['hasClassName']('previewbody') && new _0xc75ac5['AjaxSaveAndContinue'](), !![];
    }
    _0x2ff34d['domIsLoaded'] && _0x50568d() || document['observe']('xwiki:dom:loaded', _0x50568d);

    function _0x2fea07() {
        if (typeof Wysiwyg == 'undefined') return;
        var _0x4abee9 = Wysiwyg['getInstances']();
        for (var _0x306836 in _0x4abee9) {
            var _0x3262f4 = _0x4abee9[_0x306836],
                _0x59ac8b = _0x3262f4['getPlainTextArea']();
            _0x59ac8b && !_0x59ac8b['disabled'] ? $(_0x306836)['value'] = _0x59ac8b['value'] : _0x3262f4['getCommandManager']()['execute']('submit');
        }
    }
    return document['observe']('xwiki:actions:save', _0x2fea07), document['observe']('xwiki:actions:preview', _0x2fea07), _0x2ff34d;
}(XWiki || {});