$(() => {
        $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        $('#link_login').on('click', function() {
            $('.login-box').show()
            $('.reg-box').hide()
        })

        //从layui中获取form对象
        let form = layui.form
            //通过 form.verify()函数自定义校验规则
        form.verify({
            //自定义一个叫做pwd校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6-12位，不能出现空格'],


            //校验两次密码是否一致的规则
            repwd: function(value) {
                //通过形参拿到的是确认密码框中的内容
                //还需要拿到密码框中的内容
                //然后进行一次等于的判断
                let pwd = $('.reg-box [name=password]').val();
                console.log(pwd);
                console.log(value);
                //2.比较两个密码是否相同
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })

        //3.注册表单提交事件(注册)
        $('#regForm').on('submit', submitData);
        //3.注册表单提交事件(登录)
        $('#formLogin').on('submit', loginData);

    })
    // let baseUrl = 'http://ajax.frontend.itheima.net';


function submitData(e) {
    e.preventDefault(); //阻断表单默认提交
    //a.获取表单数据
    let dataStr = $(this).serialize();
    //b.发送异步请求
    $.ajax({
        url: '/api/reguser',
        method: 'post',
        data: dataStr,
        success(res) {
            //无论成与否，都显示消息
            layui.layer.msg(res.message);
            console.log(res.message);
            //注册出错
            if (res.status != 0) return;
            //注册成功


            //将用户名 密码 自动填充到 登录表单中
            let uname = $('.reg-box [name=username]').val().trim();
            $('.login-box [name=username]').val(uname);

            let upwd = $('.reg-box [name=password]').val().trim();
            $('.login-box [name=password]').val(upwd);
            //清空注册表单
            $('#regForm')[0].reset();
            //切换到登录div
            $('#link_login').click();
        }
    })
}

function loginData(e) {
    e.preventDefault();
    let dataStr = $(this).serialize();
    $.ajax({
        method: 'post',
        url: '/api/login',
        data: dataStr,
        success(res) {
            if (res.status !== 0) return layui.layer.msg(res.message);
            //登录成功
            layui.layer.msg(res.message, {
                icon: 6,
                time: 1500
            }, function() {
                //a.保存 token值到localstorage
                localStorage.setItem('token', res.token)
                    //跳转到index.html
                location.href = '/index.html'
            })

        }
    })

}