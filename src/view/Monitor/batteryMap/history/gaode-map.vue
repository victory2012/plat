<template>
  <div class="mapcontainer">
    <div class="control">
      <div class="date">
        <el-date-picker v-model="time.starts"
          size='mini'
          type="datetime"
          :placeholder="$t('history.startTime')">
        </el-date-picker>
        <el-date-picker v-model="time.endtime"
          type="datetime"
          size='mini'
          :placeholder="$t('history.endTime')">
        </el-date-picker>
        <el-button v-show="trajectory"
          size="mini"
          plain
          @click="startOnclick"
          :title="$t('history.start')">
          <i class="iconfont icon-ic_song_next"></i>
        </el-button>
        <el-button v-show="trajectory"
          size="mini"
          plain
          @click="pauseOnclick"
          :title="$t('history.pause')">
          <i class="iconfont icon-pause"></i>
        </el-button>
        <el-button v-show="trajectory"
          size="mini"
          plain
          @click="resumeOnclick"
          :title="$t('history.continue')">
          <i class="iconfont icon-icons-resume_button"></i>
        </el-button>
        <el-button v-show="trajectory"
          size="mini"
          plain
          @click="stopOnclick"
          :title="$t('history.stop')">
          <i class="iconfont icon-stop"></i>
        </el-button>
        <el-button v-show="trajectory"
          type="danger"
          size="small"
          @click="heatmap">{{$t('history.heatActive')}}</el-button>
        <el-button v-show="active"
          type="primary"
          size="mini"
          @click="track">{{$t('history.TrackReplay')}}</el-button>
      </div>
    </div>
    <div class="timeRange"
      v-show="trajectory">
      <span>{{$t('history.times')}}(s)</span>
      <el-slider v-model="time.timeSeconds"
        @change="speedChange"
        vertical
        height="200px">
      </el-slider>
    </div>
    <div id="mapcontainer"
      class="mapcenter"></div>
    <div class="HisMask"
      v-show="mapLoading"
      v-loading="mapLoading"></div>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from 'AMap';
import AMapUI from 'AMapUI';
import utils from '@/utils/utils';

