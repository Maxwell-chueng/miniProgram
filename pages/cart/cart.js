Page({
  data: {
      cartInfo:[],
      i:0,
      address:{},
      isAllChecked:true,
      totalMoney:0,
      isDisable:true
  },
      onShow(){
        this.getCartData();
        this.initialSetCart();
        const address = wx.getStorageSync('address');
        if(address){
           this.setData({
             address
           });
        }
  },
  // 结算按钮
  goPay(){
    let {cartInfo,address,i} = this.data;
    let justify = cartInfo.every(v => v.isChecked === false);
    if(cartInfo.length === 0 || justify){
      wx.showToast({
        title: '您还没有选中商品',
        icon:"none",
        mask: true
      });
    }else if(typeof address.data == 'undefined'){
      wx.showToast({
        title: '您还没有添加地址',
        icon:"none",
        mask: true
      });
    }else if(i>0 && cartInfo.length !== 0 && typeof address.data !== 'undefined'){
       wx.navigateTo({
         url: '/pages/pay/pay'
       });
    }
  },
  // 获取地址
  getAddress(){
      wx.getSetting({
        success: (result) => {
          let scopeAddress = result.authSetting['scope.address'];
          if(scopeAddress === true || scopeAddress === undefined){
            wx.chooseAddress({
              success: (result) => {
                this.setData({
                  address:{
                    province:result.provinceName,
                    city:result.cityName,
                    zone:result.countyName,
                    detail:result.detailInfo,
                    phone:result.telNumber,
                    name:result.userName,
                    post:result.postalCode
                  }
                });
                wx.setStorageSync('address',{time:Date.now(),data:this.data.address})
              }
            });
          }else{
             wx.openSetting({
               success: (result) => {
                 wx.chooseAddress({
                   success: (result) => {
                    this.setData({
                      address:{
                        province:result.provinceName,
                        city:result.cityName,
                        zone:result.countyName,
                        detail:result.detailInfo,
                        phone:result.telNumber,
                        name:result.userName,
                        post:result.postalCode,
                      }
                    });
                    wx.setStorageSync('address',{time:Date.now(),data:this.data.address})
                   }
                 });
               }
             });       
          }
        }
      });       
  },
  // 得到购物车数据
  getCartData(){
    let cartInfo = wx.getStorageSync('cart').data;
    if(cartInfo){
      this.setData({
        cartInfo,
        check:true
      });
    }
  },
  // 单件商品的加减
  changeNum(e){
    let {cartInfo} = this.data;
    let {index,type} = e.currentTarget.dataset;
    let good = `cartInfo[${index}].count`;
    let count = this.data.cartInfo[index].count;
    if(type === 'plus'){
      this.setData({
        [good]:count+1
      })
    }else if(type === 'desc' && count <= 1){
      wx.showModal({
        title: '提示',
        content: '是否删除该商品?',
        success: (result) => {
          if (result.confirm) {
            cartInfo.splice(index,1);
            this.setData({
              cartInfo
            });
            wx.setStorageSync('cart',{time:Date.now(),data:cartInfo});
          }else{
            console.log('用户取消');
          }
        }
      });        
    }else if(type === 'desc'){
      this.setData({
        [good]:count-1
      })
    }
    wx.setStorageSync('cart',{time:Date.now(),data:cartInfo});
    this.initialSetCart();
  },
  // 切换单个商品checkbox
  checkSomeOne(e){
    // 切换true false
    let {index} = e.target.dataset;
    let {cartInfo} = this.data;
    let someOneIsChecked = cartInfo[index].isChecked;
    someOneIsChecked = !someOneIsChecked;
    let change = `cartInfo[${index}].isChecked`;
    this.setData({
      [change]:someOneIsChecked
    });
    // 实现单个true false对全选框的控制
    let a = this.data.cartInfo;
    let isAllChecked = a.length!==0?a.every(v=> v.isChecked):false;
    this.setData({
      isAllChecked
    });
    wx.setStorageSync('cart',{time:Date.now(),data:this.data.cartInfo});
    this.initialSetCart();
  },
  // 切换全选checkbox
  checkAll(){
      let {cartInfo,isAllChecked} = this.data;
      if(cartInfo.length !== 0){
        isAllChecked = !isAllChecked;
        cartInfo.forEach(v => v.isChecked = isAllChecked);
        this.setData({
          cartInfo,
          isAllChecked,
          isDisable:false
        })
      }else{
        this.setData({
          isDisable:true
        })
      }
      this.initialSetCart();
  },
  // 获取总价和全选和总件数(初始化购物车)
  initialSetCart(){
    let totalMoney = 0;
    let isAllChecked = true;
    let i = 0;
    let isDisable = false;
    if(this.data.cartInfo.length !==0){
      this.data.cartInfo.forEach(v=> {
        if(v.isChecked){
          totalMoney += (v.goods_price * v.count);
          i += v.count;
        }else{
          isAllChecked = false;
        }
        });
    }else{
      isDisable = true;
    }
      isAllChecked = this.data.cartInfo.length === 0 ? isAllChecked = false : isAllChecked = isAllChecked;
    this.setData({
      totalMoney,
      isAllChecked,
      i,
      isDisable
    });
    wx.setStorageSync('cart',{time:Date.now(),data:this.data.cartInfo});
  }
})