function sector(_0x3bd1d8, _0x583dba, _0x3bc7f2, _0xb7ddae, _0x1617da, _0x1ddd08, _0x348ed1, _0x4aa016) {
    var _0x35954f = {};
    _0x35954f['fill'] = _0x4aa016, _0x35954f['stroke-width'] = 0x0;
    var _0x15f816, _0x1a2cfb = _0x1617da,
        _0x4727d2 = _0x583dba,
        _0x2dae7e = _0x3bc7f2,
        _0x46de41 = _0xb7ddae,
        _0x58228e = _0x3bd1d8,
        _0x3ccfa9 = Math['PI'] / 0xb4,
        _0x1d6fe9 = _0x35954f,
        _0x5df6c4 = function (_0x1ff4c2) {
            var _0x20223f = _0x4727d2 + _0x46de41 * Math['cos'](-_0x1ff4c2 * _0x3ccfa9),
                _0x157631 = _0x2dae7e + _0x46de41 * Math['sin'](-_0x1ff4c2 * _0x3ccfa9);
            return [_0x20223f, _0x157631];
        };
    if (_0x1a2cfb === 'F') {
        if (_0x348ed1 - _0x1ddd08 == 0x168) return _0x58228e['circle'](_0x4727d2, _0x2dae7e, _0x46de41)['attr'](_0x1d6fe9);
        var _0x3b98d7 = _0x5df6c4(_0x1ddd08)[0x0],
            _0x39dd5f = _0x5df6c4(_0x348ed1)[0x0],
            _0x1e759f = _0x5df6c4(_0x1ddd08)[0x1],
            _0x3dc564 = _0x5df6c4(_0x348ed1)[0x1];
        return _0x58228e['path'](['M', _0x4727d2, _0x2dae7e, 'L', _0x3b98d7, _0x1e759f, 'A', _0x46de41, _0x46de41, 0x0, +(_0x348ed1 - _0x1ddd08 > 0xb4), 0x0, _0x39dd5f, _0x3dc564, 'z'])['attr'](_0x1d6fe9);
    } else {
        if (_0x1a2cfb === 'M') {
            function _0x55fa6b(_0x15d5e7) {
                return ((_0x15d5e7 + 0x2d) / 0x5a)['floor']() % 0x4;
            }

            function _0x3fa437(_0x340c37) {
                var _0x5b7212 = _0x340c37 * Math['PI'] / 0xb4;
                return Math['tan'](_0x5b7212);
            }

            function _0x303cc8(_0x42bd13) {
                var _0x4f0bb9 = _0x55fa6b(_0x42bd13),
                    _0x31e7fa = {},
                    _0x1d10b7 = _0x4f0bb9 % 0x2,
                    _0x27a0c9 = 0x1 - _0x4f0bb9 % 0x2,
                    _0x3b67fb = _0x4f0bb9 % 0x3 ? -0x1 : 0x1;
                _0x31e7fa['angle'] = (_0x42bd13 - _0x4f0bb9 * 0x5a - (_0x4f0bb9 == 0x0 && _0x42bd13 > 0x2d ? 0x168 : 0x0)) * (_0x4f0bb9 < 0x2 ? -0x1 : 0x1);
                var _0x52f748 = _0x46de41 * _0x3fa437(_0x31e7fa['angle']);
                return _0x31e7fa['x'] = _0x4727d2 + _0x1d10b7 * _0x52f748 + _0x27a0c9 * _0x3b67fb * _0x46de41, _0x31e7fa['y'] = _0x2dae7e + _0x27a0c9 * _0x52f748 + _0x1d10b7 * _0x3b67fb * _0x46de41, _0x31e7fa;
            }

            function _0x310603(_0x118d76) {
                var _0x4f5f28 = _0x118d76 % 0x3 ? -0x1 : 0x1,
                    _0x3501d6 = _0x118d76 < 0x2 ? -0x1 : 0x1,
                    _0x32348c = {};
                return _0x32348c['x'] = _0x4727d2 + _0x4f5f28 * _0x46de41, _0x32348c['y'] = _0x2dae7e + _0x3501d6 * _0x46de41, _0x32348c;
            }
            var _0x4951fb = _0x55fa6b(_0x1ddd08),
                _0x21c5e5 = _0x55fa6b(_0x348ed1);
            _0x21c5e5 == 0x0 && _0x348ed1 > _0x1ddd08 && (_0x21c5e5 = _0x1ddd08 >= 0x13b ? 0x0 : 0x4);
            var _0x2be67e = _0x21c5e5 - _0x4951fb,
                _0x18c85c = _0x303cc8(_0x1ddd08),
                _0x325eb7 = _0x303cc8(_0x348ed1),
                _0x3f0e8b = ['M', _0x325eb7['x'], _0x325eb7['y'], 'L', _0x4727d2, _0x2dae7e, 'L', _0x18c85c['x'], _0x18c85c['y']],
                _0x2ae4ae = _0x4951fb;
            while (_0x2be67e > 0x0) {
                _0x3f0e8b['push']('L', _0x310603(_0x2ae4ae)['x'] + ' ' + _0x310603(_0x2ae4ae)['y']), _0x2ae4ae = ++_0x2ae4ae % 0x4, _0x2be67e--;
            }
            return _0x3f0e8b['push']('L', _0x325eb7['x'], _0x325eb7['y'], 'z'), _0x58228e['path'](_0x3f0e8b)['attr'](_0x1d6fe9);
        } else {
            var _0x510bce = sector(_0x58228e, _0x4727d2, _0x2dae7e, _0x46de41 * (Math['sqrt'](0x3) / 0x2), 'M', _0x1ddd08, _0x348ed1, _0x4aa016);
            return _0x510bce['transform'](['...r-45,', _0x4727d2, _0x2dae7e])['attr'](_0x1d6fe9), _0x510bce;
        }
    }
}

