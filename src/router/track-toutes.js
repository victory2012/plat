/* 概览 */
const trackOverview = () =>
  import(/* webpackChunkName: "trackOverview" */ '../view/Track/overview/overview.vue');

/* 电池列表 */
const trackBatteryList = () =>
  import(/* webpackChunkName: "trackBatteryList" */ '../view/Track/batteryList/index.vue');

/* 实时位置 */
const trackRealPosition = () =>
  import(/* webpackChunkName: "trackRealPosition" */ '../view/Track/realPosition/index.vue');

/* 历史轨迹 */
const trackHistory = () =>
  import(/* webpackChunkName: "trackHistory" */ '../view/Track/history-track/index.vue');

/* 拉黑列表 */
const batteryBlack = () =>
  import(/* webpackChunkName: "BatteryBlack" */ '../view/Monitor/batteryblack/black.vue');

/* 电池调配 */
const trackDeployment = () =>
  import(/* webpackChunkName: "deployment" */ '../view/Track/deployment');
/* 电池组围栏 */
const BatteryFence = () =>
  import(/* webpackChunkName: "BatteryHis" */ '../view/Monitor/fence/battery-fence.vue');
/* 公司围栏 */
const CompanyFence = () =>
  import(/* webpackChunkName: "BatteryReal" */ '../view/Monitor/fence/company-fence.vue');
/* 电池型号阈值 */
const SetModel = () =>
  import(/* webpackChunkName: "SetModel" */ '../view/Monitor/threshold/battery-model.vue');
/* 公司阈值 */
const SetCompany = () =>
  import(/* webpackChunkName: "SetCompany" */ '../view/Monitor/threshold/company.vue');
/* 添加告警接收人 */
const SetNoticeReceive = () =>
  import(/* webpackChunkName: "SetNoticeReceive" */ '../view/Monitor/notice/notice-person.vue');
/* 添加告警接收人 */
const SetNoticeUser = () =>
  import(/* webpackChunkName: "SetNoticeUser" */ '../view/Monitor/notice/addperson.vue');
/* 外部接收人 */
const SetNoticeOuter = () =>
  import(/* webpackChunkName: "SetNoticeOuter" */ '../view/Monitor/notice/outer.vue');
const Alarm = () =>
  import(/* webpackChunkName: "Alarm" */ '../view/Monitor/alarm/index.vue');
const realData = () =>
  import(/* webpackChunkName: "realData" */ '../view/Monitor/run-state/index.vue');
const routes = [
  {
    path: '/',
    component: trackOverview,
  },
  {
    path: '/track/battery/alarm',
    name: 'trackBatteryAlarm',
    component: Alarm,
  },
  {
    path: '/track/battery/run',
    name: 'trackBatteryRun',
    component: realData,
  },
  {
    path: '/track/set/receive',
    name: 'trackSetReceive',
    component: SetNoticeReceive,
  },
  {
    path: '/track/set/user',
    name: 'trackSetUser',
    component: SetNoticeUser,
  },
  {
    path: '/track/set/outer',
    name: 'trackSetOuter',
    component: SetNoticeOuter,
  },
  {
    path: '/track/set/company',
    name: 'trackSetCompany',
    component: SetCompany,
  },
  {
    path: '/track/set/model',
    name: 'trackSetModel',
    component: SetModel,
  },
  {
    path: '/track/battery/fence',
    name: 'trackBatteryFence',
    component: BatteryFence,
  },
  {
    path: '/track/company/fence',
    name: 'trackCompanyFence',
    component: CompanyFence,
  },
  {
    path: '/track/battery',
    name: 'trackBatteryList',
    component: trackBatteryList,
  },
  {
    path: '/track/real/position',
    name: 'trackRealTime',
    component: trackRealPosition,
  },
  {
    path: '/track/real/history',
    name: 'trackRealHistory',
    component: trackHistory,
  },
  {
    path: '/track/battery/defriend',
    name: 'trackBatteryDefriend',
    component: batteryBlack,
  },
  {
    path: '/battery/deployment',
    component: trackDeployment,
  },
];

export default routes;
