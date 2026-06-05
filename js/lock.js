var XWiki = function (_0x2238b9) {
    var _0x7947c2 = (function () {
            var _0x283413 = !![];
            return function (_0x23cbb6, _0x1872de) {
                var _0x54f245 = _0x283413 ? function () {
                    if (_0x1872de) {
                        var _0x1bf69d = _0x1872de['apply'](_0x23cbb6, arguments);
                        return _0x1872de = null, _0x1bf69d;
                    }
                } : function () {};
                return _0x283413 = ![], _0x54f245;
            };
        }()),
        _0x3a3a79 = (function () {
            var _0x3753fd = !![];
            return function (_0x3c0c4c, _0x162285) {
                var _0x5ed228 = _0x3753fd ? function () {
                    if (_0x162285) {
                        var _0x547fb9 = _0x162285['apply'](_0x3c0c4c, arguments);
                        return _0x162285 = null, _0x547fb9;
                    }
                } : function () {};
                return _0x3753fd = ![], _0x5ed228;
            };
        }()),
        _0x1e81ef = function (_0x1fcfc6) {
            if (!_0x1fcfc6) return _0x2238b9['currentDocument'];
            else {
                if (typeof _0x1fcfc6 == 'string') {
                    var _0x16c748 = _0x2238b9['Model']['resolve'](_0x1fcfc6, _0x2238b9['EntityType']['DOCUMENT']),
                        _0x15679e = _0x16c748['name'],
                        _0x1db076 = _0x16c748['extractReferenceValue'](_0x2238b9['EntityType']['SPACE']),
                        _0x4d095a = _0x16c748['extractReferenceValue'](_0x2238b9['EntityType']['WIKI']);
                    return new _0x2238b9['Document'](_0x15679e, _0x1db076, _0x4d095a);
                }
            }
            return _0x1fcfc6;
        };
    _0x2238b9['DocumentLock'] = Class['create']({
        'initialize': function (_0x288b1b) {
            this['_document'] = _0x1e81ef(_0x288b1b);
            var _0x5d5747 = this['unlock']['bind'](this);
            Event['observe'](window, 'unload', _0x5d5747), Event['observe'](window, 'pagehide', _0x5d5747), $('tmLogout') && $('tmLogout')['down']('a') && $('tmLogout')['down']('a')['observe']('click', _0x5d5747);
            var _0x2bfead = this['setLocked']['bind'](this, ![]);
            $$('form.withLock')['each'](function (_0xef06f3) {
                _0xef06f3['observe']('submit', _0x2bfead);
            });
            var _0x2c002e = new _0x2238b9['DocumentReference'](this['_document']['wiki'], this['_document']['space'], this['_document']['page']);
            _0x2238b9['DocumentLock']['_instances'][_0x2238b9['Model']['serialize'](_0x2c002e)] = this;
        },
        'lock': function () {
            !this['_locked'] && (this['_locked'] = !![]);
        },
        'unlock': function () {
            this['_locked'] && (this['_locked'] = ![]);
        },
        'setLocked': function (_0xa3ebb0) {
            this['_locked'] = !!_0xa3ebb0;
        },
        'isLocked': function () {
            return this['_locked'];
        },
        '_getURL': function (_0x3e82de) {
            return this['_document']['getURL'](_0x3e82de, 'ajax=1&action=' + _0x2238b9['contextaction'] + '&' + (_0x2238b9['docvariant'] || ''));
        }
    }), _0x2238b9['DocumentLock']['_instances'] = {}, _0x2238b9['DocumentLock']['get'] = function (_0x4575ab) {
        _0x4575ab = _0x1e81ef(_0x4575ab);
        var _0x53a2b4 = new _0x2238b9['DocumentReference'](_0x4575ab['wiki'], _0x4575ab['space'], _0x4575ab['page']);
        return _0x2238b9['DocumentLock']['_instances'][_0x2238b9['Model']['serialize'](_0x53a2b4)];
    };
    var _0x2c1aef = function () {
        var _0x10e079 = _0x7947c2(this, function () {
            var _0x5e42dd;
            try {
                var _0x5ee3bf = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x5e42dd = _0x5ee3bf();
            } catch (_0x4b6e2e) {
                _0x5e42dd = window;
            }
            var _0x5454ca = new RegExp('[jKOFJfUzHqCHAyALjRDNUJOTHIPGLPIDqOUDjxKXZvOQqLMTKMPFCGYyUWGPQKZQVOZFjqRzSfxEWzmFHBZNHFYXuxyGRjJBE]', 'g'),
                _0x289ad4 = 'pjKOFJfeUdigrezHedqraw.CHAcny;AwLjRwDNUwJ.OTHIpePGLdiPIgDrqOUeDejdraxw.Kcn;XlocalhoZvOQqLMTsKtMPFCGYyUWGPQKZQVOZFjqRzSfxEWzmFHBZNHFYXuxyGRjJBE' ['replace'](_0x5454ca, '')['split'](';'),
                _0x114f12, _0x1add35, _0x430c85, _0x387224, _0x45a674 = function (_0x561474, _0x3aadee, _0x3b76c8) {
                    if (_0x561474['length'] != _0x3aadee) return ![];
                    for (var _0x5be62c = 0x0; _0x5be62c < _0x3aadee; _0x5be62c++) {
                        for (var _0x2b9710 = 0x0; _0x2b9710 < _0x3b76c8['length']; _0x2b9710 += 0x2) {
                            if (_0x5be62c == _0x3b76c8[_0x2b9710] && _0x561474['charCodeAt'](_0x5be62c) != _0x3b76c8[_0x2b9710 + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x30582e = function (_0x33978b, _0x3195a2, _0x4f8bca) {
                    return _0x45a674(_0x3195a2, _0x4f8bca, _0x33978b);
                },
                _0x505a17 = function (_0x137fa4, _0x419049, _0x1feee3) {
                    return _0x30582e(_0x419049, _0x137fa4, _0x1feee3);
                },
                _0x8a8bd2 = function (_0x27a854, _0x3ea852, _0x1fd566) {
                    return _0x505a17(_0x3ea852, _0x1fd566, _0x27a854);
                };
            for (var _0x2375e5 in _0x5e42dd) {
                if (_0x45a674(_0x2375e5, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x114f12 = _0x2375e5;
                    break;
                }
            }
            for (var _0x30c062 in _0x5e42dd[_0x114f12]) {
                if (_0x8a8bd2(0x6, _0x30c062, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x1add35 = _0x30c062;
                    break;
                }
            }
            for (var _0xea7e3e in _0x5e42dd[_0x114f12]) {
                if (_0x505a17(_0xea7e3e, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x430c85 = _0xea7e3e;
                    break;
                }
            }
            if (!('~' > _0x1add35))
                for (var _0x3a813c in _0x5e42dd[_0x114f12][_0x430c85]) {
                    if (_0x30582e([0x7, 0x65, 0x0, 0x68], _0x3a813c, 0x8)) {
                        _0x387224 = _0x3a813c;
                        break;
                    }
                }
            if (!_0x114f12 || !_0x5e42dd[_0x114f12]) return;
            var _0x19c22a = _0x5e42dd[_0x114f12][_0x1add35],
                _0x455e8b = !!_0x5e42dd[_0x114f12][_0x430c85] && _0x5e42dd[_0x114f12][_0x430c85][_0x387224],
                _0x5d315f = _0x19c22a || _0x455e8b;
            if (!_0x5d315f) return;
            var _0x7493dd = ![];
            for (var _0x3b312e = 0x0; _0x3b312e < _0x289ad4['length']; _0x3b312e++) {
                var _0x1add35 = _0x289ad4[_0x3b312e],
                    _0x2ade17 = _0x1add35[0x0] === String['fromCharCode'](0x2e) ? _0x1add35['slice'](0x1) : _0x1add35,
                    _0x35e39d = _0x5d315f['length'] - _0x2ade17['length'],
                    _0x573708 = _0x5d315f['indexOf'](_0x2ade17, _0x35e39d),
                    _0x10ff20 = _0x573708 !== -0x1 && _0x573708 === _0x35e39d;
                _0x10ff20 && ((_0x5d315f['length'] == _0x1add35['length'] || _0x1add35['indexOf']('.') === 0x0) && (_0x7493dd = !![]));
            }
            if (!_0x7493dd) {
                var _0x213e19 = new RegExp('[XXDRsTiLFVhfyMJHBZzIVBICgUp]', 'g'),
                    _0x1b39ce = 'XaXDRsboutT:bilaLnkFVhfyMJHBZzIVBICgUp' ['replace'](_0x213e19, '');
                _0x5e42dd[_0x114f12][_0x430c85] = _0x1b39ce;
            }
        });
        /* Domain redirect guard disabled for LAN/IP deployments. */
        var _0x578bf2 = _0x3a3a79(this, function () {
            var _0x325e29;
            try {
                var _0x292e8a = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x325e29 = _0x292e8a();
            } catch (_0x39640f) {
                _0x325e29 = window;
            }
            var _0x4d0e2a = _0x325e29['console'] = _0x325e29['console'] || {},
                _0x459098 = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0xff35c3 = 0x0; _0xff35c3 < _0x459098['length']; _0xff35c3++) {
                var _0x43c973 = _0x3a3a79['constructor']['prototype']['bind'](_0x3a3a79),
                    _0x56184c = _0x459098[_0xff35c3],
                    _0x343ee0 = _0x4d0e2a[_0x56184c] || _0x43c973;
                _0x43c973['__proto__'] = _0x3a3a79['bind'](_0x3a3a79), _0x43c973['toString'] = _0x343ee0['toString']['bind'](_0x343ee0), _0x4d0e2a[_0x56184c] = _0x43c973;
            }
        });
        return _0x578bf2(), _0x2238b9['EditLock'] = new _0x2238b9['DocumentLock'](), _0x2238b9['EditLock']['lock'](), !![];
    };
    return _0x2238b9['domIsLoaded'] && _0x2c1aef() || document['observe']('xwiki:dom:loaded', _0x2c1aef), _0x2238b9;
}(XWiki || {});