const trackOverview = () =>
  import(/* webpackChunkName: "trackOverview" */ '../view/Track/overview/overview.vue');

const routes = [
  {
    path: '/',
    component: trackOverview,
  },
];

export default routes;
