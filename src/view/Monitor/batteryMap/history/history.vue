<template>
  <div class="positionWarp">
    <div class="mapWarp">
      <gaode-map></gaode-map>
    </div>
    <div class="dataList">
      <h2>电池列表</h2>
      <ul class="list_warp">
        <li v-for="(item, index) in pointerArr" :key="item.deviceId" @click="checkItem(item, index)">
          <p>{{index + 1}}、{{item.deviceId}}</p>
        </li>
      </ul>
      <div class="page">
        <el-pagination @current-change="pageChange" small layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import gaodeMap from './gaode-map';

export default {
  components: {
    gaodeMap,
  },
  data() {
    return {
      pointerArr: [],
      total: 0,
    };
  },
  mounted() { },

  methods: {
    pageChange() { },
  },

};

</script>
<style lang='scss' scoped>
.positionWarp {
  display: flex;
  height: 100%;
  .mapWarp {
    flex: 1;
    min-width: 810px;
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
