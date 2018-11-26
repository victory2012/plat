import http from './config';

const socketUrl = '';
export default {
  /* 登录 */
  login: data => http.post('/login', data),

  /* 登出 */
  logOut: () => http.post('/login/logout'),

  /* 获取权限 */
  permissions: data =>
    http.get(`/user/permissions/${data}?t=${new Date().getTime()}`),

  /* 获取短信验证码 */
  SMScode: data => http.post('/login/sms/send', data),

  /* 验证短信验证的正确性 */
  SMSVertify: data => http.post('/login/sms/verify', data),
  /* ----------------------------------- 电池列表 ---------------------------------------- */
  /* 电池拉黑 */
  betteryBlack: data => http.put('device', data),

  /* 电池详情 */
  betteryDetails: data =>
    http.get(`/battery_group/${data}?t=${new Date().getTime()}`),

  /* 修改电池详情 */
  changeBatteryDetail: (id, options) =>
    http.put(`/battery_group/${id}`, options),

  /* 电池绑定 */
  betteryBind: data => http.put('host/bind', data),

  /* 获取电池组规格列表 */
  batteryGroupSpecif: () =>
    http.get(`/dic?type=Norm&categoryId=2&t=${new Date().getTime()}`),

  /* 获取电池单体型号列表 */
  batterySingleModel: () =>
    http.get(`/dic?type=SingleModel&categoryId=2&t=${new Date().getTime()}`),

  /* 添加电池组型号、规格、单体规格 */
  batteryADDALL: data => http.post('/dic', data),

  /* 删除电池 */
  batteryDetele: data => http.delete(`/host/${data}`),

  /* 电池解绑 */
  batteryUnBind: data => http.put(`host/unbind/${data}`),

  /* 电池批量上传 */
  batteryUpLoadAll: data => http.post('/battery_group/batch', data),

  /* 电池列表 */
  batteryList: data =>
    http.get(`/battery_group?t=${new Date().getTime()}`, data),

  /* 添加电池组 */
  batteryAddGroup: data => http.post('/battery_group', data),

  /* 电池型号列表 */
  batteryModelList: () =>
    http.get(`/dic?type=Model&categoryId=2&t=${new Date().getTime()}`),

  /* 获取电池组客户企业表 */
  purchaseNames: () =>
    http.get(`/company/purchase_names?t=${new Date().getTime()}`),

  /* 获取电池组客户企业表 -- 无待定企业 */
  purchaseNames2: () =>
    http.get(`/company/purchase_names2?t=${new Date().getTime()}`),
  /* 获取未绑定设备 */
  DeviceList: () =>
    http.get(`/device/code?status=0&bindingStatus=0&t=${new Date().getTime()}`),

  /* 获取生产企业列表 */
  manufacturerNames: () =>
    http.get(`company/manufacturer_names?t=${new Date().getTime()}`),
  /* ----------------------------------- 电池列表结束 ---------------------------------------- */
  overviewCount: () =>
    http.get(`/battery_group/count?t=${new Date().getTime()}`),

  overviewCompany: () =>
    http.get(`/battery_group/sub_companies/count?t=${new Date().getTime()}`),

  overviewModel: () =>
    http.get(`/battery_group/model/count?t=${new Date().getTime()}`),

  overviewProvence: () =>
    http.get(`/battery_group/province/count?t=${new Date().getTime()}`),
  /* ----------------------------------- 概览结束 ---------------------------------------- */
  /* 获取所有设备的告警数据 */
  alarmData: data =>
    http.get(`/battery_group_event?t=${new Date().getTime()}`, data),

  /* 获取设备的告警 详情 */
  allAlarmData: data =>
    http.get(`/battery_group_event/${data}?t=${new Date().getTime()}`),

  /* 黑名单（设备 && 电池） */
  deviceBlackList: data => http.get(`device?t=${new Date().getTime()}`, data),

  /* 运行状况 */
  /* 获取电池 info 信息 */
  batteryGroupInfo: data =>
    http.get(`/battery_group/${data}/info?t=${Math.random()}`),

  /* 获取电量 */
  batteryCapacity: data =>
    http.get(`/battery_group/${data}/capacity?t=${Math.random()}`),

  /* 发送设备地址 到后台 */
  sendAddress: data => http.put('battery_group/address', data),

  /* 实时页面 获取过去四个小时的数据 */
  realData: (hostId, device, startTime, endTime) =>
    http.get(
      `/battery_group/${hostId}/${device}/data?startTime=${startTime}&endTime=${endTime}&t=${Math.random()}`,
    ),

  /* 获取历史数据 */
  historyData: (hostId, device, startTime, endTime) =>
    http.get(
      `/battery_group/${hostId}/${device}/data2?startTime=${startTime}&endTime=${endTime}&t=${Math.random()}`,
    ),

  /* 历史告警 */
  historyAlarm: (hostId, startTime, endTime, data) =>
    http.get(
      `/battery_group_event?hostId=${hostId}&startTime=${startTime}000000&endTime=${endTime}235959&t=${Math.random()}`,
      data,
    ),

  /* 历史补水 */
  historyFluid: (hostId, device, data) =>
    http.get(
      `/battery_group/${hostId}/${device}/fluid?t=${Math.random()}`,
      data,
    ),

  /* 单个设备 告警数据 */
  singleAlarm: (hostId, pageData) =>
    http.get(
      `/battery_group_event?hostId=${hostId}&t=${Math.random()}`,
      pageData,
    ),

  /* 创建用户 */
  createUser: data => http.post('/user', data),

  /* 创建管理员 */
  createCompany: data => http.post('/company/manufacturer', data),

  /* 创建管理员 */
  createPurchaser: data => http.post('/company/purchaser', data),

  /* 批量添加设备 */
  deviceBatchAdd: data => http.post('/device/2/batch', data),

  /* 添加设备 */
  deviceAdd: data => http.post('/device', data),

  /* 添加设备 */
  deviceAddBlack: data => http.put('device', data),

  /* 删除设备 */
  deviceDetele: id => http.delete(`/device/${id}`),

  /* 设备类型 -- 电池追踪 || 电池监测 */
  deviceCategory: () => http.get(`/category?t=${Math.random()}`),

  /* 获取设备列表 */
  deviceList: data => http.get(`/device?t=${Math.random()}`, data),

  /* 取消告警接收人 */
  cancelNotice: id => http.delete(`/company_global_internal_notice/${id}`),

  /* 添加告警接收人 */
  addNotice: id => http.post(`/company_global_internal_notice/${id}`),

  /* 已添加 告警接收人列表 */
  noticeList: data =>
    http.get(`/company_global_internal_notice?t=${Math.random()}`, data),

  /* 告警接收人 */
  noticeUsersList: data =>
    http.get(`/company_global_internal_notice/users?t=${Math.random()}`, data),

  /* 添加外部告警接收人 */
  addOuterUsers: data => http.post('/company_global_external_notice', data),

  /* 取消外部告警接收人 */
  cancelOuterUsers: id => http.delete(`/company_global_external_notice/${id}`),

  /* 外部告警接收人 */
  outerUsers: data =>
    http.get(`/company_global_external_notice?t=${Math.random()}`, data),

  /* 添加电池型号阈值 */
  batteryAddPolicy: data => http.post('battery_group_event_policy', data),

  /* 修改电池型号阈值 */
  batteryChangePolicy: data => http.put('battery_group_event_policy', data),

  /* 查询电池组型号 阈值 */
  getBatteryPolicy: id =>
    http.get(`/battery_group_event_policy?modelId=${id}&t=${Math.random()}`),

  /* 根据 model id 获取阈值 --模板 */
  getTempPolicy: () =>
    http.get(`/battery_group_event_policy?modelId=0&t=${Math.random()}`),

  /* 获取全局 阈值 --模板 */
  getSituationTempPolicy: () =>
    http.get(`/battery_group_event_policy/template?t=${Math.random()}`),

  /* 修改个人信息 */
  changeUserMsg: data => http.put('user/info', data),

  /* 获取个人信息 */
  getUserMsg: () => http.get(`/user/current?t=${Math.random()}`),

  /* 删除用户 */
  deleteUser: id => http.delete(`/user/${id}`),

  /* 删除公司 */
  deleteCompany: id => http.delete(`/company/${id}`),

  /* 修改用户权限 */
  ChangePermissions: data => http.put('/user/permissions', data),

  /* 获取用户列表 */
  getUserList: data => http.get(`/user?t=${Math.random()}`, data),

  companyPair: companyId =>
    http.get(`/battery_group/${companyId}/id_name_pair?t=${Math.random()}`),

  inventoryPair: () =>
    http.get(`/battery_group/inventory/id_name_pair?t=${Math.random()}`),

  /* 电池回收 */
  recoverBattery: data => http.post('/battery_group/recycle', data),

  /* 电池分配 */
  distributeBattery: data => http.post('/battery_group/distribute', data),

  /* gsp 修复 */
  repairGps: () => http.get('/admin/battery_group_gps/fix_gps'),

  /* 获取公司权限 */
  getCompanyRole: companyId => http.get(`/company/permissions/${companyId}`),

  /* websoket */
  Socket: () => new WebSocket(socketUrl),
};
