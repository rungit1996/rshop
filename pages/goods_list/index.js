import { request } from "../../request/index.js";
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[],
    totalPages:1,
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||'';  
    this.QueryParams.query=options.query||'';  
    this.getGoodsList();
  },
  /**
   * 页面上滑 监听滚动条触底事件
   */
  onReachBottom: function (e) {
    // 开始加载下一页数据 需要先判断是否存在下一页数据
    if(this.QueryParams.pagenum>=this.totalPages) {
      wx.showToast({title:'没有更多了'})
    }else {
      this.QueryParams.pagenum++
      this.getGoodsList();
    }
    
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 重置数组和页码
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
  },
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams})
    const total=res.total;
    this.totalPages=Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // goodsList:res.goods
      // 对data中的数组进行拼接
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 数据请求回来 手动关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  }
})