import { request } from "../../request/index"
import { login } from "../../utils/asyncWx"
Page({

  async handleGetUserInfo(e){
    try {
      const { encryptedData, rawData, iv, signature } = e.detail;
      const {code}=await login();
      // const loginParams={ encryptedData, rawData, iv, signature, code }
      // const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
            
      const token='rungit_token_'+code;
      wx.setStorageSync("token",token)
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      console.log(error);
    }
  }
})