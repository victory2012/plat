import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale';
import zh from './lang/LangZh';
import en from './lang/LangEn';

Vue.use(VueI18n);

const messages = {
  zh: Object.assign(zh, zhLocale),
  en: Object.assign(en, enLocale),
};

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh',
  // fallbackLocale: 'CN',
  messages,
});
ElementLocale.i18n((key, value) => i18n.t(key, value));
export default i18n;
