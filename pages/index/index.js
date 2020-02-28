// pages/index/index.js
import until from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      carouselList:[],
      navList:[],
      floorList:[]
  },
  requestTime:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // 获取轮播图
        until.request("https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata").then((result)=>{
          if(result.statusCode === 200){
             let carouselList = result.data.message;
             carouselList.forEach((v,i)=>{
               v.navigator_url = `/pages/goodDetail/goodDetail?goods_id=${v.goods_id}`
             })
            this.setData({
              carouselList
            })
          }
        }).catch((err)=>{
          console.log(err);
          console.log('轮播图获取数据失败');
        });
        // 获取导航
        until.request("https://api-hmugo-web.itheima.net/api/public/v1/home/catitems").then(
          (res)=>{
            if(res.statusCode === 200){
              let navList = res.data.message;
             this.setData({
              navList
             });
            }
          }
          ).catch((err)=>{
            console.log(err);
            console.log('导航获取数据失败');
          });
          // 获取首页楼层
          until.request("https://api-hmugo-web.itheima.net/api/public/v1/home/floordata").then(
            (res)=>{{
              if(res.statusCode === 200){
                let floorList = res.data.message;
                for(let i=0;i<floorList.length;i++){
                  for(let j=0;j<floorList[i].product_list.length;j++){
                    let cate = floorList[i].product_list[j].navigator_url.split('=')[1];
                    let navigator_url = `/pages/goods_list/goods_list?query=${cate}`;
                    floorList[i].product_list[j].navigator_url = navigator_url;
                  }
                }
               this.setData({
                floorList
               });
            }
          }
        }).catch((err)=>{
          console.log(err);
          console.log('首页女装获取数据失败');
        });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})