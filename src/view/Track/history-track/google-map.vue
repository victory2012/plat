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
import google from 'google';

let map;
let heatmapData;
let line;
let animate1;
export default {
  data () {
    return {
      time: {},
      trajectory: false,
      active: true,
      mapLoading: false,
      localMakerArr: [],
    };
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      try {
        map = new google.maps.Map(document.getElementById('mapcontainer'), {
          center: {
            lat: 0,
            lng: 0,
          },
          zoom: 15,
        });
        // var geocoders = new google.maps.Geocoder();
        map.addListener('click', (e) => {
          if (this.localMakerArr.length > 0) {
            this.localMakerArr.forEach((key) => {
              key.setMap(null);
            });
          }
          const latLngData =
            `${e.latLng.lat().toFixed(6)},${e.latLng.lng().toFixed(6)}`;
          const localMaker = new google.maps.Marker({
            position: e.latLng,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeColor: 'red',
            },
            map,
          });
          this.localMakerArr.push(localMaker);
          this.$.ajax({
            type: 'post',
            url:
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLngData}&key=AIzaSyAz6eHKxmBqalyW0LVFjs9mugr5t0PxvYI&fields=formatted_address`,
            async: true,
            success (data) {
              console.log(data);
              const site = `${this.$t(
                'history.latLng',
              )}：${latLngData}<br />${this.$t('history.address')}：${
                data.results[0].formatted_address
                }`;
              const infowindow = new google.maps.InfoWindow({
                content: site,
              });
              infowindow.open(map, localMaker); // 弹出信息提示窗口
              map.addListener('click', () => {
                infowindow.close();
              });
            },
          });
        });
      } catch (err) {
        this.$message.error(`${this.$t('mapError')}`);
      }
    },
    startOnclick () {
      this.animateCircle(this.time.timeSeconds);
    },
    animateCircle (times) {
      let seconds = times || 10;
      var count = 0;
      animate1 && clearInterval(animate1);
      animate1 = window.setInterval(() => {
        count = count + 5;
        // console.log(count)
        var icons = line.get("icons");
        icons[0].offset = (count / this.gridData.length) * 100 + "%";
        line.set("icons", icons);
        console.log(count, icons[0].offset);
        // 终点
        if (count >= this.gridData.length) {
          clearInterval(animate1);
        }
      }, seconds);
    },
    heatmap () {
      this.mapLoading = true;
      this.trajectory = false;
      this.active = true;
      this.clearMap();
      heatmapData = new google.maps.visualization.HeatmapLayer({
        data: this.gridData,
        map,
        radius: 10,
        opacity: 1,
        maxIntensity: 15,
        dissipating: true,
        gradient: [
          'rgba(0, 0, 255, 0)',
          'rgba(55, 55, 255, 1)',
          'rgba(0, 255, 120, 1)',
          'rgba(18, 255, 0, 1)',
          'rgba(150, 255, 0, 1)',
          'rgba(210, 255, 0, 1)',
          'rgba(255, 228, 0, 1)',
          'rgba(255, 216, 0, 1)',
          'rgba(255, 132, 0, 1)',
          'rgba(255, 72, 0, 1)',
          'rgba(255, 48, 0, 1)',
          'rgba(234, 86, 61, 1)',
          'rgba(255, 36, 0, 1)',
          'rgba(255, 0, 0, 1)',
        ],
      });
      this.mapLoading = false;
      // heatmapData.set("gradient", gradient);
    },
    // 历史轨迹 轨迹配置
    track () {
      this.trajectory = true;
      this.active = false;
      this.clearMap();
      this.mapLoading = true;
      line = new google.maps.Polyline({
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              strokeColor: '#1200ff',
            },
            offset: '0%',
          },
        ],
        strokeColor: '#71253e',
        map,
      });
      line.setPath(this.gridData);
      const TimerMax = Math.ceil(this.gridData.length * 0.01);
      if (TimerMax > this.max) {
        this.max = Math.ceil(TimerMax * 2);
      }
      this.min = TimerMax;
      this.timeSeconds = TimerMax;
      const start = new google.maps.Marker({
        position: this.gridData[0],
        label: {
          color: '#FFF',
          text: 'S',
        },
        map,
      });
      const end = new google.maps.Marker({
        position: this.gridData[this.gridData.length - 1],
        label: {
          color: '#FFF',
          text: 'E',
        },
        map,
      });
      this.mapLoading = false;
      this.markerPointer.sdPointer.push(start);
      this.markerPointer.sdPointer.push(end);
    },
    // 清除地图上的覆盖物
    clearMap () {
      animate1 && clearInterval(animate1);
      heatmapData && heatmapData.setMap(null);
      line && line.setMap(null);
      if (this.markerPointer.sdPointer.length > 0) {
        this.markerPointer.sdPointer.forEach((marker) => {
          marker.setMap(null);
        });
        this.markerPointer.sdPointer = [];
      }
      if (this.markerPointer.mapPointer.length > 0) {
        this.markerPointer.mapPointer.forEach((marker) => {
          marker.setMap(null);
        });
        this.markerPointer.mapPointer = [];
      }
      if (this.localMakerArr.length > 0) {
        this.localMakerArr.forEach((key) => {
          key.setMap(null);
        });
      }
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

