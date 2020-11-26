$(function() {
        initCropper();
        // 为上传按钮添加点击事件
        $('#btnUpload').on('click', chooseFile);
        //为确认上传按钮添加点击事件
        $('#btnOk').on('click', upload);
        // 为文件选择框 绑定 onchange 事件获取 选中文件信息
        $('#file').on('change', fileChange);
    })
    //0.裁剪区 全局配置选项--------
let $image = null;
// 1.2 配置选项
const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    //1.初始化 裁剪插件
function initCropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')



    // 1.3 创建裁剪区域
    $image.cropper(options)


}

//1.选择文件----------------
function chooseFile() {
    $('#file').click();
}

//2.选中文件
function fileChange(e) {
    let fileList = e.target.files;
    console.log(e);
    if (fileList.length == 0) return layui.layer.msg('请选择文件~！');

    //获取 选中的第一个文件信息对象
    let file = fileList[0];
    //2.创建 文件虚拟路径
    let newImgURL = URL.createObjectURL(file);
    //显示新图片 ：
    // 调用裁剪组件 销毁之前的图片 设置新的虚拟路径给它 并重新创建裁剪区
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    console.log('------');
    console.log(fileList);
}
//3.确认上传---------
function upload() {
    let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    console.log(dataURL);
    //2.调用接口 把头像上传到服务器
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success(res) {
            if (res.status != 0) return layui.layer.msg(res.message);
            //如果失败,则退出函数
            if (res.status != 0) return;
            window.top.getUserInfo();

        }
    })
}