const trackMenu = [
  {
    text: '概览', // 'menu.overview', // 概览
    link: '/overview',
    icon: 'iconfont icon-allnormal',
  },
  {
    text: '电池管理', // 'menu.batteryManage', // 电池管理
    icon: 'iconfont icon-dashboard',
    children: [
      {
        text: '电池信息', // 'menu.batteryInfo', // 电池信息
        children: [
          {
            text: '电池列表', // 'menu.batteryList', // 电池列表
            link: '/battery',
          },
          {
            text: '电池地图', // 'menu.batteryList', // 电池地图
            children: [
              {
                text: '实时位置', // 'menu.batteryList', // 实时位置
                link: '/battery',
              },
              {
                text: '历史轨迹', // 'menu.batteryList', // 历史轨迹
                link: '/battery',
              },
            ],
          },
          {
            text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
            link: '/battery/defriend',
          },
          {
            text: '电池调配', // 'menu.defriend', // 恢复拉黑设备
            link: '/battery/defriend',
          },
        ],
      },
      {
        text: '运行状况', // 'menu.runStatus', // 运行状况
        link: '/battery/run',
      },
      {
        text: '告警数据', // 'menu.alarm', // 告警数据
        link: '/battery/alarm',
      },
      {
        text: '报警阈值', // 'menu.threshold', // 报警阈值
        children: [
          {
            text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
            link: '/set/model',
          },
          {
            text: '电池型号分类', // 'menu.sortByCompany', // 按企业全局分类
            link: '/set/company',
          },
        ],
      },
      {
        text: '地理围栏', // 'menu.threshold', // 报警阈值
        children: [
          {
            text: '企业全局通用', // 'menu.sortByModel', // 按电池型号分类
            link: '/set/model',
          },
          {
            text: '电池群组划分', // 'menu.sortByCompany', // 按企业全局分类
            link: '/set/company',
          },
        ],
      },
      {
        text: '告警通知', // 'menu.WarningNotice', // 告警通知
        children: [
          {
            text: '告警接收人', // 'menu.receiveList', // 告警接收人
            link: '/set/receive',
          },
          {
            text: '已添加接收人', // 'menu.addReceive', // 已添加接收人
            link: '/set/user',
          },
          {
            text: '外部告警接收人', // 'menu.OuterReceive', // 外部告警接收人
            link: '/set/outer',
          },
        ],
      },
    ],
  },
  {
    text: '设备管理', // 'menu.device', // 设备管理
    icon: 'iconfont icon-device',
    children: [
      {
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

export default {
  title: '电池定位追踪',
  data: trackMenu,
};
