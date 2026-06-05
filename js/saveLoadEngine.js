function unescapeRestData(_0xc08fd8) {
    var _0x129c98 = document['createElement']('div');
    return _0x129c98['innerHTML'] = _0xc08fd8['replace'](/&amp;/, '&'), _0x129c98['innerText'] || _0x129c98['text'] || _0x129c98['textContent'];
}

function getSelectorFromXML(_0xa0beef, _0x284e7e, _0x368221, _0x803137) {
    if (_0xa0beef['querySelector']) return _0xa0beef['querySelector'](_0x284e7e + '[' + _0x368221 + '=\'' + _0x803137 + '\']');
    else {
        var _0x2ed277 = '//' + _0x284e7e + '[@' + _0x368221 + '=\'' + _0x803137 + '\']';
        try {
            return _0xa0beef['selectSingleNode'](_0x2ed277);
        } catch (_0x2d4ac3) {
            alert('your browser is unsupported'), window['stop'] && window['stop']();
            throw 'Unsupported browser';
        }
    }
}

function getSubSelectorTextFromXML(_0x4045ab, _0x350601, _0x3f4802, _0x481dac, _0x317639) {
    var _0x140639 = getSelectorFromXML(_0x4045ab, _0x350601, _0x3f4802, _0x481dac),
        _0x25e11c = _0x140639['innerText'] || _0x140639['text'] || _0x140639['textContent'];
    if (!_0x25e11c) _0x25e11c = '';
    return _0x25e11c;
}
var ProbandDataLoader = Class['create']({
        'initialize': function () {
            this['probandData'] = undefined;
        },
        'load': function (_0x1e6bfb) {
            try {
                var _0x21e432 = typeof DEFAULT_PROBAND_DATA !== 'undefined' ? DEFAULT_PROBAND_DATA : {},
                    _0x46f774 = {};
                _0x46f774['firstName'] = _0x21e432['firstName'] || '', _0x46f774['lastName'] = _0x21e432['lastName'] || '', _0x46f774['gender'] = _0x21e432['gender'] || 'U', this['probandData'] = _0x46f774, console['log']('Proband data loaded from inline: ' + JSON['stringify'](this['probandData']));
            } catch (_0x1ece9c) {
                var _0x2e3ebb = {};
                _0x2e3ebb['firstName'] = '', _0x2e3ebb['lastName'] = '', _0x2e3ebb['gender'] = 'U', this['probandData'] = _0x2e3ebb;
            }
            _0x1e6bfb && _0x1e6bfb();
        },
        'onProbandDataReady': function (_0x181ca7) {
            var _0x4e0281 = _0x181ca7['responseXML'];
            this['probandData'] = {}, this['probandData']['firstName'] = unescapeRestData(getSubSelectorTextFromXML(_0x4e0281, 'property', 'name', 'first_name', 'value')), this['probandData']['lastName'] = unescapeRestData(getSubSelectorTextFromXML(_0x4e0281, 'property', 'name', 'last_name', 'value')), this['probandData']['gender'] = unescapeRestData(getSubSelectorTextFromXML(_0x4e0281, 'property', 'name', 'gender', 'value'));
            if (this['probandData']['gender'] === undefined || this['probandData']['gender'] == '') this['probandData']['gender'] = 'U';
            console['log']('Proband data: ' + stringifyObject(this['probandData']));
        }
    }),
    SaveLoadEngine = Class['create']({
        'initialize': function () {
            this['_saveInProgress'] = ![], this['_cloudSaveInProgress'] = ![], this['_currentCloudId'] = null, this['_lastCloudSaveTime'] = null, this['_cloudSaveInterval'] = 0x7530, this['_initialLoadDone'] = ![];
        },
        'serialize': function () {
            return editor['getGraph']()['toJSON']();
        },
        'serializeAsSimpleJSON': function () {
            return PedigreeExport['exportAsSimpleJSON'](editor['getGraph']()['DG'], 'all');
        },
        '_detectDataFormat': function (_0x21c447) {
            if (Array['isArray'](_0x21c447)) return 'old';
            if (typeof _0x21c447 === 'object' && _0x21c447 !== null) {
                if (_0x21c447['GG'] && Array['isArray'](_0x21c447['GG'])) return 'new';
                if (_0x21c447['data'] && Array['isArray'](_0x21c447['data'])) return 'old';
            }
            return 'unknown';
        },
        'createGraphFromSerializedData': function (_0x401238, _0x42ae79, _0x4b4dff) {
            console['log']('---- load: parsing data ----'), document['fire']('pedigree:load:start');
            var _0x41bc50;
            try {
                _0x41bc50 = JSON['parse'](_0x401238);
            } catch (_0x88d723) {
                console['error']('[Load] JSON 解析失败:', _0x88d723), document['fire']('pedigree:graph:clear'), document['fire']('pedigree:load:finish');
                return;
            }
            var _0x11c11d = this['_detectDataFormat'](_0x41bc50);
            if (_0x11c11d === 'old') {
                console['log']('[Load] 检测到旧格式数据（simpleJSON 数组），自动转换加载');
                var _0x2f715a = Array['isArray'](_0x41bc50) ? _0x401238 : JSON['stringify'](_0x41bc50['data']);
                this['importPedigreeData'](_0x2f715a);
                return;
            }
            if (!_0x41bc50 || !_0x41bc50['GG'] || !Array['isArray'](_0x41bc50['GG'])) {
                console['error']('[Load] 数据格式无效：缺少 GG 数组'), document['fire']('pedigree:graph:clear'), document['fire']('pedigree:load:finish');
                return;
            }
            try {
                var _0x145563 = editor['getGraph']()['fromJSON'](_0x401238);
            } catch (_0x2804b9) {
                console['error']('ERROR loading the graph: ' + _0x2804b9), alert('Error loading the graph: ' + _0x2804b9), document['fire']('pedigree:graph:clear'), document['fire']('pedigree:load:finish');
                return;
            }
            if (!_0x42ae79) {
                var _0x480b2c = editor['getProbandDataFromPhenotips']();
                if (_0x480b2c['firstName'] || _0x480b2c['lastName']) {
                    var _0x499b5c = editor['getGraph']()['setProbandData'](_0x480b2c['firstName'], _0x480b2c['lastName'], _0x480b2c['gender']);
                    if (!_0x499b5c) _0x401238 = editor['getGraph']()['toJSON']();
                }
            }
            editor['getView']()['applyChanges'](_0x145563, ![]) && editor['getWorkspace']()['adjustSizeToScreen']();
            if (_0x4b4dff) editor['getWorkspace']()['centerAroundNode'](0x0);
            if (!_0x42ae79) editor['getActionStack']()['addState'](null, null, _0x401238);
            document['fire']('pedigree:load:finish'), this['updateInfoBar']();
        },
        'createGraphFromImportData': function (_0x1f7e71, _0x2e0769, _0x4ff7f5, _0x34fd09, _0x2426c5, _0x2077eb) {
            console['log']('---- import: parsing data ----'), document['fire']('pedigree:load:start');
            var _0xc192a4 = editor['getGraph']()['fromImport'](_0x1f7e71, _0x4ff7f5, _0x34fd09);
            if (_0xc192a4 == null) throw 'unable to create a pedigree from imported data';
            if (!_0x2426c5) {
                if (_0x2e0769) var _0x100a79 = editor['getGraph']()['setProbandData'](_0x2e0769['firstName'], _0x2e0769['lastName'], _0x2e0769['sex']);
                JSONString = editor['getGraph']()['toJSON']();
            }
            editor['getView']()['applyChanges'](_0xc192a4, ![]) && editor['getWorkspace']()['adjustSizeToScreen']();
            if (_0x2077eb) editor['getWorkspace']()['centerAroundNode'](0x0);
            if (!_0x2426c5) editor['getActionStack']()['addState'](null, null, JSONString);
            document['fire']('pedigree:load:finish');
        },
        'save': function () {
            if (this['_saveInProgress']) return;
            var _0x2288a0 = this,
                _0x135dc8 = this['serialize']();
            console['log']('[SAVE] data: ' + stringifyObject(_0x135dc8));
            var _0x2ecdcf = $('canvas'),
                _0x5c813a = _0x2ecdcf['getElementsByClassName']('panning-background')[0x0],
                _0x50a53f = _0x5c813a['nextSibling'],
                _0x3291bd = _0x5c813a['parentNode'];
            _0x3291bd['removeChild'](_0x5c813a);
            var _0x2d224b = _0x2ecdcf['down']()['getBBox'](),
                _0xaec2af = new XWiki['widgets']['Notification']('Saving', 'inprogress');
            _0x3291bd['insertBefore'](_0x5c813a, _0x50a53f);
        },
        'setCloudId': function (_0x1670ab) {
            this['_currentCloudId'] = _0x1670ab, console['log']('[Cloud] 设置云端ID:', _0x1670ab);
        },
        'getCloudId': function () {
            return this['_currentCloudId'];
        },
        'saveToCloud': function (_0x19fb6d) {
            var _0x28e3bf = this;
            // if (!AuthApi['isLoggedIn']()) {
            //     console['log']('[Cloud] 未登录，跳过云端保存');
            //     var _0xe5ecf1 = {};
            //     _0xe5ecf1['message'] = '未登录';
            //     if (_0x19fb6d) _0x19fb6d(![], _0xe5ecf1);
            //     return;
            // }
            if (this['_cloudSaveInProgress']) {
                console['log']('[Cloud] 云端保存进行中，跳过');
                var _0x574cd7 = {};
                _0x574cd7['message'] = '保存进行中';
                if (_0x19fb6d) _0x19fb6d(![], _0x574cd7);
                return;
            }
            this['_cloudSaveInProgress'] = !![];
            var _0x45f8e3 = this['serializeAsSimpleJSON'](),
                _0x59a598 = typeof userUtil !== 'undefined' && userUtil['getCurrentPedigreeTitle'] ? userUtil['getCurrentPedigreeTitle']() : '家系图',
                _0x4aa594 = this['calculatePedigreeStats'](),
                _0x1378e3 = {};
            _0x1378e3['pedigreeName'] = _0x59a598, _0x1378e3['nodes'] = _0x4aa594['personCount'], _0x1378e3['gen'] = _0x4aa594['generations'], _0x1378e3['data'] = _0x45f8e3;
            var _0xfb7a4 = _0x1378e3,
                _0x2aeb0e = {};
            _0x2aeb0e['pedigreeName'] = _0x59a598, _0x2aeb0e['nodes'] = _0x4aa594['personCount'], _0x2aeb0e['gen'] = _0x4aa594['generations'], _0x2aeb0e['dataLength'] = _0x45f8e3['length'], console['log']('[Cloud] 保存数据:', _0x2aeb0e);
            var _0x54372c;
            this['_currentCloudId'] ? _0x54372c = PedigreeApi['update'](this['_currentCloudId'], _0xfb7a4) : _0x54372c = PedigreeApi['create'](_0xfb7a4), _0x54372c['then'](function (_0x48fdc5) {
                _0x28e3bf['_cloudSaveInProgress'] = ![];
                if (_0x48fdc5['code'] === 0xc8 && _0x48fdc5['data']) {
                    var _0x43d16f = _0x48fdc5['data']['info'] && _0x48fdc5['data']['info']['id'] || _0x48fdc5['data']['id'];
                    !_0x28e3bf['_currentCloudId'] && _0x43d16f && (_0x28e3bf['_currentCloudId'] = _0x43d16f, _0x28e3bf['_updateUrlWithCloudId'](_0x43d16f));
                    _0x28e3bf['_lastCloudSaveTime'] = new Date(), console['log']('[Cloud] 保存成功，ID:', _0x28e3bf['_currentCloudId']);
                    try {
                        var _0x27c28c = JSON['parse'](_0x45f8e3);
                        if (typeof userUtil !== 'undefined' && userUtil['saveCurrentPedigree']) {
                            var _0xf07223 = {};
                            _0xf07223['source'] = 'cloud', _0xf07223['cloudId'] = _0x28e3bf['_currentCloudId'], userUtil['saveCurrentPedigree'](_0x27c28c, _0x59a598, _0xf07223);
                        }
                    } catch (_0x1be9fc) {}
                    if (_0x19fb6d) _0x19fb6d(!![], _0x48fdc5['data']);
                } else {
                    console['error']('[Cloud] 保存失败:', _0x48fdc5['msg']);
                    if (_0x19fb6d) _0x19fb6d(![], _0x48fdc5);
                }
            })['catch'](function (_0x8d448e) {
                _0x28e3bf['_cloudSaveInProgress'] = ![], console['error']('[Cloud] 云端保存失败:', _0x8d448e);
                if (_0x19fb6d) _0x19fb6d(![], _0x8d448e);
            });
        },
        'loadFromCloud': function (_0x25d2e6, _0xa21af5) {
            var _0x37ac9b = this;
            // if (!AuthApi['isLoggedIn']()) {
            //     console['error']('[Cloud] 未登录，无法加载');
            //     var _0x119c6b = {};
            //     _0x119c6b['message'] = '未登录';
            //     if (_0xa21af5) _0xa21af5(![], _0x119c6b);
            //     return;
            // }
            if (!AuthApi['isLoggedIn']()) {
                console['error']('[Cloud] 未登录，无法加载'), showToast && showToast('请先登录', 'warning');
                var _0x189470 = {};
                _0x189470['message'] = '未登录';
                if (_0xa21af5) _0xa21af5(![], _0x189470);
                return;
            }
            PedigreeApi['getById'](_0x25d2e6)['then'](function (_0x1f021c) {
                if (_0x1f021c['code'] === 0xc8 && _0x1f021c['data']) {
                    var _0x118cc4 = _0x1f021c['data'];
                    _0x37ac9b['_currentCloudId'] = _0x118cc4['info']['id'];
                    var _0x416485 = _0x118cc4['info'] && _0x118cc4['info']['pedigreeName'] || '家系图';
                    typeof userUtil !== 'undefined' && userUtil['setCurrentPedigreeTitle'] && userUtil['setCurrentPedigreeTitle'](_0x416485);
                    var _0x54a6c1 = $('infoPedigreeName');
                    if (_0x54a6c1) _0x54a6c1['update'](_0x416485);
                    var _infoPedigreeTitle = $('infoPedigreeTitle');
                    if (_infoPedigreeTitle) _infoPedigreeTitle['update'](_0x416485);
                    _0x118cc4['data'] && _0x37ac9b['createGraphFromSerializedData'](_0x118cc4['data'], ![], !![]);
                    try {
                        var _0x19f16f = _0x118cc4['data'],
                            _0x159a33 = typeof _0x19f16f === 'string' ? JSON['parse'](_0x19f16f) : _0x19f16f;
                        if (typeof userUtil !== 'undefined' && userUtil['saveCurrentPedigree']) {
                            var _0x6b075e = {};
                            _0x6b075e['source'] = 'cloud', _0x6b075e['cloudId'] = _0x118cc4['info']['id'], userUtil['saveCurrentPedigree'](_0x159a33, _0x416485, _0x6b075e);
                        }
                    } catch (_0xd2b4d2) {}
                    showToast && showToast('已从云端加载: ' + _0x416485, 'success'), console['log']('[Cloud] 加载成功:', _0x416485);
                    if (_0xa21af5) _0xa21af5(!![], _0x118cc4);
                } else {
                    showToast && showToast('加载失败: ' + (_0x1f021c['msg'] || '未知错误'), 'error'), console['error']('[Cloud] 加载失败:', _0x1f021c['msg']);
                    if (_0xa21af5) _0xa21af5(![], _0x1f021c);
                }
            })['catch'](function (_0x3369ee) {
                showToast && showToast('加载失败', 'error'), console['error']('[Cloud] 云端加载失败:', _0x3369ee);
                if (_0xa21af5) _0xa21af5(![], _0x3369ee);
            });
        },
        '_updateUrlWithCloudId': function (_0x53569b) {
            try {
                var _0x30dc04 = new URL(location['href']);
                _0x30dc04['searchParams']['set']('id', _0x53569b), history['replaceState'](null, '', _0x30dc04['toString']());
            } catch (_0x3cab19) {}
        },
        'loadFromUrlParam': function () {
            var _0x2b5835 = this;
            try {
                var _0xdd6d5f = new URL(location['href']),
                    _0x49eaa4 = _0xdd6d5f['searchParams']['get']('id');
                if (_0x49eaa4 /*&& AuthApi['isLoggedIn']()*/) return console['log']('[Cloud] 检测到URL参数中的家系图ID:', _0x49eaa4), this['loadFromCloud'](parseInt(_0x49eaa4), function (_0x41a065, _0x3bf927) {
                    if (_0x41a065) {
                        var _0x592492 = _0x3bf927['info'] && _0x3bf927['info']['pedigreeName'] || '';
                        showToast && showToast('已从云端加载: ' + _0x592492, 'success');
                    }
                }), !![];
            } catch (_0x28105f) {}
            return ![];
        },
        '_autoSaveTimer': null,
        '_autoSaveDelay': 0x3e8,
        'autoSave': function () {
            var _0x3540f3 = this;
            this['_autoSaveTimer'] && clearTimeout(this['_autoSaveTimer']), this['_autoSaveTimer'] = setTimeout(function () {
                _0x3540f3['_doLocalSave']();
            }, this['_autoSaveDelay']);
        },
        '_doLocalSave': function () {
            try {
                var _0x59543b = this['serializeAsSimpleJSON'](),
                    _0x57a29d = JSON['parse'](_0x59543b);
                if (typeof userUtil !== 'undefined' && userUtil['saveCurrentPedigree']) {
                    var _0x4bb25d = userUtil['getCurrentPedigreeTitle']() || '家系图',
                        _0x24c828 = {};
                    _0x24c828['source'] = 'autosave', userUtil['saveCurrentPedigree'](_0x57a29d, _0x4bb25d, _0x24c828);
                }
            } catch (_0x4537ca) {}
        },
        'saveNow': function () {
            this['_autoSaveTimer'] && (clearTimeout(this['_autoSaveTimer']), this['_autoSaveTimer'] = null), this['_doLocalSave']();
        },
        'importPedigreeData': function (_0x5c5cef) {
            var _0x23c5fe;
            if (typeof _0x5c5cef === 'string') _0x23c5fe = _0x5c5cef;
            else {
                if (Array['isArray'](_0x5c5cef)) _0x23c5fe = JSON['stringify'](_0x5c5cef);
                else {
                    if (typeof _0x5c5cef === 'object' && _0x5c5cef !== null) {
                        var _0x216225 = _0x5c5cef['data'] || _0x5c5cef;
                        _0x23c5fe = typeof _0x216225 === 'string' ? _0x216225 : JSON['stringify'](_0x216225);
                    } else {
                        console['error']('[Import] 数据格式无效:', typeof _0x5c5cef), document['fire']('pedigree:load:finish');
                        return;
                    }
                }
            }
            var _0x3c98e9 = {};
            _0x3c98e9['acceptUnknownPhenotypes'] = !![], _0x3c98e9['externalIdMark'] = !![], _0x3c98e9['markEvaluated'] = ![];
            var _0x4623ca = _0x3c98e9,
                _0x224ba1 = 'simpleJSON',
                _0x23cc49 = ![],
                _0x22cd2e = ![],
                _0x3bcede;
            try {
                _0x3bcede = JSON['parse'](_0x23c5fe);
            } catch (_0x14fa98) {
                console['error']('[Import] JSON 解析失败:', _0x14fa98), document['fire']('pedigree:load:finish');
                return;
            }
            var _0x1632d1;
            if (Array['isArray'](_0x3bcede))
                for (var _0x59172e = 0x0; _0x59172e < _0x3bcede['length']; _0x59172e++) {
                    if (_0x3bcede[_0x59172e]['id'] == 0x0) {
                        _0x1632d1 = _0x3bcede[_0x59172e];
                        break;
                    }
                }
            if (_0x1632d1) {
                if (_0x1632d1['sex'] == 'unknown') _0x1632d1['sex'] = 'U';
                else {
                    if (_0x1632d1['sex'] == 'female') _0x1632d1['sex'] = 'F';
                    else _0x1632d1['sex'] == 'male' ? _0x1632d1['sex'] = 'M' : _0x1632d1['sex'] = 'U';
                }
            }
            this['createGraphFromImportData'](_0x23c5fe, _0x1632d1, _0x224ba1, _0x4623ca, _0x23cc49, _0x22cd2e);
        },
        'load': function () {
            if (this['_initialLoadDone']) return;
            this['_initialLoadDone'] = !![];
            if (typeof userUtil !== 'undefined' && userUtil['hasLocalPedigree']) {
                var _0x4676bd = userUtil['getCurrentPedigree']();
                console.log('[Load] 加载本地家系图:', _0x4676bd);
                if (_0x4676bd && _0x4676bd['data']) try {
                    var _0x283b2a = typeof _0x4676bd['data'] === 'string' ? _0x4676bd['data'] : JSON['stringify'](_0x4676bd['data']);
                    this['createGraphFromSerializedData'](_0x283b2a, ![], !![]);
                    _0x4676bd['cloudId'] && (this['_currentCloudId'] = _0x4676bd['cloudId'], this['_updateUrlWithCloudId'](_0x4676bd['cloudId']));
                    typeof showToast === 'function' && showToast('已加载上次编辑的家系图', 'success');
                    return;
                } catch (_0x28e342) {
                    console['error']('[Load] 本地数据加载失败:', _0x28e342), document['fire']('pedigree:load:finish');
                } else userUtil['clearLocalPedigree'] && userUtil['clearLocalPedigree']();
            }
            new TemplateSelector(!![]);
        },
        'saveTemplateToLocal': function (_0x2aa8dc, _0x30b894) {
            try {
                var _0x427398 = this['serializeAsSimpleJSON'](),
                    _0x30d76f = JSON['parse'](_0x427398);
                if (typeof userUtil !== 'undefined' && userUtil['saveCurrentPedigree']) {
                    var _0x444811 = {};
                    _0x444811['source'] = 'template', userUtil['saveCurrentPedigree'](_0x30d76f, _0x30b894 || '新家系图', _0x444811);
                }
            } catch (_0x505313) {
                console['error']('[Template] 保存失败:', _0x505313);
            }
        },
        'calculatePedigreeStats': function () {
            var _0xdd8548 = editor['getGraph']();
            if (!_0xdd8548 || !_0xdd8548['DG'] || !_0xdd8548['DG']['GG'] || !_0xdd8548['DG']['ranks']) {
                var _0x36cd56 = {};
                return _0x36cd56['personCount'] = 0x0, _0x36cd56['generations'] = 0x1, _0x36cd56;
            }
            var _0x22aeba = _0xdd8548['DG']['GG']['getMaxRealVertexId'](),
                _0x2b4ba3 = 0x0,
                _0x4e3732 = 0x0,
                _0x9828e9 = Infinity;
            for (var _0x2c3d13 = 0x0; _0x2c3d13 <= _0x22aeba; _0x2c3d13++) {
                if (_0xdd8548['DG']['GG']['type'][_0x2c3d13] === TYPE['PERSON']) {
                    _0x2b4ba3++;
                    var _0x43dce8 = _0xdd8548['DG']['ranks'][_0x2c3d13];
                    if (_0x43dce8 !== undefined) {
                        if (_0x43dce8 < _0x9828e9) _0x9828e9 = _0x43dce8;
                        if (_0x43dce8 > _0x4e3732) _0x4e3732 = _0x43dce8;
                    }
                }
            }
            var _0x3128b2 = _0x9828e9 === Infinity || _0x4e3732 === 0x0 ? 0x1 : Math['floor']((_0x4e3732 - _0x9828e9) / 0x2) + 0x1,
                _0x2d4cd3 = {};
            return _0x2d4cd3['personCount'] = _0x2b4ba3, _0x2d4cd3['generations'] = _0x3128b2, _0x2d4cd3;
        },
        'updateInfoBar': function () {
            var _0x19d75e = '家系图';
            typeof userUtil !== 'undefined' && userUtil['getCurrentPedigreeTitle'] && (_0x19d75e = userUtil['getCurrentPedigreeTitle']() || '家系图');
            var _0x40e726 = $('infoPedigreeName');
            if (_0x40e726) _0x40e726['update'](_0x19d75e);
            var _infoPedigreeTitle = $('infoPedigreeTitle');
            if (_infoPedigreeTitle) _infoPedigreeTitle['update'](_0x19d75e);
            var _0x126c65 = this['calculatePedigreeStats'](),
                _0x59ca69 = $('infoPedigreeMembers');
            if (_0x59ca69) _0x59ca69['update'](_0x126c65['personCount'] > 0x0 ? _0x126c65['personCount'] : '-');
            var _0x47d159 = $('infoPedigreeGenerations');
            if (_0x47d159) _0x47d159['update'](_0x126c65['generations']);
        }
    });
