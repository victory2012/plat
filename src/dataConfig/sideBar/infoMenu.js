import { deepClone } from '@/utils/functions';
import permissionFun from '@/permision/valated';

const montorData = [
  {
    text: '概览', // 'menu.overview', // 概览
    link: '/monitor',
    icon: 'iconfont icon-allnormal',
  },
  {
    text: '电池管理', // 'menu.batteryManage', // 电池管理
    icon: 'iconfont icon-monitor1',
    children: [
      {
        text: '电池信息', // 'menu.batteryInfo', // 电池信息
        children: [
          {
            text: '电池地图', // 'menu.batteryList', // 电池地图
            children: [
              {
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
        text: '报警阈值', // 'menu.threshold', // 报警阈值
        children: [
          {
            text: '按电池型号分类', // 'menu.sortByModel', // 按电池型号分类
            link: '/monitor/set/model',
          },
          {
            text: '按企业全局分类', // 'menu.sortByCompany', // 按企业全局分类
            link: '/monitor/set/company',
          },
        ],
      },
      // {
      //   text: '地理围栏', // 'menu.threshold', // 报警阈值
      //   link: '5',
      //   children: [
      //     {
      //       text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
      //       link: '/set/model',
      //     },
      //     {
      //       text: '电池群组划分', // 'menu.sortByCompany', // 按企业全局分类
      //       link: '/set/company',
      //     },
      //   ],
      // },
      {
        text: '告警通知', // 'menu.WarningNotice', // 告警通知
        children: [
          {
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
        text: '用户管理', // 'menu.userManage', // 用户管理
        link: '/monitor/user',
        icon: 'iconfont icon-user',
      },
    ],
  },
  {
    text: '地理围栏', // 'menu.threshold', // 报警阈值
    icon: 'iconfont icon-electricfence',
    children: [
      {
        text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
        link: '/monitor/company/fence',
      },
      {
        text: '电池群组划分', // 'menu.sortByCompany', // 按企业全局分类
        link: '/monitor/battery/fence',
      },
    ],
  },
  {
    text: '设备管理', // 'menu.device', // 设备管理
    icon: 'iconfont icon-device',
    children: [
      {
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

const listData1 = deepClone(montorData); // 生产企业管理员\
const listData2 = deepClone(montorData); // 平台管理员
const listData3 = deepClone(montorData); // 电池采购企业管理员
const listData4 = deepClone(montorData); // 电池采购企业用户
const listData5 = deepClone(montorData); // 生产企业用户

const Allocation = {
  text: '电池调配', // 'menu.Allocation', // 电池调配
  link: '/battery/stock',
};
/* 数据对比 */
const dataContrast = {
  text: 'menu.compare', // 数据对比
  link: '/battery/compare',
};
/* 告警数据 */
const alarmData = {
  text: 'menu.alarmData', // 告警数据
  link: '/battery/alarm',
};

/* 告警数据 */
const BatteryDefriend = {
  text: 'menu.defriend', // 恢复拉黑设备
  link: '/battery/defriend',
};

/* 系统管理 */
const systemDefriend = {
  text: 'menu.system', // 系统管理
  icon: 'iconfont icon-system',
  link: '',
  children: [
    {
      text: 'menu.repairGps', // gps修正
      link: '/gps/repair',
    },
  ],
};
listData2.push(systemDefriend);
const title = '电池检测';

/* 生产企业 */
export const getManifactor = () => {
  // const personRole = {};
  console.log(listData1);
  // listData1[3] = "";
  listData1[3].children = listData1[3].children.splice(0, 1);
  listData1[1].children[0].children[3] = Allocation;
  return {
    title,
    data: listData1,
    permissions: permissionFun(),
  };
};

/* 生产企业用户 */
export const getManifactorCus = () => {
  // const personRole = {};
  if (!permissionFun().sameAnalysis) {
    listData5[1].children[1] = '';
  } else {
    listData5[1].children[1] = dataContrast;
  }
  if (!permissionFun().allocation) {
    listData5[1].children[0].children[3] = '';
  } else {
    listData5[1].children[0].children[3] = Allocation;
  }
  if (!permissionFun().alarm) {
    listData5[1].children[2] = '';
  } else {
    listData5[1].children[2] = alarmData;
  }
  if (!permissionFun().addblack) {
    listData5[1].children[0].children[1] = '';
  } else {
    listData5[1].children[0].children[1] = BatteryDefriend;
  }
  listData5[2] = '';
  listData5[4].children[1] = '';
  listData5[4].children[2] = '';
  // personRole.data = listData5;
  // personRole.permissions = permissionFun();
  return {
    title,
    data: listData5,
    permissions: permissionFun(),
  };
};

/* 平台 */
export const getPlat = () => {
  // const personRole = {};
  listData2[1].children[0].children[1] = '';
  listData2[2] = '';
  // personRole.data = listData2;
  // personRole.permissions = permissionFun();
  return {
    title,
    data: listData2,
    permissions: permissionFun(),
  };
};

/* 电池采购企业管理员 */
export const purchaseAdmin = () => {
  // const personRole = {};
  if (!permissionFun().sameAnalysis) {
    listData3[1].children[1] = '';
  } else {
    listData3[1].children[1] = dataContrast;
  }
  if (!permissionFun().alarm) {
    listData3[1].children[2] = '';
  } else {
    listData3[1].children[2] = alarmData;
  }
  if (!permissionFun().addblack) {
    listData3[1].children[0].children[1] = '';
  } else {
    listData3[1].children[0].children[1] = BatteryDefriend;
  }
  listData3[4] = '';
  // personRole.data = listData3;
  // personRole.permissions = permissionFun();
  return {
    title,
    data: listData3,
    permissions: permissionFun(),
  };
};

/* 电池采购企业用户 */
export const purchaseCus = () => {
  // console.log(permissionFun());
  // const personRole = {};
  if (!permissionFun().sameAnalysis) {
    listData4[1].children[1] = '';
  } else {
    listData4[1].children[1] = dataContrast;
  }
  if (!permissionFun().addblack) {
    listData4[1].children[0].children[1] = '';
  } else {
    listData4[1].children[0].children[1] = BatteryDefriend;
  }
  if (!permissionFun().alarm) {
    listData4[1].children[2] = '';
  } else {
    listData4[1].children[2] = alarmData;
  }
  listData4[2] = '';
  listData4[4] = '';
  // personRole.data = listData4;
  // personRole.permissions = permissionFun();
  return {
    title,
    data: listData4,
    permissions: permissionFun(),
  };
};
// export default {
//   title: '电池检测',
//   data: montorData,
// };