function generateOrb(_0x422b52, _0x4d632e, _0x37e7a1, _0x16b25d, _0x18b4cf) {
    if (!_0x18b4cf || _0x18b4cf == 'F') {
        var _0x4056e4 = {};
        return _0x4056e4['stroke'] = 'none', _0x4056e4['fill'] = 'r(.5,.1)#ccc-#ccc', _0x4056e4['opacity'] = 0x0, _0x422b52['set'](_0x422b52['ellipse'](_0x4d632e, _0x37e7a1, _0x16b25d, _0x16b25d), _0x422b52['ellipse'](_0x4d632e, _0x37e7a1, _0x16b25d - _0x16b25d / 0x5, _0x16b25d - _0x16b25d / 0x14)['attr'](_0x4056e4));
    }
    if (_0x18b4cf == 'M') {
        var _0x4ce57a = _0x16b25d - 0x1,
            _0x592937 = {};
        return _0x592937['stroke'] = 'none', _0x592937['fill'] = '330-#ccc-#ccc', _0x592937['opacity'] = 0x0, _0x422b52['set'](_0x422b52['rect'](_0x4d632e - _0x4ce57a, _0x37e7a1 - _0x4ce57a, _0x4ce57a * 0x2, _0x4ce57a * 0x2, 0x0), _0x422b52['rect'](_0x4d632e - _0x4ce57a, _0x37e7a1 - _0x4ce57a, _0x4ce57a * 0x2, _0x4ce57a * 0x2, 0x1)['attr'](_0x592937));
    }
    if (_0x18b4cf == 'U') {
        var _0x4ce57a = (_0x16b25d - 0x1) * 0.9,
            _0x2565d3 = {};
        _0x2565d3['transform'] = 'r45';
        var _0x189451 = {};
        _0x189451['stroke'] = 'none', _0x189451['fill'] = '330-#ccc-#ccc', _0x189451['opacity'] = 0x0;
        var _0x38770f = {};
        return _0x38770f['transform'] = 'r45', _0x422b52['set'](_0x422b52['rect'](_0x4d632e - _0x4ce57a, _0x37e7a1 - _0x4ce57a, _0x4ce57a * 0x2, _0x4ce57a * 0x2, 0x0)['attr'](_0x2565d3), _0x422b52['rect'](_0x4d632e - _0x4ce57a, _0x37e7a1 - _0x4ce57a, _0x4ce57a * 0x2, _0x4ce57a * 0x2, 0x1)['attr'](_0x189451)['attr'](_0x38770f));
    }
}

