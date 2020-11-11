# cxValidation
主要面向移动端的表单验证插件，能快速方便的验证表单和单个输入控件，支持基本的验证规则和自定义验证规则。支持 jQuery 和 Zepto。

**版本：**
* Zepto v1.0+ | jQuery v1.7+
* cxValidation 0.9

文档：http://code.ciaoca.com/javascript/cxValidation/

示例：http://code.ciaoca.com/javascript/cxValidation/demo/



## 使用方法

### 载入 JavaScript 文件
```html
<script src="zepto.js"></script>
<script src="cxvalidation.js"></script>
```

### 调用
```javascript
// 直接获取验证结果（返回 true 或 false ）
cxValidation(document.getElementById('input_id'));
cxValidation(document.getElementById('form_id'));

// 绑定表单的提交事件，验证通过后才会提交
cxValidation.attach(document.getElementById('form_id'));

// jQuery or Zepto
$.cxValidation($('#input_id'));
$.cxValidation($('#form_id'));
$.cxValidation.attach($('#form_id'));
```



## API 方法

名称 | 示例 | 说明
--- | ---| ---
attach | cxValidation.attach(document.getElementById('form_id'), options) | 绑定表单验证
detach | cxValidation.detach(document.getElementById('form_id')) | 解除表单验证




## 自定义验证结果处理逻辑
> 该插件仅进行验证，需由使用者定义验证结束后如何处理。
> 在验证未通过时，插件会返回相关提示信息，可自行决定如何展示。

#### 默认处理逻辑

> 触发规则为 `required` 和 `condRequired` 时，让相应输入框获取光标焦点。（Android 系统除外）
>
> 其他规则，若有使用 [cxDialog](https://github.com/ciaoca/cxDialog) 时，默认调用 cxDialog 对话框进行提示，否默认使用 alert 进行提示（建议搭配其他对话框插件提示，或自行增加效果进行提示）。

```javascript
cxValidation(dom, options);
cxValidation(dom, success, error); // 简易方法
```

### options 参数

名称 | 默认值 | 说明
--- | ---| ---
complete | undefined | 验证完成时调用的方法
success | undefined | 验证通过时调用的方法
error | undefined | 验证未通过时调用的方法
validMessage | undefined | 按规则自定义提示内容 

#### result 字段
名称 | 类型 | 说明
--- | ---| ---
status | boolean | 验证结果
message | string | 提示消息 
rule | string | 验证未通过的的规则名称
element | DOM Element | 验证未通过的元素

```javascript
var options = {
  // 验证完成（通过或失败都会触发）
  complete: function(result) {
    console.log('验证完成', result);
  },
  // 验证通过（定义该函数后，验证通过后表单将不会提交，由回调函数处理）
  success: function(result) {
    console.log('验证通过', result);
  },
  // 验证未通过（主要用于如何展示提示信息）
  error: function(result) {
    console.log('验证未通过', result);
  }
};

cxValidation(document.getElementById('input_id'), options);
cxValidation(document.getElementById('form_id'), options);
cxValidation.attach(document.getElementById('form_id'), options);
```



## 全局配置

### 自定义提示语言

> 需要在引用 `cxvalidation.js` 之前设置；
>
> 更多提示内容请参考源文件中的 `validMessage` 的配置。

```javascript
window.cxValidationMessage = {
  titleSymbol: {
    before: '[',
    after: ']',
  },
  required: {
    input: 'Missing content',
    radio: 'Not selected',
    checkbox: 'Unchecked',
    select: 'Not selected',
  },
};
```

### 全局表单验证未通过处理方法

> 可统一设置 error 回调，搭配其他提示内容的插件，或者自定义各种效果来提示。

```javascript
/*
result = {
  status: false,
  message: '【内容】不可为空',
  rule: 'required',
  element: input
}
*/
window.cxValidationFormErrorCallback = function(result) {
  if (typeof result.message === 'string' && result.message.length) {
    alert(msg);
  };
};
```



## Data 属性

```html
<input data-validation="required" data-validation-title="项目名称" data-validation-message="该项为必填">
```
名称 | 说明
--- | ---
validation | 验证规则
validation-title | 项目名称（会在提示内容前填充该内容）
validation-message | 自定义提示消息 [[DEMO：根据不同规则设置不同提示消息](http://code.ciaoca.com/javascript/cxValidation/demo/message)]<br />设置后会忽略 `data-validation-title` 

#### data-validation-message 配置

```html
<!-- 所有验证规则都适用同一个提示 -->
<input data-validation="required,minSize[6]" data-validation-message="用户名不能为空">

<!--
根据验证规则提示
注意：json 格式要求使用双引号，所以外部的需使用单引号
-->
<input data-validation="required,minSize[6]" data-validation-message='{"required":"密码不能为空","minSize":"密码安全性太低，不能少于{{0}}位"}'>
```



## 验证规则
验证规则放置在 `input` 的 `data-validation` 属性中，如使用多个规则，用 `,` 分割

```html
<input data-validation="required">
<input data-validation="required,integer">
<input data-validation="required,integer,min[3]">
```

名称 | 说明
--- | ---
required | 必填、必选
groupRequired[name]\[min] | 群组必填<br>name: 群组名称<br>min: 最少填写/选择数量，默认值为 1
condRequired[id]\[val] | 依赖必填<br>id: 控件 id（如依赖多个输入控件，用英文逗号分隔）<br>val: 当控件 id 的值等于 val 时，才为必填（仅限 id 为单个时有效） 
equals[id] | 相等验证<br>id: 控件 id
minSize[int] | 最少字符数限制
maxSize[int] | 最多字符数限制
min[int] | 最小数值限制
max[int] | 最大数值限制
integer | 验证整数
number | 验证数值（正负数、浮点数） 
onlyNumber | 只能填写数字
onlyNumberSp | 只能填写数字和空格
onlyLetterSp | 只能填写英文字母和空格
onlyLetterNumber | 只能填写英文字母和数字
onlyLetterNumberSp | 只能填写英文字母、数字、空格
email | 验证电子邮件地址
phone | 验证电话号码
url | 验证网址
chinese | 只能填写中文汉字
chinaId | 验证身份证号码（仅支持 18 位）
chinaIdLoose | 验证身份证号码（兼容 18 和 15 位）
chinaZip | 验证邮政编码
qq | 验证 QQ 号码
call[functionName]\[agr..] | 调用外部函数验证 [[DEMO: 自定义验证方法](http://code.ciaoca.com/javascript/cxValidation/demo/call)]

#### call 外部验证方法

```html
<input data-validation="call[myFunction][ciaoca]">
```

```javascript
var myFunction = function(el, key) {
  return {
    status: el.value === key,
    message: '请填写 ' + key
  };
};
```

