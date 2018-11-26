<template>
  <div class="gaoDeMap">
    <div id="AddContainer"
      class="fenceContainer"></div>
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
</template>
<script>
/* eslint-disable */
import google from 'google';

let map;
const bermudaTriangleArr = [];
export default {
  data () {
    return {
      chooseId: '',
      total: 0,
      label: 1,
      pageNum: 1,
      loading: false,
      addFence: false,
      pointerArr: [],
      fenceId: '',
      markers: [],
      polygon: null,
      fencePonter: '',
      selectPonter: [],
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      try {
        map = new google.maps.Map(document.getElementById('AddContainer'), {
          center: {
            lat: 0,
            lng: 0,
          },
          zoom: 18,
        });
      } catch (err) {
        this.$message.error(`${this.$t('mapError')}`);
      }
    },
    // 没有设置过围栏
    buildFence () {
      this.addFence = true;
      this.label = 1;
      this.markers = [];
      this.selectPonter = [];
      google.maps.event.addListener(map, 'click', (event) => {
        const marker = new google.maps.Marker({
          position: event.latLng,
          label: `${this.label++}`,
          map,
        });
        // this.fencePonter += `${event.latLng
        //   .lng()
        //   .toFixed(6)},${event.latLng.lat().toFixed(6)};`;
        this.selectPonter.push(`${event.latLng
          .lng()
          .toFixed(6)},${event.latLng.lat().toFixed(6)}`);
        this.markers.push(marker);
        if (this.label > 10) {
          google.maps.event.clearListeners(map, 'click');
        }
      });
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList, id) {
      this.addFence = false;
      const poi = gpsList.substring(0, gpsList.length - 1).split(';');
      const allPointers = [];
      const bounds = new google.maps.LatLngBounds();
      poi.forEach((res) => {
        const item = res.split(',');
        const arr = new google.maps.LatLng(item[1], item[0]);
        bounds.extend(arr);
        allPointers.push(arr);
      });
      map.fitBounds(bounds); // 自适应显示
      const bermudaTriangle = new google.maps.Polygon({
        paths: [allPointers],
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: '#FFC107',
        fillOpacity: 0.6,
      });
      bermudaTriangleArr.push(bermudaTriangle);
      bermudaTriangle.setMap(map);
      bermudaTriangle.addListener('click', () => {
        this.fenceId = id;
        bermudaTriangleArr.forEach((key) => {
          key.setOptions({
            fillColor: '#FFC107',
          });
        });
        bermudaTriangle.setOptions({
          fillColor: '#FF0000',
          fillOpacity: 0.8,
        });
      });
    },
    /* 删除围栏 */
    ToDeleteFence () { },

    /* 去重 */
    unique (arr) {
      return Array.from(new Set(arr));
    },
    // 确认设置 添加围栏
    doAddFence () {
      const pointer = this.unique(this.selectPonter);
      if (pointer.length === 0) {
        this.$message.error(`${this.$t('fence.tipMsg.addPointer')}`);
        return;
      }
      if (pointer.length < 3) {
        this.$message.error(`${this.$t('fence.tipMsg.less')}`);
        return;
      }
      let gpsList = '';
      pointer.forEach((key) => {
        gpsList += `${key};`;
      });
      const gpsObj = {
        deviceId: this.clickItme.deviceId,
        batteryId: this.clickItme.batteryId,
        gpsList,
      };
      addFence(gpsObj).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          google.maps.event.clearListeners(map, 'click');
          if (this.markers.length > 0) {
            this.markers.forEach((key) => {
              key.setMap(null);
            });
            this.markers = [];
          }
          // drawingManager.setDrawingMode(null);
          onSuccess(`${this.$t('fence.tipMsg.addSuccess')}`);
          this.getData({
            batteryId: this.clickItme.batteryId,
            deviceId: this.clickItme.deviceId,
          });
        }
      });
    },
    /* 取消设置 */
    cancelSetings () {
      this.addFence = true;
      this.selectPonter = [];
      this.label = 1;
      google.maps.event.clearListeners(map, 'click');
      if (this.markers.length > 0) {
        this.markers.forEach((key) => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.buildFence();
    },
    ToAddFence () {
      this.addFence = true;
      this.buildFence();
    },
    /* goBack 返回 */
    goBack () {
      this.addFence = false;
      this.selectPonter = [];
      if (this.markers.length > 0) {
        this.markers.forEach((key) => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.label = 1;
      google.maps.event.clearListeners(map, 'click');
      // this.getData({
      //   batteryId: this.clickItme.batteryId,
      //   deviceId: this.clickItme.deviceId,
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.gaoDeMap {
  position: relative;
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
.fenceContainer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // height: 100%;
  // width: 100%;
  border-radius: 5px;
}
</style>
