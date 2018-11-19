<template>

  <el-menu class="sidebar-el-menu sideBar"
    :default-active="projectType"
    text-color="rgba(255, 255, 255, 0.67)"
    :unique-opened='true'
    :collapse="collapse">
    <!-- background-color="#404040" -->
    <!-- router> -->
    <menu-item :menuData="menus"></menu-item>
    <!-- <MenuTree :menuData="this.menus.data"></MenuTree> -->
  </el-menu>
</template>

<script>
import { mapState } from 'vuex';
import barData from '@/dataConfig/sideBar/bar';
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
  mounted() {
    console.log(this.$route.path);
  },

  methods: {},

};

</script>
<style lang='scss' scoped>
.sideBar {
  // border-top: 1px solid #393d42;
  height: calc(100vh - 50px);
  background-color: #404040;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  // width: 180px;
  flex: 0 0 160px;
}
</style>
