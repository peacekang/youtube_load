import Vue from 'vue';

const globalFilter: { [prop: string]: Function } = {
  /**
   * 在这里添加你的全局过滤器函数
   */
};

/**
 * 注册全局过滤器
 */
Object.keys(globalFilter).forEach(k => Vue.filter(k, globalFilter[k]));

export default globalFilter;
