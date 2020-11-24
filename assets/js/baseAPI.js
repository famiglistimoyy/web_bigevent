//为页面上 所有基于 jq的ajax请求发送之前 对参数对象做处理
$.ajaxPrefilter(function(options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
    })
    //使用ajaxPrefilter的目的就是同意在发送ajax请求之前，来执行一些准备工作
    // 比如：为url添加新地址
    // 对请求报文做处理