// pages/feedback/feedback.js
import util from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
       tab:[
         {
           id:0,
           name:"全部订单",
           isActive:true
         },{
           id:1,
           name:"待付款",
           isActive:false
         },{
           id:0,
           name:"待收货",
           isActive:false
         },{
           id:0,
           name:"退货/换货",
           isActive:false
         }
       ],
       type:0,
       hasOrderList:true,
       currentIndex:0,
       orderData:[],
       num:0
  },
  onLoad(e){
    // 得到type
    this.getType(e);
    let {type} = this.data;
    this.setData({
      type
    });
  },
  onShow(){
    let {type,tab} = this.data;
    let orderData = wx.getStorageSync('order').data;
    this.switchData(type,tab,orderData);
    this.getTotalCount();
  },
  onUnload(){
    wx.switchTab({
      url: '/pages/user/user'
    });
      
  },
  getTotalCount(){
    let num = 0;
    for(let i=0;i<this.data.orderData.length;i++){
      for(let j=0;j<this.data.orderData[i].length;j++){
        num += this.data.orderData[i][j].count;
      }
    }
    this.setData({
      num
    })
  },
  getType(e){
    let {type} = e;
    this.setData({
      type
    })
  },
  handleTabBar(e){
    let {currentIndex} = e.detail;
    let {tab,orderData} = this.data;
    tab.forEach((v,i) => {
        i === currentIndex ? v.isActive = true: v.isActive=false;
    });
    this.switchTab(currentIndex,orderData,tab);
  },
  switchData(type,tab,orderData){
    if(orderData){
      // 全部订单按时间排序
      if(type == 0){
          this.setData({
            orderData,
            currentIndex:0
          })
      }else if(type == 1){  
          function sortPrice(a,b){
              for(let i in orderData){
                return a[i].goods_price - b[i].goods_price;
              }
          }
          orderData.sort(sortPrice);
          this.setData({
            orderData,
            currentIndex:1
          })
      }else if(type == 2){
          function sortPrice(a,b){
            for(let i in orderData){
              return a[i].cat_id - b[i].cat_id;
            }
         }
        orderData.sort(sortPrice);
        this.setData({
          orderData,
          currentIndex:2
        })
      }else if(type == 3){
        function sortPrice(a,b){
          for(let i in orderData){
            return a[i].count - b[i].count;
          }
       }
      orderData.sort(sortPrice);
      this.setData({
        orderData,
        currentIndex:3
      })
      }
      tab.forEach((v,i) => {
        i == type ? v.isActive = true: v.isActive=false;
      });
      }else{
        this.setData({
          hasOrderList:false
        })
      }
      this.setData({
        tab
      })
    },
    switchTab(currentIndex,orderData,tab){
      if(orderData){
        // 全部订单按时间排序
        if(currentIndex == 0){
            this.setData({
              orderData,
              currentIndex:0
            })
        }else if(currentIndex == 1){  
            function sortPrice(a,b){
                for(let i in orderData){
                  return a[i].goods_price - b[i].goods_price;
                }
            }
            orderData.sort(sortPrice);
            this.setData({
              orderData,
              currentIndex:1
            })
        }else if(currentIndex == 2){
            function sortPrice(a,b){
              for(let i in orderData){
                return a[i].cat_id - b[i].cat_id;
              }
           }
          orderData.sort(sortPrice);
          this.setData({
            orderData,
            currentIndex:2
          })
        }else if(currentIndex == 3){
          function sortPrice(a,b){
            for(let i in orderData){
              return a[i].count - b[i].count;
            }
         }
        orderData.sort(sortPrice);
        this.setData({
          orderData,
          currentIndex:3
        })
        }
        }else{
          this.setData({
            hasOrderList:false
          })
        }
      this.setData({
         tab,
         currentIndex
      })
    }
})