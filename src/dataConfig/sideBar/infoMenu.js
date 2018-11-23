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

export default {
  title: '电池检测',
  data: montorData,
};
