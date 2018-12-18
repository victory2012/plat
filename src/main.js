// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import promise from 'es6-promise';
import { Message, MessageBox } from 'element-ui';
// eslint-disable-next-line
import XLSX from 'xlsx';
import App from '@/App';
import router from '@/router';
import ElementUI from '@/UI-component/element';
import CreateStore from '@/store';
import i18n from '@/i18n';
import api from '@/api/index';
import './assets/font/iconfont.css';

const store = CreateStore();
const outputXlsxFile = (data, xlsxName) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, xlsxName);
  XLSX.writeFile(wb, `${xlsxName}.xlsx`);
};
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox;
Vue.prototype.$api = api;

Vue.prototype.$outputXlsxFile = outputXlsxFile;

ElementUI();
promise.polyfill();
Vue.use(Vuex);

router.beforeEach((to, from, next) => {
  const loginData = sessionStorage.getItem('loginData');
  if (to.fullPath !== '/login') {
    if (!loginData) {
      next('/login');
    } else {
      next();
    }
  } else {
    store.commit('setProjectType', '');
    sessionStorage.removeItem('projectType');
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