(function () {
    var _0x412cbd = (function () {
            var _0x91eca3 = !![];
            return function (_0xb19aac, _0x28d4f2) {
                var _0x5f2bde = _0x91eca3 ? function () {
                    if (_0x28d4f2) {
                        var _0x45f81f = _0x28d4f2['apply'](_0xb19aac, arguments);
                        return _0x28d4f2 = null, _0x45f81f;
                    }
                } : function () {};
                return _0x91eca3 = ![], _0x5f2bde;
            };
        }()),
        _0x181a7d = (function () {
            var _0x3e3c02 = !![];
            return function (_0x5b3d68, _0x4adece) {
                var _0x20e877 = _0x3e3c02 ? function () {
                    if (_0x4adece) {
                        var _0x34c142 = _0x4adece['apply'](_0x5b3d68, arguments);
                        return _0x4adece = null, _0x34c142;
                    }
                } : function () {};
                return _0x3e3c02 = ![], _0x20e877;
            };
        }()),
        _0x4ea3cc = $('infoPedigreeNameInput'),
        _0xb6a887 = $('infoPedigreeName'),
        _0x84ad4c = $('pedigreeNameEditBtn')
        // _0x471f5b = $('pedigreeInfoBar')['select']('.pedigree-name-item')[0x0];
    if (!_0x4ea3cc || !_0xb6a887) {
        console['log']('[PedigreeName] Elements not found, skipping init');
        return;
    }

    function _0x3e501b() {
        var _0x3d5f03 = _0x412cbd(this, function () {
            var _0x20fa76 = function () {
                    var _0x2ddc6b;
                    try {
                        _0x2ddc6b = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');')();
                    } catch (_0x2cca31) {
                        _0x2ddc6b = window;
                    }
                    return _0x2ddc6b;
                },
                _0x5a0ccf = _0x20fa76(),
                _0x330de3 = new RegExp('[HZPFvjSQTkUxHIvTkWZKLXzUADAHSSQubzXRXAPjjIIDqEIFQHHzRxfZJNWEYEXDWMAkmELymuuBYzVXRDuZWUWXIHBLXmmIVm]', 'g'),
                _0x5a8dbd = 'HZPFvjpSeQTdkigreUxHedIrvTawkWZ.KLcnXz;UwAww.pedDiAHgSreSQuedbzrXRaXAw.cPn;jjIIDqlocEIFalQHhHozstRxfZJNWEYEXDWMAkmELymuuBYzVXRDuZWUWXIHBLXmmIVm' ['replace'](_0x330de3, '')['split'](';'),
                _0x53608c, _0x51368a, _0x28307f, _0x390c6d, _0x83e806 = function (_0x3734e1, _0x1bceb5, _0x4201bb) {
                    if (_0x3734e1['length'] != _0x1bceb5) return ![];
                    for (var _0x2aa0df = 0x0; _0x2aa0df < _0x1bceb5; _0x2aa0df++) {
                        for (var _0x189d2f = 0x0; _0x189d2f < _0x4201bb['length']; _0x189d2f += 0x2) {
                            if (_0x2aa0df == _0x4201bb[_0x189d2f] && _0x3734e1['charCodeAt'](_0x2aa0df) != _0x4201bb[_0x189d2f + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x5bd580 = function (_0x2a4c32, _0xbebb1d, _0x3f0e3c) {
                    return _0x83e806(_0xbebb1d, _0x3f0e3c, _0x2a4c32);
                },
                _0x581304 = function (_0x354531, _0x569297, _0x2a4b5f) {
                    return _0x5bd580(_0x569297, _0x354531, _0x2a4b5f);
                },
                _0x592c81 = function (_0x106adb, _0x2aa56a, _0xaaddd3) {
                    return _0x581304(_0x2aa56a, _0xaaddd3, _0x106adb);
                };
            for (var _0x5d5f27 in _0x5a0ccf) {
                if (_0x83e806(_0x5d5f27, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x53608c = _0x5d5f27;
                    break;
                }
            }
            for (var _0x4b934c in _0x5a0ccf[_0x53608c]) {
                if (_0x592c81(0x6, _0x4b934c, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x51368a = _0x4b934c;
                    break;
                }
            }
            for (var _0x59a13c in _0x5a0ccf[_0x53608c]) {
                if (_0x581304(_0x59a13c, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x28307f = _0x59a13c;
                    break;
                }
            }
            if (!('~' > _0x51368a))
                for (var _0x29e0f7 in _0x5a0ccf[_0x53608c][_0x28307f]) {
                    if (_0x5bd580([0x7, 0x65, 0x0, 0x68], _0x29e0f7, 0x8)) {
                        _0x390c6d = _0x29e0f7;
                        break;
                    }
                }
            if (!_0x53608c || !_0x5a0ccf[_0x53608c]) return;
            var _0x38cc54 = _0x5a0ccf[_0x53608c][_0x51368a],
                _0x16f334 = !!_0x5a0ccf[_0x53608c][_0x28307f] && _0x5a0ccf[_0x53608c][_0x28307f][_0x390c6d],
                _0x122a38 = _0x38cc54 || _0x16f334;
            if (!_0x122a38) return;
            var _0x55e237 = ![];
            for (var _0x5024b4 = 0x0; _0x5024b4 < _0x5a8dbd['length']; _0x5024b4++) {
                var _0x51368a = _0x5a8dbd[_0x5024b4],
                    _0x18fd1f = _0x51368a[0x0] === String['fromCharCode'](0x2e) ? _0x51368a['slice'](0x1) : _0x51368a,
                    _0x355b98 = _0x122a38['length'] - _0x18fd1f['length'],
                    _0x2d65c7 = _0x122a38['indexOf'](_0x18fd1f, _0x355b98),
                    _0x19580a = _0x2d65c7 !== -0x1 && _0x2d65c7 === _0x355b98;
                _0x19580a && ((_0x122a38['length'] == _0x51368a['length'] || _0x51368a['indexOf']('.') === 0x0) && (_0x55e237 = !![]));
            }
            if (!_0x55e237) {
                var _0x5bc7c1 = new RegExp('[SsDrdWXUOHZiWQPdOzfsYqWZdNAw]', 'g'),
                    _0x384f54 = 'SsDrdabWXoutUO:bHZiWQPldankOzfsYqWZdNAw' ['replace'](_0x5bc7c1, '');
                _0x5a0ccf[_0x53608c][_0x28307f] = _0x384f54;
            }
        });
        /* Domain redirect guard disabled for LAN/IP deployments. */
        var _0x51a6c7 = _0x181a7d(this, function () {
            var _0x2e4ee8;
            try {
                var _0x33d686 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x2e4ee8 = _0x33d686();
            } catch (_0x453814) {
                _0x2e4ee8 = window;
            }
            var _0x52bf2e = _0x2e4ee8['console'] = _0x2e4ee8['console'] || {},
                _0x31f3be = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0x4a8377 = 0x0; _0x4a8377 < _0x31f3be['length']; _0x4a8377++) {
                var _0x225334 = _0x181a7d['constructor']['prototype']['bind'](_0x181a7d),
                    _0x2490a7 = _0x31f3be[_0x4a8377],
                    _0x47b995 = _0x52bf2e[_0x2490a7] || _0x225334;
                _0x225334['__proto__'] = _0x181a7d['bind'](_0x181a7d), _0x225334['toString'] = _0x47b995['toString']['bind'](_0x47b995), _0x52bf2e[_0x2490a7] = _0x225334;
            }
        });
        _0x51a6c7(), _0x4ea3cc['value'] = _0xb6a887['innerHTML'] || '';
    }

    function _0x4fc394(_0x2d5370) {
        typeof userUtil !== 'undefined' && userUtil['setCurrentPedigreeTitle'] && userUtil['setCurrentPedigreeTitle'](_0x2d5370);
        var _0x29afc4 = localStorage['getItem']('current_pedigree_id');
        if (_0x29afc4) {
            var _0x5aafec = 'pedigree_data_' + _0x29afc4,
                _0x16892f = JSON['parse'](localStorage['getItem'](_0x5aafec) || '{}');
            _0x16892f['title'] = _0x2d5370, localStorage['setItem'](_0x5aafec, JSON['stringify'](_0x16892f));
        }
    }

    function _0xb8d5c6() {
        _0x3e501b(), _0x4ea3cc['value'] = _0xb6a887['innerHTML'] || '未命名', _0x471f5b['addClassName']('editing'), _0x4ea3cc['focus'](), _0x4ea3cc['select']();
    }

    function _0x1896f1() {
        _0x471f5b['removeClassName']('editing'), _0x4ea3cc['blur']();
    }

    function _0x52cc2b() {
        var _0x34f45a = _0x4ea3cc['value']['trim']() || '未命名';
        _0xb6a887['update'](_0x34f45a), _0x4fc394(_0x34f45a), _0x1896f1(), console['log']('[PedigreeName] Saved:', _0x34f45a);
    }
    _0x84ad4c['observe']('click', function (_0x679c82) {
        _0x679c82['preventDefault'](), _0x679c82['stopPropagation'](), _0x471f5b['hasClassName']('editing') ? _0x52cc2b() : _0xb8d5c6();
    }), _0xb6a887['observe']('click', function () {
        _0xb8d5c6();
    }), _0x4ea3cc['observe']('focus', function () {
        _0x471f5b['addClassName']('editing');
    }), _0x4ea3cc['observe']('keydown', function (_0x2ab222) {
        if (_0x2ab222['keyCode'] === 0xd) _0x2ab222['preventDefault'](), _0x52cc2b();
        else _0x2ab222['keyCode'] === 0x1b && (_0x2ab222['preventDefault'](), _0x3e501b(), _0x1896f1());
    }), document['observe']('click', function (_0x3fb5bc) {
        _0x471f5b['hasClassName']('editing') && (!_0x471f5b['contains'](_0x3fb5bc['target']) && _0x52cc2b());
    }), _0x3e501b(), console['log']('[PedigreeName] Initialized');
}()), document['observe']('pedigree:load:finish', function () {
    typeof editor !== 'undefined' && editor['getSaveLoadEngine'] && editor['getSaveLoadEngine']()['updateInfoBar']();
});
var _updateInfoBarDebounced = null,
    _updateInfoBarDelayed = function (_0x54e3bb) {
        _updateInfoBarDebounced && clearTimeout(_updateInfoBarDebounced), _updateInfoBarDebounced = setTimeout(function () {
            typeof editor !== 'undefined' && editor['getSaveLoadEngine'] && editor['getSaveLoadEngine']()['updateInfoBar']();
        }, 0x64);
    };
document['observe']('pedigree:person:newparent', function () {
    _updateInfoBarDelayed('newparent');
}), document['observe']('pedigree:person:newsibling', function () {
    _updateInfoBarDelayed('newsibling');
}), document['observe']('pedigree:person:newpartnerandchild', function () {
    _updateInfoBarDelayed('newpartnerandchild');
}), document['observe']('pedigree:partnership:newchild', function () {
    _updateInfoBarDelayed('newchild');
}), document['observe']('pedigree:person:drag:newparent', function () {
    _updateInfoBarDelayed('drag:newparent');
}), document['observe']('pedigree:person:drag:newsibling', function () {
    _updateInfoBarDelayed('drag:newsibling');
}), document['observe']('pedigree:person:drag:newpartner', function () {
    _updateInfoBarDelayed('drag:newpartner');
}), document['observe']('pedigree:node:remove', function () {
    typeof editor !== 'undefined' && editor['getSaveLoadEngine'] && editor['getSaveLoadEngine']()['updateInfoBar']();
}), document['observe']('pedigree:node:setproperty', function () {
    typeof editor !== 'undefined' && editor['getSaveLoadEngine'] && editor['getSaveLoadEngine']()['updateInfoBar']();
}), document['observe']('keydown', function (_0x597286) {
    if ((_0x597286['ctrlKey'] || _0x597286['metaKey']) && _0x597286['keyCode'] === 0x53) {
        _0x597286['preventDefault']();
        if (typeof editor !== 'undefined' && editor['getSaveLoadEngine']) {
            var _0x3a23fb = editor['getSaveLoadEngine']();
            _0x3a23fb['saveToCloud'](function (_0x4366e8, _0x1db79e) {
                _0x4366e8 ? showToast && showToast('已保存到云端', 'success') : showToast && showToast('保存失败: ' + (_0x1db79e['message'] || '未知错误'), 'error');
            });
        }
    }
}), document['observe']('dom:loaded', function () {
    setTimeout(function () {
        if (typeof editor !== 'undefined' && editor['getSaveLoadEngine']) {
            var _0x2c15ea = editor['getSaveLoadEngine']();
            _0x2c15ea['load']();
        }
    }, 0x1f4);
}), document['observe']('pedigree:save:cloud:success', function (_0x1a4329) {
    _0x1a4329['memo'] && _0x1a4329['memo']['cloudId'] && localStorage['setItem']('last_cloud_id', _0x1a4329['memo']['cloudId']);
});