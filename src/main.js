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

Vue.config.productionTip = false;
ElementUI();
promise.polyfill();
Vue.use(Vuex);
const store = CreateStore();
router.beforeEach((to, from, next) => {
  const loginData = sessionStorage.getItem('loginData');
  if (!loginData) {
    next('/login');
    return;
  }
  next();
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
