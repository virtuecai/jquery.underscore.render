/* 文 件 名:  underscore.util.js
 * 版    权:  Tianwen Digital Media Technology(Beijing) Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  underscore 模版渲染 辅助|扩展
 * 创 建 人:  Caizhengda
 * 修改时间:  2016-04-15
 */
define('dist/jquery.underscore.render', function (require, exports, module) {

    require('lib/underscore');

    //解决IE下不支持Object.keys
    if (!Object.keys) {
        Object.keys = function (obj) {
            var keys = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys;
        };
    }
    //解决IE下不支持 window.console
    if (!window.console) {
        window.console = {
            log: function () {
            }
        }
    }

    (function ($) {
        
        //页面加载初始定义的模版
        $('.underscore-template').each(function () {
            var $this = $(this);
            var templateContent = $this.prop('outerHTML');
            //templateContent 内容转义 防止 js 代码中出现 &gt 等等
            templateContent = templateContent.replace(new RegExp("&lt;", "g"), '<').replace(new RegExp("&gt;", "g"), '>');
            $this.parent().data('template', templateContent);
        });

        var TemplateRender = function (element, options) {
            this.render(element, options);
        };

        TemplateRender.version = '1.0';

        TemplateRender.defaults = {
            //渲染模版的数据, 对象{} 或者 对象数组[{..},{..}]
            data: {},
            // 是否启用默认图片加载, 如果为 true, image 表情语法: <img data-src='' default-src='' />
            // default-src 为 data-src 加载失败后显示的图片
            // data-src='' 最终会 set attr src 中
            enableDefaultImageSrc: false,
            //自动移除上一次渲染的原始
            autoRemove: true,
            beforeCallback: function () {
            },
            afterCallback: function () {
            },
            //检查到传入 data 数据为空时回调
            emptyDataCallBack: function () {

            }
        };

        TemplateRender.prototype = {
            /**
             * 检测模版内容语法是否包含标准语法
             * @param templateContent 模版内容
             */
            validateContent: function (templateContent) {
                if (
                    _.templateSettings.evaluate.test(templateContent) ||
                    _.templateSettings.interpolate.test(templateContent) ||
                    _.templateSettings.escape.test(templateContent)) {
                } else {
                    console.log("请确定模版语法:( {%=%} {%%} {%-%}) (以 _.templateSettings 为准), 以及容器选择器!");
                }
            },
            /**
             * 当图片url加载时候, 采用默认图片, 需要在图片元素上加上 default-src url;
             * @param $container 该元素容器下得所有img, 可以为jquery对象, 或者jquery选择器字符串
             */
            loadDefaultImgOnError: function ($container) {
                // 当图片url加载时候, 采用默认图片, 需要在图片元素上加上 default-src url;
                $("img", $($container)).one("error", function () {
                    var $this = $(this);
                    var defaultSrc = $.trim($this.attr('default-src'));
                    if (defaultSrc && defaultSrc != '') $this.attr("src", defaultSrc);
                }).filter(function () {  //check to see if an image was loaded from the cache as broken (or if onerror fired before set)
                    return (this.complete && (this.naturalWidth === 0 || this.naturalWidth === undefined));
                }).trigger("error");
            },
            render: function (container, options) {
                var that = this;
                options = $.extend({}, that.options, options);

                options.beforeCallback && options.beforeCallback();

                if (!container || $(container).length == 0) {
                    throw "请正确传入模版容器container参数.(选择器|jquery对象)!";
                }

                var $container = $(container);
                var templateContent = $container.data('template');
                if (!templateContent) {
                    var $repeat = $container.find('.underscore-template').first();
                    if($repeat.prop('tagName').toLowerCase() == 'script') {
                        templateContent = $repeat.html();
                    } else {
                        templateContent = $repeat.prop('outerHTML');
                    }
                }
                //templateContent 内容转义 防止 js 代码中出现 &gt 等等
                templateContent = templateContent.replace(new RegExp("&lt;", "g"), '<').replace(new RegExp("&gt;", "g"), '>');

                //检测模版语法
                that.validateContent(templateContent);

                $container.data('template', templateContent);

                // 需要进行渲染的 data
                if (jQuery.type(options.data) != "array" && jQuery.type(options.data) != "object") {
                    throw "options.data  仅支持 Object or Array!";
                }
                //数据为空回调
                if (jQuery.type(options.data) == "array" && options.data.length == 0) {
                   options.emptyDataCallBack && options.emptyDataCallBack($container);
                }
                if (jQuery.type(options.data) == "object" && Object.keys(options.data).length == 0) {
                    options.emptyDataCallBack && options.emptyDataCallBack($container);
                }

                var $el = [];
                // 兼容 对象 or 数据
                if (jQuery.type(options.data) === "array") {
                    $.each(options.data, function (idx, item) {
                        item.$index = idx;
                        var $item = $(_.template(templateContent)(item)).data('item', item).removeClass('underscore-template').addClass('underscore-template-rendered');
                        that.renderDataSrc($item);
                        $el.push($item);
                    });
                } else if (jQuery.type(options.data) === "object") {
                    var $item = $(_.template(templateContent)(options.data)).data('item', options.data).removeClass('underscore-template').addClass('underscore-template-rendered');
                    that.renderDataSrc($item);
                    $el.push($item);
                }
                if(options.autoRemove) {
                    $container.find('.underscore-template, .underscore-template-rendered').remove();
                }
                try {
                    $container.append($el);
                } catch (e) {
                    // jquery 1.7.2 不支持append jquery 数组 所以得each 一个个append
                    $.each($el, function (idx, item) {
                        $container.append(item);
                    })
                }

                if (options.enableDefaultImageSrc) {
                    // 当图片url加载时候, 采用默认图片, 需要在图片元素上加上 default-src url;
                    that.loadDefaultImgOnError($container);
                }
                //完成后回调
                options.afterCallback && options.afterCallback($el);
            },
            /**
             * 如果存在 data-src 则将其赋值给 src 属性
             * @param $items
             */
            renderDataSrc: function ($items) {
                $items.find('img').each(function () {
                    var dataSrc = $(this).data('src');
                    if (dataSrc) $(this).attr('src', dataSrc);
                });
            }
        };

        /**
         * 页面模版直接渲染
         * @param options
         * @returns {*}
         */
        $.fn.templateRender = function (options) {
            return this.each(function () {
                var $this   = $(this);
                var data    = $this.data('underscore.render');
                var _options = $.extend({}, TemplateRender.defaults, $this.data(), typeof options == 'object' && options)
                if (!data) $this.data('underscore.render', (data = new TemplateRender(this, _options)))
            });
        };

    })(jQuery);

});
