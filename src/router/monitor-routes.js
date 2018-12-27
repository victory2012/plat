const monitorOverview = () =>
  import(/* webpackChunkName: "moniview" */ '../view/Monitor/overview/overview.vue');
const monitorBatteryList = () =>
  import(/* webpackChunkName: "monitorBatteryList" */ '../view/Monitor/batteryList/index.vue');
const monitorBatteryFence = () =>
  import(/* webpackChunkName: "monitorBatteryFence" */ '../view/Monitor/fence/battery-fence.vue');
const monitorCompanyFence = () =>
  import(/* webpackChunkName: "BatteryReal" */ '../view/Monitor/fence/company-fence.vue');
const monitorBatteryBlack = () =>
  import(/* webpackChunkName: "BatteryBlack" */ '../view/Monitor/batteryblack/black.vue');
const realData = () =>
  import(/* webpackChunkName: "realData" */ '../view/Monitor/run-state/index.vue');
const compare = () =>
  import(/* webpackChunkName: "compare" */ '../view/Monitor/compare/index.vue');
const Alarm = () =>
  import(/* webpackChunkName: "Alarm" */ '../view/Monitor/alarm/index.vue');
const SetModel = () =>
  import(/* webpackChunkName: "SetModel" */ '../view/Monitor/threshold/battery-model.vue');
const SetCompany = () =>
  import(/* webpackChunkName: "SetCompany" */ '../view/Monitor/threshold/company.vue');
const SetNoticeReceive = () =>
  import(/* webpackChunkName: "SetNoticeReceive" */ '../view/Monitor/notice/notice-person.vue');
const SetNoticeUser = () =>
  import(/* webpackChunkName: "SetNoticeUser" */ '../view/Monitor/notice/addperson.vue');
const SetNoticeOuter = () =>
  import(/* webpackChunkName: "SetNoticeOuter" */ '../view/Monitor/notice/outer.vue');
const DeviceList = () =>
  import(/* webpackChunkName: "DeviceList" */ '../view/Monitor/device/device.vue');
const DeviceReal = () =>
  import(/* webpackChunkName: "DeviceReal" */ '../view/Monitor/device/deviceReal.vue');
const DeviceBlack = () =>
  import(/* webpackChunkName: "DeviceBlack" */ '../view/Monitor/deviceBlack/back-list.vue');
const RealPosition = () =>
  import(/* webpackChunkName: "RealPosition" */ '../view/Monitor/batteryMap/realTime/index.vue');
const HistoryTrak = () =>
  import(/* webpackChunkName: "HistoryTrak" */ '../view/Monitor/batteryMap/history/history.vue');
const MonitorUser = () =>
  import(/* webpackChunkName: "MonitorUser" */ '../view/Monitor/user/user.vue');
const TestTemp = () =>
  import(/* webpackChunkName: "TestTemp" */ '../view/test.vue');
// const Password = () =>
//   import(/* webpackChunkName: "Password" */ '../view/User/password.vue');

const route = [
  {
    path: '/',
    component: monitorOverview,
  },
  {
    path: '/monitor/TestTemp',
    name: 'TestTemp',
    component: TestTemp,
  },
  {
    path: '/monitor/real-position',
    name: 'monitorRealPosition',
    component: RealPosition,
  },
  {
    path: '/monitor/history-track',
    name: 'monitorHistoryTrak',
    component: HistoryTrak,
  },
  {
    path: '/monitor/battery',
    name: 'monitorBatteryList',
    component: monitorBatteryList,
  },
  {
    path: '/monitor/battery/fence',
    name: 'BatteryFence',
    component: monitorBatteryFence,
  },
  {
    path: '/monitor/company/fence',
    name: 'CompanyFence',
    component: monitorCompanyFence,
  },
  {
    path: '/monitor/battery/defriend',
    name: 'monitorBatteryBlack',
    component: monitorBatteryBlack,
  },
  {
    path: '/monitor/battery/run',
    name: 'monitorBatteryrun',
    component: realData,
  },
  {
    path: '/monitor/battery/compare',
    name: 'monitorBatteryCompare',
    component: compare,
  },
  {
    path: '/monitor/battery/alarm',
    name: 'monitorBatteryAlarm',
    component: Alarm,
  },
  {
    path: '/monitor/set/model',
    name: 'monitorSetModel',
    component: SetModel,
  },
  {
    path: '/monitor/set/company',
    name: 'monitorSetCompany',
    component: SetCompany,
  },
  {
    path: '/monitor/set/receive',
    name: 'monitorSetReceive',
    component: SetNoticeReceive,
  },
  {
    path: '/monitor/set/user',
    name: 'monitorSetUser',
    component: SetNoticeUser,
  },
  {
    path: '/monitor/set/outer',
    name: 'monitorSetOuter',
    component: SetNoticeOuter,
  },
  {
    path: '/monitor/device/list',
    name: 'monitorDeviceList',
    component: DeviceList,
  },
  {
    path: '/monitor/device/real',
    name: 'monitorDeviceReal',
    component: DeviceReal,
  },
  {
    path: '/monitor/device/defriend',
    name: 'monitorDeviceDefriend',
    component: DeviceBlack,
  },
  {
    path: '/monitor/user',
    name: 'monitorUser',
    component: MonitorUser,
  },
];

export default route;
