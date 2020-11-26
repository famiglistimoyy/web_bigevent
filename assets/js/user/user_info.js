$(function() {
        // 为layui 添加校验规则
        let form = layui.form
        form.verify({
            nickname: [/^\S{6,12}$/, '昵称必须在6-12']
        })

        // 1.加载用户基本信息--------
        initUserInfo()

        //2.重置按钮事件
        $('#btnReset').on('click', function(e) {
            e.preventDefault()
            initUserInfo()
        });
        //表单提交事件
        $('.layui-form').on('submit', submitData);
    })
    //1.加载用户信息----------
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            console.log(res);
            //错误判断
            if (res.status !== 0) return layui.layer.msg(res.message)
                //将数据装入同名表单元素中
            layui.form.val('formUserInfo', res.data)
        }
    })
}

//2.提交 表单数据
function submitData(e) {
    //阻断表单提交
    e.preventDefault();
    $.ajax({
        url: '/my/userinfo',
        method: 'post',
        data: $(this).serialize(),
        success(res) {
            console.log(res);
            if (res.status != 0) return layui.layer.msg(res.message);
            //如果没有出错 则通过window.parent 或 window.top调用
            //父页面的 方法
            window.top.getUserInfo();
        }
    })
}