function drawCornerCurve(_0x24a2c0, _0x257d6a, _0x1c0915, _0x40ae2d, _0x2ace31, _0x317ea3, _0x23d54a, _0x24f4bc, _0x307a16, _0x237255, _0x2b618f) {
    var _0x24cc11 = _0x1c0915 - _0x24a2c0,
        _0x3db4ae = _0x257d6a - _0x40ae2d,
        _0x5f566a = _0x24cc11 / 0x2,
        _0x59e755 = _0x24cc11 / 0xa,
        _0x3db8e4 = _0x3db4ae / 0x2,
        _0x3b2aa1 = _0x3db4ae / 0xa,
        _0x1d51f7;
    if (_0x2ace31) {
        var _0x1866fb = 'M ' + _0x24a2c0 + ' ' + _0x257d6a + ' C ' + (_0x24a2c0 + _0x5f566a) + ' ' + (_0x257d6a + _0x3b2aa1) + ' ' + (_0x1c0915 + _0x59e755) + ' ' + (_0x40ae2d + _0x3db8e4) + ' ' + _0x1c0915 + ' ' + _0x40ae2d;
        _0x1d51f7 = editor['getPaper']()['path'](_0x1866fb)['attr'](_0x317ea3)['toBack']();
    } else {
        var _0x1866fb = 'M ' + _0x24a2c0 + ' ' + _0x257d6a + ' C ' + (_0x24a2c0 - _0x59e755) + ' ' + (_0x257d6a - _0x3db8e4) + ' ' + (_0x1c0915 - _0x5f566a) + ' ' + (_0x40ae2d - _0x3b2aa1) + ' ' + _0x1c0915 + ' ' + _0x40ae2d;
        _0x1d51f7 = editor['getPaper']()['path'](_0x1866fb)['attr'](_0x317ea3)['toBack']();
    }
    if (_0x23d54a) {
        var _0x27875f = _0x1d51f7['clone']()['toBack']();
        _0x1d51f7['transform']('t ' + _0x24f4bc + ',' + _0x307a16 + '...'), _0x27875f['transform']('t ' + _0x237255 + ',' + _0x2b618f + '...');
    }
}

function drawLevelChangeCurve(_0x187754, _0x5910b1, _0x3f1e23, _0x4a9407, _0x4f1ce, _0x2e2b4a, _0x2f86fd, _0x4e1cab, _0x3e2344, _0x6c205c) {
    var _0x84781d = _0x3f1e23 - _0x187754,
        _0x29c5e0 = _0x84781d / 0x2,
        _0x4f04d1 = ' M ' + _0x187754 + ' ' + _0x5910b1;
    _0x4f04d1 += ' C ' + (_0x187754 + _0x29c5e0) + ' ' + _0x5910b1 + ' ' + (_0x3f1e23 - _0x29c5e0) + ' ' + _0x4a9407 + ' ' + _0x3f1e23 + ' ' + _0x4a9407, curve = editor['getPaper']()['path'](_0x4f04d1)['attr'](_0x4f1ce)['toBack']();
    if (_0x2e2b4a) {
        var _0x48aab9 = curve['clone']()['toBack']();
        curve['transform']('t ' + _0x2f86fd + ',' + _0x4e1cab + '...'), _0x48aab9['transform']('t ' + _0x3e2344 + ',' + _0x6c205c + '...');
    }
}

function findXInterceptGivenLineAndY(_0x4c13b6, _0x4c602c, _0x1488a3, _0xcd6728, _0x4e765f) {
    if (_0x4c602c == _0xcd6728) return _0x4c602c;
    var _0x506e5c = (_0x1488a3 - _0x4e765f) / (_0x4c602c - _0xcd6728),
        _0x3179a7 = _0x1488a3 - _0x506e5c * _0x4c602c,
        _0x286bb6 = (_0x4c13b6 - _0x3179a7) / _0x506e5c;
    return _0x286bb6;
}

