//1.在dom树 创建完后开始执行
$(function() {
    getUserInfo();
    $('#btnLogout').on('click', logout);
})

//1.加载 用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        }
    })
}

//2.渲染用户信息函数
function renderAvatar(userData) {
    //先获取用户名（昵称/登录名）
    let username = userData.nickname || userData.username
        //b.s设置给 welcome span标签
    $('#welcome').html(username)

    //3.按需渲染用户头像

    if (userData.user_pic !== null) {
        //有图片头像
        $('.layui-nav-img').attr('src', userData.user_pic).show()
            //隐藏文字头像
        $('.text-avatar').hide()
    } else {
        //没有图片头像使用文本头像
        $('.layui-nav-img').hide(); //隐藏图片头像
        let firstChar = username[0].toUpperCase();
        $('.text-avatar').text(firstChar).show();
    }
}

//3.退出按钮函数
function logout() {
    //弹出确认框
    layui.layer.confirm('小可爱你确定要离开我吗？', {
            icon: 3,
            title: '系统提示'
        },
        function(index) {
            //删除 本地储存中的token值
            localStorage.removeItem('token');
            //跳转到login.html
            location.href = "/login.html";
            layer.close(index);
        })

}