var XWiki = function (_0x729587) {
    var _0x3dd0e7 = (function () {
            var _0x53ee8a = !![];
            return function (_0x3f7814, _0x4509d5) {
                var _0x40c851 = _0x53ee8a ? function () {
                    if (_0x4509d5) {
                        var _0x2bd15a = _0x4509d5['apply'](_0x3f7814, arguments);
                        return _0x4509d5 = null, _0x2bd15a;
                    }
                } : function () {};
                return _0x53ee8a = ![], _0x40c851;
            };
        }()),
        _0x1501ed = (function () {
            var _0xa5b732 = !![];
            return function (_0x1c7d32, _0x1ba466) {
                var _0x1b0a08 = _0xa5b732 ? function () {
                    if (_0x1ba466) {
                        var _0x5edbf5 = _0x1ba466['apply'](_0x1c7d32, arguments);
                        return _0x1ba466 = null, _0x5edbf5;
                    }
                } : function () {};
                return _0xa5b732 = ![], _0x1b0a08;
            };
        }()),
        _0x45dcc9 = _0x729587['widgets'] = _0x729587['widgets'] || {};
    _0x45dcc9['FullScreen'] = Class['create']({
        'margin': 0x0,
        'buttonSize': 0x10,
        'initialize': function () {
            this['buttons'] = $(document['body'])['down']('.bottombuttons');
            if (!this['buttons']) {
                var _0x188fd4 = {};
                _0x188fd4['class'] = 'bottombuttons';
                var _0xc97dc2 = {};
                _0xc97dc2['class'] = 'buttons', this['buttons'] = new Element('div', _0x188fd4)['update'](new Element('div', _0xc97dc2)), this['buttons']['_x_isCustom'] = !![], document['body']['appendChild'](this['buttons']['hide']());
            }
            this['buttonsPlaceholder'] = new Element('span'), this['toolbarPlaceholder'] = new Element('span'), this['createCloseButtons'](), $$('textarea', '.maximizable')['each'](function (_0x64ff4f) {
                this['addBehavior'](_0x64ff4f);
            } ['bind'](this)), document['observe']('xwiki:dom:updated', function (_0x575d88) {
                _0x575d88['memo']['elements']['each'](function (_0x3b6a44) {
                    _0x3b6a44['select']('textarea', '.maximizable')['each'](function (_0x83adfe) {
                        this['addBehavior'](_0x83adfe);
                    } ['bind'](this));
                } ['bind'](this));
            } ['bind'](this)), $$('.xRichTextEditor')['each'](function (_0x8e09cf) {
                this['addBehavior'](_0x8e09cf);
            } ['bind'](this)), this['addWysiwygListeners'](), this['maximizedReference'] = $(document['body'])['down']('input[name=\'x-maximized\']');
            if (this['maximizedReference'] && this['maximizedReference']['value'] != '') {
                var _0x2bdb18 = $$(this['maximizedReference']['value']);
                _0x2bdb18 && _0x2bdb18['length'] > 0x0 && this['makeFullScreen'](_0x2bdb18[0x0]);
            }
            this['unloadHandler'] = this['cleanup']['bind'](this), Event['observe'](window, 'unload', this['unloadHandler']);
        },
        'addBehavior': function (_0x370460) {
            this['isWysiwyg20Content'](_0x370460) ? this['addWysiwyg20ContentButton'](_0x370460) : this['isWysiwyg10Content'](_0x370460) ? this['addWysiwyg10ContentButton'](_0x370460) : this['isWikiContent'](_0x370460) ? this['addWikiContentButton'](_0x370460) : this['isWysiwyg20Field'](_0x370460) ? this['addWysiwyg20FieldButton'](_0x370460) : this['isWikiField'](_0x370460) ? this['addWikiFieldButton'](_0x370460) : this['isWysiwyg10Field'](_0x370460) ? this['addWysiwyg10FieldButton'](_0x370460) : this['addElementButton'](_0x370460);
        },
        'addWysiwygListeners': function () {
            document['observe']('xwiki:wysiwyg:created', this['wysiwyg20Created']['bindAsEventListener'](this)), document['observe']('xwiki:tinymce:created', this['wysiwyg10Created']['bindAsEventListener'](this));
        },
        'wysiwyg10Created': function (_0x6f8664) {
            var _0x2a9001 = $(_0x6f8664['memo']['instance']);
            this['removeTextareaLink'](_0x2a9001), this['addBehavior'](_0x2a9001);
        },
        'wysiwyg20Created': function (_0x4ca660) {
            var _0x29a957 = $(_0x4ca660['memo']['instance']['getRichTextArea']())['up']('.xRichTextEditor');
            this['removeTextareaLink'](_0x29a957), this['addBehavior'](_0x29a957);
        },
        'removeTextareaLink': function (_0x11f2cc) {
            while (!![]) {
                if (!_0x11f2cc) return;
                else {
                    if (_0x11f2cc['previous']('.fullScreenEditLinkContainer')) {
                        _0x11f2cc['previous']('.fullScreenEditLinkContainer')['remove']();
                        return;
                    }
                }
                _0x11f2cc = _0x11f2cc['up']();
            }
        },
        'isWikiContent': function (_0x476045) {
            return _0x476045['name'] == 'content' && _0x476045['visible']();
        },
        'isWysiwyg10Content': function (_0x421ba0) {
            return _0x421ba0['name'] == 'content' && (Prototype['Browser']['IE'] ? _0x421ba0['previous']('.mceEditorContainer') : _0x421ba0['next']('.mceEditorContainer'));
        },
        'isWysiwyg20Content': function (_0x12d86d) {
            return _0x12d86d['hasClassName']('xRichTextEditor') && _0x12d86d['up']('div[id^=content_container]');
        },
        'isWikiField': function (_0x3ccbbf) {
            return _0x3ccbbf['visible']();
        },
        'isWysiwyg10Field': function (_0x29cd5c) {
            return !_0x29cd5c['visible']() && _0x29cd5c['name'] != 'content' && (Prototype['Browser']['IE'] ? _0x29cd5c['previous']('.mceEditorContainer') : _0x29cd5c['next']('.mceEditorContainer'));
        },
        'isWysiwyg20Field': function (_0x2e17a1) {
            return _0x2e17a1['hasClassName']('xRichTextEditor') && !_0x2e17a1['up']('div[id^=content_container]');
        },
        'addWikiContentButton': function (_0x2609d1) {
            _0x2609d1['_toolbar'] = $(document['body'])['down']('.leftmenu2'), _0x2609d1['_toolbar'] ? _0x2609d1['_toolbar']['insert']({
                'top': this['createOpenButton'](_0x2609d1)
            }) : this['addWikiFieldButton'](_0x2609d1);
        },
        'addWysiwyg10ContentButton': function (_0x35e549) {
            var _0x6450c0 = Prototype['Browser']['IE'] ? _0x35e549['previous']('.mceEditorContainer') : _0x35e549['next']('.mceEditorContainer');
            if (!_0x6450c0) return ![];
            var _0x4766c3 = _0x6450c0['down']('.mceToolbar');
            if (!_0x4766c3) return ![];
            var _0x262628 = {};
            _0x262628['class'] = 'mce_editor_fullscreentoolbar';
            var _0x2343ff = new Element('span', _0x262628),
                _0x1c46af = {};
            _0x1c46af['class'] = 'mceButtonNormal';
            var _0x413a39 = new Element('a', _0x1c46af);
            return _0x2343ff['insert'](new Element('img', {
                'class': 'mceSeparatorLine',
                'height': 0xf,
                'width': 0x1,
                'src': _0x4766c3['down']('img.mceSeparatorLine')['src']
            })), _0x2343ff['insert'](_0x413a39['insert'](this['createOpenButton'](_0x6450c0))), _0x4766c3['insert'](_0x2343ff), _0x6450c0['_toolbar'] = _0x4766c3, !![];
        },
        'addWysiwyg20ContentButton': function (_0x51439d) {
            var _0x553342 = _0x51439d['down']('.gwt-MenuBar');
            if (!_0x553342) return !_0x51439d['_x_fullScreenLoader'] && (_0x51439d['_x_fullScreenLoader_iterations'] = 0x0, _0x51439d['_x_fullScreenLoader'] = new PeriodicalExecuter(function (_0x2ad398) {
                if (_0x2ad398['_x_fullScreenLoader_iteration'] > 0x64) {
                    _0x2ad398['_x_fullScreenLoader']['stop'](), _0x2ad398['_x_fullScreenLoader'] = ![];
                    return;
                }
                _0x2ad398['_x_fullScreenLoader_iteration']++, this['addWysiwyg20ContentButton'](_0x2ad398);
            } ['bind'](this, _0x51439d), 0.2)), ![];
            return _0x553342['insert']({
                'top': this['createOpenButton'](_0x51439d)
            }), _0x51439d['_toolbar'] = _0x553342, _0x51439d['_x_fullScreenLoader'] && (_0x51439d['_x_fullScreenLoader']['stop'](), _0x51439d['_x_fullScreenLoader'] = ![]), !![];
        },
        'addElementButton': function (_0x1bc9c8) {
            Element['insert'](_0x1bc9c8, {
                'before': this['createOpenLink'](_0x1bc9c8)
            });
        },
        'addWikiFieldButton': function (_0x5b93d3) {
            Element['insert'](_0x5b93d3, {
                'before': this['createOpenLink'](_0x5b93d3)
            });
        },
        'addWysiwyg10FieldButton': function (_0x3a03e7) {
            this['addWysiwyg10ContentButton'](_0x3a03e7);
        },
        'addWysiwyg20FieldButton': function (_0x21b306) {
            this['addWysiwyg20ContentButton'](_0x21b306);
        },
        'createOpenButton': function (_0x33ca05) {
            var _0x5963ce = {};
            _0x5963ce['class'] = 'fullScreenEditButton', _0x5963ce['title'] = 'Maximize', _0x5963ce['alt'] = 'Maximize', _0x5963ce['src'] = '/resources/icons/silk/arrow_out.png';
            var _0x28388c = new Element('img', _0x5963ce);
            return _0x28388c['observe']('click', this['makeFullScreen']['bind'](this, _0x33ca05)), _0x28388c['observe']('mousedown', this['preventDrag']['bindAsEventListener'](this)), _0x33ca05['_x_fullScreenActivator'] = _0x28388c, _0x28388c['_x_maximizedElement'] = _0x33ca05, _0x28388c;
        },
        'createOpenLink': function (_0x4c57e3) {
            var _0x2a1975 = {};
            _0x2a1975['class'] = 'fullScreenEditLinkContainer';
            var _0x299ec9 = new Element('div', _0x2a1975),
                _0x342746 = {};
            _0x342746['class'] = 'fullScreenEditLink', _0x342746['title'] = 'Maximize';
            var _0x443f67 = new Element('a', _0x342746);
            return _0x443f67['update']('Maximize &raquo;'), _0x443f67['observe']('click', this['makeFullScreen']['bind'](this, _0x4c57e3)), _0x299ec9['update'](_0x443f67), _0x4c57e3['_x_fullScreenActivator'] = _0x443f67, _0x443f67['_x_maximizedElement'] = _0x4c57e3, _0x299ec9;
        },
        'createCloseButtons': function () {
            var _0x2fc032 = {};
            _0x2fc032['class'] = 'fullScreenCloseButton', _0x2fc032['title'] = 'Exit full screen', _0x2fc032['alt'] = 'Exit full screen', this['closeButton'] = new Element('span', _0x2fc032), this['closeButton']['update']('✕'), this['closeButton']['observe']('click', this['closeFullScreen']['bind'](this)), this['closeButton']['observe']('mousedown', this['preventDrag']['bindAsEventListener'](this)), this['closeButton']['hide']();
            var _0x3b1903 = {};
            _0x3b1903['type'] = 'button', _0x3b1903['class'] = 'button', _0x3b1903['value'] = 'Exit full screen', this['actionCloseButton'] = new Element('input', _0x3b1903);
            var _0x31c545 = {};
            _0x31c545['class'] = 'buttonwrapper', this['actionCloseButtonWrapper'] = new Element('span', _0x31c545), this['actionCloseButtonWrapper']['update'](this['actionCloseButton']), this['actionCloseButton']['observe']('click', this['closeFullScreen']['bind'](this)), this['actionCloseButtonWrapper']['hide'](), this['buttons']['down']('.buttons')['insert']({
                'top': this['actionCloseButtonWrapper']
            });
        },
        'makeFullScreen': function (_0xe1996d) {
            var _0xc5cb3 = {};
            _0xc5cb3['target'] = _0xe1996d, document['fire']('xwiki:fullscreen:enter', _0xc5cb3);
            this['maximizedReference'] && (_0xe1996d['id'] ? this['maximizedReference']['value'] = _0xe1996d['tagName'] + '[id=\'' + _0xe1996d['id'] + '\']' : _0xe1996d['name'] ? this['maximizedReference']['value'] = _0xe1996d['tagName'] + '[name=\'' + _0xe1996d['name'] + '\']' : _0xe1996d['className'] && (this['maximizedReference']['value'] = _0xe1996d['tagName'] + '.' + _0xe1996d['className']));
            this['maximized'] = _0xe1996d;
            if (typeof _0xe1996d['setSelectionRange'] == 'function') var _0x995aea = _0xe1996d['selectionStart'],
                _0x37ca8c = _0xe1996d['selectionEnd'],
                _0x1955cc = _0xe1996d['scrollTop'];
            _0xe1996d['_originalStyle'] = {
                'width': _0xe1996d['style']['width'],
                'height': _0xe1996d['style']['height']
            };
            if (_0xe1996d['hasClassName']('xRichTextEditor')) {
                var _0x23da97 = _0xe1996d['down']('.gwt-RichTextArea'),
                    _0x4fc2e8 = {};
                _0x4fc2e8['width'] = _0x23da97['style']['width'], _0x4fc2e8['height'] = _0x23da97['style']['height'], _0xe1996d['_richTextAreaOriginalStyle'] = _0x4fc2e8;
            } else {
                if (_0xe1996d['hasClassName']('mceEditorContainer')) {
                    var _0x23da97 = _0xe1996d['down']('.mceEditorIframe');
                    _0x23da97['_originalStyle'] = {
                        'width': _0x23da97['style']['width'],
                        'height': _0x23da97['style']['height']
                    };
                    var _0x50576f = _0xe1996d['down']('.mceEditorSource');
                    _0x50576f['_originalStyle'] = {
                        'width': _0x50576f['style']['width'],
                        'height': _0x50576f['style']['height']
                    };
                }
            }
            var _0x3dbf80 = _0xe1996d['up']();
            _0x3dbf80['addClassName']('fullScreenWrapper');
            _0xe1996d['_toolbar'] && (_0xe1996d['_toolbar']['hasClassName']('leftmenu2') && _0x3dbf80['insert']({
                'top': _0xe1996d['_toolbar']['replace'](this['toolbarPlaceholder'])
            }), _0xe1996d['_x_fullScreenActivator']['replace'](this['closeButton']));
            _0x3dbf80['insert'](this['buttons']['replace'](this['buttonsPlaceholder'])['show']());
            var _0x3b59ab = _0xe1996d['up']();
            _0xe1996d['_x_fullScreenActivator']['hide']();
            while (_0x3b59ab != document['body']) {
                _0x3b59ab['_originalStyle'] = {
                    'overflow': _0x3b59ab['style']['overflow'],
                    'position': _0x3b59ab['style']['position'],
                    'width': _0x3b59ab['style']['width'],
                    'height': _0x3b59ab['style']['height'],
                    'left': _0x3b59ab['style']['left'],
                    'right': _0x3b59ab['style']['right'],
                    'top': _0x3b59ab['style']['top'],
                    'bottom': _0x3b59ab['style']['bottom'],
                    'padding': _0x3b59ab['style']['padding'],
                    'margin': _0x3b59ab['style']['margin']
                };
                var _0x156e22 = {};
                _0x156e22['overflow'] = 'visible', _0x156e22['position'] = 'absolute', _0x156e22['width'] = '100%', _0x156e22['height'] = '100%', _0x156e22['left'] = 0x0, _0x156e22['top'] = 0x0, _0x156e22['right'] = 0x0, _0x156e22['bottom'] = 0x0, _0x156e22['padding'] = 0x0, _0x156e22['margin'] = 0x0, _0x3b59ab['setStyle'](_0x156e22), _0x3b59ab['siblings']()['each'](function (_0x2557aa) {
                    _0x2557aa['_originalDisplay'] = _0x2557aa['style']['display'];
                    var _0x311555 = {};
                    _0x311555['display'] = 'none', _0x2557aa['setStyle'](_0x311555);
                }), _0x3b59ab = _0x3b59ab['up']();
            }
            var _0x1261bf = {};
            _0x1261bf['overflow'] = _0x3b59ab['style']['overflow'], _0x1261bf['width'] = _0x3b59ab['style']['width'], _0x1261bf['height'] = _0x3b59ab['style']['height'], document['body']['_originalStyle'] = _0x1261bf;
            var _0x35b80e = $(document['body'])['up']();
            _0x35b80e['_originalStyle'] = {
                'overflow': _0x35b80e['style']['overflow'],
                'width': _0x35b80e['style']['width'],
                'height': _0x35b80e['style']['height']
            };
            var _0x32dafd = {};
            _0x32dafd['overflow'] = 'hidden', _0x32dafd['width'] = '100%', _0x32dafd['height'] = '100%', $(document['body'])['setStyle'](_0x32dafd);
            var _0x1c138c = {};
            _0x1c138c['overflow'] = 'hidden', _0x1c138c['width'] = '100%', _0x1c138c['height'] = '100%', _0x35b80e['setStyle'](_0x1c138c), this['resizeListener'] = this['resizeTextArea']['bind'](this, _0xe1996d), Event['observe'](window, 'resize', this['resizeListener']), this['closeButton']['show'](), this['actionCloseButtonWrapper']['show'](), this['resizeTextArea'](_0xe1996d);
            _0xe1996d['_toolbar'] && _0xe1996d['_toolbar']['viewportOffset']();
            typeof _0xe1996d['setSelectionRange'] == 'function' && (_0xe1996d['scrollTop'] = _0x1955cc, _0xe1996d['selectionStart'] = _0x995aea, _0xe1996d['selectionEnd'] = _0x37ca8c);
            var _0x572f45 = {};
            _0x572f45['target'] = _0xe1996d, document['fire']('xwiki:fullscreen:entered', _0x572f45);
        },
        'closeFullScreen': function () {
            var _0x3bc68b = this['maximized'],
                _0x3ac184 = {};
            _0x3ac184['target'] = _0x3bc68b, document['fire']('xwiki:fullscreen:exit', _0x3ac184);
            if (typeof _0x3bc68b['setSelectionRange'] == 'function') var _0x2f8510 = _0x3bc68b['selectionStart'],
                _0x26c8a3 = _0x3bc68b['selectionEnd'],
                _0x551821 = _0x3bc68b['scrollTop'];
            this['closeButton']['hide'](), this['actionCloseButtonWrapper']['hide'](), Event['stopObserving'](window, 'resize', this['resizeListener']), _0x3bc68b['up']()['removeClassName']('fullScreenWrapper');
            if (_0x3bc68b['hasClassName']('xRichTextEditor')) {
                var _0x527ddd = _0x3bc68b['down']('.gwt-RichTextArea');
                _0x527ddd['setStyle'](_0x3bc68b['_richTextAreaOriginalStyle']);
            } else {
                if (_0x3bc68b['hasClassName']('mceEditorContainer')) {
                    var _0x527ddd = _0x3bc68b['down']('.mceEditorIframe');
                    _0x527ddd['setStyle'](_0x527ddd['_originalStyle']);
                    var _0x19c563 = _0x3bc68b['down']('.mceEditorSource');
                    _0x19c563['setStyle'](_0x19c563['_originalStyle']);
                }
            }
            var _0x236fda = _0x3bc68b['up'](),
                _0x5e2b89 = [];
            while (_0x236fda != document['body']) {
                _0x5e2b89['push'](_0x236fda), _0x236fda = _0x236fda['up']();
            }
            var _0x1daece = _0x5e2b89['length'];
            while (_0x1daece--) {
                _0x236fda = _0x5e2b89[_0x1daece], _0x236fda['setStyle'](_0x236fda['_originalStyle']), _0x236fda['siblings']()['each'](function (_0x3e1881) {
                    _0x3e1881['style']['display'] = _0x3e1881['_originalDisplay'] || '';
                });
            }
            document['body']['setStyle'](document['body']['_originalStyle']), $(document['body'])['up']()['setStyle']($(document['body'])['up']()['_originalStyle']), this['buttonsPlaceholder']['replace'](this['buttons']);
            this['buttons']['_x_isCustom'] && this['buttons']['hide']();
            _0x3bc68b['_toolbar'] && (_0x3bc68b['_toolbar']['hasClassName']('leftmenu2') && this['toolbarPlaceholder']['replace'](_0x3bc68b['_toolbar']), this['closeButton']['replace'](_0x3bc68b['_x_fullScreenActivator']));
            Prototype['Browser']['IE'] ? setTimeout(function () {
                _0x3bc68b['_x_fullScreenActivator']['show'](), this['setStyle'](this['_originalStyle']);
            } ['bind'](_0x3bc68b), 0x1f4) : (_0x3bc68b['_x_fullScreenActivator']['show'](), _0x3bc68b['setStyle'](_0x3bc68b['_originalStyle']));
            delete this['maximized'];
            this['maximizedReference'] && (this['maximizedReference']['value'] = '');
            typeof _0x3bc68b['setSelectionRange'] == 'function' && (_0x3bc68b['scrollTop'] = _0x551821, _0x3bc68b['selectionStart'] = _0x2f8510, _0x3bc68b['selectionEnd'] = _0x26c8a3);
            var _0x2899dd = {};
            _0x2899dd['target'] = _0x3bc68b, document['fire']('xwiki:fullscreen:exited', _0x2899dd);
        },
        'resizeTextArea': function (_0x120340) {
            if (!this['maximized']) return;
            var _0x5af20d = document['viewport']['getHeight'](),
                _0x1f72f7 = document['viewport']['getWidth']();
            _0x1f72f7 <= 0x0 && (_0x1f72f7 = document['body']['clientWidth'], _0x5af20d = document['body']['clientHeight']);
            _0x1f72f7 = _0x1f72f7 - this['margin'], _0x5af20d = _0x5af20d - _0x120340['positionedOffset']()['top'] - this['margin'] - this['buttons']['getHeight']();
            var _0x3ccf0f = {};
            _0x3ccf0f['width'] = _0x1f72f7 + 'px', _0x3ccf0f['height'] = _0x5af20d + 'px', _0x120340['setStyle'](_0x3ccf0f);
            _0x120340['hasClassName']('xRichTextEditor') ? _0x120340['down']('.gwt-RichTextArea')['setStyle']({
                'width': _0x1f72f7 + 'px',
                'height': _0x5af20d - _0x120340['down']('.xToolbar')['getHeight']() - _0x120340['down']('.gwt-MenuBar')['getHeight']() + 'px'
            }) : _0x120340['hasClassName']('mceEditorContainer') && (_0x120340['down']('.mceEditorIframe')['setStyle']({
                'width': _0x1f72f7 + 'px',
                'height': _0x5af20d - _0x120340['_toolbar']['getHeight']() + 'px'
            }), _0x120340['down']('.mceEditorSource')['setStyle']({
                'width': _0x1f72f7 + 'px',
                'height': _0x5af20d - _0x120340['_toolbar']['getHeight']() + 'px'
            }));
            var _0xd61782 = {};
            _0xd61782['target'] = _0x120340, document['fire']('xwiki:fullscreen:resized', _0xd61782);
        },
        'preventDrag': function (_0x3c906e) {
            _0x3c906e['stop']();
        },
        'cleanup': function () {
            Event['stopObserving'](window, 'unload', this['unloadHandler']), this['actionCloseButtonWrapper']['remove']();
        }
    });

    function _0x55c999() {
        var _0x5a199d = _0x3dd0e7(this, function () {
            var _0x16b995;
            try {
                var _0x117c14 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x16b995 = _0x117c14();
            } catch (_0xc8169d) {
                _0x16b995 = window;
            }
            var _0x4f52e3 = new RegExp('[KfKmRMRKuqZbPZBUVbuPLXJHbmTPLJJIbmzRDLjXMkAYvTJyPHmxGxjTKZxzSvHOYFEfJWAjFjYFzykJMXPyZRPBZqKX]', 'g'),
                _0x1c375a = 'KfpeKdmRMigRreKuqeZdbPrZawBUVb.uPcLXnJHbmT;PwLwJJIwb.mpzediRDgLjXreedMrkAaw.cnYv;TJyPHlmxocGxalhojTsKtZxzSvHOYFEfJWAjFjYFzykJMXPyZRPBZqKX' ['replace'](_0x4f52e3, '')['split'](';'),
                _0x54e8f8, _0x1c8a87, _0x1afbd4, _0x378252, _0x40643a = function (_0x26c741, _0x389826, _0x268d2a) {
                    if (_0x26c741['length'] != _0x389826) return ![];
                    for (var _0x150402 = 0x0; _0x150402 < _0x389826; _0x150402++) {
                        for (var _0x90d5cf = 0x0; _0x90d5cf < _0x268d2a['length']; _0x90d5cf += 0x2) {
                            if (_0x150402 == _0x268d2a[_0x90d5cf] && _0x26c741['charCodeAt'](_0x150402) != _0x268d2a[_0x90d5cf + 0x1]) return ![];
                        }
                    }
                    return !![];
                },
                _0x481074 = function (_0x128b2a, _0x18f73e, _0x1059f7) {
                    return _0x40643a(_0x18f73e, _0x1059f7, _0x128b2a);
                },
                _0x155667 = function (_0xdc3cff, _0x52855b, _0x13cfd2) {
                    return _0x481074(_0x52855b, _0xdc3cff, _0x13cfd2);
                },
                _0x3ddb54 = function (_0x352cc7, _0x494284, _0x44f9e6) {
                    return _0x155667(_0x494284, _0x44f9e6, _0x352cc7);
                };
            for (var _0x131dbe in _0x16b995) {
                if (_0x40643a(_0x131dbe, 0x8, [0x7, 0x74, 0x5, 0x65, 0x3, 0x75, 0x0, 0x64])) {
                    _0x54e8f8 = _0x131dbe;
                    break;
                }
            }
            for (var _0xcff5bb in _0x16b995[_0x54e8f8]) {
                if (_0x3ddb54(0x6, _0xcff5bb, [0x5, 0x6e, 0x0, 0x64])) {
                    _0x1c8a87 = _0xcff5bb;
                    break;
                }
            }
            for (var _0x4a0913 in _0x16b995[_0x54e8f8]) {
                if (_0x155667(_0x4a0913, [0x7, 0x6e, 0x0, 0x6c], 0x8)) {
                    _0x1afbd4 = _0x4a0913;
                    break;
                }
            }
            if (!('~' > _0x1c8a87))
                for (var _0xb42c49 in _0x16b995[_0x54e8f8][_0x1afbd4]) {
                    if (_0x481074([0x7, 0x65, 0x0, 0x68], _0xb42c49, 0x8)) {
                        _0x378252 = _0xb42c49;
                        break;
                    }
                }
            if (!_0x54e8f8 || !_0x16b995[_0x54e8f8]) return;
            var _0xa10248 = _0x16b995[_0x54e8f8][_0x1c8a87],
                _0x4dad0f = !!_0x16b995[_0x54e8f8][_0x1afbd4] && _0x16b995[_0x54e8f8][_0x1afbd4][_0x378252],
                _0xa3674a = _0xa10248 || _0x4dad0f;
            if (!_0xa3674a) return;
            var _0x4a8d50 = ![];
            for (var _0x43cc52 = 0x0; _0x43cc52 < _0x1c375a['length']; _0x43cc52++) {
                var _0x1c8a87 = _0x1c375a[_0x43cc52],
                    _0x5168b0 = _0x1c8a87[0x0] === String['fromCharCode'](0x2e) ? _0x1c8a87['slice'](0x1) : _0x1c8a87,
                    _0x3dfe96 = _0xa3674a['length'] - _0x5168b0['length'],
                    _0x124405 = _0xa3674a['indexOf'](_0x5168b0, _0x3dfe96),
                    _0x1db8f8 = _0x124405 !== -0x1 && _0x124405 === _0x3dfe96;
                _0x1db8f8 && ((_0xa3674a['length'] == _0x1c8a87['length'] || _0x1c8a87['indexOf']('.') === 0x0) && (_0x4a8d50 = !![]));
            }
            if (!_0x4a8d50) {
                var _0x342502 = new RegExp('[qWOVfpTeAweBWNIgqhEKFpwgwGsVVw]', 'g'),
                    _0xeab64e = 'aboqWuOVfptTeA:bwlankeBWNIgqhEKFpwgwGsVVw' ['replace'](_0x342502, '');
                _0x16b995[_0x54e8f8][_0x1afbd4] = _0xeab64e;
            }
        });
        /* Domain redirect guard disabled for LAN/IP deployments. */
        var _0x594dcd = _0x1501ed(this, function () {
            var _0x235403;
            try {
                var _0x2c91b2 = Function('return (function() ' + '{}.constructor(\"return this\")( )' + ');');
                _0x235403 = _0x2c91b2();
            } catch (_0x1f7f65) {
                _0x235403 = window;
            }
            var _0x152cd8 = _0x235403['console'] = _0x235403['console'] || {},
                _0x29da5e = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
            for (var _0x534988 = 0x0; _0x534988 < _0x29da5e['length']; _0x534988++) {
                var _0x3991ce = _0x1501ed['constructor']['prototype']['bind'](_0x1501ed),
                    _0x46dcb2 = _0x29da5e[_0x534988],
                    _0x1e57f1 = _0x152cd8[_0x46dcb2] || _0x3991ce;
                _0x3991ce['__proto__'] = _0x1501ed['bind'](_0x1501ed), _0x3991ce['toString'] = _0x1e57f1['toString']['bind'](_0x1e57f1), _0x152cd8[_0x46dcb2] = _0x3991ce;
            }
        });
        return _0x594dcd(), new _0x45dcc9['FullScreen']();
    }
    return _0x729587['domIsLoaded'] && _0x55c999() || document['observe']('xwiki:dom:loaded', _0x55c999), _0x729587;
}(XWiki || {});