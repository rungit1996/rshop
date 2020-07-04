// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品投诉",
        isActive:false
      }
    ],
    tempFilePaths:[],
    textVal:''
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  // 点击 + 号 选择图片
  handleChooseImg(){let _this=this;
    // 调用系统API获取图片
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        _this.setData({
          // 对图片数组进行拼接
          tempFilePaths:[..._this.data.tempFilePaths,...tempFilePaths]
        });
      }
    })
  },
  // 点击自定义图片组件 x 号删除图片
  handleRemoveImg(e){
    const {index}=e.currentTarget.dataset;
    let {tempFilePaths} = this.data;
    tempFilePaths.splice(index,1)
    this.setData({tempFilePaths});
  },

  // 文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFromSubmit(){
    const {textVal}=this.data
    if(!textVal.trim()){
      wx.showToast({
        title: '需要提交反馈内容',
        icon: 'none',
        mask:true
      })
      // 将文件上传到指定服务器
      // wx.uploadFile({
      //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      //   filePath: tempFilePaths[0],
      //   name: 'file',
      //   formData: {
      //     'user': 'test'
      //   },
      //   success (res){
      //     const data = res.data
      //     //do something
      //   }
      // })
    }else{
      wx.showToast({
        title: '谢谢您的宝贵意见',
        icon: 'success',
        mask:true
      })
      // 清空图片和文本域
      this.setData({
        tempFilePaths:[],
        textVal:''
      });
      setTimeout(()=>{
        wx.navigateBack({
          delea:1
        })
      },2000);
    }
  }
  
})