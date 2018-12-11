<template>
  <div id="positions" class="positioned"></div>
</template>
<script>
/* eslint-disable */
import AMap from 'AMap';

let map;
let infoWindow;
let geocoder;
export default {
  props: ['mapData'],
  data () {
    return {
      pointer: this.mapData,
      markers: [],
    };
  },
  watch: {
    mapData: {
      handler (val) {
        console.log(val[0][0]);
        if (val[0][0]) {
          this.MapInit({
            abaan: val[0][0]
          });
        }

      },
      deep: true,
    },
  },
  methods: {
    init () {
      const lang = sessionStorage.getItem('locale') === 'en' ? 'en' : 'zh_cn';
      map = new AMap.Map('positions', {
        resizeEnable: true,
        zoom: 15,
        lang,
      });
      this.MapInit({
        abaan: this.mapData[0] ? this.mapData[0] : {}
      });
    },
    MapInit (data, type) {
      console.log(data);
      if (this.markers.length > 0) {
        map.remove(this.markers);
        this.markers = [];
      }
      const allmarkerArr = Object.values(data);
      const markerkeys = Object.keys(data);
      for (let i = 0; i < allmarkerArr.length; i++) {
        const lngs = allmarkerArr[i].toString().split(',');
        if (lngs[0]) {
          // if (lngs[0].length > 6 && lngs[1].length > 6 && lngs[4] === '1') {
          const marker = new AMap.Marker({
            position: [lngs[0], lngs[1]],
            offset: new AMap.Pixel(-12, -12),
            zIndex: 101,
            extData: {
              position: `${lngs[0]},${lngs[1]}`,
              center: new AMap.LngLat(lngs[0], lngs[1]),
              times: lngs[2],
            },
            map,
          });
          marker.setIcon(
            `http://webapi.amap.com/theme/v1.3/markers/n/mark_b${i + 1}.png`,
          );
          // if (lngs[5] === '0') {
          //   marker.setIcon('../../../static/img/gray.png');
          // } else {
          //   marker.setIcon(
          //     `http://webapi.amap.com/theme/v1.3/markers/n/mark_b${lngs[6]}.png`,
          //   );
          // }
          if (type === 'fromClick') {
            map.setCenter(new AMap.LngLat(lngs[0], lngs[1]));
            marker.setIcon(
              `http://webapi.amap.com/theme/v1.3/markers/n/mark_r${lngs[6]}.png`,
            );
          }
          // const voltage = lngs[7];
          // let content;
          // if (voltage === 'null') {
          //   content = `${this.$t('positions.batteryCode')}：${
          //     lngs[3]
          //     }<br/>${this.$t('positions.deviceCode')}：${markerkeys[i]}`;
          // } else {
          //   content = `${this.$t(
          //     'positions.voltage',
          //   )}：${voltage}<br/>${this.$t('positions.batteryCode')}：${
          //     lngs[3]
          //     }<br/>${this.$t('positions.deviceCode')}：${markerkeys[i]}`;
          // }
          // marker.setLabel({
          //   offset: new AMap.Pixel(15, 20),
          //   content,
          // });
          this.markers.push(marker);
        }
      }
      if (type === 'http') {
        map.setFitView(); // 自适应地图
      }
      if (this.markers.length > 0) {
        this.markers.forEach((key) => {
          key.on('click', () => {
            const pointerData = key.getExtData();
            // console.log(key);
            const self = this;
            geocoder.getAddress(pointerData.center, (status, result) => {
              if (status === 'complete' && result.regeocode) {
                const address = result.regeocode.formattedAddress;
                console.log(result);
                const info = [];
                info.push(
                  `<div><div>${self.$t('positions.updateTime')}：${
                  pointerData.times
                  }</div>`,
                );
                info.push(
                  `<div style="font-size:14px;">${self.$t(
                    'positions.address',
                  )} :${address}</div></div>`,
                );
                infoWindow = new AMap.InfoWindow({
                  content: info.join('<br/>'), // 信息窗体框，显示信息内容
                  autoMove: false,
                  offset: new AMap.Pixel(0, -10),
                });
                infoWindow.open(map, pointerData.center);
              }
            });
          });
        });
      }
      map.on('click', () => {
        if (typeof infoWindow === 'object') {
          infoWindow.close();
        }
      });
    },
  },
  mounted () {
    // console.log('pointer', this.pointer);
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.positioned {
  width: 100%;
}
</style>
