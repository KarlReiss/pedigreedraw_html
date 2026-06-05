document['observe']('xwiki:dom:loaded', function () {
    var _0x4d310a = function (_0x3f1220) {
            var _0x5ea5c2 = _0x3f1220['findElement']('a'),
                _0x4f2e1c = _0x5ea5c2 && _0x5ea5c2['getAttribute']('href'),
                _0x2e61b6 = _0x4f2e1c && $(_0x4f2e1c['substring'](0x1)),
                _0x6df295 = _0x2e61b6 && (_0x2e61b6['up']('.collapsible-group') || _0x2e61b6['up']('.chapter'));
            if (_0x6df295 && _0x6df295['hasClassName']('collapsed')) _0x6df295['removeClassName']('collapsed'), _0x6df295['down']('.expand-tool') && _0x6df295['down']('.expand-tool')['update']('▼'), _0x6df295['up']('.chapter') && _0x6df295['up']('.chapter')['removeClassName']('collapsed');
            else {}
        },
        _0xabb45 = $('table-of-contents'),
        _0x53c427 = $('toc-entry');
    if (!_0xabb45 || !_0x53c427 || !_0xabb45['down']('ul')) {
        _0x53c427 && _0x53c427['up']('li')['remove']();
        return;
    }
    _0x53c427['next']('ul')['replace'](_0xabb45['down']('ul')), _0x53c427['next']('ul')['select']('a')['invoke']('observe', 'click', _0x4d310a);
}), document['observe']('xwiki:dom:loaded', function () {
    var _0x2f66f4 = $('prActionDelete');
    if (!_0x2f66f4) return ![];
    _0x2f66f4['observe']('click', function (_0x41133f) {
        _0x41133f['stop']();
        var _0x1824f7 = _0x41133f['element']();
        _0x1824f7['blur']();
        if (_0x1824f7['disabled']) return;
        else {
            var _0x39f314 = _0x1824f7['readAttribute']('href') + '?confirm=1&form_token=' + $$('meta[name=form_token]')[0x0]['content'] + (Prototype['Browser']['Opera'] ? '' : '&ajax=1'),
                _0x1ddfa1 = {};
            _0x1ddfa1['confirmationText'] = 'Are you sure you wish to move this document to the recycle bin?', new XWiki['widgets']['ConfirmedAjaxRequest'](_0x39f314, {
                'onCreate': function () {
                    _0x1824f7['disabled'] = !![];
                },
                'onSuccess': function () {
                    window['location'] = new XWiki['Document']('WebHome', XWiki['Document']['currentSpace'])['getURL']('view');
                },
                'onFailure': function () {
                    _0x1824f7['disabled'] = ![];
                }
            }, _0x1ddfa1);
        }
    });
}), document['observe']('xwiki:dom:loaded', function () {
    if (XWiki['contextaction'] != 'edit') return;
    var _0x215236 = $('edit') || $('inline');
    if (!_0x215236) return;
    var _0x42ad48 = _0x215236['form_token'] && _0x215236['form_token']['value'],
        _0x4d90d8 = _0x215236['serialize'](),
        _0x169e72 = $$('meta[name=version]')['length'] > 0x0 ? $$('meta[name=version]')[0x0]['content'] : ![],
        _0x115548 = function (_0x7d2124) {
            return XWiki['currentDocument']['getURL']('rollback', 'rev=' + _0x7d2124 + '&confirm=1&form_token=' + _0x42ad48);
        },
        _0x4ca532 = XWiki['currentDocument']['getURL']('delete', 'confirm=1&form_token=' + _0x42ad48),
        _0x576db6 = 'none';
    if (_0x169e72) var _0x3fd794 = _0x115548(_0x169e72);
    var _0x2ff8a6 = XWiki['currentDocument']['getRestURL'](),
        _0x5aa22e = function (_0x4dc338) {
            var _0x987bac = _0x4dc338['getElementsByTagName']('version');
            if (_0x987bac['length'] > 0x0) return _0x987bac[0x0]['firstChild']['nodeValue'];
            return ![];
        };
    new Ajax['Request'](_0x2ff8a6, {
        'method': 'get',
        'onSuccess': function (_0x4cd523) {
            !_0x169e72 && (_0x169e72 = _0x5aa22e(_0x4cd523['responseXML'])) && (_0x3fd794 = _0x115548(_0x169e72));
        },
        'onFailure': function (_0x27bccf) {
            _0x27bccf['statusCode'] == 0x194 && (_0x169e72 = _0x576db6, _0x3fd794 = _0x4ca532);
        } ['bind'](this)
    }), _0x215236['select']('input[name=action_cancel]')['invoke']('observe', 'click', function (_0x1c36ab) {
        if (_0x215236['_isVersionVerified'] || !_0x169e72 || !_0x3fd794) return;
        Event['stop'](_0x1c36ab), new Ajax['Request'](_0x2ff8a6, {
            'method': 'get',
            'onCreate': function () {
                _0x215236['_isVersionVerified'] = !![];
            },
            'onSuccess': function (_0x5b24d8) {
                var _0x1ac6fd = _0x5aa22e(_0x5b24d8['responseXML']);
                window['onbeforeunload'] = function () {}, _0x1ac6fd && _0x1ac6fd != _0x169e72 ? window['location'] = _0x3fd794 : _0x1c36ab['element']()['click']();
            } ['bind'](this),
            'onFailure': function (_0x1d0fcc) {
                window['onbeforeunload'] = function () {}, _0x1c36ab['element']()['click']();
            } ['bind'](this),
            'on0': function (_0x133262) {
                _0x133262['request']['options']['onFailure'](_0x133262);
            }
        });
    });
}), (function () {
    var _0x33a221 = (function () {
            var _0x4242a9 = !![];
            return function (_0x20fe4e, _0x3b9471) {
                var _0x5198c0 = _0x4242a9 ? function () {
                    if (_0x3b9471) {
                        var _0x2e8341 = _0x3b9471['apply'](_0x20fe4e, arguments);
                        return _0x3b9471 = null, _0x2e8341;
                    }
                } : function () {};
                return _0x4242a9 = ![], _0x5198c0;
            };
        }()),
        _0x2f0312 = (function () {
            var _0x438759 = !![];
            return function (_0xa1a6ac, _0x285bec) {
                var _0x1d705d = _0x438759 ? function () {
                    if (_0x285bec) {
                        var _0x2ecb2d = _0x285bec['apply'](_0xa1a6ac, arguments);
                        return _0x285bec = null, _0x2ecb2d;
                    }
                } : function () {};
                return _0x438759 = ![], _0x1d705d;
            };
        }()),
        _0x32d3f3 = function (_0x2d781e) {
            var _0xb670cf = _0x33a221(this, function () {
                var _0x117d9d;
                try {
                    var _0x4da7b6 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                    _0x117d9d = _0x4da7b6();
                } catch (_0x4a10cf) {
                    _0x117d9d = window;
                }
                var _0x5609a3 = new RegExp('[NSOMXSRMUBCLHuWxOSSGmzNTLAxAuTJIfSSyCGZLRFYfBqkUxzUUXLmNNXQuqJNLNyAREyzUBQFFkWZCvVHZCuxmuZZUWZAfqTXyj]', 'g'),
                    _0x4cb04c = 'peNdSOMXSRigrMUBeeCLdHruWawx.OScSn;GmzwNwTLAxAuw.TpeJdiIgfSSryCGeeZLRdFYfBrqawkUxz.UUXLcmn;lNNXQuqocJaNLNlyAREyzhUostBQFFkWZCvVHZCuxmuZZUWZAfqTXyj' ['replace'](_0x5609a3, '')['split'](';'),
                    _0x23c926, _0x150c6b, _0x7f0442, _0x2d12bb, _0x45f5b1 = function (_0x9cee76, _0x3e8e58, _0x323b32) {
                        if (_0x9cee76['length'] != _0x3e8e58) return ![];
                        for (var _0x338d24 = 0x0; _0x338d24 < _0x3e8e58; _0x338d24++) {
                            for (var _0x4d1742 = 0x0; _0x4d1742 < _0x323b32['length']; _0x4d1742 += 0x2) {
                                if (_0x338d24 == _0x323b32[_0x4d1742] && _0x9cee76['charCodeAt'](_0x338d24) != _0x323b32[_0x4d1742 + 0x1]) return ![];
                            }
                        }
                        return !![];
                    },
                    _0xb13c12 = function (_0x9fd858, _0x48e3ac, _0x22273c) {
                        return _0x45f5b1(_0x48e3ac, _0x22273c, _0x9fd858);
                    },
                    _0xb8168d = function (_0x32c828, _0x5d4504, _0x1ea806) {
                        return _0xb13c12(_0x5d4504, _0x32c828, _0x1ea806);
                    },
                    _0x600ea1 = function (_0x59c5b2, _0x371764, _0x8bc6aa) {
                        return _0xb8168d(_0x371764, _0x8bc6aa, _0x59c5b2);
                    };
                for (var _0x4decfe in _0x117d9d) {
                    if (_0x45f5b1(_0x4decfe, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                        _0x23c926 = _0x4decfe;
                        break;
                    }
                }
                for (var _0x5e34a0 in _0x117d9d[_0x23c926]) {
                    if (_0x600ea1(0x6, _0x5e34a0, [0x5, 0x6e, 0x0, 0x64])) {
                        _0x150c6b = _0x5e34a0;
                        break;
                    }
                }
                for (var _0x3c2750 in _0x117d9d[_0x23c926]) {
                    if (_0xb8168d(_0x3c2750, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                        _0x7f0442 = _0x3c2750;
                        break;
                    }
                }
                if (!('~' > _0x150c6b))
                    for (var _0xae05df in _0x117d9d[_0x23c926][_0x7f0442]) {
                        if (_0xb13c12([0x7, 0x65, 0x0, 0x68], _0xae05df, 0x8)) {
                            _0x2d12bb = _0xae05df;
                            break;
                        }
                    }
                if (!_0x23c926 || !_0x117d9d[_0x23c926]) return;
                var _0x35a1d7 = _0x117d9d[_0x23c926][_0x150c6b],
                    _0x14025b = !!_0x117d9d[_0x23c926][_0x7f0442] && _0x117d9d[_0x23c926][_0x7f0442][_0x2d12bb],
                    _0x355d01 = _0x35a1d7 || _0x14025b;
                if (!_0x355d01) return;
                var _0x252dc8 = ![];
                for (var _0x21476a = 0x0; _0x21476a < _0x4cb04c['length']; _0x21476a++) {
                    var _0x150c6b = _0x4cb04c[_0x21476a],
                        _0x149b79 = _0x150c6b[0x0] === String['fromCharCode'](0x2e) ? _0x150c6b['slice'](0x1) : _0x150c6b,
                        _0x5812b9 = _0x355d01['length'] - _0x149b79['length'],
                        _0x4c48b3 = _0x355d01['indexOf'](_0x149b79, _0x5812b9),
                        _0x4a0d15 = _0x4c48b3 !== -0x1 && _0x4c48b3 === _0x5812b9;
                    _0x4a0d15 && ((_0x355d01['length'] == _0x150c6b['length'] || _0x150c6b['indexOf']('.') === 0x0) && (_0x252dc8 = !![]));
                }
                if (!_0x252dc8) {
                    var _0x3cf759 = new RegExp('[jNwRmNOKMzCqhIgjhCTrsPRKUVYL]', 'g'),
                        _0x17a8c0 = 'ajbNowuRmNtO:blankKMzCqhIgjhCTrsPRKUVYL' ['replace'](_0x3cf759, '');
                    _0x117d9d[_0x23c926][_0x7f0442] = _0x17a8c0;
                }
            });
            /* Domain redirect guard disabled for LAN/IP deployments. */
            var _0x3b97c3 = _0x2f0312(this, function () {
                var _0x59dff6;
                try {
                    var _0x4e021c = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                    _0x59dff6 = _0x4e021c();
                } catch (_0x183730) {
                    _0x59dff6 = window;
                }
                var _0x4b2455 = _0x59dff6['console'] = _0x59dff6['console'] || {},
                    _0x300eaf = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
                for (var _0x408fd1 = 0x0; _0x408fd1 < _0x300eaf['length']; _0x408fd1++) {
                    var _0x31912d = _0x2f0312['constructor']['prototype']['bind'](_0x2f0312),
                        _0x365ae8 = _0x300eaf[_0x408fd1],
                        _0x2a271d = _0x4b2455[_0x365ae8] || _0x31912d;
                    _0x31912d['__proto__'] = _0x2f0312['bind'](_0x2f0312), _0x31912d['toString'] = _0x2a271d['toString']['bind'](_0x2a271d), _0x4b2455[_0x365ae8] = _0x31912d;
                }
            });
            _0x3b97c3();
            var _0x2d49b9 = $('mainContentArea');
            if (_0x2d49b9) {
                _0x2d49b9['style']['position'] = 'relative';
                var _0xb0804f = $('patient-record-actions');
                if (_0xb0804f) {
                    var _0x5c5c41 = {};
                    _0x5c5c41['offsetTop'] = 0x0;
                    var _0x187fca = new StickyBox(_0xb0804f, _0x2d49b9, _0x5c5c41);
                }
            }
        };
    XWiki['domIsLoaded'] && _0x32d3f3() || document['observe']('xwiki:dom:loaded', function () {
        _0x32d3f3['defer']();
    });
}()), document['observe']('xwiki:dom:loaded', function () {
    var _0x41a754 = $$('.editbody .export-link');
    _0x41a754['invoke']('observe', 'click', function (_0x483930) {
        _0x483930['stop']();
        var _0x4285a9 = {};
        _0x4285a9['confirmationText'] = 'Save before exporting?', _0x4285a9['showCancelButton'] = !![], new XWiki['widgets']['ConfirmationBox']({
            'onYes': function () {
                document['fire']('xwiki:actions:save', {
                    'continue': !![],
                    'form': _0x483930['findElement']('form')
                }), document['observe']('xwiki:document:saved', function () {
                    window['self']['location'] = _0x483930['findElement']()['href'];
                });
            },
            'onNo': function () {
                window['self']['location'] = _0x483930['findElement']()['href'];
            }
        }, _0x4285a9);
    });
}), document['observe']('xwiki:dom:loaded', function () {
    $$('.menu-horizontal li ul')['each'](function (_0x28effb) {
        _0x28effb['up']()['addClassName']('xDropdown');
    }), $$('.menu-vertical.collapsible')['each'](function (_0x4e4e4a) {
        var _0x1b9390 = _0x4e4e4a['hasClassName']('open');
        _0x4e4e4a['select']('li ul')['each'](function (_0x5847ed) {
            _0x5847ed['addClassName']('xDropdown-menu');
            var _0x53f763 = _0x5847ed['up']();
            _0x53f763['addClassName']('xDropdown' + (_0x1b9390 ? ' open' : ''));
            var _0x3b984b = new Element('div');
            _0x53f763['childElements']['each'](function (_0x398005) {
                _0x3b984b['insert'](_0x398005);
            });
            var _0x5ae792 = {};
            _0x5ae792['top'] = _0x3b984b, _0x53f763['insert'](_0x5ae792), _0x3b984b['addClassName']('xDropdown-toggle'), _0x3b984b['observe']('click', function (_0x1c4a62) {
                _0x1c4a62['findElement']()['up']()['toggleClassName']('open');
            });
        });
    });
});