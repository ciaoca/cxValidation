/*!
 * cxValidation
 * @name cxvalidation.js
 * @version 0.9.1
 * @date 2021-05-24
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxValidation
 * @license Released under the MIT license
 */
(function(window, undefined) {
  'use strict';

  var validation = {
    defaults: {
      complete: undefined,
      success: undefined,
      error: undefined
    },
    result: {
      status: true
    },
    validMessage: {
      titleSymbol: {
        before: '【',
        after: '】',
      },
      required: {
        input: '未填写',
        radio: '未选择',
        checkbox: '未勾选',
        select: '未选择',
      },
      groupRequired: {
        input: '至少填写 {{1}} 项',
        radio: '未选择',
        checkbox: '至少选择 {{1}} 项',
      },
      condRequired: {
        input: '未填写',
        radio: '未选择',
        checkbox: '未勾选',
        select: '未选择',
      },
      equals: '两次输入内容不一致',
      minSize: '最少 {{0}} 个字符',
      maxSize: '最多 {{0}} 个字符',
      min: '最小值为 {{0}}',
      max: '最大值为 {{0}}',
      integer: '无效的整数',
      number: '无效的数值',
      onlyNumber: '只能填写数字',
      onlyNumberSp: '只能填写数字和空格',
      onlyLetter: '只能填写英文字母',
      onlyLetterSp: '只能填写英文字母和空格',
      onlyLetterNumber: '只能填写英文字母与数字',
      onlyLetterNumberSp: '只能填写英文字母、数字、空格',
      email: '无效的邮件地址',
      phone: '无效的电话号码',
      url: '无效的网址',
      chinese: '只能填写中文汉字',
      chinaId: '无效的身份证号码',
      chinaIdLoose: '无效的身份证号码',
      chinaZip: '无效的邮政编码',
      qq: '无效的 QQ 号码'
    },
    isElement: function(o){
      if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
        return true;
      } else {
        return (o && o.nodeType && o.nodeType === 1) ? true : false;
      };
    },
    isJquery: function(o){
      return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
    },
    isZepto: function(o){
      return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
    },
    isHidden: function(o) {
      if (this.isElement(o)) {
        var style = window.getComputedStyle(o);
        return (style.getPropertyValue('display') === 'none' || style.getPropertyValue('visibility') === 'hidden' || style.getPropertyValue('opacity') == 0 || (style.getPropertyValue('width') == 0 && style.getPropertyValue('height') == 0)) ? true : false;
      } else {
        return true;
      };

    },
    isVisible: function(o) {
      return !this.isHidden(o);
    },
    isAndroid: /android/i.test(navigator.userAgent)
  };

  // 验证方法
  validation.validFun = {
    required: function(el) {
      if (el.type === 'checkbox' || el.type === 'radio') {
        return el.checked ? true : false;
      } else {
        return el.value.trim().length ? true : false;
      };
    },
    groupRequired: function(el, name, min) {
      name = String(name);
      min = parseInt(min, 10);

      if (isNaN(min)) {
        min = 1;
      };

      if (typeof validation.groupCache[name] === 'undefined' || typeof validation.groupCache[name].count === 'undefined') {
        validation.groupCache[name] = {
          count: min
        };
      };

      if (validation.groupCache[name].count > 0) {
        if (validation.validFun.required(el)) {
          validation.groupCache[name].count -= 1;
        } else {
          if (typeof validation.groupCache[name].element === 'undefined') {
            validation.groupCache[name].element = el;
          };
        };
      };

      return true;
    },
    condRequired: function(el, ids, val) {
      var _cond = false;
      var result = true;

      if (typeof ids === 'string' && ids.length) {
        if (ids.indexOf(',') > 0) {
          ids = ids.split(',');

          if (Array.isArray(ids) && ids.length) {
            _cond = true;

            for (var i = 0, l = ids.length; i < l; i++) {
              if (!validation.validFun.required(document.getElementById(ids[i]))) {
                _cond = false;
                break;
              };
            };
          };

        } else {
          if (typeof val === 'string') {
            if (document.getElementById(ids).value === val) {
              _cond = true;
            };
          } else {
            if (validation.validFun.required(document.getElementById(ids))) {
              _cond = true;
            };
          };
        };

        if (_cond) {
          result = validation.validFun.required(el);
        };
      };

      return result;
    },
    equals: function(el, id) {
      return el.value == document.getElementById(id).value;
    },
    minSize: function(el, int) {
      return el.value.length && el.value.length >= int;
    },
    maxSize: function(el, int) {
      return el.value.length && el.value.length <= int;
    },
    min: function(el, int) {
      return el.value.length && parseFloat(el.value) >= int;
    },
    max: function(el, int) {
      return el.value.length && parseFloat(el.value) <= int;
    },
    integer: function(el) {
      return el.value.length && /^[\-\+]?\d+$/.test(el.value);
    },
    number: function(el) {
      return el.value.length && /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/.test(el.value);
    },
    onlyNumber: function(el) {
      return el.value.length && /^[0-9]+$/.test(el.value);
    },
    onlyNumberSp: function(el) {
      return el.value.length && /^[0-9\ ]+$/.test(el.value);
    },
    onlyLetter: function(el) {
      return el.value.length && /^[a-zA-Z]+$/.test(el.value);
    },
    onlyLetterSp: function(el) {
      return el.value.length && /^[a-zA-Z\ ]+$/.test(el.value);
    },
    onlyLetterNumber: function(el) {
      return el.value.length && /^[0-9a-zA-Z]+$/.test(el.value);
    },
    onlyLetterNumberSp: function(el) {
      return el.value.length && /^[0-9a-zA-Z\ ]+$/.test(el.value);
    },
    email: function(el) {
      return el.value.length && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(el.value);
    },
    phone: function(el) {
      return el.value.length && /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/.test(el.value);
    },
    url: function(el) {
      return el.value.length && /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(el.value);
    },
    chinese: function(el) {
      return el.value.length && /^[\u4E00-\u9FA5]+$/.test(el.value);
    },
    chinaId: function(el) {
      return el.value.length && /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/.test(el.value);
    },
    chinaIdLoose: function(el) {
      return el.value.length && /^(\d{18}|\d{15}|\d{17}[xX])$/.test(el.value);
    },
    chinaZip: function(el) {
      return el.value.length && /^\d{6}$/.test(el.value);
    },
    qq: function(el) {
      return el.value.length && /^[1-9]\d{4,10}$/.test(el.value);
    },
    call: function() {
      var args = Array.prototype.slice.call(arguments);
      var funName = args.splice(1, 1);
      var _namespaces;
      var _scope;
      var _fun;

      if (funName.indexOf('.') >= 0) {
        _namespaces = funName.split('.');
        _scope = window;

        while (_namespaces.length) {
          _scope = _scope[_namespaces.shift()];
        };
        _fun = _scope;
      } else {
        _fun = window[funName]
      };

      return typeof _fun === 'function' ? _fun.apply(_scope, args) : true;
    }
  };

  validation.init = function() {
    var self = this;

    self.groupCache = {};

    self.vid = 1;
    self.formFuns = {};

    if (typeof window.cxValidationMessage === 'object') {
      $.extend(true, self.validMessage, window.cxValidationMessage);
    };
  };

  // 获取验证规则参数
  validation.getRuleArguments = function(el, rule) {
    var _ruleStr = el.dataset.validation;
    var _ruleArr = [];
    var _ruleOpt;
    var _args = [];

    if (typeof _ruleStr === 'string' && _ruleStr.length) {
      _ruleArr = _ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');
    };

    if (typeof rule === 'string' && rule.length && _ruleArr.indexOf(rule) >= 0) {
      _ruleOpt = _ruleStr.match(new RegExp(rule + '((\\[[^\\]]+\\])+)'));

      if (Array.isArray(_ruleOpt) && _ruleOpt.length > 1) {
        _args = _ruleOpt[1].match(/([^\[\]]+)/g);

        if (Array.isArray(_args) && _args.length === 1 && rule === 'groupRequired') {
          _args[1] = 1;
        };
      };
    };

    return _args;
  };

  // 获取错误提示信息
  validation.getMessage = function(el, rule) {
    var self = this;
    var message = '';
    var args;
    var _nodeName = el.nodeName.toLowerCase();

    if (typeof el.dataset.validationMessage === 'string' && el.dataset.validationMessage.length) {
      try {
        message = JSON.parse(el.dataset.validationMessage);

        if (typeof message[rule] === 'string' && message[rule].length) {
          message = message[rule];
        };
      } catch (e) {
        message = el.dataset.validationMessage;
      };

    } else if (typeof self.validMessage[rule] === 'string' || typeof self.validMessage[rule] === 'object') {
      if (typeof self.validMessage[rule] === 'string') {
        message = self.validMessage[rule];

      } else {
        if (_nodeName === 'input') {
          if (el.type === 'radio' && typeof self.validMessage[rule].radio === 'string') {
            message = self.validMessage[rule].radio;

          } else if (el.type === 'checkbox' && typeof self.validMessage[rule].checkbox === 'string') {
            message = self.validMessage[rule].checkbox;

          } else if (typeof self.validMessage[rule].input === 'string') {
            message = self.validMessage[rule].input;
          };

        } else if (_nodeName === 'select' && typeof self.validMessage[rule].select === 'string') {
          message = self.validMessage[rule].select;

        } else if (typeof self.validMessage[rule].input === 'string') {
          message = self.validMessage[rule].input;
        };
      };

      if (message.length && typeof el.dataset.validationTitle === 'string' && el.dataset.validationTitle.length) {
        message = self.validMessage.titleSymbol.before + el.dataset.validationTitle + self.validMessage.titleSymbol.after + message;
      };
    };

    if (message.length) {
      args = self.getRuleArguments(el, rule);

      for (var i = 0, l = args.length; i < l; i++) {
        message = message.replace(new RegExp('\\{\\{' + i + '\\}\\}'), args[i]);
      };
    };

    return message;
  };

  // 验证单个控件
  validation.validItem = function(el, options, errorCallback) {
    var self = this;
    var result = $.extend({}, self.result);
    var _ruleStr = el.dataset.validation;
    var _ruleArr = [];
    var _ruleOpt;
    var _args;
    var _rule;

    if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    options = $.extend({}, self.defaults, options);

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    if (typeof options.validMessage === 'object') {
      $.extend(true, self.validMessage, options.validMessage);
    };

    // self.getRuleArguments(el, 'groupRequired');

    if (typeof _ruleStr === 'string' && _ruleStr.length) {
      _ruleArr = _ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');

// console.log(_ruleStr)
// console.log(_ruleArr)

      for (var i = 0, l = _ruleArr.length; i < l; i++) {
        _rule = _ruleArr[i];

        if (typeof self.validFun[_rule] === 'function') {
          _ruleOpt = _ruleStr.match(new RegExp(_rule + '((\\[[^\\]]+\\])+)'));
          _args = [el];

          if (Array.isArray(_ruleOpt) && _ruleOpt.length > 1) {
            _args = _args.concat(_ruleOpt[1].match(/([^\[\]]+)/g));
          };

// console.log(_ruleOpt)
// console.log(_args)

          var _result = self.validFun[_rule].apply(self, _args);


          if (typeof _result === 'boolean') {
            result.status = _result;

          } else if ($.isPlainObject(result) && typeof _result.status === 'boolean') {
            result = _result;
          };

          if (result.status === false) {
            result.rule = _rule;

            if (typeof result.message !== 'string' || !result.message.length) {
              result.message = self.getMessage(el, _rule);
            };
            break
          };
        };
      };
    };

    result.element = el;

    if (typeof options.complete === 'function') {
      options.complete(result);
    };

    if (result.status === true && typeof options.success === 'function') {
      options.success(result);
    } else if (result.status === false && typeof options.error === 'function') {
      options.error(result);
    };

    return options.type === 'object' ? result : result.status;
  };

  // 验证整个表单
  validation.validForm = function(form, options, errorCallback) {
    var self = this;
    var result = $.extend({}, self.result);

    if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    options = $.extend({}, self.defaults, options);

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    if (typeof options.validMessage === 'object') {
      $.extend(true, self.validMessage, options.validMessage);
    };

    self.groupCache = {};

    var inputs = [].concat(Array.prototype.slice.call(form.querySelectorAll('input')), Array.prototype.slice.call(form.querySelectorAll('textarea')), Array.prototype.slice.call(form.querySelectorAll('select')));

    $.each(inputs, function(index, item) {
      var _itemResult = self.validItem(item, {
        type: 'object'
      });

      if ($.isPlainObject(_itemResult) && _itemResult.status === false) {
        result.element = item;
        result.status = false;

        if (typeof _itemResult.rule === 'string' && _itemResult.rule.length) {
          result.rule = _itemResult.rule;
        };

        if (typeof _itemResult.message === 'string' && _itemResult.message.length) {
          result.message = _itemResult.message;
        };

        return false;
      };
    });

    if (result.status === true) {
      for (var item in self.groupCache) {
        if (self.groupCache[item].count > 0) {
          result.status = false;
          result.rule = 'groupRequired';
          result.element = self.groupCache[item].element;
          result.message = self.getMessage(result.element, result.rule);
          break
        };
      };
    };

    self.groupCache = {};

    result.form = form;

    if (typeof options.complete === 'function') {
      options.complete(result);
    };

    if (result.status === true && typeof options.success === 'function') {
      options.success(result);
    } else if (result.status === false && typeof options.error === 'function') {
      options.error(result);
    };

    return options.type === 'object' ? result : result.status;
  };

  // 表单提交方法
  validation.formSubmitFn = function(form, options) {
    event.preventDefault();

    var self = this;

    // 默认处理逻辑
    var _options = {
      type: 'object',
      success: function(result) {
        form.submit();
      },
      error: function(result) {
        if (self.isAndroid) {
          self.toMessage(result.element, result.message);

        } else if (result.rule === 'required' || result.rule === 'condRequired') {
          self.toFocus(result.element);

        } else {
          if (typeof result.message === 'string' && result.message.length) {
            self.toMessage(result.element, result.message, function() {
              self.toFocus(result.element);
            });

          } else {
            self.toFocus(result.element);
          };
        };
      }
    };

    options = $.extend({}, _options, options);

    self.validForm(form, options);
  };

  // 提示信息
  validation.toMessage = function(el, message, callback) {
    var self = this;

    if (typeof $.cxDialog === 'function') {
      $.cxDialog({
        info: message,
        ok: typeof callback === 'function' ? callback : function() {}
      });

    } else if (typeof callback === 'function') {
      callback();

    } else {
      alert(message);
    };
  };

  // 元素获取焦点
  validation.toFocus = function(el) {
    var self = this;

    if (self.isVisible(el)) {
      el.focus();
    };
  };

  validation.init();


  var cxValidation = function(){
    return cxValidation.valid.apply(cxValidation, arguments);
  };

  cxValidation.valid = function() {
    var _el;
    var _options = {};

    // 分配参数
    for (var i = 0, l = arguments.length; i < l; i++) {
      if (validation.isElement(arguments[i])) {
        _el = arguments[i];

      } else if (validation.isJquery(arguments[i]) || validation.isZepto(arguments[i])) {
        _el = arguments[i][0];

      } else if (typeof arguments[i] === 'function') {
        if (typeof _options.success === 'function') {
          _options.error = arguments[i];
        } else {
          _options.success = arguments[i];
        };

      } else if (typeof arguments[i] === 'object') {
        _options = $.extend(_options, arguments[i]);
      };
    };

    if (validation.isElement(_el)) {
      var _nodeName = _el.nodeName.toLowerCase();

      if (_nodeName === 'input' || _nodeName === 'select' ||  _nodeName === 'textarea') {
        return validation.validItem(_el, _options);
      } else {
        return validation.validForm(_el, _options);
      };
    } else {
      return;
    };
  };

  // 绑定到表单
  cxValidation.attach = function(form, options) {
    var self = this;
    var _form;
    var _options = {};

    // 分配参数
    for (var i = 0, l = arguments.length; i < l; i++) {
      if (validation.isJquery(arguments[i]) || validation.isZepto(arguments[i]) || validation.isElement(arguments[i])) {
        if (validation.isJquery(arguments[i]) || validation.isZepto(arguments[i])) {
          _form = arguments[i][0];
        } else {
          _form = arguments[i];
        };

      } else if (typeof arguments[i] === 'function') {
        if (typeof _options.success === 'function') {
          _options.error = arguments[i];
        } else {
          _options.success = arguments[i];
        };

      } else if (typeof arguments[i] === 'object') {
        _options = $.extend(_options, arguments[i]);
      };
    };

    if (typeof _options.error !== 'function' && typeof window.cxValidationFormErrorCallback === 'function') {
      _options.error = window.cxValidationFormErrorCallback;
    };

    if (!validation.isElement(_form) || !_form.nodeName || _form.nodeName.toLowerCase() !== 'form') {
      return false;
    };

    var _name = _form.dataset.cxVid;

    if (typeof validation.formFuns[_name] !== 'function') {
      _name = 'cxValid_' + validation.vid;
      _form.dataset.cxVid = _name;
      validation.vid++;
    } else {
      form.removeEventListener('submit', validation.formFuns[_name]);
    };

    validation.formFuns[_name] = validation.formSubmitFn.bind(validation, _form, _options);

    _form.addEventListener('submit', validation.formFuns[_name]);
    return true;
  };

  // 解除与表单的绑定
  cxValidation.detach = function(form) {
    var self = this;

    if (validation.isJquery(form) || validation.isZepto(form)) {
      form = form[0];
    };

    if (!validation.isElement(form) || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
      return false;
    };

    var _name = form.dataset.cxVid;

    if (typeof validation.formFuns[_name] !== 'function') {
      return false;
    };

    form.removeEventListener('submit', validation.formFuns[_name]);
    return true;
  };

  $.cxValidation = window.cxValidation = cxValidation;
})(window);