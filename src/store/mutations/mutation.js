export default {
  /* 右边 主菜单 打开收起 */
  toggleSideBar(state) {
    state.collapse = !state.collapse;
  },
  // 设置项目类型
  setProjectType(state, data) {
    state.projectType = data;
  },
  /* 用户登录数据 */
  setUserData(state, data) {
    state.userData = data;
  },
  // 登录页的 loading
  setLoginLoading(state, data) {
    state.loginLoading = data;
  },
};
