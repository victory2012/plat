export default {
  /* 概览 统计数据 */
  setCardData(state, data) {
    state.cardData = data;
  },
  /* 概览 loading */
  setCardLoading(state, data) {
    state.cardLoading = data;
  },
  /* 储存电池详情数据 */
  setBatteryDetail(state, data) {
    state.batteryDetail = data;
  },
  /* 显示||隐藏 电池详情框 */
  showBatteryDetail(state, data) {
    // console.log('showBatteryDetail ===>>>', state);
    state.showBatteryDetail = data;
  },
  /* 显示||隐藏 添加电池框 */
  triggerAddBattery(state, data) {
    state.addBattery = data;
  },
  /* 储存电池组客户列表 */
  SETCustomOpts(state, data) {
    state.batteryCustList = data;
  },
  // 电池组规格
  SETbatteryGroupSpecifOpts(state, data) {
    state.batteryGroupSpecif = data;
  },
  // 电池单体型号
  SETsingleBatteryOpts(state, data) {
    state.batterySingleModel = data;
  },
  // 获取电池型号列表
  SETGroupModelOpts(state, data) {
    state.batteryModelList = data;
  },
  /* 未绑定的设备列表 */
  SETdeviceList(state, data) {
    state.deviceList = data;
  },
  SETManufacturer(state, data) {
    state.manufacturerNames = data;
  },
  /* 控制用户在地图上选区点 */
  SETmapPonter(state, data) {
    state.canAddponter = data;
  },
};
