<template>
  <div class="center">
    <div class="dashboad">
      <div>
        <img src="../../../assets/img/temp.png">
        <p class="info">{{infoData.temperature}}℃</p>
        <p>{{$t('realTime.temperature')}}</p>
      </div>
      <div>
        <img src="../../../assets/img/level.png">
        <p class="info">{{infoData.fluid}}</p>
        <p>{{$t('realTime.fluid')}}</p>
      </div>
      <div>
        <img src="../../../assets/img/voltage_total.png">
        <p class="info">{{infoData.voltage}}V</p>
        <p>{{$t('realTime.voltage')}}</p>
      </div>
      <div>
        <img src="../../../assets/img/voltage.png">
        <p class="info">{{infoData.singleVoltage}}V</p>
        <p>{{$t('realTime.singleVoltage')}}</p>
      </div>
      <div>
        <img src="../../../assets/img/current.png">
        <p class="info">{{infoData.current}}A</p>
        <p>{{$t('realTime.current')}}</p>
      </div>
      <div>
        <img src="../../../assets/img/capacity.png">
        <p class="info">{{quantity}}</p>
        <p>{{$t('realTime.quantity')}}</p>
      </div>
    </div>
    <div class="warrp">
      <div class="map">
        <div class="mapCenter">
          <div class="mapContent"
            id="mapContent"></div>
        </div>
        <div class="timeCenter">
          <p class="map-time">{{infoData.hhmmss}}</p>
          <p class="map-date">{{infoData.yyddmm}}</p>
          <p class="map-des">{{$t('realTime.refresh')}}</p>
          <p @click="activeQuery"
            :class="{'active': queryData}"
            class="map-line">{{btnTip}}</p>
        </div>
      </div>
      <div class="address">
        <div>
          <img width="21px"
            src="../../../assets/img/me.png"
            alt="">
          <span>{{infoData.companyName}}</span>
        </div>
        <div>
          <img width="22px"
            src="../../../assets/img/address.png"
            alt="">
          <span>{{address}}</span>
        </div>
        <div>
          <img width="25px"
            src="../../../assets/img/battery.png"
            alt="">
          <span>{{infoData.code}}</span>
        </div>
        <div>
          <img width="26px"
            src="../../../assets/img/device.png"
            alt="">
          <span>{{infoData.deviceCode}}</span>
        </div>
        <div>
          <img width="25px"
            src="../../../assets/img/version.svg"
            alt="">
          <span>{{version}}</span>
        </div>
        <div>
          <img width="25px"
            src="../../../assets/img/device-flesh.png"
            alt="">
          <span>{{CCID}}</span>
        </div>
      </div>
    </div>
    <div class="my-map-divider">
      <span>{{$t('realTime.fourHour')}}</span>
      <el-checkbox v-model="checked">{{$t('realTime.update')}}</el-checkbox>
    </div>
    <echart-map :chartData="dataObj"
      :mqttData="ReceiveObj"></echart-map>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from "AMap";
import AMapUI from "AMapUI";
import Paho from "Paho";
import utils from "@/utils/utils";
import echartMap from "@/components/real/real-chart";
import mqtt from "@/api/mqtt.config";
import lnglatTrabsofor from "@/utils/longlatTransfor";
import t from "@/utils/translate";

