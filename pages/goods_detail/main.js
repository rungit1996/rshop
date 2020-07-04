import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCollect:false,
    goodsObj:{}
  },
  goodsInfo:{},
  onLoad(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages=getCurrentPages();
    let currentPages=pages[pages.length-1];
    let options=currentPages.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}})
    this.goodsInfo=goodsObj;
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    const isCollect=collect.some(v=>v.goods_id===this.goodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone 部分手机不识别 webp 图片格式 最好后台修改 我们也可以在前端修改需要确保 webp=>jpg 使用正则表达式替换
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
        
  },
  /**
   * 点击放大预览
   * @param {} e 
   */
  handlePreviewImage(e){
    console.log(e);
    
    // 构造预览的图片数组
    const urls=this.goodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 点击加入购物车
   */
  handleCartAdd(){
    let cart = wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index===-1) {
      // 不存在
      this.goodsInfo.num=1;
      this.goodsInfo.checked=true;
      cart.push(this.goodsInfo);
    }else {
      // 存在
      cart[index].num++;
    }
    wx.setStorageSync("cart",cart);
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true // 防止用户手抖 疯狂点击按钮
    })
  },
  // 商品收藏功能
  handleCollect(){
    let isCollect=false;
    let collect=wx.getStorageSync("collect")||[];
    let index=collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index!==-1){
      // 能找到表示已经收藏过了
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消收藏',
        icon:'success',
        mask: true
      });
    }else{
      collect.push(this.goodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask: true
      });
    }
    wx.setStorageSync("collect",collect);
    // 修改data中的isCollect属性
    this.setData({isCollect})
  }
})