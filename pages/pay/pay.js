import util from "../../utils/util"
Page({
  data: {
      cartInfo:[],
      i:0,
      address:{},
      totalMoney:0,
  },
  onShow(){
      this.getAddress();
      this.getCartData();
      this.initialSetCart();
  },
  pay(){
      let {cartInfo,address} = this.data; 
      let order = wx.getStorageSync('order').data;
      cartInfo.forEach((v,i)=>{
        v.time = util.formatTime(new Date());
        v.address = address.data;
      });
      if(order){
        order.push(cartInfo);
        wx.setStorageSync('order', {time:Date.now(),data:order});
        
        let cartData = wx.getStorageSync('cart').data;
        for(let i=0;i<cartData.length;i++){
          if(cartData[i].isChecked){
            cartData.splice(i,1);
            i = i -1;
          }
        };
        wx.setStorageSync('cart',{time:Date.now(),data:cartData});
      }else{  
        let arr = [];
        arr.push(cartInfo);
        wx.setStorageSync('order', {time:Date.now(),data:arr});
        
        let cart_data = wx.getStorageSync('cart').data;
        for(let i=0;i<cart_data.length;i++){
          if(cart_data[i].isChecked){
            cart_data.splice(i,1);
            i = i -1;
          }
        };
        wx.setStorageSync('cart',{time:Date.now(),data:cart_data});
      }

    // // 将未付款的商品继续保存在购物车
    wx.redirectTo({
      url: '/pages/feedback/feedback?type=0'
    });
    
  },
  // 获取地址
  getAddress(){
    const address = wx.getStorageSync('address');
    if(address){
       this.setData({
         address
       });
    }       
  },
  // 得到购物车数据
  getCartData(){
    let cartInfo = wx.getStorageSync('cart').data;
    cartInfo = cartInfo.filter(v => v.isChecked);
    if(cartInfo){
      this.setData({
        cartInfo
      });
    }
  },
  // 获取总价和全选和总件数(初始化购物车)
  initialSetCart(){
    let totalMoney = 0;
    let i = 0;
    if(this.data.cartInfo.length !==0){
      this.data.cartInfo.forEach(v=> {
        if(v.isChecked){
          totalMoney += (v.goods_price * v.count);
          i += v.count;
        }
        });
    }
    this.setData({
      totalMoney,
      i,
    });
  }
})