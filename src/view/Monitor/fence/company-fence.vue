<template>
  <div class="positionWarp">
    <div class="mapWarp">
      <gaode-map></gaode-map>
      <div class="toolWarp">
        <span v-show="addFence"
          class="Tiptext">Tips：{{$t('fence.tipMsg.morePointer')}}</span>
        <el-button v-show="addFence"
          @click="cancelSetings"
          size="small "
          type="info">{{$t('fence.cancelSeting')}}</el-button>
        <el-button v-show="addFence"
          @click="doAddFence"
          size="small "
          type="primary">{{$t('fence.sureSeting')}}</el-button>
        <el-button v-show="addFence"
          @click="goBack"
          size="small "
          type="warning">{{$t('fence.back')}}</el-button>
        <el-button v-show="!addFence"
          @click="ToAddFence"
          size="small "
          type="primary">{{$t('fence.addBtn')}}</el-button>
        <el-button v-show="!addFence"
          @click="ToDeleteFence"
          size="small "
          type="danger">{{$t('fence.delBtn')}}</el-button>
      </div>
    </div>
    <div class="dataList">
      <h2>企业列表</h2>
      <ul class="list_warp">
        <li v-for="(item, index) in pointerArr"
          :key="item.deviceId"
          @click="checkItem(item, index)">
          <p>{{index + 1}}、{{item.deviceId}}</p>
        </li>
      </ul>
      <div class="page">
        <el-pagination @current-change="pageChange"
          small
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import gaodeMap from './map/gaode-map';

export default {
  components: {
    gaodeMap,
  },
  data() {
    return {
      pointerArr: [],
      total: 0,
      addFence: false,
    };
  },
  mounted() { },

  methods: {
    pageChange() { },
    cancelSetings() { },
    doAddFence() {

    },
    goBack() {
      this.$store.commit('monitor/SETmapPonter', false);
      this.addFence = false;
    },
    ToAddFence() {
      this.$store.commit('monitor/SETmapPonter', true);
      this.addFence = true;
    },
    ToDeleteFence() { },
  },

};

</script>
<style lang='scss' scoped>
.positionWarp {
  display: flex;
  height: 100%;
  .mapWarp {
    flex: 1;
    position: relative;
    min-width: 810px;
    .toolWarp {
      position: absolute;
      top: 2px;
      right: 5px;
      padding: 5px 10px;
      background: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.2) 0 0 50px;
      border-radius: 5px;
      font-size: 14px;
    }
  }
  .dataList {
    flex: 0 0 230px;
    background: #ffffff;
    h2 {
      font-size: 14px;
      height: 40px;
      line-height: 45px;
      color: #409eff;
      text-align: center;
      border-bottom: 1px solid #409eff;
    }
    ul {
      padding: 10px 0;
      li {
        padding: 0 5px;
        height: 60px;
        position: relative;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 5px;
        &:hover {
          background: #b3d8ff;
        }
        p {
          line-height: 60px;
          font-size: 13px;
        }
        .badge {
          height: 30px;
          position: absolute;
          top: 15px;
          right: 16px;
        }
      }
    }
    .page {
      padding-top: 20px;
      text-align: right;
    }
  }
}
</style>
