<template>
  <div>
    <div class="titleTab textAlain">
      <div class="tabInfo">
        <!-- 同一电池单元 -->
        <a @click="showSameData"
          :class="{'active': actived == 'same'}">{{$t('comparison.same')}}</a>
        <span class="divider"></span>
        <!-- 不同电池单元 -->
        <a @click="showDiffData"
          :class="{'active': actived == 'diff'}">{{$t('comparison.diffrence')}}</a>
      </div>
    </div>
    <component :is="activeComponent"></component>
  </div>
</template>
<script>

export default {
  components: {
    sameCompent: () => import('./same'),
    diffCompent: () => import('./different'),
  },
  data() {
    return {
      actived: 'same',
      activeComponent: 'sameCompent',
    };
  },
  methods: {
    showSameData() {
      this.activeComponent = 'sameCompent';
      this.actived = 'same';
    },
    showDiffData() {
      this.activeComponent = 'diffCompent';
      this.actived = 'diff';
    },
  },
  mounted() { },
};
</script>
<style lang="scss" scoped>
.textAlain {
  text-align: center;
}
.tabInfo {
  width: 330px;
  // height: 50px;
  background: #ffffff;
  font-size: 0;
  // line-height: 50px;
  padding: 15px 0;
  border-radius: 5px;
  margin: 0 auto;
  a {
    width: 158px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    color: #bfbfbf;
    &.active {
      color: #484848;
    }
  }
  .divider {
    margin: 0 6px;
    display: inline-block;
    height: 8px;
    width: 1px;
    background: #ccc;
  }
}
</style>
