import {request} from "../../utils/util"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
     isShow:false,
     val:""
  },
  timeId:-1,
  handleInput(e){
    let {value:val} = e.detail;
    if(!val.trim()){
        this.setData({
          val:"",
          list:[]
        })
    }else{
        clearTimeout(this.timeId);
        this.timeId = setTimeout(()=>{
          this.getSearchData(val);
        },1000)
    }
  },
  async getSearchData(val){
    let res = await request('https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch',"GET",{query:val}); 
    this.setData({
      list:res.data.message,
      isShow:true,
      val
    })
  },
  handleBtn(){
    this.setData({
      list:[],
      isShow:false,
      val:""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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