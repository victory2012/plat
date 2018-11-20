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
    state.showBatteryDetail = data;
  },
  /* 储存电池组客户列表 */
  SETCustomOpts(state, data) {
    state.batteryCustList = data;
  },
};
