# cxValidation
主要面向移动端的表单验证插件，能快速方便的验证表单和单个输入控件，支持基本的验证规则。支持 jQuery 和 Zepto。

**版本：**
* Zepto v1.0+ | jQuery v1.7+
* cxValidation 0.7

文档：http://code.ciaoca.com/javascript/cxValidation/

示例：http://code.ciaoca.com/javascript/cxValidation/demo/

**Future:**
* 日期验证规则
* 完全原生 JavaScript，不依赖 jQuery 或 Zepto

##使用方法
###载入 CSS 文件
```html
<link rel="stylesheet" href="cxvalidation.css">
```

###载入 JavaScript 文件
```html
<script src="zepto.js"></script>
<script src="cxvalidation.js"></script>
```

###获取验证结果
```javascript
// 结果返回 true 或 false 
 
// JavaScript 
cxValidation(document.getElementById('input_id'));
cxValidation(document.getElementById('form_id'));
 
// jQuery or Zepto 
$.cxValidation($('#input_id'));
$.cxValidation($('#form_id'));
```

###绑定表单验证
```javascript
// 绑定表单的提交事件，验证失败会有提示，验证通过后才会提交
// JavaScript
cxValidation.attach(document.getElementById('form_id'));
 
// jQuery or Zepto
$.cxValidation.attach($('#form_id'));
```

##参数说明
```javascript
var options = {
  complete: function(result) {
    console.log('验证完成', result);
  },
  success: function(result) {
    console.log('验证通过', result);
  },
  error: function(result) {
    console.log('验证失败', result);
  }
};

// 简易方法，快速设置验证成功及失败的回调
cxValidation(document.getElementById('input_id'), options.success, options.error);
cxValidation(document.getElementById('form_id'), options.success, options.error);
cxValidation.attach(document.getElementById('form_id'), options.success, options.error);

// 完整方法，可设置验证完成、成功及失败的回调
cxValidation(document.getElementById('input_id'), options);
cxValidation(document.getElementById('form_id'), options);
cxValidation.attach(document.getElementById('form_id'), options);
```

名称 | 默认值 | 说明
--- | ---| ---
complete | undefined | 验证完成时调用的方法
success | undefined | 验证通过时调用的方法
error | undefined | 验证失败时调用的方法

###回调函数参数  result 说明
名称 | 类型 | 说明
--- | ---| ---
status | boolean | 验证结果
message | string | 提示消息
rule | string | 验证未通过的的规则名称
element | DOM Element | 验证未通过的元素


  
##验证规则
验证规则放置在```input```的```data-validation```属性中，如使用多个规则，用```,```分割

```html
<input data-validation="required">
<input data-validation="required,integer">
<input data-validation="required,integer,min[3]">
```

名称 | 说明
--- | ---
required | 必填、必选
groupRequired[name][min] | 群组必填<br>name: 群组名称<br>min: 最少填写/选择数量，默认值为 1
condRequired[id] | 依赖必填<br>id: 控件 id（如依赖多个输入控件，用英文逗号分隔）
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
call[functionName] | 调用外部函数验证
  
##Data 属性
```html
<input data-validation="required" data-validation-message="该项为必填">
```
名称 | 说明
--- | ---
validation | 验证规则
validation-message | 验证提示消息

##API 方法
名称 | 示例 | 说明
--- | ---| ---
attach | cxValidation.attach(document.getElementById('form_id'), options) | 绑定表单验证
detach | cxValidation.detach(document.getElementById('form_id')) | 解除表单验证
