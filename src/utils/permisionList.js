import t from '@/utils/translate';

export default (item) => {
  let defaultList;
  if (item.type === 2 && item.layerName === '采购企业') {
    defaultList = [
      {
        label: t('defaultRole.addblack'), // "拉黑及恢复电池",
        id: 'addblack',
        value: false,
      },
      {
        label: t('defaultRole.historyData'), // "历史数据",
        id: 'historyData',
        value: false,
      },
      {
        label: t('defaultRole.alarm'), // "告警事件",
        id: 'alarm',
        value: false,
      },
      {
        label: t('defaultRole.sameAnalysis'), // "数据对比",
        id: 'sameAnalysis',
        value: false,
      },
      {
        label: t('defaultRole.personalInfo'), // "个人信息维护",
        id: 'personalInfo',
        value: false,
      },
    ];
  }
  if (item.type === 3 && item.layerName === '采购企业') {
    defaultList = [
      { label: t('defaultRole.historyData'), id: 'historyData', value: false },
      { label: t('defaultRole.alarm'), id: 'alarm', value: false },
      {
        label: t('defaultRole.sameAnalysis'),
        id: 'sameAnalysis',
        value: false,
      },
      { label: t('defaultRole.personalInfo'), id: 'personalInfo', value: false },
    ];
  }
  if (item.type === 2 && item.layerName === '生产企业') {
    defaultList = [
      {
        label: t('defaultRole.addBatteries'),
        id: 'AddBatteries',
        value: false,
      },
      { label: t('defaultRole.addblack'), id: 'addblack', value: false },
      { label: t('defaultRole.historyData'), id: 'historyData', value: false },
      { label: t('defaultRole.alarm'), id: 'alarm', value: false },
      {
        label: t('defaultRole.sameAnalysis'),
        id: 'sameAnalysis',
        value: false,
      },
      {
        label: `${t('defaultRole.allocation')}`, // "电池调配",
        id: 'allocation',
        value: false,
      },
      { label: t('defaultRole.personalInfo'), id: 'personalInfo', value: false },
    ];
  }
  if (item.type === 3 && item.layerName === '生产企业') {
    defaultList = [
      {
        label: t('defaultRole.addBatteries'),
        id: 'AddBatteries',
        value: false,
      },
      { label: t('defaultRole.historyData'), id: 'historyData', value: false },
      { label: t('defaultRole.alarm'), id: 'alarm', value: false },
      {
        label: t('defaultRole.sameAnalysis'),
        id: 'sameAnalysis',
        value: false,
      },
      {
        label: `${t('defaultRole.allocation')}`,
        id: 'allocation',
        value: false,
      },
      { label: t('defaultRole.personalInfo'), id: 'personalInfo', value: false },
    ]; // "电池调配",
  }
  return defaultList;
};
