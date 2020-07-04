import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    inputValue:''
  },
  TimeId:-1,

  handleInput(e){
    console.log(e);
    const {value}=e.detail;
    if(!value.trim()){ // 做输入框值是否合法性的验证
      this.setData({
        goods:[],
        isFocus:false
      });
      clearTimeout(this.TimeId);
      return;
    }
    this.setData({isFocus:true});
    // 防抖 使用一个定时器来解决
    /**
     * 防抖：一般输入框中使用 防止重复输入 重复发送请求
     * 节流：一般用于页面上拉和下拉
     */
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
  },
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({goods:res})
  },
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }

})