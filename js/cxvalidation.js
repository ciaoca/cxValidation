/*!
 * cxValidation
 * @version 1.2.0
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxValidation
 * @license Released under the MIT license
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.cxValidation = factory();
  };
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const validation = {
    validMessage: {
      titleSymbol: {
        before: '【',
        after: '】'
      },
      required: {
        input: '未填写',
        radio: '未选择',
        checkbox: '未勾选',
        select: '未选择'
      },
      groupRequired: {
        input: '至少填写 {{1}} 项',
        radio: '未选择',
        checkbox: '至少选择 {{1}} 项'
      },
      condRequired: {
        input: '未填写',
        radio: '未选择',
        checkbox: '未勾选',
        select: '未选择'
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
    isHidden: function(o) {
      if (this.isElement(o)) {
        const style = window.getComputedStyle(o);
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
    const self = this;

    // 默认表单验证处理逻辑
    self.defaults = {
      success: (result) => {
        result.form.submit();
      },
      error: (result) => {
        const nodeName = result.element.nodeName.toLowerCase();

        if (result.rule === 'required' || result.rule === 'condRequired') {
          if (nodeName === 'input' && ['radio','checkbox','color','range','file','hidden'].indexOf(result.element.type) >= 0) {
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
      const self = this;
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
      const self = this;
      let hasCond = false;
      let result = true;

      if (typeof ids === 'string' && ids.length) {
        if (ids.indexOf(',') > 0) {
          ids = ids.split(',');

          if (Array.isArray(ids) && ids.length) {
            hasCond = true;

            for (let x of ids) {
              if (!self.validFun.required(document.getElementById(x))) {
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
      const args = Array.prototype.slice.call(arguments);
      let spaces = args.splice(1, 1);
      let scope = window;

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
    const ruleStr = el.dataset.validation;
    let ruleArr = [];
    let args = [];

    if (typeof ruleStr === 'string' && ruleStr.length) {
      ruleArr = ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');
    };

    if (typeof rule === 'string' && rule.length && ruleArr.indexOf(rule) >= 0) {
      let ruleOpt = ruleStr.match(new RegExp(rule + '((\\[[^\\]]+\\])+)'));

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
    const self = this;
    const nodeName = el.nodeName.toLowerCase();
    let message = '';

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
      let args = self.getRuleArguments(el, rule);

      for (var i = 0, l = args.length; i < l; i++) {
        message = message.replace(new RegExp('\\{\\{' + i + '\\}\\}'), args[i]);
      };
    };

    return message;
  };

  // 验证单个控件
  validation.validItem = function(el, options) {
    const self = this;
    let result = Object.assign({}, self.result);
    const ruleStr = el.dataset.validation;

    options = Object.assign({}, options);

    if (typeof ruleStr === 'string' && ruleStr.length) {
      let ruleArr = ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');

      for (let x of ruleArr) {
        if (typeof self.validFun[x] === 'function') {
          let ruleOpt = ruleStr.match(new RegExp(x + '((\\[[^\\]]+\\])+)'));
          let args = [el];

          if (Array.isArray(ruleOpt) && ruleOpt.length > 1) {
            args = args.concat(ruleOpt[1].match(/([^\[\]]+)/g));
          };

          result = self.validFun[x].apply(self, args);

          if (typeof result === 'boolean') {
            result = {
              status: result
            };
          };

          if (typeof result === 'object' && typeof result.status === 'boolean') {
            if (result.status === false) {
              result.rule = x;

              if (typeof result.message !== 'string' || !result.message.length) {
                result.message = self.getMessage(el, x);
              };

              break
            };
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

    return result;
  };

  // 验证整个表单
  validation.validForm = function(form, options) {
    const self = this;
    const result = Object.assign({}, self.result);
    let inputs = form.querySelectorAll('input,textarea,select');

    options = Object.assign({}, options);
    self.groupCache = {};

    for (let x of inputs) {
      const itemResult = self.validItem(x);

      if (itemResult && itemResult.status === false) {
        result.status = false;
        result.element = x;

        if (typeof itemResult.rule === 'string' && itemResult.rule.length) {
          result.rule = itemResult.rule;
        };

        if (typeof itemResult.message === 'string' && itemResult.message.length) {
          result.message = itemResult.message;
        };

        break;
      };
    };

    if (result && result.status === true) {
      for (let x in self.groupCache) {
        if (self.groupCache[x].count > 0) {
          result.status = false;
          result.rule = 'groupRequired';
          result.element = self.groupCache[x].element;
          result.message = self.getMessage(result.element, result.rule);
          break;
        };
      };
    };

    result.form = form;
    self.groupCache = {};

    if (typeof options.complete === 'function') {
      options.complete(result);
    };

    if (result.status === true && typeof options.success === 'function') {
      options.success(result);
    } else if (result.status === false && typeof options.error === 'function') {
      options.error(result);
    };

    return result;
  };

  // 表单提交方法
  validation.formSubmitFn = function(form, options) {
    event.preventDefault();
    this.validForm(form, Object.assign({}, this.defaults, options));
  };

  // 提示信息
  validation.toMessage = function(message) {
    alert(message);
  };

  // 元素获取焦点
  validation.toFocus = function(el) {
    if (this.isVisible(el)) {
      el.focus();
    };
  };

  validation.init();


  const cxValidation = function(){
    return cxValidation.valid.apply(cxValidation, arguments);
  };

  cxValidation.setOptions = function(options) {
    Object.assign(validation.defaults, options);
  };

  cxValidation.setLanguage = function(options) {
    for (let x in options) {
      if (typeof options[x] === 'object') {
        if (validation.validMessage.hasOwnProperty(x)) {
          Object.assign(validation.validMessage[x], options[x]);
        } else {
          validation.validMessage[x] = Object.assign({}, options[x]);
        };
      } else {
        validation.validMessage[x] = options[x];
      };
    };
  };

  cxValidation.valid = function(el, options) {
    if (!validation.isElement(el)) {
      return;
    };

    return el.nodeName.toLowerCase() === 'form' ? validation.validForm(el, options) : validation.validItem(el, options);
  };

  // 检验并提示
  cxValidation.verify = function(el, options) {
    this.valid(el, Object.assign({}, validation.defaults, options));
  };

  // 绑定到表单
  cxValidation.attach = function() {
    const self = this;
    let form;
    let options = {};

    // 分配参数
    for (let x of arguments) {
      if (validation.isElement(x)) {
        form = x;

      } else if (typeof x === 'object') {
        Object.assign(options, x);
      };
    };

    if (!validation.isElement(form) || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
      console.warn('[cxValidation] Not form element.');
      return;
    };

    let alias = form.dataset.cxVid;

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
    const self = this;

    if (!validation.isElement(form) || !form.nodeName || form.nodeName.toLowerCase() !== 'form') {
      return;
    };

    let alias = form.dataset.cxVid;
    delete form.dataset.cxVid;

    if (!alias || typeof validation.formFuns[alias] !== 'function') {
      return;
    };

    form.removeEventListener('submit', validation.formFuns[alias]);
    delete validation.formFuns[alias];
  };

  return cxValidation;
}));