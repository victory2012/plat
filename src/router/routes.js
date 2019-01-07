import monitorRoutes from './monitor-routes';
import trackRoutes from './track-toutes';

const Login = () =>
  import( /* webpackChunkName: "login" */ '../login/login.vue');
const Home = () => import( /* webpackChunkName: "Home" */ '../layout/index.vue');
const SubComponent = () =>
  import( /* webpackChunkName: "monitor" */ '../view/index.vue');

const userInfo = () =>
  import( /* webpackChunkName: "userInfo" */ '../view/User/user.vue');
const Password = () =>
  import( /* webpackChunkName: "Password" */ '../view/User/password.vue');
// const userManage = () =>
//   import( /* webpackChunkName: "userManage" */ '../view/Monitor/user/user');
/* eslint-disable */
const routes = [{
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
    children: [{
        path: '/monitor',
        component: SubComponent,
        children: [...monitorRoutes],
      },
      {
        path: '/track',
        component: SubComponent,
        children: [...trackRoutes],
      },
      {
        path: '/user/info',
        component: userInfo,
      },
      {
        path: '/user/password',
        component: Password,
      },
    ],
  },
];

export default routes;