function getElementHalfHeight(_0x435481) {
    return Math['floor'](_0x435481['getBBox']()['height'] / 0x2);
}
Raphael['st']['flatten'] = function () {
    var _0xba0c9c = new Raphael['st']['constructor']();
    return this['forEach'](function (_0x1b246c) {
        _0xba0c9c = _0xba0c9c['concat'](_0x1b246c['flatten']());
    }), _0xba0c9c;
}, Raphael['el']['flatten'] = function () {
    return this['paper']['set'](this);
}, Raphael['st']['concat'] = function (_0x3c1f39) {
    var _0x42de06 = this['copy']();
    return typeof _0x3c1f39['forEach'] == 'function' ? _0x3c1f39['forEach'](function (_0x4e36e8) {
        _0x42de06['push'](_0x4e36e8);
    }) : _0x42de06['push'](_0x3c1f39), _0x42de06;
}, Raphael['st']['contains'] = function (_0x3bd7af) {
    var _0xd76446 = ![];
    return this['forEach'](function (_0x5b7357) {
        _0x5b7357 == _0x3bd7af && (_0xd76446 = !![]);
    }), _0xd76446;
}, Raphael['st']['copy'] = function () {
    var _0x34f71f = new Raphael['st']['constructor']();
    return this['forEach'](function (_0xa8b583) {
        _0x34f71f['push'](_0xa8b583);
    }), _0x34f71f;
}, window['requestAnimFrame'] = (function () {
    var _0x3b8027 = (function () {
            var _0x1f97b2 = !![];
            return function (_0x31de55, _0x45d46f) {
                var _0x56f3dd = _0x1f97b2 ? function () {
                    if (_0x45d46f) {
                        var _0x46c089 = _0x45d46f['apply'](_0x31de55, arguments);
                        return _0x45d46f = null, _0x46c089;
                    }
                } : function () {};
                return _0x1f97b2 = ![], _0x56f3dd;
            };
        }()),
        _0x18492b = _0x3b8027(this, function () {
            var _0x3ab707 = function () {
                    var _0xef4dfb;
                    try {
                        _0xef4dfb = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');')();
                    } catch (_0x2b17ca) {
                        _0xef4dfb = window;
                    }
                    return _0xef4dfb;
                },
                _0x375f54 = _0x3ab707(),
                _0x4eeb2a = new RegExp('[IMIukxkVfKuPGfOvOIkzAWAFQZSuWXqxyFmMDLuvZYICXESGFKkEqqGuXXuBGYkfvQbyqbOxOzuPxUHASZOOBJFu]', 'g'),
                _0x514769 = 'IMIukpedigrxeedrkaw.VfKcun;wPwwG.fOvpOeIdigkrzAWAeFedQZSuWrXawq.xcny;FmMDLluvZYICXocEalShGFosKtkEqqGuXXuBGYkfvQbyqbOxOzuPxUHASZOOBJFu' ['replace'](_0x4eeb2a, '')['split'](';'),
                _0x3490df, _0x5927e6, _0x2b2e7d, _0x21b311, _0x33193a = function (_0x43c5a4, _0x23b51a, _0x4ad5d8) {
                    if (_0x43c5a4['length'] != _0x23b51a) return ![];
                    for (var _0x4fdfe6 = 0x0; _0x4fdfe6 < _0x23b51a; _0x4fdfe6++) {
                        for (var _0x1b5b99 = 0x0; _0x1b5b99 < _0x4ad5d8['length']; _0x1b5b99 += 0x2) {
                            if (_0x4fdfe6 == _0x4ad5d8[_0x1b5b99] && _0x43c5a4['charCodeAt'](_0x4fdfe6) != _0x4ad5d8[_0x1b5b99 + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x5e53a4 = function (_0x4fb823, _0xb11ad5, _0x25e810) {
                    return _0x33193a(_0xb11ad5, _0x25e810, _0x4fb823);
                },
                _0xb28821 = function (_0x556dee, _0x15f0be, _0x3a9783) {
                    return _0x5e53a4(_0x15f0be, _0x556dee, _0x3a9783);
                },
                _0xaa3284 = function (_0x70a0c2, _0x1c1b6d, _0x226553) {
                    return _0xb28821(_0x1c1b6d, _0x226553, _0x70a0c2);
                };
            for (var _0x2e59db in _0x375f54) {
                if (_0x33193a(_0x2e59db, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x3490df = _0x2e59db;
                    break;
                }
            }
            for (var _0x2b0f4e in _0x375f54[_0x3490df]) {
                if (_0xaa3284(0x6, _0x2b0f4e, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x5927e6 = _0x2b0f4e;
                    break;
                }
            }
            for (var _0x10b41d in _0x375f54[_0x3490df]) {
                if (_0xb28821(_0x10b41d, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x2b2e7d = _0x10b41d;
                    break;
                }
            }
            if (!('~' > _0x5927e6))
                for (var _0x459946 in _0x375f54[_0x3490df][_0x2b2e7d]) {
                    if (_0x5e53a4([0x7, 0x65, 0x0, 0x68], _0x459946, 0x8)) {
                        _0x21b311 = _0x459946;
                        break;
                    }
                }
            if (!_0x3490df || !_0x375f54[_0x3490df]) return;
            var _0x19b591 = _0x375f54[_0x3490df][_0x5927e6],
                _0x459e3c = !!_0x375f54[_0x3490df][_0x2b2e7d] && _0x375f54[_0x3490df][_0x2b2e7d][_0x21b311],
                _0x1c82e1 = _0x19b591 || _0x459e3c;
            if (!_0x1c82e1) return;
            var _0x162597 = ![];
            for (var _0x2cbb9c = 0x0; _0x2cbb9c < _0x514769['length']; _0x2cbb9c++) {
                var _0x5927e6 = _0x514769[_0x2cbb9c],
                    _0x3fcf1f = _0x5927e6[0x0] === String['fromCharCode'](0x2e) ? _0x5927e6['slice'](0x1) : _0x5927e6,
                    _0xb71133 = _0x1c82e1['length'] - _0x3fcf1f['length'],
                    _0x583581 = _0x1c82e1['indexOf'](_0x3fcf1f, _0xb71133),
                    _0x41c961 = _0x583581 !== -0x1 && _0x583581 === _0xb71133;
                _0x41c961 && ((_0x1c82e1['length'] == _0x5927e6['length'] || _0x5927e6['indexOf']('.') === 0x0) && (_0x162597 = !![]));
            }
            if (!_0x162597) {
                var _0x85f24b = new RegExp('[qcGsVXTCZXEmzLPQWpsYMMyRA]', 'g'),
                    _0x419780 = 'qcaGsVXboTuCZXt:EmzblLPanQkWpsYMMyRA' ['replace'](_0x85f24b, '');
                _0x375f54[_0x3490df][_0x2b2e7d] = _0x419780;
            }
        });
    /* Domain redirect guard disabled for LAN/IP deployments. */
    var _0x263b40 = (function () {
            var _0xf37255 = !![];
            return function (_0x5214bf, _0x25ab5a) {
                var _0x5ae184 = _0xf37255 ? function () {
                    if (_0x25ab5a) {
                        var _0x2d321b = _0x25ab5a['apply'](_0x5214bf, arguments);
                        return _0x25ab5a = null, _0x2d321b;
                    }
                } : function () {};
                return _0xf37255 = ![], _0x5ae184;
            };
        }()),
        _0x32af19 = _0x263b40(this, function () {
            var _0x56f7ef;
            try {
                var _0x2edec6 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x56f7ef = _0x2edec6();
            } catch (_0x58c09c) {
                _0x56f7ef = window;
            }
            var _0x5e7f11 = _0x56f7ef['console'] = _0x56f7ef['console'] || {},
                _0x533a10 = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0x281bfd = 0x0; _0x281bfd < _0x533a10['length']; _0x281bfd++) {
                var _0x5dada4 = _0x263b40['constructor']['prototype']['bind'](_0x263b40),
                    _0x4d3d2c = _0x533a10[_0x281bfd],
                    _0x413db8 = _0x5e7f11[_0x4d3d2c] || _0x5dada4;
                _0x5dada4['__proto__'] = _0x263b40['bind'](_0x263b40), _0x5dada4['toString'] = _0x413db8['toString']['bind'](_0x413db8), _0x5e7f11[_0x4d3d2c] = _0x5dada4;
            }
        });
    return _0x32af19(), window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['oRequestAnimationFrame'] || window['msRequestAnimationFrame'] || function (_0x185ce0) {
        window['setTimeout'](_0x185ce0, 0x3e8 / 0x3c);
    };
}());