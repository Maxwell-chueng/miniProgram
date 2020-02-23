Page({
  data: {
     userInfo:{},
     isHasData:true,
     collectNum:0,
     historyNum:0
  },
  onShow(){
      this.getUserInfo();
      this.getCollectionNum();
  },
  getUserInfo(){
    let userInfo = wx.getStorageSync('userInfo').data;
    if(userInfo){
       this.setData({
         userInfo,
         isHasData:true
       })
    }else{
      this.setData({
        isHasData:false
      })
    }
  },
  getCollectionNum(){
    // 得到收藏商品的数量
    let collect = wx.getStorageSync('collection').data||[];
    let history = wx.getStorageSync('history').data||[];
    // 得到浏览历史的数量
    this.setData({
      collectNum: collect.length,
      historyNum:history.length
    })
  }
})