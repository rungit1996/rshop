import { getSetting,openSetting,chooseAddress,showModal,showToast } from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart=wx.getStorageSync("cart")||[];
    // // 实现全选功能 所有的商品都被选中 全选就被选中了
    // // every是一个数组方法 会接收一些回调函数，当这些回调函数都返回true那么every方法的返回值则为true
    // // 当一个空数组调用了every方法返回值就是true
    // // const allChecked=cart.length?cart.every(v=>v.checked):false;
    // let allChecked=true;
    // // 实现计算总价格和总数量 只有被选中的商品才被计算
    // let totalPrice=0
    // let totalNum=0;
    // cart.forEach(v => {
    //   if(v.checked){
    //     totalPrice+=v.num*v.goods_price;
    //     totalNum+=v.num;
    //   }else{
    //     allChecked=false;
    //   }
    // });
    // // 判断数组是否为空
    // allChecked=cart.length!=0?allChecked:false;
    this.setCart(cart);
    this.setData({
      address
    })
  },
  /**
   * 获取收获地址
   */
  async handleChooseAddress(){

    // wx.chooseAddress({
    //   success: (res)=>{
    //     console.log(res);
        
    //   }
    // })

    // wx.getSetting({
    //   success: (res)=>{
    //     const scopeAddress=res.authSetting['scope.address'];
    //     if(scopeAddress===true||scopeAddress===undefined) {
    //       wx.chooseAddress({
    //         success: (res)=>{
    //           console.log(res);
              
    //         }
    //       })
    //     }else {
    //       // 当用户曾拒绝过授予权限
    //       wx.openSetting({
    //         success: (res)=>{
    //           wx.chooseAddress({
    //             success: (res)=>{
    //               console.log(res);
                  
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
    
    try{
      const res = await getSetting();     
      const scopeAddress=res.authSetting['scope.address'];     
      if(scopeAddress===false) {       
        await openSetting();     
      }     
      let address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      wx.setStorageSync("address",address)
      
    }catch(err){
      console.log(err);
    }
  },
  /**
   * 实现商品选中 取反商品对象的选中状态 重新计算商品总价和数量
   * @param {*} e 
   */
  handleItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;
    this.setData({
      cart
    })
    this.setCart(cart);
  },
  /**
   * 设置购物车状态的同时计算底部工具栏的数据
   * @param {*} cart 
   */
  setCart(cart) {
    let allChecked=true;
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
   * 商品全选功能
   */
  handleItemCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },

  /**
   * 商品数量的编辑功能
   * @param {*} e 
   */
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id);
    // 当商品数量为1时用户点击减号按钮时提示用户是否删除该商品
    if(cart[index].num===1&&operation===-1) {
      const res = await showModal({content:"是否要删除?"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      } 
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  /**
   * 点击结算 需要先判断收货地址 判断用户是否有选购商品
   */
  async handlePay(){
    const {address,totalNum}=this.data;
    if(!address.userName) {
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    if(totalNum===0) {
      await showToast({title:"您还没有选择商品"});
      return;
    }
    wx.navigateTo({
      url:"/pages/pay/index"
    });
  }
  
})