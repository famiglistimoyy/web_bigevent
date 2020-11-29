  // 1. 初始化图片裁剪器
  let $image = null;
  let options = null;
  $(function() {
      //1.请求分类
      initCateList();
      // 初始化富文本编辑器
      initEditor();


      // 1. 初始化图片裁剪器
      $image = $('#image');
      // 2. 裁剪选项
      options = {
          aspectRatio: 400 / 280,
          preview: '.img-preview'
      }

      // 3. 初始化裁剪区域
      $image.cropper(options);

      $('#btnChooseImage').on('click', () => {
              //模拟文件选择框被点击
              $('#coverFile').click();
          })
          // 为文件选择框 绑定 onchange 事件获取 选中文件信息
      $('#coverFile').on('change', fileChange);
      //5.为发布和草稿按钮绑定事件
      $('#btnPublish').on('click', publish);
      $('#btnDraft').on('click', draft);
      //6.为表单绑定提交事件
      $('#form-pub').on('submit', doSubmit);

      // 监听coverFile的change事件获取用户
      //   let file = e.target.files[0];
      //   let newImgURL = URL.createObjectURL(file);
      //   $image
      //       .cropper('destroy') // 销毁旧的裁剪区域
      //       .attr('src', newImgURL) // 重新设置图片路径
      //       .cropper(options) // 重新初始化裁剪区域


  })

  //请求分类下拉框数据并渲染下拉框
  function initCateList() {
      $.ajax({
          method: 'GET',
          url: '/my/article/cates',
          success(res) {
              console.log(res);
              if (res.status != 0) return layui.layer.msg(res.message);
              let strHtml = template('tpl-cate', res);
              console.log(strHtml);
              $('select[name="cate_id"]').html(strHtml);
              layui.form.render()
          }
      })
  }

  //2.选中文件
  function fileChange(e) {
      let fileList = e.target.files;
      //   console.log(e);
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

  //3.发布和草稿共用的点击事件处理函数
  let art_state = '已发布'

  function publish() {
      art_state = '已发布'
  }

  function draft() {
      art_state = '草稿'
  }

  function doSubmit(e) {
      //a.阻断表单默认行为
      e.preventDefault();
      // b.获取 表单书装入FormData对象（有文件要上传）
      let fd = new FormData(this);
      //c.为FormData 追加state值（已发布/草稿）
      fd.append('state', art_state);
      //为FormData追加裁剪后的文件数据
      $image
          .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
              width: 400,
              height: 280
          })
          .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
              // 得到文件对象后，进行后续的操作
              fd.append('cover_img', blob);
              fd.forEach((e, i) => {
                      console.log(e, i);
                  })
                  //d.提交到接口
              $.ajax({
                  method: 'post',
                  url: '/my/article/add',
                  data: fd,
                  processData: false,
                  contentType: false,
                  success(res) {
                      console.log(res);
                      //判断是否发表成功
                      if (res.status != 0) return layui.layer.msg(res.message)
                          //如果成功 页面跳转
                      location.href = "/article/art_list.html"
                  }
              })

          })

  }