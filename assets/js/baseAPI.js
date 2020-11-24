//为页面上 所有基于 jq的ajax请求发送之前 对参数对象做处理
$.ajaxPrefilter(function(options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;



        //统一为有权限的接口 设置headers
        if (options.url.indexOf('/my/') > -1) {
            options.headers = {
                Authorization: localStorage.getItem('token')
            }
        }



        // 全局统一挂载 complete 回调函数
        options.complete = function(res) {
            // console.log('执行了 complete 回调：')
            console.log(res.responseJSON)
                // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                layer.msg(res.responseJSON.message, {
                        icon: 1,
                        time: 1500 //2s关闭（如果不配置默认是3s）
                    }, function() {
                        localStorage.removeItem('token')
                            // 2. 强制跳转到登录页面
                        location.href = '/login.html'
                    })
                    // 1. 强制清空 token

            }
        }
    })
    //使用ajaxPrefilter的目的就是同意在发送ajax请求之前，来执行一些准备工作
    // 比如：为url添加新地址
    // 对请求报文做处理