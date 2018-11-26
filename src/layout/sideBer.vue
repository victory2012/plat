<template>
  <div class="mainMenu">
    <ul class="mainInfo">
      <li class="item"
        v-for="key in menus"
        :key="key.type">
        <span class="icon"><i :class="key.icon"></i></span>
        <span class="text">{{key.text}}</span></li>
    </ul>
  </div>
  <!-- <el-menu class="sidebar-el-menu sideBar"
    :default-active="projectType"
    text-color="rgba(255, 255, 255, 0.67)"
    :unique-opened='true'
    :collapse-transition='false'
    :collapse="collapse">
    <menu-item :menuData="menus"></menu-item>
  </el-menu> -->
</template>

<script>
import { mapState } from 'vuex';
import barData from '../dataConfig/sideBar/mainBar';
import menuItem from './sideBarItem';

export default {
  name: '',
  props: [''],
  data() {
    return {
      menus: barData,
    };
  },
  components: {
    menuItem,
  },
  computed: {
    ...mapState(['collapse', 'projectType']),
  },

};

</script>
<style lang='scss' scoped>
.mainMenu {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: all 0.35s ease;
  width: 50px;
  // height: 100%;
  background-color: #252a2f;
  z-index: 50;
  &:hover {
    width: 160px;
  }
  .mainInfo {
    width: 160px;
    font-size: 0;
    .item {
      width: 100%;
      font-size: 0;
      cursor: pointer;
      span {
        display: inline-block;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        &.icon {
          width: 50px;
          text-align: center;
          font-size: 18px;
          &:hover {
            background-color: #00c1de;
          }
        }
        &.text {
          width: 100px;
          padding-left: 10px;
        }
      }
    }
  }
}
// .sideBar {
//   // border-top: 1px solid #393d42;
//   height: calc(100vh - 50px);
//   background-color: #404040;
//   width: 60px;
// }
// .sidebar-el-menu:not(.el-menu--collapse) {
//   // width: 180px;
//   flex: 0 0 160px;
// }
</style>
