# jquery.underscore.render jQuery Plugin

## Demo & Examples

<https://virtuecai.github.io/jquery.underscore.render/>

## Example Usage

### HTML
```html
<style>
  .underscore-template {
    display: none;
  }
</style>
```
```html
<table>
    <tbody id="tbody1">
        <script class="underscore-template" type="text/html">
            <tr>
                <td>{%= $index %}</td>
                <td>{%= name %}</td>
                <td>{%= age %}</td>
                {% _.each(cars, function(a , b, c){ %}
                <td>{%= a %}</td>
                {% }); %}
            </tr>
        </script>
    </tbody>
</table>
```

```js
var userList = [
    {name: 'virtuecai', age: 18, cars: ['car1','car2']},
    {name: 'lq', age: 20, cars: ['car1','car2', 'car3']}
];
$('#tbody1').templateRender({data: userList});
```

```html
<table>
    <tbody id="tbody2">
        <tr class="underscore-template">
            <td>{%= $index %}</td>
            <td>{%= name %}</td>
            <td>{%= age %}</td>
        </tr>
    </tbody>
</table>
```

```js
var userList = [
    {name: 'virtuecai', age: 18},
    {name: 'lq', age: 20}
];
$('#tbody2').templateRender({data: userList});
```

```html
<div class="container">
    <h1 class="underscore-template">
        <span>hello, {%= name %}, {%= age %}</span>
    </h1>
</div>
```

```js
var user = {name: 'virtuecai', age: 18};
$('div.container').templateRender({data: user});
```

## Options

```javascript
options: {
    /**
     * 渲染模版的数据, 对象{} 或者 对象数组[{..},{..}]
     */
    data: {},
    /**
     * 是否启用默认图片加载, 如果为 true, image 表情语法: <img data-src='' default-src='' />
     * default-src 为 data-src 加载失败后显示的图片
     *  data-src='' 最终会 set attr src 中
     *
     */
    enableDefaultImageSrc: false,
    /**
     * 自动移除上一次渲染的元素
     */
    autoRemove: true,
    beforeCallback: function () {
    },
    afterCallback: function () {
    },
    /**
     * 检查到传入 data 数据为空时回调
     * @param $container 调用插件的 jquery 对象
     */
    emptyDataCallBack: function ($container) {

    },
    /**
     * 针对于 data Array, 单个模版 渲染之前
     * @param item Array 中的单个数据, 如果是原始数据类型, 需要转换 {} 对象模版使用
     */
    itemRenderBeforeCallBack: function (item) {

    },
    /**
     * 针对于 data Array, 单个模版 渲染之前
     * @param $item 模版+数据 渲染之后的 jquery 对象(dom)
     */
    itemRenderAfterCallBack: function ($item) {

    }
}
```

## Notes
* 依赖 [underscore](http://www.css88.com/doc/underscore/)
* 轻量级
* 正对于图片显示, 请使用 data-src;
* Demo 示例, 用的 seajs, 不熟悉移除即可.
* 可渲染单个/多个数据;
* 针对于table(强解析)动态td, tr, th 等, 采用`<script>`;
* 针对于 data 为 Array, 会给每个对象附加一个 $index 属性, 用于模版中使用.
* 如何获取传递给模版渲染的数据 ? 比如 渲染的是 tbody 中 tr, 请如下示例代码
```js
var itemList = [{...},{...},{...}];
var item = $('tbody tr:fist').data('item');//第一个tr
// item 数据就是 itemList[0]
```

## 1.1.2 更新
* options.itemRenderBeforeCallBack(item)
* options.itemRenderAfterCallBack($item)


