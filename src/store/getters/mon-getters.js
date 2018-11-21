export default {
  /* 概览的统计数据 */
  GETCARDDATA(state) {
    return state.cardData;
  },
  /* 获取客户企业列表 */
  GETCustomerList(state) {
    return state.batteryCustList;
  },
  /* 获取添加电池框 */
  GETAddBatteryShow(state) {
    return state.addBattery;
  },
  /* 电池组规格 */
  GETbatteryGroupSpecif(state) {
    return state.batteryGroupSpecif;
  },
  /* 电池单体型号 */
  GETbatterySingleModel(state) {
    return state.batterySingleModel;
  },
  /* 电池型号列表 */
  GETbatteryModelList(state) {
    return state.batteryModelList;
  },
  /* 未绑定的设备列表 */
  GETdeviceList(state) {
    return state.deviceList;
  },
  /* 获取电池详情数据 */
  GETbatteryDetail(state) {
    return state.batteryDetail;
  },
  /* 获取电池详情数据 */
  GETshowBatteryDetail(state) {
    return state.showBatteryDetail;
  },
  /* 获取生产企业列表 */
  GETManufacturer(state) {
    return state.manufacturerNames;
  },
};
