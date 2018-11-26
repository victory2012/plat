<template>
  <div class="positionWarp">
    <!-- <div >map</div> -->
    <gaode-map v-if='mapType === 1'
      class="mapWarp"></gaode-map>
    <google-map class="mapWarp"
      v-else></google-map>
    <div class="dataList">
      <h2>电池列表</h2>
      <ul class="list_warp">
        <li v-for="(item, index) in pointerArr"
          :key="item.deviceId"
          @click="checkItem(item, index)">
          <p>{{index + 1}}、{{item.deviceId}}</p>
          <el-badge :value="item.onLine"
            class="badge">
            <el-button @click.prevent.stop="HistoryTrack(item.batteryId)"
              size="mini">{{$t('positions.track')}}</el-button>
          </el-badge>
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
import { mapGetters } from 'vuex';
import gaodeMap from './gaode-map';
import googleMap from './google-map';

export default {
  components: {
    gaodeMap,
    googleMap,
  },
  data() {
    return {
      pageChange: 1,
      pageNum: 1,
      total: 0,
      mapData: {},
      pointerArr: [{
        deviceId: '123456abc',
        onLine: '在线',
      }, {
        deviceId: '123456def',
        onLine: '离线',
      }, {
        deviceId: '123456abcd',
        onLine: '在线',
      }, {
        deviceId: '123456dgfe',
        onLine: '离线',
      }, {
        deviceId: '123456abcf',
        onLine: '在线',
      }, {
        deviceId: '123456defg',
        onLine: '离线',
      }, {
        deviceId: '123456abch',
        onLine: '在线',
      }, {
        deviceId: '123456defs',
        onLine: '离线',
      }, {
        deviceId: '123456absd',
        onLine: '在线',
      }, {
        deviceId: '123456defe',
        onLine: '离线',
      }],
    };
  },
  computed: {
    ...mapGetters({
      mapType: 'getUserMapType',
    }),
  },
  mounted() { },

  methods: {
    HistoryTrack() { },
    checkItem() { },
  },

};

</script>
<style lang='scss' scoped>
.positionWarp {
  display: flex;
  height: 100%;
  .mapWarp {
    flex: 1;
    margin-right: 5px;
    border-radius: 5px;
  }
  .dataList {
    flex: 0 0 230px;
    background: #ffffff;
    border-radius: 5px;
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
