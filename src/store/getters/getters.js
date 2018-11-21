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
  /* 获取登录的 loading状态 */
  getloginData(state) {
    return state.userData;
  },
  /* 获取用户权限 */
  getUserPermisson(state) {
    return state.userPermission;
  },
};
