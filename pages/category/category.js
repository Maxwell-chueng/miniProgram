// pages/category/category.js
import {request} from "../../utils/util"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类页面的总数据
      categoryData:[],
      // 分类名称
      categoryName:[],
      // 不同名称对应的不同内容
      categoryList:[],
      // 当前索引
      currentIndex:0,
      // 重新设置scrollTop,点击事件后右侧商品列表回到顶部
      scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  从localStorage中取出分类数据
      const category = wx.getStorageSync('category'); 
      // 如果不存在那么发送请求并且存入localStorage中
         if(!category){
          this.getCategoryData();
         }else{
          //  如果存在localStorage中，那么判断上一次存储的时间是否在一天前
           if(Date.now()-category.time>1000*60*60*24){
            //  一天前存储的数据那么重新发送请求
            this.getCategoryData();
           }else{
            //  存储的时间小于一天，那么从localStorage直接读取
              let message = category.data;
              // 设置到保存分类数据的变量上
              this.setData({
                categoryData:message
               });
              //  得到categoryName
              let cateName = [];
              for(let i in message){
                 cateName.push(message[i].cat_name);
              }
              // 将分类名称和菜单设置到对应变量上
              this.setData({
                categoryName:cateName,
                categoryList:message[0].children
              })
           }
         }

  },
  // 实现点击分类名称切换内容
  switchItems(e){
      //  得到索引index
       let {index:currentIndex} = e.currentTarget.dataset;
      //  将得到的内容和目前的索引保存到对应变量
       this.setData({
         currentIndex,
         categoryList:this.data.categoryData[currentIndex].children,
         scrollTop:0
       })
  },
       async getCategoryData(){
            let  res = await request("https://api-hmugo-web.itheima.net/api/public/v1/categories");
            if(res.statusCode === 200){
             //  得到分类页面的总数据
              let {message} = res.data;
              wx.setStorageSync('category', {time:Date.now(),data:message});
              this.setData({
               categoryData:message
              });
             //  得到categoryName
             let cateName = [];
             for(let i in message){
                cateName.push(message[i].cat_name);
             }
             this.setData({
               categoryName:cateName,
               categoryList:message[0].children
             })
            }
       }
})