<template>
  <el-menu class="sidebar-el-menu infoMenuWarp"
    :default-active="$route.path"
    text-color="#333333"
    :unique-opened='false'
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
      menusData: [],
    };
  },
  computed: {
    ...mapGetters(['getInfoMenu']),
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

