const montorData = [
  {
    text: '概览', // 'menu.overview', // 概览
    link: '/monitor/overview',
    icon: 'iconfont icon-allnormal',
  },
  {
    text: '电池管理', // 'menu.batteryManage', // 电池管理
    link: '1',
    icon: 'iconfont icon-dashboard',
    children: [
      {
        text: '电池信息', // 'menu.batteryInfo', // 电池信息
        link: '11',
        children: [
          {
            text: '电池列表', // 'menu.batteryList', // 电池列表
            link: '/monitor/battery',
          },
          {
            text: '电池地图', // 'menu.batteryList', // 电池地图
            link: 'map',
            children: [
              {
                text: '实时位置', // 'menu.batteryList', // 实时位置
                link: '/monitor/battery/real-time',
              },
              {
                text: '历史轨迹', // 'menu.batteryList', // 历史轨迹
                link: '/monitor/battery/history',
              },
            ],
          },
          {
            text: '恢复拉黑设备', // 'menu.defriend', // 恢复拉黑设备
            link: '/monitor/battery/defriend',
          },
        ],
      },
      {
        text: '运行状况', // 'menu.runStatus', // 运行状况
        link: '/battery/run',
      },
      {
        text: '数据对比', // 'menu.compare', // 数据对比
        link: '/battery/compare',
      },
      {
        text: '告警数据', // 'menu.alarm', // 告警数据
        link: '/battery/alarm',
      },
      {
        text: '报警阈值', // 'menu.threshold', // 报警阈值
        link: '22',
        children: [
          {
            text: '按电池型号分类', // 'menu.sortByModel', // 按电池型号分类
            link: '/set/model',
          },
          {
            text: '按企业全局分类', // 'menu.sortByCompany', // 按企业全局分类
            link: '/set/company',
          },
        ],
      },
      {
        text: '地理围栏', // 'menu.threshold', // 报警阈值
        link: '232',
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
        link: '23',
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
    link: '3',
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

export default montorData;
