<template>
  <div class="infoMenuWarp">
    <h1 class="projectTit">{{getInfoMenu.title}}</h1>
    <el-tree class="warp"
      :data="getInfoMenu.data"
      :props="defaultProps"
      :highlight-current='true'
      :default-expand-all='true'
      @node-click="handleNodeClick">
    </el-tree>
    <!-- <div class="btn right">
      <div class="product-navbar-collapse-inner">
        <div class="product-navbar-collapse-bg"></div>
      </div>
    </div> -->
  </div>

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      menusData: [],
      defaultProps: {
        children: 'children',
        label: 'text',
      },
    };
  },
  computed: {
    ...mapGetters(['getInfoMenu']),
  },
  methods: {
    handleNodeClick(data) {
      if (data.link) {
        this.$router.push(`${data.link}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.warp {
  background-color: #d8dce3;
}
.btn {
  position: absolute;
  left: 0;
  top: 50%;
  width: 20px;
  height: 50px;
  z-index: 3;
  transition: all 0.2s ease;
  // background-color: #ffffff;
  cursor: pointer;
  &.right {
    left: 160px;
  }
  .product-navbar-collapse-inner {
    position: relative;
    overflow: hidden;
    .product-navbar-collapse-bg {
      width: 0;
      height: 50px;
      position: absolute;
      top: 0;
      left: 0;
      border-bottom: 9px solid transparent;
      border-left: 13px solid #d9dee4;
      border-top: 9px solid transparent;
      transition: all 0.1s ease, 0.1s ease;
      // left: auto;
      // border-bottom: 9px solid transparent;
      // border-left: none;
      // border-right: 13px solid #f7f7f7;
      // border-top: 9px solid transparent;
    }
  }
}
.projectTit {
  font-weight: bold;
  text-indent: 20px;
  width: 180px;
  height: 70px;
  line-height: 70px;
  background: #d9dee4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.infoMenuWarp {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 0 0 180px;
  height: calc(100vh - 50px);
  background-color: #d8dce3;
}
</style>

