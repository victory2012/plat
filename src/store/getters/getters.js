export default {
  getInfoMenu(state) {
    if (state.projectType === 'monitor') {
      return state.monitorMenu;
    }
    return state.trackMenu;
  },
};
