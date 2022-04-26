# cxValidation
主要面向移动端的表单验证插件，能快速方便的验证表单和单个输入控件，支持基本的验证规则和自定义验证规则。

Demo: http://ciaoca.github.io/cxValidation/



## 使用方法

### 载入 JavaScript 文件
```html
<script src="cxvalidation.js"></script>
```

### 调用
```javascript
/**
 * 获取验证结果
 * @returns {object} result
 */
cxValidation(document.getElementById('input_or_form'));

// 检验并提示
cxValidation.verify(document.getElementById('input_or_form'));

// 绑定表单的提交事件，验证通过后才会提交
cxValidation.attach(document.getElementById('form'));
```

### result 验证结果
名称 | 类型 | 说明
--- | ---| ---
status | boolean | 验证结果
message | string | 提示消息
rule | string | 验证未通过的的规则名称
element | dom | 验证未通过的元素



## API 接口

名称 | 说明
--- | ---
verify(dom, [options]) | 检验并提示
attach(dom, [options]) | 绑定表单验证
detach(dom) | 解除表单验证
setOptions(options) | 设置默认配置
setLanguage(object) | 设置默认语言

```javascript
// 表单验证未通过时，默认处理方法，建议搭配对话框插件进行提示
cxValidation.setOptions({
  error: function(result) {
    console.log(result);
  }
});

// 自定义提示语言，完整配置可参考源码 validMessage
cxValidation.setLanguage({
  titleSymbol: {
    before: '',
    after: '',
  },
  required: {
    input: '必填项'
  },
  email: '请填写正确的邮箱地址'
});
```


### options 参数说明

名称 | 默认值 | 说明
--- | ---| ---
complete | undefined | 验证完成时回调函数
success | function | 验证通过时回调函数
error | function | 验证未通过时回调函数

```javascript

// 自定义表单验证完成后的处理方式
cxValidation.attach(document.getElementById('form'), {
  // 验证完成
  complete: function(result) {
    console.log('验证完成', result);
  },
  // 验证通过（定义该函数后，验证通过后表单将阻止提交）
  success: function(result) {
    console.log('验证通过', result);
  },
  // 验证未通过（用于展示提示信息）
  error: function(result) {
    console.log('验证未通过', result);
  }
});
```


### `attach()` 绑定表单默认处理逻辑

#### 验证通过时
> 触发表单提交。

#### 验证未通过时

> 若规则为 `required` 或 `condRequired` 时，对应的输入框获取光标焦点。  
> 其他规则，则使用 `alert` 进行提示。



## data 属性参数

名称 | 说明
--- | ---
data-validation | 验证规则
data-validation-title | 项目名称（会在提示内容前填充该内容）
data-validation-message | 自定义提示消息 [[DEMO]](http://ciaoca.github.io/cxValidation/demo/message.html)<br>设置后会忽略 `data-validation-title` 


```html
<input data-validation="required" data-validation-title="项目名称" data-validation-message="该项为必填">
<!--
验证未通过时 result 对象内容：
{
  status: false,
  message: '【项目名称】该项为必填'
  rule: 'required',
  element: dom
}
-->
```

### data-validation-message 配置

```html
<!-- 所有验证规则都使用相同的提示 -->
<input data-validation="required,minSize[6]" data-validation-message="验证未通过">

<!--
根据验证规则提示
注意：json 格式要求使用双引号，所以外部的需使用单引号
-->
<input data-validation="required,minSize[6]" data-validation-message='{"required":"密码不能为空","minSize":"密码安全性太低，不能少于{{0}}位"}'>
```



## 验证规则
验证规则放置在 `input, select, textarea` 的 `data-validation` 属性中，如使用多个规则，用 `,` 分割

```html
<input data-validation="required">
<input data-validation="required,integer">
<input data-validation="required,integer,min[3]">
```

名称 | 说明
--- | ---
required | 必填、必选
groupRequired[alias]\[min] | 群组必填、必选<br>alias: 群组名称<br>min: 最少填写/选择数量，默认值为 1
condRequired[id]\[val] | 依赖必填、必选<br>当依赖控件值有效时，则当前控件为必填<br>id: 控件 id（如依赖多个输入控件，用英文逗号分隔）<br>val: 当控件 id 的值等于 val 时，才为必填（仅限 id 为单个时有效） 
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
call[funName]\[agr..] | 调用自定义函数验证 [[DEMO]](http://ciaoca.github.io/cxValidation/demo/call.html)

### call 自定义验证方法

```html
<input data-validation="call[myFunction][abc]">
```

```javascript
var myFunction = function(el, key) {
  return {
    status: el.value === key,
    message: '请填写 ' + key
  };
};
```

