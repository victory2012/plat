<template>
  <div class="document">
    <header-sec></header-sec>
    <ul class="mainMun">
      <li class="item"
        :class="getProjectType === key.type ? 'choosed' : ''"
        v-for="key in menus"
        @click="chooseProject(key)"
        :key="key.type">
        <span class="icon">
          <i class="mainMenuIcon"
            :class="key.icon"></i>
        </span>
        <span class="text">{{key.text}}</span></li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  purchaseCus, // 电池采购企业用户
  purchaseAdmin, // 电池采购企业管理员
  getPlat, // 平台
  getManifactorCus, // 生产企业用户
  getManifactor, // 生产企业
} from '@/dataConfig/sideBar/infoMenu';
import {
  trackManufacturAdmin, // 生产企业
  trackManufacturUser, // 生产企业用户
  trackPlat, // 平台
  trackPurchaseAdmin, // 电池采购企业管理员
  trackPurchaseUser, // 电池采购企业用户
} from '@/dataConfig/sideBar/infoTrack';
import barData from '../dataConfig/sideBar/mainBar';
import headerSec from './header';

export default {
  name: '',
  props: [''],
  data() {
    return {
      menus: barData(),
    };
  },
  components: {
    headerSec,
  },
  computed: {
    ...mapGetters(['getProjectType', 'getloginData']),
  },
  mounted() {
    // this.menus = barData();
  },
  methods: {
    chooseProject(key) {
      if (key.link) {
        this.$router.push(`${key.link}`);
        this.$store.commit('setProjectType', key.type);
        let menuData;
        const projectType = key.type === 'monitor';
        if (this.getloginData.layerName === '平台') {
          menuData = projectType ? getPlat() : trackPlat();
        }
        if (this.getloginData.layerName === '生产企业' && this.getloginData.type === 2) {
          menuData = projectType ? getManifactor() : trackManufacturAdmin();
        }
        if (this.getloginData.layerName === '采购企业' && this.getloginData.type === 2) {
          menuData = projectType ? purchaseAdmin() : trackPurchaseAdmin();
        }
        if (this.getloginData.layerName === '生产企业' && this.getloginData.type === 3) {
          menuData = projectType ? getManifactorCus() : trackManufacturUser();
        }
        if (this.getloginData.layerName === '采购企业' && this.getloginData.type === 3) {
          menuData = projectType ? purchaseCus() : trackPurchaseUser();
        }
        this.$store.commit('setInfoMenuData', menuData);
      }
    },
  },
};

</script>
<style lang='scss' scoped>
.mainMenuIcon {
  font-size: 20px;
}
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
    color: #ffffff;
    &.choosed {
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
