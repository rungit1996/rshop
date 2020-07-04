import { request } from "../../request/index.js";
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航栏数组
    catesList:[],
    // 楼层数组
    floorList:[]
  },
  // 页面开始加载就会触发
  onLoad: function(options){
    // 使用 es6 的 promise 来优化此异步请求
    // var reqTask = wx.request({
    //   url: '/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
        
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCateList();
    this.getfloorList();
  },
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList: result
      })
    })
  },
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        catesList: result
      })
    })
  },
  getfloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList: result
      })
    })
  }
  // getNavList() {
  //   /home/catitems
  // }
});