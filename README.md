# cxValidation
主要面向移动端的表单验证插件，能快速方便的验证表单和单个输入控件，支持基本的验证规则。支持 jQuery 和 Zepto。

**版本：**
* Zepto v1.0+ | jQuery v1.7+
* cxValidation 0.5

文档：http://code.ciaoca.com/jquery/cxValidation/

示例：http://code.ciaoca.com/jquery/cxValidation/demo/

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

##API 方法
名称 | 示例 | 说明
--- | ---| ---
attach | cxValidation.attach(document.getElementById('form_id'), options) | 绑定表单验证
detach | cxValidation.detach(document.getElementById('form_id')) | 解除表单验证

