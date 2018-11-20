import defaultPermion from './default-permision';

export default function permissionFun() {
  const sessionData = sessionStorage.getItem('loginData');
  if (!sessionData) {
    window.location.href = '#login';
    return;
  }
  const userData = JSON.parse(sessionData);
  const role = JSON.parse(JSON.parse(sessionStorage.getItem('userRoles')));

  const permissions = {
    type: '',
    AddBatteries: true, // 电池登记
    info: true, // 基础信息
    runState: true, // 运行状况
    monitoring: true, // 主动监测
    historyData: true, // 历史数据
    alarmDatas: true, // 告警数据 （单个电池的告警）
    alarm: true, // 告警事件（全部的电池告警）
    deleteBattery: true, // 删除电池
    addblack: true, // 添加黑名单
    recovery: true, // 回复拉黑电池,
    sameAnalysis: true, // 同一电池单元的数据分析
    sameBatch: true, // 同批次不同电池单元的数据分析
    personalInfo: true, // 个人信息维护
    threshold: true, // 告警阈值
    notice: true, // 告警通知,
    addCompany: true, // 创建企业用户
    deleteCompany: true, // 删除企业用户
    modifyPermissions: true, // 修改权限，
    addAdmin: true, // 添加管理员
    deleteAdmin: true, // 删除管理员
    allocation: false, // 电池调配
  };
  if (role == null) {
    if (userData.type === 1) {
      permissions.type = 'plat';
      permissions.AddBatteries = false;
      permissions.info = false;
      permissions.runState = true;
      permissions.recovery = false;
      permissions.addblack = false;
      permissions.deleteBattery = false;
      permissions.addCompany = false;
      permissions.deleteCompany = false;
      permissions.addAdmin = false;
      permissions.deleteAdmin = false;
      permissions.notice = false;
      permissions.allocation = false;
      permissions.threshold = false;
    }
    if (userData.type === 3 && userData.layerName === '平台') {
      permissions.type = 'plat';
      permissions.AddBatteries = false;
      permissions.info = false;
      permissions.runState = true;
      permissions.recovery = false;
      permissions.addblack = false;
      permissions.deleteBattery = false;
      permissions.addCompany = false;
      permissions.deleteCompany = false;
      permissions.addAdmin = false;
      permissions.deleteAdmin = false;
      permissions.notice = false;
      permissions.allocation = false;
      permissions.threshold = false;
    }
    if (userData.type === 2 && userData.layerName === '生产企业') {
      permissions.type = 'manufactur';
      permissions.allocation = true;
    }
    if (userData.type === 2 && userData.layerName === '采购企业') {
      const defaultper = defaultPermion.custormAdmin();
      permissions.type = 'purchase';
      permissions.AddBatteries = false;
      permissions.alarmSetting = false;
      permissions.sameAnalysis = false; // 同一电池单元的数据分析
      permissions.sameBatch = false; // 同批次不同电池单元的数据分析
      permissions.addAdmin = false;
      permissions.deleteAdmin = false;
      permissions.info = defaultper.info;
      permissions.runState = defaultper.runState;
      permissions.recovery = defaultper.recovery;
      permissions.alarmDatas = defaultper.alarmDatas;
      permissions.historyData = defaultper.historyData;
      permissions.alarm = defaultper.alarm;
      permissions.personalInfo = defaultper.personalInfo;
      permissions.addblack = defaultper.addblack;
    }
    if (userData.type === 3 && userData.layerName === '生产企业') {
      const defaultper = defaultPermion.productPer();
      permissions.type = 'manufacturUser';
      permissions.alarmSetting = false;
      permissions.notice = false;
      permissions.threshold = false;
      permissions.addCompany = false;
      permissions.deleteCompany = false;
      permissions.modifyPermissions = false;
      permissions.AddBatteries = false;
      permissions.addAdmin = false;
      permissions.deleteAdmin = false;
      permissions.personalInfo = defaultper.personalInfo;
      permissions.info = defaultper.info;
      permissions.runState = defaultper.runState;
      permissions.recovery = defaultper.recovery;
      permissions.alarmDatas = defaultper.alarmDatas;
      permissions.historyData = defaultper.historyData;
      permissions.alarm = defaultper.alarm;
      permissions.addblack = defaultper.addblack;
      permissions.allocation = defaultper.allocation;
    }
    if (userData.type === 3 && userData.layerName === '采购企业') {
      const defaultper = defaultPermion.custormPer();
      permissions.type = 'purchaseUser';
      permissions.AddBatteries = false;
      permissions.alarmSetting = false;
      permissions.sameAnalysis = false; // 同一电池单元的数据分析
      permissions.sameBatch = false; // 同批次不同电池单元的数据分析
      permissions.threshold = false;
      permissions.addCompany = false;
      permissions.deleteCompany = false;
      permissions.modifyPermissions = false;
      permissions.addAdmin = false;
      permissions.deleteAdmin = false;
      permissions.personalInfo = defaultper.personalInfo;
      permissions.info = defaultper.info;
      permissions.runState = defaultper.runState;
      permissions.recovery = defaultper.recovery;
      permissions.alarmDatas = defaultper.alarmDatas;
      permissions.historyData = defaultper.historyData;
      permissions.alarm = defaultper.alarm;
      permissions.addblack = defaultper.addblack;
      permissions.allocation = false;
    }
  } else {
    permissions.AddBatteries = role.AddBatteries;
    permissions.info = role.info;
    permissions.runState = role.runState;
    permissions.monitoring = role.monitoring;
    permissions.historyData = role.historyData;
    permissions.alarm = role.alarm;
    permissions.sameAnalysis = role.sameAnalysis;
    permissions.sameBatch = role.sameBatch;
    permissions.personalInfo = role.personalInfo;
    permissions.alarmDatas = role.alarmDatas;
    permissions.recovery = role.recovery;
    permissions.addblack = role.addblack;
    permissions.allocation = role.allocation;
  }
  return permissions;
}
