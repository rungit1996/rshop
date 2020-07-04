// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部订单",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
    orders:[]
  },

  /**
   * 生命周期函数--监听页面显示
   * 订单内容是需要频繁打开查看，所以使用onShow,onShow被加载多次，onLoad加载一次
   */
  onShow: function () {
    // 小程序最好支持的页面长度是10个页面
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    let currentPage=pages[pages.length-1]  
    let {type}=currentPage.options
    if(!type){
      type=0;
    }
    this.changeTitleByIndex(type);
    this.getOrders();
    
  },
  // 根据标题索引来激活选中
  changeTitleByIndex(index){
    index=parseInt(index);
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 改变标题时应发起请求根据所选择的type重新获取订单
    // this.getOrders()
  },
  // 获取订单列表的方法
  getOrders(type){
    const orders=wx.getStorageSync("order");
    console.log(orders);
        
    this.setData({
      orders
    })
  },

})