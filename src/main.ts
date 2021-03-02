import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './element';

import 'normalize.css/normalize.css';
import '@/assets/sprites/index.scss';
import '@/assets/styles/index.scss';
import '@/assets/styles/element.scss';

import '@/services/directives';
import '@/services/filters';
import '@/services/mixin';

import '@/components/base';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener(
        'hashchange',
        () => {
          const currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath); // 主动更改路由界面
          }
        },
        false
      );
    }
  }
}).$mount('#app');
