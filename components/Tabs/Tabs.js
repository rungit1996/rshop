// components/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type: Array,
      value: []
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
    handleItemTap(e){
      const {index} = e.currentTarget.dataset;      
      // 父子组件通信
      this.triggerEvent('tabsItemChange',{index}); // 触发父组件事件 自定义
    }
  }
})