let mqttClient = {};
let map;
let marker;
const PI = 3.14159265358979324;
const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
export default {
  props: ["hostObj", "propData"],
  components: {
    echartMap
  },
  data () {
    return {
      hasSend: false,
      sendBack: "",
      timer: null,
      quantity: "",
      btnTip: t("realTime.query"),
      CCID: "",
      address: "",
      interval: false,
      version: "",
      queryData: false,
      ReceiveObj: {},
      hasgetData: false,
      checked: true,
      mapData: null,
      infoData: this.propData,
      dataObj: {
        timeArr: [],
        singleVoltage: [],
        temperature: [],
        voltage: [],
        current: []
      },
      companyInfo: {},
      markerArr: []
    };
  },
  mounted () {
    this.init();
    this.getData();
    this.connectMqtt();
    this.getQuantity();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.interval) {
        this.getQuantity();
      }
    }, 25000);
  },
  destroyed () {
    if (
      typeof mqttClient === "object" &&
      typeof mqttClient.isConnected === "function" &&
      mqttClient.isConnected()
    ) {
      mqttClient.disconnect();
      mqttClient = {};
      map = null;
    }
    this.dataObj = {};
    this.ReceiveObj = {};
    clearInterval(this.timer);
  },
  watch: {
    hostObj: {
      handler: function () {
        this.getData();
        this.getQuantity();
      }
    },
    propData: {
      handler: function (val) {
        this.infoData = val;
        this.positionData(val);
        this.onConnect();
      },
      deep: true
    }
  },
  methods: {
    init () {
      const lang = localStorage.getItem('locale') === 'en' ? 'en' : 'zh_cn';
      map = new AMap.Map("mapContent", {
        resizeEnable: true,
        zoom: 10,
        lang
      });
    },
    getQuantity () {
      if (this.hostObj.deviceCode) {
        this.interval = false;
        this.$api.batteryCapacity(this.hostObj.deviceCode).then(res => {
          if (res.data && res.data.code === 0) {
            this.interval = true;
            if (res.data.data != null) {
              this.quantity = `${Math.round(res.data.data * 100)}%`;
            }
          }
        });
      }
    },
    connectMqtt () {
      const mqttConfig = mqtt();
      mqttClient = new Paho.MQTT.Client(
        mqttConfig.hostname,
        mqttConfig.port,
        mqttConfig.clientId
      );
      mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: mqttConfig.reconnect,
        keepAliveInterval: mqttConfig.keepAliveInterval,
        useSSL: mqttConfig.useSSL,
        timeout: mqttConfig.timeout
      });
      mqttClient.onFailure = res => {
        console.log(res);
      };
      mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      mqttClient.onMessageArrived = message => {
        console.log("message:", message);
        let payload = message.payloadString;
        if (payload) {
          let payloadType = payload.toString().split("]");
          if (payloadType[1]) {
            this.queryData = false;
            this.CCID = payloadType[1];
            let payloadJSON = `${payloadType[0]}]`;
            this.receiveData(payloadJSON);
          } else {
            this.receiveData(payload);
          }
        }
      };
    },
    /* 发送地址给后台 */
    addressCallBack (data) {
      let param = {
        id: this.hostObj.id,
        province: data.province ? data.province : data.city,
        city: data.city ? data.city : data.province
      };
      this.$api.sendAddress(param).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.hasSend = true;
        }
      });
    },
    /* 收到 mqtt数据 */
    receiveData (data) {
      let payloadString = JSON.parse(data);
      let dataObj = {
        times: utils.TimeSconds(payloadString[1]), // 时间
        singleVoltage: payloadString[3], // 单体电压
        voltage: payloadString[4], // 电压
        current: payloadString[5], // 电流
        temperature: payloadString[6], // 温度
        liquid: payloadString[7], // 液位
        longitude: payloadString[8], // 经度
        latitude: payloadString[9], // 纬度
        loop: payloadString[10], // 循环次数
        chargeingTime: payloadString[11], // 充电时间
        chargeTimes: payloadString[12], // 充电次数
        disChargeingTime: payloadString[13], // 放电时间
        disChargeTimes: payloadString[14], // 放电次数
        emptyTime: payloadString[15], // 空截时间
        addLiquidingTime: payloadString[16], // 补水时间
        addLiquidTimes: payloadString[17], // 补水次数
        addLiquidTimeOut: payloadString[18], //补水超限时间
        battery: payloadString[19], // 充电电量
        version: payloadString[20], // 版本号
        batteryCode: payloadString[21] // 电池编号
      };
      this.version = dataObj.version;
      if (Number(dataObj.latitude) > 0 && Number(dataObj.longitude) > 0) {
        let posData = this.gcj_encrypt(dataObj.latitude, dataObj.longitude);
        this.infoData.gcjLongitude = posData.lon;
        this.infoData.gcjLatitude = posData.lat;
        let resultPos = {
          gcjLongitude: posData.lon,
          gcjLatitude: posData.lat
        };
        this.positionData(resultPos);
      }

      this.infoData.temperature = dataObj.temperature;
      this.infoData.fluid =
        dataObj.liquid === 0 ? t("realTime.normal") : t("realTime.abnormal");
      this.infoData.voltage = dataObj.voltage;
      this.infoData.singleVoltage = dataObj.singleVoltage;
      if (Number(dataObj.current) < 0 && Number(dataObj.current) < -300) {
        dataObj.current = 0;
        this.infoData.current = 0;
      } else {
        this.infoData.current = -Number(dataObj.current);
      }
      this.infoData.hhmmss = utils.hhmmss(dataObj.times);
      this.infoData.yyddmm = utils.yyyymmdd(dataObj.times);
      if (this.checked) {
        this.ReceiveObj = dataObj;
      } else {
      }
    },
    onConnect () {
      console.log("connect");
      if (
        typeof mqttClient === "object" &&
        typeof mqttClient.subscribe === "function"
      ) {
        mqttClient.subscribe(`dev/${this.infoData.deviceCode}`);
      }
    },
    positionData (data) {
      if (data && data.gcjLongitude) {
        // marker.remove()
        let position = new AMap.LngLat(data.gcjLongitude, data.gcjLatitude);
        if (this.markerArr.length > 0) {
          this.markerArr.forEach(key => {
            key.setMap(null);
          });
        }
        marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: position
        });
        marker.setMap(map);
        this.markerArr.push(marker);
        map.setCenter(position);
        /* 根据经纬度 用高德查询详细地址 */
        lnglatTrabsofor(position, res => {
          // console.log("adress", res);
          this.address = res.formattedAddress;
          let sendAddress = `${res.addressComponent.province}-${
            res.addressComponent.city
            }`;
          if (this.sendBack !== sendAddress) {
            this.hasSend = false;
            this.sendBack = sendAddress;
          }
          if (!this.hasSend) {
            this.addressCallBack(res.addressComponent);
          }
        });
      }
    },
    getData () {
      let startTime = utils.getFourHours();
      let endTime = utils.getNowTime();
      if (!this.hostObj.hostId || !this.hostObj.device) {
        return;
      }
      this.$api
        .realData(this.hostObj.hostId, this.hostObj.device, startTime, endTime)
        .then(res => {
          // console.log(res);
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            this.dataObj = {
              timeArr: [],
              singleVoltage: [],
              temperature: [],
              voltage: [],
              current: []
            };
            result.forEach(key => {
              let timeArr = utils.TimeSconds(key.time); // 时间
              this.dataObj.singleVoltage.push({
                name: timeArr,
                value: [timeArr, key.singleVoltage]
              });
              this.dataObj.temperature.push({
                name: timeArr,
                value: [timeArr, key.temperature]
              });
              this.dataObj.voltage.push({
                name: timeArr,
                value: [timeArr, key.voltage]
              });
              this.dataObj.current.push({
                name: timeArr,
                value: [timeArr, -key.current]
              });
            });
            this.hasgetData = true;
          }
        });
    },
    activeQuery () {
      if (mqttClient.isConnected() && !this.queryData) {
        this.queryData = true;
        clearInterval(this.decriseTime);
        let index = 10;
        this.decriseTime = setInterval(() => {
          if (this.queryData) {
            index--;
            this.btnTip = `${t("realTime.query")}(${index}s)`;
            if (index === 0) {
              clearInterval(this.decriseTime);
              this.btnTip = `${t("realTime.query")}`;
              this.queryData = false;
            }
          } else {
            clearInterval(this.decriseTime);
            this.btnTip = `${t("realTime.query")}`;
          }
        }, 1000);
        let message = new Paho.MQTT.Message("c:get");
        message.destinationName = `cmd/${this.infoData.deviceCode}`;
        mqttClient.send(message);
      }
    },
    toggleUpdate () {
      if (this.checked) {
        if (mqttClient.isConnected()) {
          mqttClient.disconnect();
        }
      } else {
        this.connectMqtt();
      }
    },
    //硬件GPS----转高德经纬度 ----开始
    delta (lat, lon) {
      let a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
      let ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
      let dLat = this.transformLat(lon - 105.0, lat - 35.0);
      let dLon = this.transformLon(lon - 105.0, lat - 35.0);
      let radLat = (lat / 180.0) * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
      dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
      return { lat: dLat, lon: dLon };
    },

    /* 入口 */
    gcj_encrypt (wgsLat, wgsLon) {
      if (this.outOfChina(wgsLat, wgsLon)) return { lat: wgsLat, lon: wgsLon };
      var d = this.delta(wgsLat, wgsLon);
      return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
    },
    outOfChina (lat, lon) {
      if (lon < 72.004 || lon > 137.8347) return true;
      if (lat < 0.8293 || lat > 55.8271) return true;
      return false;
    },
    transformLat (x, y) {
      let ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    },
    transformLon (x, y) {
      let ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((x / 12.0) * PI) +
          300.0 * Math.sin((x / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    }
    //硬件GPS----转高德经纬度 ----结束
  }
};
</script>
<style lang="scss" scoped>
$fontColor: rgba(0, 0, 0, 0.65);
.center {
  background: #ffffff;
  padding: 24px;
}
.dashboad {
  display: flex;
  margin-bottom: 20px;
  div {
    flex: 1;
    text-align: center;
    color: $fontColor;
    img {
      width: 56px;
      height: auto;
    }
    p {
      &.info {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
.warrp {
  display: flex;
  height: 250px;
  .map {
    flex: 0 0 59%;
    display: flex;
    .mapCenter {
      flex: 0 0 67%;
      .mapContent {
        width: 100%;
        height: 100%;
      }
    }
    .timeCenter {
      flex: 1;
      padding-left: 24px;
      p {
        font-weight: 600;
        margin-bottom: 16px;
        color: $fontColor;
      }
      .map-time {
        height: 24px;
        font-size: 20px;
        margin-top: 100px;
      }
      .map-date {
        height: 20px;
        font-size: 17px;
      }
      .map-des {
        height: 19px;
        font-size: 15px;
      }
      .map-line {
        height: 20px;
        font-size: 17px;
        color: #71bfdb;
        text-decoration: underline;
        cursor: pointer;
        &.active {
          color: #d7d7d7;
        }
      }
    }
  }
  .address {
    flex: 1;
    border-left: 1px solid #d7d7d7;
    div {
      padding-left: 50px;
      height: 43px;
      line-height: 43px;
      img {
        height: auto;
        vertical-align: middle;
        margin-right: 15px;
      }
      span {
        color: $fontColor;
        font-size: 13px;
      }
    }
  }
}
.my-map-divider {
  margin: 40px 0;
  height: 38px;
  line-height: 38px;
  border-top: 1px solid #d7d7d7;
  span {
    margin-right: 15px;
  }
}
.chartWarrp {
  display: flex;
  .chartInfo {
    padding: 0 15px;
    flex: 1;
    height: 400px;
  }
}
</style>
