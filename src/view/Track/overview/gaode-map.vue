<template>
  <div class="warrp">
    <div id="container" class="mapWarrp"></div>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from 'AMap';

let map;
export default {
  props: ['propData'],
  data() {
    return {
      markers: [],
    };
  },

  watch: {
    propData: {
      handler(val) {
        this.mapInit(val.data, val.type);
      },
      deep: true,
    },
  },
  methods: {
    mapInit(obj, type) {
      console.log(obj);
      if (this.markers.length > 0) {
        map.remove(this.markers);
        this.markers = [];
      }
      const allmarkerArr = Object.values(obj);
      allmarkerArr.forEach((key) => {
        const lngs = key.toString().split(',');
        const marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            size: new AMap.Size(20, 35),
          }),
          position: [lngs[0], lngs[1]],
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          clickable: true,
          map,
        });
        this.markers.push(marker);
      });
      if (type === 'http') {
        map.setFitView(); // 地图自适应
      }
    },
    init() {
      // const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 10,
        // lang: lang
      });
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    map.destroy();
  },
};
</script>
<style lang="scss" scoped>
.mapWarrp {
  width: 100%;
  height: calc(100vh - 202px);
}
</style>
