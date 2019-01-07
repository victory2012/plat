/* eslint-disable */
import {
  deepClone
} from '@/utils/functions';
import permissionFun from '@/permision/monitor-valated';

const montorData = [{
    text: '概览', // 'menu.overview', // 概览
    link: '/monitor',
    icon: 'iconfont icon-allnormal',
  },
  {
    text: '电池管理', // 'menu.batteryManage', // 电池管理
    icon: 'iconfont icon-monitor1',
    children: [{
        text: '电池信息', // 'menu.batteryInfo', // 电池信息
        children: [{
            text: '电池地图', // 'menu.batteryList', // 电池地图
            children: [{
                text: '实时位置', // 'menu.batteryList', // 实时位置
                link: '/monitor/real-position',
              },
              {
                text: '历史轨迹', // 'menu.batteryList', // 历史轨迹
                link: '/monitor/history-track',
              },
            ],
          },
          {
            text: '电池列表', // 'menu.batteryList', // 电池列表
            link: '/monitor/battery',
          },
          {
            text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
            link: '/monitor/battery/defriend',
          },
        ],
      },
      {
        text: '运行状况', // 'menu.runStatus', // 运行状况
        link: '/monitor/battery/run',
      },
      {
        text: '数据对比', // 'menu.compare', // 数据对比
        link: '/monitor/battery/compare',
      },
      {
        text: '告警数据', // 'menu.alarm', // 告警数据
        link: '/monitor/battery/alarm',
      },
      {
        text: '用户管理', // 'menu.userManage', // 用户管理
        link: '/monitor/user',
        icon: 'iconfont icon-user',
      },
    ],
  },
  {
    text: '配置管理', // 'menu.threshold', // 报警阈值
    icon: 'iconfont icon-electricfence',
    children: [{
        text: '报警阈值', // 'menu.threshold', // 报警阈值
        children: [{
            text: '按电池型号分类', // 'menu.sortByModel', // 按电池型号分类
            link: '/monitor/set/model',
          },
          {
            text: '按企业全局分类', // 'menu.sortByCompany', // 按企业全局分类
            link: '/monitor/set/company',
          },
        ],
      },
      {
        text: '告警通知', // 'menu.WarningNotice', // 告警通知
        children: [{
            text: '告警接收人', // 'menu.receiveList', // 告警接收人
            link: '/monitor/set/receive',
          },
          {
            text: '已添加接收人', // 'menu.addReceive', // 已添加接收人
            link: '/monitor/set/user',
          },
          {
            text: '外部告警接收人', // 'menu.OuterReceive', // 外部告警接收人
            link: '/monitor/set/outer',
          },
        ],
      },
      {
        text: '地理围栏', // 'menu.threshold', // 报警阈值
        children: [{
            text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
            link: '/monitor/company/fence',
          },
          {
            text: '电池群组划分', // 'menu.sortByCompany', // 按企业全局分类
            link: '/monitor/battery/fence',
          },
        ],
      },
    ],
  },
  {
    text: '设备管理', // 'menu.device', // 设备管理
    icon: 'iconfont icon-device',
    children: [{
        text: '设备列表', // 'menu.deviceList', // 设备列表
        link: '/monitor/device/list',
      },
      {
        text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
        link: '/monitor/device/defriend',
      },
    ],
  },
];

console.log('montorData', montorData);
const Allocation = {
  text: '电池调配', // 'menu.Allocation', // 电池调配
  link: '/battery/deployment',
};

// /* 系统管理 */
// const systemDefriend = {
//   text: 'menu.system', // 系统管理
//   icon: 'iconfont icon-system',
//   link: '',
//   children: [
//     {
//       text: 'menu.repairGps', // gps修正
//       link: '/gps/repair',
//     },
//   ],
// };
// listData2.push(systemDefriend);
const title = '电池检测';

/* 生产企业 */
export const getManifactor = () => {
  const listData = deepClone(montorData);
  listData[3].children.splice(1, 1);
  listData[1].children[0].children[3] = Allocation;
  return {
    title,
    data: listData,
  };
};

/* 生产企业用户 */
export const getManifactorCus = () => {
  const listData = deepClone(montorData);
  if (!permissionFun().sameAnalysis) {
    listData[1].children.splice(2, 1);
  }
  if (permissionFun().allocation) {
    listData[1].children[0].children[3] = Allocation;
  }
  if (!permissionFun().alarm) {
    listData[1].children.splice(3, 1);
  }

  if (!permissionFun().addblack) {
    listData[1].children[0].children.splice(2, 1);
  }

  listData[1].children.splice(4, 2);
  listData[3].children.splice(1, 1);
  return {
    title,
    data: listData,
  };
};

/* 平台 */
export const getPlat = () => {
  const listData = deepClone(montorData);
  listData[1].children[0].children.splice(2, 1);
  listData.splice(2, 1);
  return {
    title,
    data: listData,
  };
};

/* 电池采购企业管理员 */
export const purchaseAdmin = () => {
  const listData = deepClone(montorData);
  if (!permissionFun().sameAnalysis) {
    listData[1].children.splice(2, 1);
  }
  if (!permissionFun().alarm) {
    listData[1].children.splice(3, 1);
  }
  if (!permissionFun().addblack) {
    listData[1].children[0].children.splice(2, 1);
  }
  listData[1].children.splice(2, 1);
  listData.splice(3, 1);
  return {
    title,
    data: listData,
  };
};

/* 电池采购企业用户 */
export const purchaseCus = () => {
  const listData = deepClone(montorData);
  listData[1].children.splice(4, 2);
  if (!permissionFun().sameAnalysis) {
    listData[1].children.splice(2, 1);
  }
  if (!permissionFun().addblack) {
    listData[1].children[0].children.splice(2, 1);
  }
  if (!permissionFun().alarm) {
    listData[1].children.splice(3, 1);
  }
  listData.splice(3, 1);
  return {
    title,
    data: listData,
  };
};
