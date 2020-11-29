//[全局变量]分页查询参数对象
let q = {
    //分页相关 和筛选相关
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据
    //筛选相关 
    cate_id: '', //文章分类的Id
    state: '' //文章发布状态
}
$(function() {

    //创建 时间格式化过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = dt.getMonth() + 1;
        let d = dt.getDate();
        let hh = dt.getHours();
        let mm = dt.getMinutes();
        let ss = dt.getSeconds();
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', search)
    initArtList();
    initCate();
    //为未来的删除按钮代理点击事件
    $('tbody').on('click', '.btn-delete', del)
})

//1.加载文章列表-----------
function initArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            // if (res.status != 0) return layui.layer.msg('获取文章列表失败');
            //1.遍历数组生成html字符串
            let strHtml = template('tpl-list', res.data);
            //2.将html字符串渲染到tbody中
            $('tbody').html(strHtml);
            //3.调用生成页码条方法
            renderPage(res.total);
        }
    })
}
//2.加载分类下拉框------------
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success(res) {
            if (res.status !== 0) {
                return layer.msg('获取数据失败')
            }
            let htmlStr = template('tpl-cate', res.data);
            // console.log(htmlStr);
            //将html代码 添加到分类下拉框中
            $('[name=cate_id]').html(htmlStr);
            //通知layui重新渲染下拉框 和其他表单元素
            layui.form.render();
        }
    })
}

//为筛选表单绑定submit事件
//3.查询事件处理函数-----------
function search(e) {
    //a.阻断表单提交
    e.preventDefault();
    //b.逐一获取查询表单下拉框的数据
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val();
    console.log(q);
    //d.重新加载文章列表
    initArtList();
}
//4.生成页码条 定义渲染分页的方法
//注意 ：laypage中的jump函数出发时机：1.laypage.render会执行首次触发
// 2.点击页码时触发
// 3.切换页面时触发
function renderPage(total) {
    layui.laypage.render({
        elem: 'pageBox', //分页容器的Id
        count: total, //总数据条数
        limit: q.pagesize, //每页显示几条数据
        curr: q.pagenum, //设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 5, 10, 15, 20], //页容量选项
        //分页发生切换的时候，触发jump回调

        //触发jump回调的方式有两种：
        // 1.点击页码的时候，会触发jump回调
        // 2.根据最新的q获取对应数据列表并渲染表格
        jump(obj, first) {
            console.log(obj.curr); //当前点击页码
            //把最新的页码值赋值到q这个查询参数对象中
            q.pagenum = obj.curr;

            //把最新的q获取对应的数据列表
            q.pagesize = obj.limit;
            //根据最新的页码值q获取对应的数据列表 并渲染表格

            //当点击页码时
            if (!first) {
                initArtList();
            }
        }
    })
}


//5.删除业务
function del() {
    // console.log('id=', this.dataset.id);
    //获取要删除文章的id
    let id = this.dataset.id;

    // console.log(rows);
    // console.log($('.btn-delete'));
    // console.log($('#btn-delete'));
    layui.layer.confirm('你确定要删除嘛？', function(index) {
        //获取页面上剩余行数
        let rows = $('.btn-delete').length;
        // let id = this.getAttribute('data-id');
        //h5中提供了获取data-  属性的快速语法
        // console.log('要删除的是:', id);
        //发送异步请求
        $.ajax({
                url: '/my/article/delete/' + id,
                method: 'get',
                success(res) {
                    layui.layer.msg(res.message);
                    if (res.status != 0) return;
                    //如果删除成功，需要判断是否已经没有行了，如果没有，则页码-1
                    if (rows <= 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    //当数据删除完成之后
                    initArtList();
                }
            })
            //关闭当前确认框
        layui.layer.close(index);
    })
}