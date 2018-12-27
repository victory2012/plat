<template>
  <div class="infoSide">
    <info-sidebar></info-sidebar>
    <div class="infoView">
      <router-view />
    </div>
  </div>
</template>

<script>
import infoSidebar from './infoSideBar';

export default {
  // data () {
  //   return {

  //   };
  // },
  components: {
    infoSidebar,
  },
  // mounted () { },
  // methods: {},
};

</script>
<style lang='scss' scoped>
.infoSide {
  display: flex;
  width: 100%;
  .infoView {
    flex: 1;
    box-sizing: border-box;
    padding: 15px;
    color: #333333;
    height: calc(100vh - 50px);
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
