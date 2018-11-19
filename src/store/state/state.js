import moniData from './infoMenu';
import trackData from './infoTrack';

export default {
  collapse: true, // 控制sideBar 打开收起, true: 关闭  false： 展开
  projectType: 'monitor', // 项目类型，（即 电池追踪 || 电池监测）
  monitorMenu: moniData, // 电池监测 info side bar
  trackMenu: trackData, // 电池追踪 info side bar
};
