export default {
  /* 获取登录的 loading状态 */
  getloginLoading(state) {
    return state.loginLoading;
  },
  /* 获取登录的 loading状态 */
  getMenuCollapse(state) {
    return state.collapse;
  },
  /* 获取子项目类型 */
  getProjectType(state) {
    return state.projectType;
  },
  /* 根据项目类型，返回相应的 menu数据 */
  getInfoMenu(state) {
    if (state.projectType === 'monitor') {
      return state.monitorMenu;
    }
    return state.trackMenu;
  },
  /* 获取登录的用户信息 */
  getloginData(state) {
    return state.userData;
  },
  /* 获取登录的用户信息 */
  getUserMapType(state) {
    return state.userData.type;
  },
  /* 获取用户权限 */
  getUserPermisson(state) {
    return state.userPermission;
  },
};
