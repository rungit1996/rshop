import {showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart=wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({
      address
    })
    // 实现计算总价格和总数量 只有被选中的商品才被计算
    let totalPrice=0
    let totalNum=0;
    cart.forEach(v => {
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    });
    // 判断数组是否为空
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },
  
  /**
   * 设置购物车状态的同时计算底部工具栏的数据
   * @param {*} cart 
   */
  setCart(cart) {
    // 实现计算总价格和总数量 只有被选中的商品才被计算
    let totalPrice=0
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    });
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart",cart);
  },
  /**
   * 支付按钮 需要获取登录信息
   */
  async handleOrderPay() {
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 创建订单
    const cart=wx.getStorageSync("cart")||[];
    let order=cart.filter(v=>v.checked);
    order.forEach(o => {
      o.oid=this.guid()
      o.add_time=this.getDate("yyyy-MM-dd hh:mm:ss");
    });
    wx.setStorageSync("order",order);
    try {
      await showToast({title:"支付成功！"});
    } catch (error) {
      console.log(error);
    }
    // 手动删除已经支付过的购物车中的商品
    let newCart=wx.getStorageSync("cart")||[];
    newCart=newCart.filter(v=>!v.checked);
    wx.setStorageSync("cart",newCart);
    // 跳转到订单页面
    wx.navigateTo({
      url: "/pages/order/index"
    })
  },
  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    // return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    return S4()+S4()+S4()+S4();
  },
  getDate(format) {
    if (format === undefined) format = 'yyyy-MM-dd hh:mm:ss';
    const date = new Date();
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      S: date.getMilliseconds()
    };
  
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }
  
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        );
      }
    }
    return format;
  }
})