// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tab:[{
       id:0,
       name:"收藏的店铺",
       isActive:true
     },{
       id:1,
       name:"收藏的商品",
       isActive:false
     },{
       id:2,
       name:"关注的商品",
       isActive:false
     },{
       id:3,
       name:"我的足迹",
       isActive:false
     }],
     hasCollectionList:true,
     collectionList:[]
  },
  onShow(){
    // onShow中得到路由传参
    let pages =  getCurrentPages();
    let options = pages[pages.length-1].options;
    let {type} = options;
    // 遍历tab更改tab中于的子元素
    this.showTab(type);
    // 根据不同的type获取不同的数据设置到data中以便循环渲染
    this.showCollection(type);
  },
  // 切换tab改变tab中的isActive达到更改class的目的
  changeTab(e){
    let {currentIndex} = e.detail;
    let {tab} = this.data;
    tab.forEach((v,i) => {
      i === currentIndex ? v.isActive = true :v.isActive = false;
    });
    this.showCollection(currentIndex);
    this.setData({
      tab
    });
  },
  // 遍历tab更改tab中于的子元素
  showTab(type){
    let {tab} = this.data;
    tab.forEach((v,i) => {
      i == type ? v.isActive = true : v.isActive = false;
    });
    this.setData({
      tab
    });
  },
  showCollection(type){
    if(type == 0){
        this.setData({
          hasCollectionList:false
        })
    }else if(type == 1){
      let collect = wx.getStorageSync('collection').data;
      if(collect){
          this.setData({
            collectionList:collect,
            hasCollectionList:true
          })
      }else{
        this.setData({
          hasCollectionList:false
        })
      }  
    }else if(type == 2){
          this.setData({
            hasCollectionList:false
          })
    }else if(type == 3){
          let history = wx.getStorageSync('history').data;
          if(history){
            this.setData({
              collectionList:history,
              hasCollectionList:true
            })
          }else{
            this.setData({
              hasCollectionList:false
            })
          }
    }
  }
})