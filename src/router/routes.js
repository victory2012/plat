const Login = () =>
  import(/* webpackChunkName: "login" */ '../login/login.vue');
const Home = () => import(/* webpackChunkName: "Home" */ '../layout/index.vue');
const monitorComponent = () =>
  import(/* webpackChunkName: "monitor" */ '../view/index.vue');
const monitorOverview = () =>
  import(/* webpackChunkName: "moniview" */ '../view/Monitor/overview/overview.vue');
const monitorBatteryList = () =>
  import(/* webpackChunkName: "monitorBatteryList" */ '../view/Monitor/batteryList/index.vue');
const monitorBatteryHis = () =>
  import(/* webpackChunkName: "BatteryHis" */ '../view/Monitor/batteryMap/history/history.vue');
const monitorBatteryReal = () =>
  import(/* webpackChunkName: "BatteryReal" */ '../view/Monitor/batteryMap/realTime/realTime.vue');
const monitorBatteryBlack = () =>
  import(/* webpackChunkName: "BatteryBlack" */ '../view/Monitor/batteryblack/black.vue');
const realData = () =>
  import(/* webpackChunkName: "realData" */ '../view/Monitor/run-state/index.vue');
const compare = () =>
  import(/* webpackChunkName: "realData" */ '../view/Monitor/compare/index.vue');
const routes = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/main',
    name: 'main',
    component: Home,
    children: [
      {
        path: '/monitor',
        name: 'monitor',
        component: monitorComponent,
        children: [
          {
            path: '',
            name: '',
            component: monitorOverview,
          },
          {
            path: '/monitor/battery',
            name: 'monitorBatteryList',
            component: monitorBatteryList,
          },
          {
            path: '/monitor/battery/history',
            name: 'monitorBatteryHis',
            component: monitorBatteryHis,
          },
          {
            path: '/monitor/battery/real-time',
            name: 'monitorBatteryReal',
            component: monitorBatteryReal,
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
        ],
      },
      {
        path: '/track',
        name: 'track',
        component: monitorComponent,
      },
    ],
  },
];

export default routes;
