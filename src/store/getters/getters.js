export default {
  /* 获取登录的 loading状态 */
  getloginLoading(state) {
    return state.loginLoading;
  },
  /* 项目类型 */
  getInfoMenu(state) {
    if (state.projectType === 'monitor') {
      return state.monitorMenu;
    }
    return state.trackMenu;
  },
};
