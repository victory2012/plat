<template>
  <!--  -->
  <el-menu class="sidebar-el-menu infoMenuWarp"
    :default-active="$route.path"
    :default-openeds='defaultOpen'
    text-color="#333333"
    :unique-opened='true'
    router>
    <MenuTree :menuData="getInfoMenu"></MenuTree>
  </el-menu>

</template>

<script>
import { mapGetters } from 'vuex';
import MenuTree from './bar-item';

export default {
  components: {
    MenuTree,
  },
  data() {
    return {
      defaultOpen: [1, 2, 3, 4, 5, 6, 7],
      menusData: [],
    };
  },
  computed: {
    ...mapGetters(['getInfoMenu']),
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
<style lang="scss" scoped>
.infoMenuWarp {
  flex: 0 0 205px;
  height: calc(100vh - 50px);
  background-color: #d8dce3;
}
</style>