let navg;
let map;
let heatmap;
let pathSimplifierIns;
let infoWindow;
export default {
  data () {
    return {
      time: {},
      trajectory: false,
      active: true,
      markerArr: [],
      mapLoading: false,
      lineArr: [],
      gridData: []
    };
  },
  mounted () { this.init() },
  methods: {
    init () {
      const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map("mapcontainer", {
        resizeEnable: true,
        lang: lang,
        zoom: 15
      });
      AMap.plugin(["AMap.Heatmap"], () => {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 12, // 给定半径
          opacity: [0, 1] // 透明度
        });
      });
    },
    // 开始运动
    startOnclick () {
      if (typeof navg === 'object') {
        navg.start();
      }
    },
    // 暂停运动
    pauseOnclick () {
      if (typeof navg === 'object') {
        navg.pause();
      }
    },
    // 继续运动
    resumeOnclick () {
      if (typeof navg === 'object') {
        navg.resume();
      }
    },
    // 停止运动
    stopOnclick () {
      if (typeof navg === 'object') {
        navg.stop();
      }
      // map.clearMap();
    },
    heatmap () {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      // this.mapLoading = true;
      this.trajectory = false;
      this.active = true;
      if (this.gridData.length > 0) {
        this.mapLoading = true;
        map.setCenter([this.gridData[0].lng, this.gridData[0].lat]);
        heatmap.setDataSet({
          data: this.gridData, // 热力图数据
        });
        heatmap.show();
        if (typeof pathSimplifierIns === 'object') {
          pathSimplifierIns.hide();
        }
        this.mapLoading = false;
      }
      // this.mapLoading = false;
    },
    // 历史轨迹 轨迹配置
    track () {
      this.trajectory = true;
      this.active = false;
      if (typeof heatmap === 'object') {
        heatmap.hide();
      }
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      if (this.lineArr.length < 1) {
        return;
      }
      this.mapLoading = true;
      const self = this;
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          const positionPicker = new PositionPicker({
            mode: 'dragMarker',
            map,
            iconStyle: {
              url: '../../static/img/iocna.png',
              size: [1, 1],
              ancher: [1, 1],
            },
          });
          pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map,
            getHoverTitle (pathData, pathIndex, pointIndex) {
              if (pointIndex >= 0) {
                return `${self.$t('history.No')} ${pointIndex} ${self.$t(
                  'history.point',
                )}`;
              }
            },
            getPath (pathData) {
              return pathData.path;
            },
            renderOptions: {
              pathLineStyle: {
                strokeStyle: 'rgb(193,21,52)',
                lineWidth: 6,
                dirArrowStyle: true,
              },
              keyPointTolerance: 10,
              keyPointStyle: {
                radius: 3,
                fillStyle: '#20acff',
              },
            },
          });
          pathSimplifierIns.on('pointClick', (e, info) => {
            const pointIndex = info.pointIndex;
            const pathData = info.pathData;
            const point = pathData.path[pointIndex];
            const position = new AMap.LngLat(point[0], point[1]);
            positionPicker.start(position);
            positionPicker.on('success', (result) => {
              const infoArr = [];
              infoArr.push(
                `<div><div>${self.$t('history.times')}：${utils.trakTimeformat(
                  point[2],
                )}</div>`,
              );
              infoArr.push(
                `<div style="font-size:14px;">${self.$t('history.junction')} :${
                result.nearestJunction
                }</div>`,
              );
              infoArr.push(
                `<div style="font-size:14px;">${self.$t('history.address')} :${
                result.address
                }</div></div>`,
              );
              infoWindow = new AMap.InfoWindow({
                content: info.join('<br/>'), // 使用默认信息窗体框样式，显示信息内容
              });
              infoWindow.open(map, position);
              map.on('click', () => {
                infoWindow.close();
              });
            });
          });
          window.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([
            {
              name: this.$t('history.track'),
              path: this.lineArr,
            },
          ]);
          const distance = Number(this.alldistance) / 1000; // 米转成千米
          const times = Number(this.timeSeconds) / 3600; // 秒转成小时
          const speeds = Math.ceil(distance / times); // 最终得到的速度是 km/h
          navg = pathSimplifierIns.createPathNavigator(0, {
            loop: true,
            speed: speeds,
            pathNavigatorStyle: {
              width: 30,
              height: 30,
              strokeStyle: null,
              fillStyle: null,
              // 使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(
                '../../../../static/img/0181102120349.png',
              ),
            },
          });
        });
        const startPot = this.lineArr[0];
        const endPot = this.lineArr[this.lineArr.length - 1];
        const start = new AMap.Marker({
          map,
          position: [startPot[0], startPot[1]], // 基点位置  开始位置
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
          zIndex: 50,
        });
        const end = new AMap.Marker({
          map,
          position: [endPot[0], endPot[1]], // 基点位置  结束位置
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
          zIndex: 10,
        });
        this.mapLoading = false;
        this.markerArr.push(start);
        this.markerArr.push(end);
      });
    },
    speedChange () { },
  },

};

</script>
<style lang='scss' scoped>
.mapcontainer {
  position: relative;
  height: 100%;
  width: 100%;
  .control {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px 10px;
    border-radius: 3px;
    box-shadow: 0 0 15px #000000;
    background: #ffffff;
    line-height: 16px;
    z-index: 999;
    .date {
      font-size: 16px;
    }
  }
  .timeRange {
    position: absolute;
    top: 70px;
    right: 8px;
    z-index: 1000;
    padding: 5px 4px 15px;
    box-shadow: 0 0 15px #000000;
    background: #ffffff;
    text-align: center;
    border-radius: 3px;
    span {
      font-size: 12px;
    }
  }
  .mapcenter {
    height: 100%;
    width: 100%;
  }
}
</style>
