<template>
  <div id="positions"
    class="positioned"></div>
</template>

<script>
/* eslint-disable */
import google from 'google';

let map;
let ponterIndex;
export default {
  data () {
    return {

    };
  },

  mounted () { this.init() },

  methods: {
    init () {
      try {
        map = new google.maps.Map(document.getElementById('positions'), {
          center: {
            lat: 0,
            lng: 0,
          },
          zoom: 15,
        });
      } catch (err) {
        this.$message.error(this.$t('mapError'));
      }
    },
    GoogleMapInit (data, fromWs) {
      if (this.markers.length > 0) {
        this.markers.forEach((key) => {
          key.setMap(null);
        });
        this.markers = [];
      }
      const allmarkerArr = Object.values(data);
      const markerkeys = Object.keys(data);
      this.markerTime = [];
      for (let i = 0; i < allmarkerArr.length; i++) {
        const lngs = allmarkerArr[i].toString().split(',');
        if (lngs[0].length > 6 && lngs[1].length > 6 && lngs[4] === '1') {
          const obj = {};
          let content;
          const latLng = new google.maps.LatLng(lngs[0], lngs[1]);

          obj.voltage = lngs[7] || 0;
          if (obj.voltage) {
            content = `${this.$t('positions.batteryCode')}：${lngs[3]}\n${this.$t('positions.deviceCode')}：${markerkeys[i]}\n${this.$t('positions.voltage')}：${obj.voltage}`;
          } else {
            content = `${this.$t('positions.batteryCode')}：${lngs[3]}\n${this.$t('positions.deviceCode')}：${markerkeys[i]}`;
          }

          const marker = new google.maps.Marker({
            position: latLng,
            label: `${i + 1}`,
            title: content,
            map,
          });
          if (fromWs === 'fromClick') {
            marker.setLabel({
              text: `${ponterIndex}`,
            });
          }
          obj.pointer = marker;
          obj.times = lngs[2];
          this.markerTime.push(obj);
          this.markers.push(marker);
        }
      }
      this.markerTime.forEach((key) => {
        const self = this;
        const voltage = key.voltage;
        key.pointer.addListener('click', (e) => {
          const latLngData = `${e.latLng.lat().toFixed(6)},${e.latLng.lng().toFixed(6)}`;
          let site;
          if (key.voltage) {
            site = `${self.$t('positions.updateTime')}：${key.times}<br />${self.$t('positions.latLng')}：${latLngData}<br />${self.$t('positions.voltage')}：${voltage}`;
          } else {
            site = `${self.$t('positions.updateTime')}：${key.times}<br />${self.$t('positions.latLng')}：${latLngData}`;
          }
          this.infowindow = new google.maps.InfoWindow({
            content: site,
          });
          this.infowindow.open(map, key.pointer); // 弹出信息提示窗口
          map.addListener('click', () => {
            this.infowindow.close();
          });
        });
      });
      // 只有从概览中获取marker点的时候 才需要自适应显示；
      if (!fromWs) {
        // 地图自适应显示所有点
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        map.fitBounds(bounds);
      }
    },
  },

};

</script>
<style lang='scss' scoped>
.positioned {
  width: 100%;
  height: 100%;
}
</style>
