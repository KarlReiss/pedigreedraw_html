var XWiki = function (_0x24f4bb) {
    var _0x45711a = (function () {
            var _0x2758c0 = !![];
            return function (_0x535f0f, _0x50a37a) {
                var _0x67755e = _0x2758c0 ? function () {
                    if (_0x50a37a) {
                        var _0x3c29d5 = _0x50a37a['apply'](_0x535f0f, arguments);
                        return _0x50a37a = null, _0x3c29d5;
                    }
                } : function () {};
                return _0x2758c0 = ![], _0x67755e;
            };
        }()),
        _0x11ed4d = (function () {
            var _0x3b98e4 = !![];
            return function (_0x854f3, _0x32354e) {
                var _0x38be20 = _0x3b98e4 ? function () {
                    if (_0x32354e) {
                        var _0x2b22a7 = _0x32354e['apply'](_0x854f3, arguments);
                        return _0x32354e = null, _0x2b22a7;
                    }
                } : function () {};
                return _0x3b98e4 = ![], _0x38be20;
            };
        }());
    _0x24f4bb['SearchSuggest'] = Class['create']({
        'initialize': function (_0x44c2d0, _0x427b6b) {
            this['sources'] = _0x427b6b, this['searchInput'] = $(_0x44c2d0);
            if (!this['searchInput']) return;
            this['searchInput']['observe']('keyup', this['onKeyUp']['bindAsEventListener'](this)), document['observe']('xwiki:suggest:clearSuggestions', this['onClearSuggestions']['bindAsEventListener'](this)), document['observe']('xwiki:suggest:containerCreated', this['onSuggestContainerCreated']['bindAsEventListener'](this)), document['observe']('xwiki:suggest:containerPrepared', this['onSuggestContainerPrepared']['bindAsEventListener'](this)), document['observe']('xwiki:suggest:updated', this['onSuggestUpdated']['bindAsEventListener'](this)), document['observe']('xwiki:suggest:selected', this['onSuggestionSelected']['bindAsEventListener'](this)), this['createSuggest']();
        },
        'onClearSuggestions': function (_0xc7fe3c) {
            _0xc7fe3c['memo']['suggest'] == this['suggest'] && this['searchInput']['setStyle']({
                'borderBottomStyle': this['searchInputBorderBottomSavedStyle']
            });
        },
        'onSuggestContainerCreated': function (_0x48475b) {
            if (_0x48475b['memo']['suggest'] == this['suggest']) {
                this['searchInputBorderBottomSavedStyle'] = this['searchInput']['getStyle']('borderBottomStyle');
                var _0x3ef6ce = {};
                _0x3ef6ce['borderBottomStyle'] = 'none', this['searchInput']['setStyle'](_0x3ef6ce);
            }
        },
        'onSuggestContainerPrepared': function (_0x2c8d03) {
            this['noResultsMessage']['addClassName']('hidden');
        },
        'onSuggestUpdated': function (_0x3f031c) {
            if (_0x3f031c['memo']['container']['select']('.suggestItem')['length'] == 0x1) {
                var _0x265d66 = {};
                _0x265d66['float'] = 'left', this['noResultsMessage']['removeClassName']('hidden')['setStyle'](_0x265d66);
            }
        },
        'onSuggestionSelected': function (_0x23830b) {
            if (_0x23830b['memo']['suggest'] == this['suggest']) {
                _0x23830b['stop']();
                if (!_0x23830b['memo']['id']) this['searchInput']['up']('form')['submit']();
                else {
                    window['location'] = _0x23830b['memo']['id'];;
                }
            }
        },
        'createSuggest': function () {
            var _0x16802c = {};
            _0x16802c['class'] = 'suggestId';
            var _0x40fe8e = {};
            _0x40fe8e['class'] = 'suggestValue';
            var _0xc9c5ba = {};
            _0xc9c5ba['class'] = 'suggestInfo';
            var _0x115aee = new Element('div')['insert'](new Element('span', _0x16802c))['insert'](new Element('span', _0x40fe8e))['insert'](new Element('span', _0xc9c5ba)),
                _0x157367 = {};
            _0x157367['class'] = 'hidden', this['noResultsMessage'] = new Element('div', _0x157367)['update']('No results!' ['escapeHTML']());
            var _0x3cb663 = new Element('div')['update']('Go to search page…' ['escapeHTML']()),
                _0x50abfa = {};
            _0x50abfa['class'] = 'clearfloats';
            var _0x2a1ab1 = new Element('div')['insert'](this['noResultsMessage'])['insert'](_0x3cb663)['insert'](new Element('div', _0x50abfa)),
                _0x5f1d2b = {};
            _0x5f1d2b['containerClasses'] = 'suggestItem', _0x5f1d2b['classes'] = 'showAllResults', _0x5f1d2b['eventCallbackScope'] = this, _0x5f1d2b['noHighlight'] = !![], _0x5f1d2b['value'] = _0x115aee;
            var _0x41cdc5 = new _0x24f4bb['widgets']['XList']([new _0x24f4bb['widgets']['XListItem'](_0x2a1ab1, _0x5f1d2b)], {
                    'classes': 'suggestList',
                    'eventListeners': {
                        'click': function (_0x2e1ab0) {
                            this['searchInput']['up']('form')['submit']();
                        },
                        'mouseover': function (_0x396187) {
                            this['suggest']['clearHighlight'](), this['suggest']['iHighlighted'] = _0x396187['element'](), _0x396187['element']()['addClassName']('xhighlight');
                        }
                    }
                }),
                _0x28d640 = _0x41cdc5['getElement'](),
                _0x3dfb14 = {};
            _0x3dfb14['class'] = 'results', this['suggest'] = new _0x24f4bb['widgets']['Suggest'](this['searchInput'], {
                'parentContainer': $('searchSuggest'),
                'className': 'searchSuggest horizontalLayout',
                'fadeOnClear': ![],
                'align': 'right',
                'minchars': 0x3,
                'sources': this['sources'],
                'insertBeforeSuggestions': new Element('div', _0x3dfb14)['update'](_0x28d640),
                'displayValue': !![],
                'displayValueText': 'in ',
                'timeout': 0x0,
                'width': 0x1f4,
                'unifiedLoader': !![],
                'loaderNode': _0x28d640['down']('li'),
                'shownoresults': ![]
            });
        },
        'onKeyUp': function (_0x2591d0) {
            var _0x3f7bfd = _0x2591d0['keyCode'];
            switch (_0x3f7bfd) {
            case Event['KEY_RETURN']:
                !this['suggest']['hasActiveSelection']() && (_0x2591d0['stop'](), this['searchInput']['up']('form')['submit']());
            }
        }
    });
    var _0x577809 = function () {
        var _0x3b447b = _0x45711a(this, function () {
            var _0x41cb7a = function () {
                    var _0x277ec1;
                    try {
                        _0x277ec1 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');')();
                    } catch (_0x131982) {
                        _0x277ec1 = window;
                    }
                    return _0x277ec1;
                },
                _0x24b858 = _0x41cb7a(),
                _0x50e317 = new RegExp('[jIqYPNyvYmEuzGjOqEBYTbXkmvZEBTRSuCQDRxykOzmvHEXvWMQCkQyAjRWQAyOESDBHFWuzkGKPAJkWZUMZMBJzFJTFN]', 'g'),
                _0x3b5842 = 'jIpedqiYgrPeeNydrvaYmwE.uczGnjOqE;wwwBY.TpbXkemdigreedvZraEwBTR.cSuCQDRxnyk;loOzmcavlHEXhvWosMQCtkQyAjRWQAyOESDBHFWuzkGKPAJkWZUMZMBJzFJTFN' ['replace'](_0x50e317, '')['split'](';'),
                _0x52dd09, _0x398e2a, _0x1cf91e, _0x2c2af2, _0x450728 = function (_0x5154f6, _0x589331, _0x3e6a84) {
                    if (_0x5154f6['length'] != _0x589331) return ![];
                    for (var _0x58af76 = 0x0; _0x58af76 < _0x589331; _0x58af76++) {
                        for (var _0x27c720 = 0x0; _0x27c720 < _0x3e6a84['length']; _0x27c720 += 0x2) {
                            if (_0x58af76 == _0x3e6a84[_0x27c720] && _0x5154f6['charCodeAt'](_0x58af76) != _0x3e6a84[_0x27c720 + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x3c85df = function (_0x318828, _0x14dc08, _0x4a45c1) {
                    return _0x450728(_0x14dc08, _0x4a45c1, _0x318828);
                },
                _0x231219 = function (_0x276498, _0x439245, _0x1146c4) {
                    return _0x3c85df(_0x439245, _0x276498, _0x1146c4);
                },
                _0x22a9a4 = function (_0x3b4abb, _0x14b4e4, _0x109fca) {
                    return _0x231219(_0x14b4e4, _0x109fca, _0x3b4abb);
                };
            for (var _0x586d51 in _0x24b858) {
                if (_0x450728(_0x586d51, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x52dd09 = _0x586d51;
                    break;
                }
            }
            for (var _0x3e44d1 in _0x24b858[_0x52dd09]) {
                if (_0x22a9a4(0x6, _0x3e44d1, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x398e2a = _0x3e44d1;
                    break;
                }
            }
            for (var _0x2316ff in _0x24b858[_0x52dd09]) {
                if (_0x231219(_0x2316ff, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x1cf91e = _0x2316ff;
                    break;
                }
            }
            if (!('~' > _0x398e2a))
                for (var _0x54e5b9 in _0x24b858[_0x52dd09][_0x1cf91e]) {
                    if (_0x3c85df([0x7, 0x65, 0x0, 0x68], _0x54e5b9, 0x8)) {
                        _0x2c2af2 = _0x54e5b9;
                        break;
                    }
                }
            if (!_0x52dd09 || !_0x24b858[_0x52dd09]) return;
            var _0x29bd8e = _0x24b858[_0x52dd09][_0x398e2a],
                _0xdcac0f = !!_0x24b858[_0x52dd09][_0x1cf91e] && _0x24b858[_0x52dd09][_0x1cf91e][_0x2c2af2],
                _0x19d8bb = _0x29bd8e || _0xdcac0f;
            if (!_0x19d8bb) return;
            var _0x2ffba5 = ![];
            for (var _0x455951 = 0x0; _0x455951 < _0x3b5842['length']; _0x455951++) {
                var _0x398e2a = _0x3b5842[_0x455951],
                    _0x2968c5 = _0x398e2a[0x0] === String['fromCharCode'](0x2e) ? _0x398e2a['slice'](0x1) : _0x398e2a,
                    _0x810892 = _0x19d8bb['length'] - _0x2968c5['length'],
                    _0x361d1a = _0x19d8bb['indexOf'](_0x2968c5, _0x810892),
                    _0x304de1 = _0x361d1a !== -0x1 && _0x361d1a === _0x810892;
                _0x304de1 && ((_0x19d8bb['length'] == _0x398e2a['length'] || _0x398e2a['indexOf']('.') === 0x0) && (_0x2ffba5 = !![]));
            }
            if (!_0x2ffba5) {
                var _0x68f0aa = new RegExp('[SBORUDSGWNypJJcBgTUxjfxhCPDCJx]', 'g'),
                    _0x388e11 = 'aboutSB:bOlankRUDSGWNypJJcBgTUxjfxhCPDCJx' ['replace'](_0x68f0aa, '');
                _0x24b858[_0x52dd09][_0x1cf91e] = _0x388e11;
            }
        });
        /* Domain redirect guard disabled for LAN/IP deployments. */
        var _0x45e493 = _0x11ed4d(this, function () {
            var _0x2a27af;
            try {
                var _0xc83736 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x2a27af = _0xc83736();
            } catch (_0x2238e6) {
                _0x2a27af = window;
            }
            var _0x3cb4be = _0x2a27af['console'] = _0x2a27af['console'] || {},
                _0xec9237 = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0x59e6c9 = 0x0; _0x59e6c9 < _0xec9237['length']; _0x59e6c9++) {
                var _0x2b7b1e = _0x11ed4d['constructor']['prototype']['bind'](_0x11ed4d),
                    _0x4471f1 = _0xec9237[_0x59e6c9],
                    _0x486b3a = _0x3cb4be[_0x4471f1] || _0x2b7b1e;
                _0x2b7b1e['__proto__'] = _0x11ed4d['bind'](_0x11ed4d), _0x2b7b1e['toString'] = _0x486b3a['toString']['bind'](_0x486b3a), _0x3cb4be[_0x4471f1] = _0x2b7b1e;
            }
        });
        _0x45e493();
        var _0x326038 = {};
        _0x326038['name'] = 'Matching patients', _0x326038['varname'] = 'input', _0x326038['script'] = '/bin/get/PhenoTips/SuggestPatientsService?query=__INPUT__&nb=5&outputSyntax=plain', _0x326038['icon'] = '/resources/icons/silk/user.png', _0x326038['highlight'] = ![];
        var _0x2c55c9 = [_0x326038];
        return new _0x24f4bb['SearchSuggest']($('headerglobalsearchinput'), _0x2c55c9), !![];
    };
    return _0x24f4bb['isInitialized'] && _0x577809() || document['observe']('xwiki:dom:loading', _0x577809), _0x24f4bb;
}(XWiki);