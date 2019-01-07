/* eslint-disable */
import {
  deepClone
} from '@/utils/functions';
import permissionFun from '@/permision/monitor-valated';

const trackMenu = [{
    text: '概览', // 'menu.overview', // 概览
    link: '/track',
    icon: 'iconfont icon-allnormal',
  },
  {
    text: '电池管理', // 'menu.batteryManage', // 电池管理
    icon: 'iconfont icon-dashboard',
    children: [{
        text: '电池信息', // 'menu.batteryInfo', // 电池信息
        children: [{
            text: '电池地图', // 'menu.batteryList', // 电池地图
            children: [{
                text: '实时位置', // 'menu.batteryList', // 实时位置
                link: '/track/real/position',
              },
              {
                text: '历史轨迹', // 'menu.batteryList', // 历史轨迹
                link: '/track/real/history',
              },
            ],
          },
          {
            text: '电池列表', // 'menu.batteryList', // 电池列表
            link: '/track/battery',
          },
          {
            text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
            link: '/track/battery/defriend',
          },
          {
            text: '电池调配', // 'menu.defriend', // 恢复拉黑设备
            link: '/battery/deployment',
          },
        ],
      },
      {
        text: '运行状况', // 'menu.runStatus', // 运行状况
        link: '/track/battery/run',
      },
      {
        text: '告警数据', // 'menu.alarm', // 告警数据
        link: '/track/battery/alarm',
      },
      {
        text: '报警阈值', // 'menu.threshold', // 报警阈值
        children: [{
            text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
            link: '/track/set/company',
          },
          {
            text: '电池型号分类', // 'menu.sortByCompany', // 按企业全局分类
            link: '/track/set/model',
          },
        ],
      },

      {
        text: '告警通知', // 'menu.WarningNotice', // 告警通知
        children: [{
            text: '告警接收人', // 'menu.receiveList', // 告警接收人
            link: '/track/set/receive',
          },
          {
            text: '已添加接收人', // 'menu.addReceive', // 已添加接收人
            link: '/track/set/user',
          },
          {
            text: '外部告警接收人', // 'menu.OuterReceive', // 外部告警接收人
            link: '/track/set/outer',
          },
        ],
      },
    ],
  },
  {
    text: '地理围栏', // 'menu.threshold', // 报警阈值
    children: [{
        text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
        link: '/track/company/fence',
      },
      {
        text: '电池群组划分', // 'menu.sortByCompany', // 按企业全局分类
        link: '/track/battery/fence',
      },
    ],
  },
  {
    text: '用户管理', // 'menu.userManage', // 用户管理
    link: '/track/user',
    icon: 'iconfont icon-user',
  },
  {
    text: '设备管理', // 'menu.device', // 设备管理
    icon: 'iconfont icon-device',
    children: [{
        text: '设备列表', // 'menu.deviceList', // 设备列表
        link: '/device/list',
      },
      {
        text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
        link: '/device/defriend',
      },
    ],
  },
];

const platadmin = deepClone(trackMenu); // 平台管理员
const manufacturAdmin = deepClone(trackMenu); // 生产企业管理员\
const manufacturUser = deepClone(trackMenu); // 生产企业用户
const purchaseAdmin = deepClone(trackMenu); // 电池采购企业管理员
const purchaseUser = deepClone(trackMenu); // 电池采购企业用户

const title = '电池定位追踪';

const Allocation = {
  text: '电池调配', // 'menu.Allocation', // 电池调配
  link: '/battery/deployment',
};

/* 平台 */
export const trackPlat = () => {
  platadmin[1].children.splice(4, 2);
  platadmin[1].children[0].children.splice(3, 1);
  return {
    title,
    data: platadmin,
  };
};

/* 生产企业 */
export const trackManufacturAdmin = () => {
  console.log('manufacturAdmin', manufacturAdmin);
  manufacturAdmin[4].children.splice(1, 1);
  manufacturAdmin[1].children[0].children[3] = Allocation;
  return {
    title,
    data: manufacturAdmin,
  };
};

/* 生产企业用户 */
export const trackManufacturUser = () => {
  if (!permissionFun().sameAnalysis) {
    manufacturUser[1].children.splice(2, 1);
  }
  if (permissionFun().allocation) {
    manufacturUser[1].children[0].children[3] = Allocation;
  }
  if (!permissionFun().alarm) {
    manufacturUser[1].children.splice(3, 1);
  }

  if (!permissionFun().addblack) {
    manufacturUser[1].children[0].children.splice(2, 1);
  }

  manufacturUser[1].children.splice(4, 2);
  manufacturUser[3].children.splice(1, 1);
  // manufacturUser[1].children[0].children.splice(3, 1);
  return {
    title,
    data: manufacturUser,
  };
};

/* 电池采购企业管理员 */
export const trackPurchaseAdmin = () => {
  if (!permissionFun().sameAnalysis) {
    purchaseAdmin[1].children.splice(2, 1);
  }
  if (!permissionFun().alarm) {
    purchaseAdmin[1].children.splice(3, 1);
  }
  if (!permissionFun().addblack) {
    purchaseAdmin[1].children[0].children.splice(2, 1);
  }
  purchaseAdmin[1].children.splice(2, 1);
  purchaseAdmin.splice(3, 1);
  purchaseAdmin[1].children[0].children.splice(3, 1);
  return {
    title,
    data: purchaseAdmin,
  };
};

/* 电池采购企业用户 */
export const trackPurchaseUser = () => {
  purchaseUser[1].children.splice(4, 2);
  if (!permissionFun().sameAnalysis) {
    purchaseUser[1].children.splice(2, 1);
  }
  if (!permissionFun().addblack) {
    purchaseUser[1].children[0].children.splice(2, 1);
  }
  if (!permissionFun().alarm) {
    purchaseUser[1].children.splice(3, 1);
  }
  purchaseUser.splice(3, 1);
  purchaseUser[1].children[0].children.splice(3, 1);
  return {
    title,
    data: purchaseUser,
  };
};
