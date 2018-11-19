<template>
  <div>
    <header-sec></header-sec>
    <div class="warp">
      <side-bar></side-bar>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import headerSec from './header';
import sideBar from './sideBer';

export default {
  name: '',
  props: [''],
  data() {
    return {

    };
  },
  components: {
    headerSec,
    sideBar,
  },

  mounted() { },

  methods: {},

};

</script>
<style lang='scss' scoped>
.warp {
  display: flex;
  color: #ffffff;
  height: 100%;
  .content {
    flex: 1;
    background-color: #f0f2f5;
  }
}
</style>
