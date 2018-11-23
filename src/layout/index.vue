<template>
  <div class="document">
    <header-sec></header-sec>
    <ul class="mainMun">
      <li class="item"
        :class="getProjectType === key.type ? 'choosed' : ''"
        v-for="key in menus"
        @click="chooseProject(key)"
        :key="key.type">
        <span class="icon"><i :class="key.icon"></i></span>
        <span class="text">{{key.text}}</span></li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import barData from '@/dataConfig/sideBar/bar';
import headerSec from './header';
// import sideBar from './sideBer';

export default {
  name: '',
  props: [''],
  data() {
    return {
      menus: barData,
    };
  },
  components: {
    headerSec,
  },
  computed: {
    ...mapGetters(['getMenuCollapse', 'getProjectType']),
  },
  methods: {
    chooseProject(key) {
      if (key.link) {
        this.$router.push(`${key.link}`);
        sessionStorage.setItem('projectType', key.type);
        this.$store.commit('setProjectType', key.type);
      }
    },
  },
};

</script>
<style lang='scss' scoped>
.warp {
  // position: absolute;
  display: flex;
  color: #ffffff;
  height: calc(100vh - 50px);
}
.content {
  position: absolute;
  top: 50px;
  left: 50px;
  right: 0;
  bottom: 0;
  background-color: #f0f2f5;
  // transition: all 0.35s ease;
  // &.showMore {
  //   left: 160px;
  //   transition: all 0.35s ease;
  // }
}
.mainMun {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  transition: all 0.35s ease;
  width: 50px;
  font-size: 0;
  background-color: #252a2f;
  overflow: hidden;
  z-index: 50;
  &:hover {
    width: 160px;
  }
  .item {
    width: 160px;
    font-size: 0;
    cursor: pointer;
    color: rgb(170, 170, 170);
    &.choosed {
      color: #ffffff;
      background-color: #00c1de;
    }
    &:hover:not(.choosed) {
      // background-color: #00c1de;
      .icon {
        color: #ffffff;
      }
      .text {
        color: #00c1de;
      }
    }
    span {
      vertical-align: middle;
      display: inline-block;
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      &.icon {
        width: 50px;
        text-align: center;
        font-size: 18px;
      }
      &.text {
        width: 110px;
        padding-left: 10px;
      }
    }
  }
}
</style>
