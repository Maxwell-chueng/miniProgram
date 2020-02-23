Page({
  handleGetUserInfo(e){
    let {userInfo} = e.detail;
    wx.setStorageSync('userInfo',{time:Date.now(),data:userInfo});
    wx.navigateBack({
      delta: 1
    });
  }
})