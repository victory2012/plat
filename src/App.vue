<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import "./style/common";
.app {
  height: 100%;
}
.gm-style > button,
.gmnoprint {
  display: none;
}
.el-dialog__header {
  text-align: left;
}
.el-badge__content.is-fixed {
  right: 20px;
}
.el-tree-node__expand-icon {
  color: #000000;
}
.el-tree-node__content {
  height: 32px;
  line-height: 32px;
}
.el-menu {
  .el-menu-item:not(.is-active) {
    &:hover {
      color: #393d42;
      background: #404040;
    }
  }
  .is-active {
    background: #00c0e0;
    color: #ffffff;
  }
}
.el-menu {
  border: none;
}
.infoSide {
  .infoMenuWarp {
    .is-active {
      background-color: #ffffff;
      color: #333333;
    }
    .el-submenu__title {
      background-color: #d8dce3;
    }
    .el-menu-item {
      background-color: #d8dce3;
      &.is-active {
        background-color: #ffffff;
        color: #333333;
      }
      &:not(.is-active):hover {
        background: #ffffff;
        color: #409eff;
      }
    }
  }
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
