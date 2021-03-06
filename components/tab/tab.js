// components/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
        tab:{
          type:Array,
          value:[]
        }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e){
      const {index:currentIndex} = e.currentTarget.dataset;
      this.triggerEvent('handleTab',{currentIndex});
    }
  }
})
