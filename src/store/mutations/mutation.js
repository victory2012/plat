export default {
  toggleSideBar(state) {
    state.collapse = !state.collapse;
  },
  // 设置项目类型
  setProjectType(state, data) {
    state.projectType = data;
  },
};
