<template>
  <div class="infoSide">
    <info-sidebar></info-sidebar>
    <div class="infoView">
      <router-view />
      <!-- <el-scrollbar style="height:100%;overflow-x: hidden;">
        <div class="scrollwarrp">
          <router-view />
        </div>
      </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import infoSidebar from './infoSideBar';

export default {
  data() {
    return {

    };
  },
  components: {
    infoSidebar,
  },
  mounted() { },

  methods: {},

};

</script>
<style lang='scss' scoped>
.infoSide {
  display: flex;
  .infoView {
    flex: 1;
    box-sizing: border-box;
    padding: 15px;
    color: #333333;
    // .scrollwarrp {
    //   height: 100%;
    //   color: #333333;
    // box-sizing: border-box;
    // padding: 15px;
    // }
  }
}
</style>
