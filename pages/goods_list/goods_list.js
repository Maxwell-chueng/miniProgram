import {request} from "../../utils/util"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 列表参数
      goodListData:[],
      // tab
      tab:[{
        id:0,
        name:"综合",
        isActive:true
      },{
        id:1,
        name:"销售",
        isActive:false
      },{
        id:2,
        name:"价格",
        isActive:false
      }]
  },
  // 设置请求参数
  requestParams:{
    query:'',
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPage:"",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
         if(options.cid){
           this.requestParams.cid = options.cid;
          }else if(options.query){
            this.requestParams.query = options.query;
         }
         this.getListData();
        },
  // 下拉刷新事件
  onPullDownRefresh(){
        // 重置数组数据
         this.setData({
           goodListData:[]
         });
        //  重置请求配置
        this.requestParams.pagenum = 1;
        this.totalPage = "";
        // 重新发送请求
        this.getListData();
  },
  // 上拉触底事件
  async onReachBottom(){
        let {currentIndex,goodListData} = this.data;
        if(Math.ceil(this.totalPage / this.requestParams.pagesize) >  this.requestParams.pagenum){
            this.requestParams.pagenum++;
            let goodListDatas = await request('https://api.zbztb.cn/api/public/v1/goods/search','GET',this.requestParams);
            if(goodListDatas.statusCode === 200){
                // 得到数据总条数
                let {total} = goodListDatas.data.message;
                this.totalPage = total;
                goodListDatas = goodListDatas.data.message.goods;
                // 对数据的图片图片缺失和价格异常做出处理
                goodListDatas.forEach(v=> {
                  v.goods_price === 0 ? 4323 :v.goods_price;
                  v.goods_small_logo = v.goods_small_logo == "" ? 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3136626573,2216251976&fm=26&gp=0.jpg':v.goods_small_logo;
                });
                // currentIndex为2时，tab处于价格，按价钱升序
                if(currentIndex===2){
                  function sortPrice(a,b){
                    return a.goods_price - b.goods_price;
                  };
                  goodListDatas.sort(sortPrice);
                  // currentIndex为1时，tab处于销量，按goods_id升序
                  }else if(currentIndex === 1){
                      function sortGoodsId(a,b){
                        return a.goods_id - b.goods_id;
                      };
                      goodListDatas.sort(sortGoodsId);
                };
                // 也可以使用concat合拼数组
                // goodListData = goodListData.concat(goodListDatas);
                this.setData({
                  // 使用三点运算符结构组合数组
                  goodListData:[...goodListData,...goodListDatas]
                });
            }else{
              console.log('获取下拉数据失败');
          }
        }else{
            wx.showToast({
              title: '没有下一页数据'
            });            
        }
  },    
  // 点击切换tab事件
  handleTab(e){
      let {currentIndex} = e.detail;
      let {tab,goodListData} = this.data;
      tab.forEach((v,i)=>i === currentIndex? v.isActive = true : v.isActive = false);
      if(currentIndex ===2){
          // 按价格
        function sortPrice(a,b){
          return a.goods_price - b.goods_price;
        };
        goodListData.sort(sortPrice);
      }else if(currentIndex === 1){
        function sortGoodsId(a,b){
          return a.goods_id - b.goods_id;
        };
        goodListData.sort(sortGoodsId);
      }
      this.setData({
        tab,goodListData,currentIndex
      });
  },
  async getListData(){
      let goodListData = await request('https://api.zbztb.cn/api/public/v1/goods/search','GET',this.requestParams);
      if(goodListData.statusCode === 200){
          // 得到数据总条数
          let {total} = goodListData.data.message;
          this.totalPage = total;
          goodListData = goodListData.data.message.goods;
          goodListData.forEach(v=> {
            v.goods_price = v.goods_price == 0 ? 4323 :v.goods_price;
            v.goods_small_logo = v.goods_small_logo == "" ? 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3136626573,2216251976&fm=26&gp=0.jpg':v.goods_small_logo;
          });
          this.setData({
            goodListData
          });
          // 得到数据后关闭下拉刷新效果
          wx.stopPullDownRefresh();    
      }else{
          console.log('获取产品列表数据失败');
      }
  }
})