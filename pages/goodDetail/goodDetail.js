import {request} from "../../utils/util"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goodDetailData:{},
    isCollect:false
  },
  async onShow(){
    let currentPage = getCurrentPages();
    let options = currentPage[currentPage.length-1].options;
    let {goods_id} =  options;
    // 发送请求，得到页面数据
    await this.getGoodDetail(goods_id);
    // 读取该商品是否收藏
    this.getCollection(goods_id);
    // 将该商品加入到浏览足迹中
    this.setHistory(goods_id);
  },
  // 设置历史将该商品加入到浏览足迹中
  setHistory(goods_id){
    let {goodDetailData} = this.data;
    let history = wx.getStorageSync('history').data||[];
    history.findIndex(v=>v.goods_id == goods_id) == -1? history.push(goodDetailData):'';
    wx.setStorageSync('history', {data:history}); 
  },
  // 点击实现商品收藏
  collection(){
     let {isCollect,goodDetailData} = this.data;
     let {goods_id} = goodDetailData;
    //  如果localStorage中存在收藏那么取出如果不存在那么赋值空数组
     let collect = wx.getStorageSync('collection').data||[];
    //  由于之前先执行了onShow，那么isCollect已经可以作为判断缓存中是否存在这件商品的依据
     if(isCollect){
      //  如果存在，再点击之后应该取消收藏，那么遍历数组，将该索引下的对象去除
       collect.forEach((v,i) => {
          if(v.goods_id == goods_id){
            collect.splice(i,1);
          }
       });
       this.setData({
         isCollect:false
       });
       wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });  
     }else{
      //  如果不存在，那么将页面数据加入缓存
         collect.push(goodDetailData);
         this.setData({
           isCollect:true
         });
         wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true
        });  
     }
    //  无论如何最后都要保存再缓存中
     wx.setStorageSync('collection',{data:collect});
       
  },
  // 读取商品是否收藏
  getCollection(goods_id){
      let collect = wx.getStorageSync('collection').data;
      if(collect){
        // 如果缓存中存在商品收藏列表，那么通过findIndex查找列表中是否存在该商品，返回1为不存在，那么isCollect依旧为false，如果存在那么设置为true
        collect.findIndex(v=> v.goods_id == goods_id) == -1?  this.setData({isCollect:false}):this.setData({isCollect:true});
      }else{
        // 如果缓存中不存在该商品，那么isCollect为false
        this.setData({
          isCollect:false
        });
      }  
  },
  // 发送请求获取产品细节页面数据
  async getGoodDetail(goods_id){
    let goodDetailData = await request('https://api-hmugo-web.itheima.net/api/public/v1/goods/detail','GET',{goods_id});
    // 如果状态码为200，则请求成功
    if(goodDetailData.statusCode === 200){
      goodDetailData = goodDetailData.data.message;
      // 判断请求的商品数据中是否存在图片
      if(!goodDetailData.pics[0]){
        // 如果不存在，那么手动添加默认图片
        let obj = {pics_mid:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3136626573,2216251976&fm=26&gp=0.jpg"}
        goodDetailData.pics.push(obj);
      }
      // 如果该商品价格为0元，那么更改为4323元
      goodDetailData.goods_price = goodDetailData.goods_price === 0 ? 4323 : goodDetailData.goods_price;
      // 将轮播图中的图片设置到全局对象上，以便之后设置轮播图预览图的时候作为urls数组使用
      this.previewImage = goodDetailData.pics;
        //  去除接收请求对象内多余的属性优化性能
        // 针对iphone不支持webp格式的图片，使用正则替换为.jpg结尾
         this.setData({
            goodDetailData:{
            pics:goodDetailData.pics,
            goods_price:goodDetailData.goods_price,
            goods_name:goodDetailData.goods_name,
            goods_introduce:goodDetailData.goods_introduce.replace(/\.webp/g,'.jpg'),
            goods_id:goodDetailData.goods_id
           }
         });
        //  为之后添加到购物车做数据准备，将产品请求的全部数据设置到goodsObj上，设置个数为一个，设置在购物车的checkbox中默认选中
         this.goodsObj = goodDetailData;
         this.goodsObj.count = 1;
         this.goodsObj.isChecked = true;
    }else{
      console.log('获取数据失败');
    }
  },
  // 预览图片
  previewImage:{},
  handlePreviewImage(e){
    // map自带return且和forEach不同的是，他并不改变原数组，这边使用map直接得到了previewImage对象中存放的所有用于轮播图的图片
    let urls = this.previewImage.map((v,i)=> v.pics_mid);
    // type用于判断请求中是否包含图片
    let {current,type} = e.currentTarget.dataset;
    // 如果包含
    if(type == 'hasImage'){
      wx.previewImage({
        // 通过循环中{{item.pics}}得到
        // 轮播图现在滑到第几张图片对应的src
        current,
        // 商品轮播图所有的图片src组成的数组,的通过previewImage对象得到
        urls
      });
    }else{
      // 如果商品不存在图片.只有后来手动设置的默认图片
      wx.previewImage({
        // 因为只有一张图片,所有current直接写死为第一张,不需要传入变量
        current:1,
        // 而第一张图片对应的src也应当是默认图片对应的src
        urls:["https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3136626573,2216251976&fm=26&gp=0.jpg"]
      })
    }
      
  },
  // 用于存放本次加入购物车的数据
  goodsObj:{},
  // 加入购物车
  addCart(){
    const cart = wx.getStorageSync('cart').data;
    // 如果已有购物车
    if(cart){
      let index = cart.findIndex(v => v.goods_id === this.goodsObj.goods_id);
      // 如果购物车不存在相同的商品
      if(index == -1){
         cart.push(this.goodsObj);  
      // 如果购物车存在相同的商品，count++
       }else{
         cart[index].count++;
       }
       wx.setStorageSync('cart',{time:Date.now(),data:cart});
      //  如果没有购物车
    }else{
      let cartObj = [];
      cartObj.push(this.goodsObj);
      wx.setStorageSync('cart',{time:Date.now(),data:cartObj});
    }
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      mask: true
    });     
  }
})