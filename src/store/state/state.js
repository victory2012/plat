import moniData from '@/dataConfig/sideBar/infoMenu';
import trackData from '@/dataConfig/sideBar/infoTrack';

const loginData = sessionStorage.getItem('loginData');
const projectType = sessionStorage.getItem('projectType');
const premission = sessionStorage.getItem('setUserRole');

export default {
  loginLoading: false, // 登录页的button loading控制
  collapse: true, // 控制sideBar 打开收起, true: 关闭  false： 展开
  projectType: projectType || '', // monitor 项目类型，（即 电池追踪 || 电池监测）
  monitorMenu: moniData, // 电池监测 info side bar
  userPermission: premission || '', // 用户权限
  trackMenu: trackData, // 电池追踪 info side bar
  userData: loginData ? JSON.parse(loginData) : '', // 用户登录的数据
};
