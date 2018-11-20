// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import promise from 'es6-promise';
import App from '@/App';
import router from '@/router';
import ElementUI from '@/UI-component/element';
import CreateStore from '@/store';
import i18n from '@/i18n';
import api from '@/api/index';
import './assets/font/iconfont.css';

Vue.config.productionTip = false;
ElementUI();
promise.polyfill();
Vue.use(Vuex);
Vue.prototype.$api = api;
const store = CreateStore();
router.beforeEach((to, from, next) => {
  const loginData = sessionStorage.getItem('loginData');
  next();
  if (to.fullPath !== '/login') {
    if (!loginData) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
});
