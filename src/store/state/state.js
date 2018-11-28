import {
  purchaseCus,
  purchaseAdmin,
  getPlat,
  getManifactorCus,
  getManifactor,
} from '@/dataConfig/sideBar/infoMenu';
import trackData from '@/dataConfig/sideBar/infoTrack';

const loginData = sessionStorage.getItem('loginData');
const projectType = sessionStorage.getItem('projectType');
const premission = sessionStorage.getItem('setUserRole');
// console.log('purchaseCus', purchaseCus);
// console.log('purchaseAdmin', purchaseAdmin);
// console.log('getPlat', getPlat);
// console.log('getManifactorCus', getManifactorCus);
// console.log('getManifactor', getManifactor);
function checkUserPermission() {
  if (loginData) {
    const userInfo = JSON.parse(loginData);
    if (userInfo.layerName === '平台') {
      return getPlat();
    }
    if (userInfo.layerName === '生产企业' && userInfo.type === 2) {
      return getManifactor();
    }
    if (userInfo.layerName === '采购企业' && userInfo.type === 2) {
      return purchaseAdmin();
    }
    if (userInfo.layerName === '生产企业' && userInfo.type === 3) {
      return getManifactorCus();
    }
    if (userInfo.layerName === '采购企业' && userInfo.type === 3) {
      return purchaseCus();
    }
  }
}
export default {
  loginLoading: false, // 登录页的button loading控制
  collapse: true, // 控制sideBar 打开收起, true: 关闭  false： 展开
  projectType: projectType || '', // monitor 项目类型，（即 电池追踪 || 电池监测）
  monitorMenu: checkUserPermission(), // 电池监测 info side bar
  userPermission: premission || '', // 用户权限
  trackMenu: trackData, // 电池追踪 info side bar
  userData: loginData ? JSON.parse(loginData) : '', // 用户登录的数据
};
