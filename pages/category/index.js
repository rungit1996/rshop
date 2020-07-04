import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 点击左侧菜单右侧菜单顶部显示
    scrollTop:0,
    // 右侧商品数据
    rightContent:[],
    // 接口返回的数据
    Cates:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存策略 在页面加载后先判断本地存储中是否存在旧数据 如果没有则发送请求 如果有切没有过期就使用本地存储的旧数据
    const Cates = wx.getStorageSync('cates');
    if(!Cates) {
      this.getCates();
    }else {
      if(Date.now()-Cates.time>1000*10){
        this.getCates();
      }else{
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCates() {
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;
    //   // 将获取到的分类数据存入本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 使用es7的async await 语法 来发送请求 具体在函数前加async 在请求方法前加await

    let result = await request({url:"/categories"})
    this.Cates=result;
    // 将获取到的分类数据存入本地存储中
    wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;   
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置右侧内容标签距离顶部内容
      scrollTop:0
    }) 
  }

})