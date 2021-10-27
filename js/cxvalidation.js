/*!
 * cxValidation
 * 
 * @version 1.0.0
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxValidation
 * @license Released under the MIT license
 */
(function(window, undefined) {
  'use strict';

  var validation = {
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
    result: {
      status: true
    },
    vid: 1,
    formFuns: {},
    groupCache: {},

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
  };

  validation.init = function() {
    var self = this;

    // 默认表单验证处理逻辑
    self.defaults = {
      success: function(result) {
        result.form.submit();
      },
      error: function(result) {
        var nodeName = result.element.nodeName.toLowerCase();

        if (result.rule === 'required' || result.rule === 'condRequired') {
          if (nodeName === 'input' && ['radio','checkbox','color','range','file'].indexOf(result.element.type) >= 0) {
            self.toMessage(result.message);
          } else {
            self.toFocus(result.element);
          };

        } else {
          self.toMessage(result.message);
        };
      }
    };
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
      var self = this;
      name = String(name);
      min = parseInt(min, 10);

      if (isNaN(min)) {
        min = 1;
      };

      if (typeof self.groupCache[name] === 'undefined' || typeof self.groupCache[name].count === 'undefined') {
        self.groupCache[name] = {
          count: min
        };
      };

      if (self.groupCache[name].count > 0) {
        if (self.validFun.required(el)) {
          self.groupCache[name].count -= 1;
        } else {
          if (typeof self.groupCache[name].element === 'undefined') {
            self.groupCache[name].element = el;
          };
        };
      };

      return true;
    },
    condRequired: function(el, ids, val) {
      var self = this;
      var hasCond = false;
      var result = true;

      if (typeof ids === 'string' && ids.length) {
        if (ids.indexOf(',') > 0) {
          ids = ids.split(',');

          if (Array.isArray(ids) && ids.length) {
            hasCond = true;

            for (var i = 0, l = ids.length; i < l; i++) {
              if (!self.validFun.required(document.getElementById(ids[i]))) {
                hasCond = false;
                break;
              };
            };
          };

        } else {
          if (typeof val === 'string') {
            if (document.getElementById(ids).value === val) {
              hasCond = true;
            };
          } else {
            if (self.validFun.required(document.getElementById(ids))) {
              hasCond = true;
            };
          };
        };

        if (hasCond) {
          result = self.validFun.required(el);
        };
      };

      return result;
    },
    equals: function(el, id) {
      return el.value == document.getElementById(id).value;
    },
    minSize: function(el, int) {
      return el.value.length ? el.value.length >= int : true;
    },
    maxSize: function(el, int) {
      return el.value.length ? el.value.length <= int : true;
    },
    min: function(el, int) {
      return el.value.length ? parseFloat(el.value) >= int : true;
    },
    max: function(el, int) {
      return el.value.length ? parseFloat(el.value) <= int : true;
    },
    integer: function(el) {
      return el.value.length ? /^[\-\+]?\d+$/.test(el.value) : true;
    },
    number: function(el) {
      return el.value.length ? /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/.test(el.value) : true;
    },
    onlyNumber: function(el) {
      return el.value.length ? /^[0-9]+$/.test(el.value) : true;
    },
    onlyNumberSp: function(el) {
      return el.value.length ? /^[0-9\ ]+$/.test(el.value) : true;
    },
    onlyLetter: function(el) {
      return el.value.length ? /^[a-zA-Z]+$/.test(el.value) : true;
    },
    onlyLetterSp: function(el) {
      return el.value.length ? /^[a-zA-Z\ ]+$/.test(el.value) : true;
    },
    onlyLetterNumber: function(el) {
      return el.value.length ? /^[0-9a-zA-Z]+$/.test(el.value) : true;
    },
    onlyLetterNumberSp: function(el) {
      return el.value.length ? /^[0-9a-zA-Z\ ]+$/.test(el.value) : true;
    },
    email: function(el) {
      return el.value.length ? /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(el.value) : true;
    },
    phone: function(el) {
      return el.value.length ? /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/.test(el.value) : true;
    },
    url: function(el) {
      return el.value.length ? /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(el.value) : true;
    },
    chinese: function(el) {
      return el.value.length ? /^[\u4E00-\u9FA5]+$/.test(el.value) : true;
    },
    chinaId: function(el) {
      return el.value.length ? /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/.test(el.value) : true;
    },
    chinaIdLoose: function(el) {
      return el.value.length ? /^(\d{18}|\d{15}|\d{17}[xX])$/.test(el.value) : true;
    },
    chinaZip: function(el) {
      return el.value.length ? /^\d{6}$/.test(el.value) : true;
    },
    qq: function(el) {
      return el.value.length ? /^[1-9]\d{4,10}$/.test(el.value) : true;
    },
    call: function() {
      var args = Array.prototype.slice.call(arguments);
      var spaces = args.splice(1, 1);
      var scope = window;

      if (spaces.indexOf('.') >= 0) {
        spaces = spaces.split('.');

        while (spaces.length) {
          scope = scope[spaces.shift()];
        };

      } else {
        scope = scope[spaces];
      };

      return typeof scope === 'function' ? scope.apply(scope, args) : true;
    }
  };

  // 获取验证规则参数
  validation.getRuleArguments = function(el, rule) {
    var ruleStr = el.dataset.validation;
    var ruleArr = [];
    var ruleOpt;
    var args = [];

    if (typeof ruleStr === 'string' && ruleStr.length) {
      ruleArr = ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');
    };

    if (typeof rule === 'string' && rule.length && ruleArr.indexOf(rule) >= 0) {
      ruleOpt = ruleStr.match(new RegExp(rule + '((\\[[^\\]]+\\])+)'));

      if (Array.isArray(ruleOpt) && ruleOpt.length > 1) {
        args = ruleOpt[1].match(/([^\[\]]+)/g);

        if (Array.isArray(args) && args.length === 1 && rule === 'groupRequired') {
          args[1] = 1;
        };
      };
    };

    return args;
  };

  // 获取错误提示信息
  validation.getMessage = function(el, rule) {
    var self = this;
    var message = '';
    var args;
    var nodeName = el.nodeName.toLowerCase();

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
        if (nodeName === 'input') {
          if (el.type === 'radio' && typeof self.validMessage[rule].radio === 'string') {
            message = self.validMessage[rule].radio;

          } else if (el.type === 'checkbox' && typeof self.validMessage[rule].checkbox === 'string') {
            message = self.validMessage[rule].checkbox;

          } else if (typeof self.validMessage[rule].input === 'string') {
            message = self.validMessage[rule].input;
          };

        } else if (nodeName === 'select' && typeof self.validMessage[rule].select === 'string') {
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
  validation.validItem = function(el, reType) {
    var self = this;
    var result = $.extend({}, self.result);
    var ruleStr = el.dataset.validation;
    var ruleArr = [];
    var ruleOpt;
    var args;
    var rule;

    if (typeof ruleStr === 'string' && ruleStr.length) {
      ruleArr = ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');

      // console.log(ruleStr);
      // console.log(ruleArr);

      for (var i = 0, l = ruleArr.length; i < l; i++) {
        rule = ruleArr[i];

        if (typeof self.validFun[rule] === 'function') {
          ruleOpt = ruleStr.match(new RegExp(rule + '((\\[[^\\]]+\\])+)'));
          args = [el];

          if (Array.isArray(ruleOpt) && ruleOpt.length > 1) {
            args = args.concat(ruleOpt[1].match(/([^\[\]]+)/g));
          };

          // console.log(ruleOpt);
          // console.log(args);

          result = self.validFun[rule].apply(self, args);

          if (typeof result === 'boolean') {
            result = {
              status: result
            };
          };

          if ($.isPlainObject(result) && typeof result.status === 'boolean') {
            if (result.status === false) {
              result.rule = rule;

              if (typeof result.message !== 'string' || !result.message.length) {
                result.message = self.getMessage(el, rule);
              };

              break
            };
          };
        };
      };
    };

    result.element = el;

    return reType === true ? result : result.status;
  };

  // 验证整个表单
  validation.validForm = function(form, options, errorCallback) {
    var self = this;
    var result = $.extend({}, self.result);
    var reType = 'boolean';

    if (options === true) {
      reType = 'object';

    } else if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    options = $.extend({}, options);

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    var inputs = form.querySelectorAll('input,textarea,select');
    self.groupCache = {};

    $.each(inputs, function(index, item) {
      var itemResult = self.validItem(item, true);

      if (itemResult && itemResult.status === false) {
        result.status = false;
        result.element = item;

        if (typeof itemResult.rule === 'string' && itemResult.rule.length) {
          result.rule = itemResult.rule;
        };

        if (typeof itemResult.message === 'string' && itemResult.message.length) {
          result.message = itemResult.message;
        };

        return false;
      };
    });

    if (result && result.status === true) {
      for (var alias in self.groupCache) {
        if (self.groupCache[alias].count > 0) {
          result.status = false;
          result.rule = 'groupRequired';
          result.element = self.groupCache[alias].element;
          result.message = self.getMessage(result.element, result.rule);
          break;
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

    return reType === 'object' ? result : result.status;
  };

  // 表单提交方法
  validation.formSubmitFn = function(form, options) {
    event.preventDefault();
    var self = this;
    options = $.extend({}, self.defaults, options);
    self.validForm(form, options);
  };

  // 提示信息
  validation.toMessage = function(message) {
    var self = this;
    alert(message);
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

  cxValidation.setOptions = function(options) {
    $.extend(validation.defaults, options);
  };

  cxValidation.setLanguage = function(options) {
    $.extend(true, validation.validMessage, options);
  };

  cxValidation.valid = function(el, reType) {
    if (validation.isJquery(el) || validation.isZepto(el)) {
      el = el[0];
    };

    if (!validation.isElement(el)) {
      return false;
    };

    return el.nodeName.toLowerCase() === 'form' ? validation.validForm(el, reType) : validation.validItem(el, reType);
  };

  // 绑定到表单
  cxValidation.attach = function() {
    var self = this;
    var form;
    var options = {};

    // 分配参数
    for (var i = 0, l = arguments.length; i < l; i++) {
      if (validation.isElement(arguments[i])) {
        form = arguments[i];

      } else if (validation.isJquery(arguments[i]) || validation.isZepto(arguments[i])) {
        form = arguments[i][0];

      } else if (typeof arguments[i] === 'function') {
        if (typeof options.success === 'function') {
          options.error = arguments[i];
        } else {
          options.success = arguments[i];
        };

      } else if (typeof arguments[i] === 'object') {
        options = $.extend(options, arguments[i]);
      };
    };

    if (!validation.isElement(form) || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
      console.warn('[cxValidation] Not form element.');
      return false;
    };

    var alias = form.dataset.cxVid;

    if (typeof validation.formFuns[alias] !== 'function') {
      alias = 'cxValid_' + validation.vid;
      form.dataset.cxVid = alias;
      validation.vid++;
    } else {
      form.removeEventListener('submit', validation.formFuns[alias]);
    };

    validation.formFuns[alias] = validation.formSubmitFn.bind(validation, form, options);

    form.addEventListener('submit', validation.formFuns[alias]);
  };

  // 解除表单绑定
  cxValidation.detach = function(form) {
    var self = this;

    if (validation.isJquery(form) || validation.isZepto(form)) {
      form = form[0];
    };

    if (!validation.isElement(form) || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
      return false;
    };

    var alias = form.dataset.cxVid;
    delete form.dataset.cxVid;

    if (!alias || typeof validation.formFuns[alias] !== 'function') {
      return false;
    };

    form.removeEventListener('submit', validation.formFuns[alias]);
    delete validation.formFuns[alias];
  };

  $.cxValidation = window.cxValidation = cxValidation;
})(window);