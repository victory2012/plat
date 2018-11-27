const trackOverview = () =>
  import(/* webpackChunkName: "trackOverview" */ '../view/Track/overview/overview.vue');
const trackBatteryList = () =>
  import(/* webpackChunkName: "trackBatteryList" */ '../view/Track/batteryList/index.vue');

const routes = [
  {
    path: '/',
    component: trackOverview,
  },
  {
    path: '/track/battery',
    component: trackBatteryList,
  },
];

export default routes;
