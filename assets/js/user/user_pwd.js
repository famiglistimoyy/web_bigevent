$(function() {
        let form = layui.form
        form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格！'],
            samepwd: function(value) {
                if (value == $('[name=oldPwd]').val()) {
                    return '新旧密码不能一样哦~~~'
                }
            },
            confirmpwd: function(value) {
                if (value != $('[name=newPwd]').val()) {
                    return '确认密码核心密码输入不一样哦'
                }
            }
        })

        //2.为表单添加提交事件
        $('.layui-form').on('submit', changePwd);
    })
    //1.修改密码--------------------

function changePwd(e) {
    e.preventDefault();
    // alert('校验通过');
    //a.提交数据到接口完成更新密码
    $.ajax({
        url: '/my/updatepwd',
        method: 'post',
        data: $(this).serialize(),
        success(res) {
            //b.如果不成功 则退出 函数
            if (res.status != 0) return layui.layer.msg(res.message);

            //c.如果成功 则清空 token 并跳转到login.html
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500 //1.5s关闭
            }, function() {
                localStorage.removeItem('token');
                window.top.location = '/login.html';
            })

        }
    })
}