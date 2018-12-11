<template>
  <div class="gaoDeMap">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="toolWarp">
      <span v-show="addFence" class="Tiptext">Tips：{{$t('fence.tipMsg.morePointer')}}</span>
      <el-button v-show="addFence" @click="cancelSetings" size="small " type="info">{{$t('fence.cancelSeting')}}</el-button>
      <el-button v-show="addFence" @click="doAddFence" size="small " type="primary">{{$t('fence.sureSeting')}}</el-button>
      <el-button v-show="addFence" @click="goBack" size="small " type="warning">{{$t('fence.back')}}</el-button>
      <el-button v-show="!addFence" @click="ToAddFence" size="small " type="primary">{{$t('fence.addBtn')}}</el-button>
      <el-button v-show="!addFence" @click="ToDeleteFence" size="small " type="danger">{{$t('fence.delBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from 'AMap';

let map;
let marker;
// let mouseTool;
// let allPointers = [];
export default {
  data () {
    return {
      chooseId: '',
      total: 0,
      pageNum: 1,
      loading: false,
      addFence: false,
      pointerArr: [],
      polygonArr: [],
      mouseToolArr: [],
      mouseTool: null,
      markers: [],
      json: '',
      fenceId: '',
      polygon: null,
      selectPonter: [],
    };
  },
  mounted () {
    console.log(this.$route)
    this.init();
  },
  methods: {
    init () {
      const lang = sessionStorage.getItem('locale') === 'en' ? 'en' : 'zh_cn';
      map = new AMap.Map('AddContainer', {
        resizeEnable: true,
        lang,
        zoom: 5,
      });

      // this.buildFence();
      // map.on('click', this.callBackFn); // 地图的点击事件
      // map.setDefaultCursor('pointer'); // 手势
      // map.on('rightclick', () => {
      //   // map.setDefaultCursor(); // 手势
      //   map.off('click', this.callBackFn); // 移除地图点击事件
      //   if (this.mouseTool) {
      //     this.mouseTool.close(false); // 移除 画多边形的功能
      //   }
      // });
    },
    // 没有设置过围栏
    buildFence () {
      map.plugin(['AMap.MouseTool'], () => {
        this.mouseTool = new AMap.MouseTool(map);
        this.mouseTool.polygon();
        // this.mouseTool.close(true); // 移除 画多边形的功能
        this.mouseToolArr.push(this.mouseTool);
      });
      map.setDefaultCursor('pointer'); // 手势
      map.on('click', this.callBackFn); // 地图的点击事件
      /* 鼠标右击事件 右击后 要移除地图的点击事件 和画多边形的事件 */
      map.on('rightclick', () => {
        map.setDefaultCursor(); // 手势
        map.off('click', this.callBackFn); // 移除地图点击事件
        this.mouseTool.close(false); // 移除 画多边形的功能
      });
    },
    callBackFn (e) {
      if (this.markers.length === 9) {
        this.mouseTool.close(false); // 移除 画多边形的功能
      }
      if (this.markers.length > 9) {
        map.setDefaultCursor(); // 手势
        map.off('click', this.callBackFn); // 移除地图点击事件
        this.mouseTool.close(false); // 移除 画多边形的功能
      } else {
        // 获取地图点击的jps坐标位置 集合
        this.selectPonter.push(`${e.lnglat.getLng()},${e.lnglat.getLat()}`);
        marker = new AMap.Marker({
          map,
          position: [e.lnglat.getLng(), e.lnglat.getLat()],
        });
        this.markers.push(marker);
      }
      console.log('this.selectPonter', this.selectPonter);
    },
    ToDeleteFence () { },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList, id) {
      // this.addFence = false;
      const poi = gpsList.split(';');
      const allPointers = [];
      poi.forEach((res) => {
        const item = res.split(',');
        const arr = [item[0], item[1]];
        allPointers.push(arr);
      });
      /** 画多边形 */
      const polygons = new AMap.Polygon({
        map,
        strokeColor: '#0000ff',
        strokeWeight: 2,
        fillColor: '#f5deb3',
        fillOpacity: 0.6,
        extData: id,
        cursor: 'pointer',
      });
      polygons.setPath(allPointers);
      this.polygonArr.push(polygons);
      polygons.on('click', (e) => {
        if (this.polygonArr.length > 0) {
          this.polygonArr.forEach((key) => {
            key.setOptions({
              strokeColor: '#0000ff',
              fillColor: '#f5deb3',
              fillOpacity: 0.6,
              cursor: 'pointer',
            });
            if (e.target.getExtData() === key.G.extData) {
              this.polygon = key;
            }
          });
        }
        e.target.setOptions({
          strokeColor: '#0000ff',
          fillColor: 'red',
          fillOpacity: 0.6,
        });
        this.fenceId = e.target.getExtData();
      });
      map.setFitView(); // 地图自适应
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
      console.log('gpsList', gpsList);
      // const gpsObj = {
      //   deviceId: this.clickItme.deviceId,
      //   batteryId: this.clickItme.batteryId,
      //   gpsList,
      // };
      // addFence(gpsObj).then((res) => {
      //   // console.log(res);

      //   if (res.data.code === 0) {
      //     onSuccess(`${this.$t('fence.tipMsg.addSuccess')}`);
      //     this.cancelSetings();
      //     this.getFenceData({
      //       batteryId: this.clickItme.batteryId,
      //       deviceId: this.clickItme.deviceId,
      //     });
      //   }
      // });
    },
    unique (arr) {
      return Array.from(new Set(arr));
    },
    /* 取消设置 */
    cancelSetings () {
      this.selectPonter = [];
      this.markers && map.remove(this.markers); // 清除marker点
      this.mouseTool && this.mouseTool.close(true); // 清除多边形
      this.markers = [];
      this.mouseTool = null;
      /*
      * 点击取消设置后 需要恢复地图的点击事件 和 “AMap.MouseTool”画多边形事件
      * 所以 在执行一下 buildFence（）方法 即可解决
      */
      this.buildFence();
    },
    /* goBack 返回 */
    goBack () {
      this.cancelSetings();
      this.addFence = false;
      map.setDefaultCursor(); // 手势
      map.off('click', this.callBackFn); // 移除地图点击事件
      this.mouseTool.close(false); // 移除 画多边形的功能
      // this.getFenceData({
      //   batteryId: this.clickItme.batteryId,
      //   deviceId: this.clickItme.deviceId,
      // });
    },
    /*
      参数 data {"batteryId":1,"deviceId":2}
     */
    ToAddFence () {
      // if (this.hasFenced) return;
      this.addFence = true;
      this.markers = [];
      // console.log(this.mouseToolArr);
      if (this.mouseToolArr.length > 0) {
        this.mouseToolArr.forEach((key) => {
          key.close(false);
        });
      }
      this.mouseTool = null;
      // console.log(this.polygonArr);
      if (this.polygonArr.length > 0) {
        this.polygonArr.forEach((key) => {
          key.hide();
        });
      }
      this.mouseToolArr = [];
      this.polygonArr = [];
      this.buildFence();
    },
  },
  beforeDestroy () {
    map.destroy();
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
