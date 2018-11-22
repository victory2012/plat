<template>
  <div>
    <header-sec></header-sec>
    <div class="warp">
      <side-bar :class="getMenuCollapse ? 'nomore' : 'showMore'"
        class="mainMun"></side-bar>
      <div :class="{'showMore' : !getMenuCollapse}"
        class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters(['getMenuCollapse']),
  },
};

</script>
<style lang='scss' scoped>
.warp {
  position: relative;
  color: #ffffff;
  height: 100%;
  .mainMun {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.35s ease;
    &.showMore {
      width: 160px;
    }
    &.nomore {
      width: 60px;
      transition: all 0.35s ease;
    }
  }
  .content {
    position: absolute;
    top: 0;
    left: 60px;
    right: 0;
    bottom: 0;
    background-color: #f0f2f5;
    // transition: all 0.35s ease;
    &.showMore {
      left: 160px;
      transition: all 0.35s ease;
    }
  }
}
</style>
