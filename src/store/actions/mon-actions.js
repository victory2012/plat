import api from '@/api';

export default {
  carData({ commit }) {
    commit('setCardLoading', true);
    api.overviewCount().then((res) => {
      commit('setCardLoading', false);
      if (res.data && res.data.code === 0) {
        commit('setCardData', res.data.data);
      }
    });
  },
  // 获取客户企业表
  getCompanyList({ commit }) {
    api.purchaseNames().then((res) => {
      console.log('获取电池组客户企业表', res);
      if (res.data && res.data.code === 0) {
        commit('SETCustomOpts', res.data.data);
      }
    });
  },
  // 获取电池型号列表
  getBatteryModelList({ commit }) {
    api.batteryModelList().then((res) => {
      console.log('获取电池型号列表', res);
      if (res.data && res.data.code === 0) {
        commit('SETGroupModelOpts', res.data.data);
      }
    });
  },
  // 获取未绑定的设备列表
  getDeviceList({ commit }) {
    api.DeviceList('/device/code?status=0&bindingStatus=0').then((res) => {
      console.log('设备编号', res);
      if (res.data && res.data.code === 0) {
        commit('SETdeviceList', res.data.data);
      }
    });
  },
  // 获取生产企业列表
  getManufacturer({ commit }) {
    api.manufacturerNames().then((res) => {
      console.log('companyArr', res);
      if (res.data && res.data.code === 0) {
        commit('SETManufacturer', res.data.data);
      }
    });
  },
  // 获取电池组规格列表
  getBatterySpecif({ commit }) {
    api.batteryGroupSpecif().then((res) => {
      console.log('电池组规格', res);
      if (res.data && res.data.code === 0) {
        commit('SETbatteryGroupSpecifOpts', res.data.data);
      }
    });
  },
  // 获取电池单体型号列表
  getbatterySingleModel({ commit }) {
    api.batterySingleModel().then((res) => {
      console.log('电池组规格', res);
      if (res.data && res.data.code === 0) {
        commit('SETsingleBatteryOpts', res.data.data);
      }
    });
  },
};
