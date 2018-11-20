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
};
