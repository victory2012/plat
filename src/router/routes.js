import monitorRoutes from './monitor-routes';
import trackRoutes from './track-toutes';

const Login = () =>
  import(/* webpackChunkName: "login" */ '../login/login.vue');
const Home = () => import(/* webpackChunkName: "Home" */ '../layout/index.vue');
const monitorComponent = () =>
  import(/* webpackChunkName: "monitor" */ '../view/index.vue');
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
        component: monitorComponent,
        children: [...monitorRoutes],
      },
      {
        path: '/track',
        component: monitorComponent,
        children: [...trackRoutes],
      },
    ],
  },
];

export default routes;
