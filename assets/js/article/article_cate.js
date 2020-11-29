$(function() {
        initArtCateList();
        //
        $('#btnAddCate').on('click', addCate);
        //通过代理方式 为未来的新增表单 绑定提交事件
        $('body').on('submit', '#formAdd', doAdd);
        //通过代理方式 为未来的 新增表单绑定点击事件
        $('tbody').on('click', '.btn-delete', doDelete)

        //通过代理方式 为未来的编辑按钮绑定点击事件
        $('tbody').on('click', '.btn-edit', showEdit)
    })
    //1.加载文章分类列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            console.log(res);
            let strHtml = template('tpl-table', res.data)
                //2.将html字符串渲染到tbody中
            $('tbody').html(strHtml)
        }
    });
}
//保存 弹出层id 关闭弹出层的时候会用到
let layerID = null;
// 显示新增窗口
function addCate() {
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '添加文章分类',
        content: $('#tpl-layer').html()
    })
}
//3.执行新增
function doAdd(e) {
    e.preventDefault();
    console.log('要提交啦');

    //（1）获取弹出层标题
    let title = $('.layui-layer-title').text().trim();
    // 新增操作-----
    if (title == "添加文章分类") {
        //a.获取数据
        let dataStr = $(this).serialize();
        console.log($(this));
        //将 数据字符串中 的Id=& 替换成 空字符串
        dataStr = dataStr.replace('Id=&', '')
            //b.异步提交
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 表单转为jQUery对象
            data: dataStr,
            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                //c.重新获取分类列表
                initArtCateList();
                //d.关闭弹出窗口
                layui.layer.close(layerID)
            }
        })
    } else {
        //编辑操作----
        $.ajax({
            url: '/my/article/updatecate',
            method: 'post',
            data: $(this).serialize(),

            success(res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return;
                //c.重新获取分类列表
                initArtCateList();
                //d.关闭弹出窗口
                layui.layer.close(layerID)
            }
        });
        console.log($(this))
    }

}
//4.执行删除
function doDelete() {
    let id = this.dataset.id;
    layui.layer.confirm('你确定要删除嘛？', function(index) {
        // let id = this.getAttribute('data-id');
        //h5中提供了获取data-  属性的快速语法
        console.log('要删除的是:', id);
        //发送异步请求
        $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'get',
                success(res) {
                    layui.layer.msg(res.message);
                    if (res.status != 0) return;
                    //如果删除成功，则重新请求列表数据
                    initArtCateList();
                }
            })
            //关闭当前确认框
        layui.layer.close(index);
    })
}

// 5.显示编辑
function showEdit() {
    //(1)保存弹出层的弹出层

    //(3)将
    console.log(this.dataset.id);
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '修改文章分类',
        content: $('#tpl-layer').html()
    });
    //(2)获取id
    let id = this.dataset.id;
    //(3)查询数据
    $.ajax({
        url: '/my/article/cates/' + id,
        method: 'get',
        success(res) {
            console.log(res);
            //将获取的文章分类数据自动装天道表单元素中
            layui.form.val('formData', res.data)
        }
    })
}