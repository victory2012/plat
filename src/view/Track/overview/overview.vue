<template>
  <div>
    <el-row :gutter="20"
      class="mgb20">
      <el-col :span="6">
        <el-card shadow="hover"
          :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1">
            <i class="grid-con-icon icon-total iconfont"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{count.total}}</div>
              <div>{{$t('overview.total')}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <i class="grid-con-icon icon-online iconfont"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{count.monthTotal}}</div>
              <div>{{$t('overview.online')}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-3">
            <i class="grid-con-icon iconfont icon-offline"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{count.availableTotal}}</div>
              <div>{{$t('overview.offLine')}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover"
          :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <i class="grid-con-icon iconfont icon-icon_operate_invalid"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{count.invalid}}</div>
              <div>{{$t('overview.invalid')}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <gaode-map v-if="mapType.type === 1"
      :propData="propData"></gaode-map>
    <google-map v-else
      :propData="propData"></google-map>
  </div>
</template>
<script>
// import AMap from "AMap";
import { mapGetters } from 'vuex';
import gaodeMap from './gaode-map';
import googleMap from './google-map';

export default {
  components: {
    gaodeMap,
    googleMap,
  },
  name: 'battery',
  data() {
    return {
      count: {
        invalid: 5,
        availableTotal: 3,
        monthTotal: 6,
        total: 8,
      },
      markers: [],
      sendData: { api: 'bind', param: [] },
      propData: {},
    };
  },
  computed: {
    ...mapGetters({
      mapType: 'getUserMapType',
    }),
  },
  methods: {
    init() {
      this.getTocalsData();
      this.narmleHttp();
    },
    /* 获取统计数据 */
    getTocalsData() {
      // GetCount().then((res) => {
      //   console.log('GetCount', res);
      //   if (res.data && res.data.code === 0) {
      //     const result = res.data.data;
      //     this.count = result;
      //     this.count.invalid =
      //       Number(result.total) - Number(result.availableTotal);
      //   }
      // });
    },
    /*
      http请求 获取全部电池设备
     */
    narmleHttp() {
      // const pageObj = {
      //   pageNum: 1,
      //   pageSize: 999999999,
      //   bindingStatus: '',
      // };
      // GetDeviceList(pageObj).then((res) => {
      //   console.log(res);

      //   if (res.data.code === 0) {
      //     const result = res.data.data.data;
      //     this.allDevice = result.length;
      //     pointerObj = {};
      //     if (result.length > 0) {
      //       result.forEach((key) => {
      //         if (key.longitude && key.latitude && Number(key.longitude) > 0 && Number(key.latitude) > 0 && key.onlineStatus === 1) {
      //           pointerObj[key.deviceId] = `${key.longitude},${key.latitude}`;
      //           this.sendData.param.push(key.deviceId);
      //         }
      //       });
      //       console.log(pointerObj);
      //       this.propData.data = pointerObj;
      //       // this.mapInit(pointerObj);
      //       this.propData.type = 'http';
      //       this.sockets(this.sendData);
      //     } else {
      //       onWarn(this.$t('history.noDevice'));
      //     }
      //   }
      // });
    },
    /*
      websockets 请求
     */
    sockets(result) {
      this.WX = this.$api.Socket();
      this.WX.onopen = () => {
        console.log('open....');
        this.WX.send(JSON.stringify(result));
      };
      this.WX.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.code === 1) {
          this.onLine = data.data;
          if (Number(this.allDevice) < Number(this.onLine)) {
            this.onLine = this.allDevice;
          }
          this.offLine = this.allDevice - this.onLine;
        }
        if (data.code === 2) {
          // if (this.markers.length > 0) {
          //   map.remove(this.markers);
          // }
          // code 为 1时 既绑定成功，2时为 收到了数据
          // const obj = data.data.split(',');
          // if (Number(obj[2]) > 0 && Number(obj[1]) > 0) {
          //   pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
          //   this.propData.data = pointerObj;
          //   this.propData.type = 'ws';
          // }
        }
      };
      this.WX.onerror = () => {
        this.over();
      };
    },
    over() {
      this.WX.close();
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (typeof this.WX === 'object') {
      this.over();
    }
  },
};
</script>
<style lang="scss" scoped>
.mgb20 {
  margin-bottom: 20px;
}
.grid-num {
  font-weight: 700;
  font-size: 30px;
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}
.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-4 .grid-con-icon {
  background: #e6a23c;
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>

