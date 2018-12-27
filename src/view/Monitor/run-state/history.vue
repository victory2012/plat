<template>
  <div class="history">
    <div class="timeBar">
      <!-- 从 -->
      <span class="lables">{{$t('history.from')}}</span>
      <el-date-picker class="queryTime" :class="{'timeSelect': !defaultGray}" @focus="timeChanges" size="small" v-model="start" type="date" :placeholder="$t('history.startTime')"></el-date-picker>
      <!-- 至 -->
      <span class="lable">{{$t('history.to')}}</span>
      <el-date-picker class="queryTime" :class="{'timeSelect': !defaultGray}" @focus="timeChanges" size="small" v-model="end" type="date" placeholder="$t('history.endTime')"></el-date-picker>
      <el-select class="queryTime" :class="{'timeSelect': defaultGray}" size="small" @change="changeTime" @focus="selectTimeChanges" v-model="timevalue">
        <el-option v-for="item in weekOption" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getChartData" class="queryBtn" size="small" type="primary">{{$t('timeBtn.sure')}}</el-button>
    </div>
    <div class="btns">
      <div class="btns-item">
        <el-button :type="btnTypeDown" :disabled="narrowBtn" plain @click="narrow" icon="el-icon-remove-outline"></el-button>
        <el-button :type="btnTypeUp" :disabled="enlargeBtn" plain @click="enlarge" icon="el-icon-circle-plus-outline"></el-button>
      </div>
      <div class="btns-item">
        <el-button type="primary" plain @click="exportExcel">{{$t('history.exportBtn')}}</el-button>
      </div>
    </div>
    <echart-map :chartData="dataObj" :loading="loading" @timeZoom="timeZoom"></echart-map>
    <div class="batteryChart">
      <div class="addbattery">
        <ul>
          <li>
            <p class="history_count_val">{{summary.cycle || 0}}</p>
            <!-- 电池循环次数 -->
            <p>{{$t('history.cycle')}}</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.chargeDuration || 0}}</p>
            <!-- 充电时间 -->
            <p>{{$t('history.chargeDuration')}}(h)</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.dischargeDuration || 0}}</p>
            <!-- 放电时间 -->
            <p>{{$t('history.dischargeDuration')}}(h)</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.avgChargeDuration || 0}}</p>
            <!-- 平均充电时间 -->
            <p>{{$t('history.avgChargeDuration')}}(h)</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.avgDischargeDuration || 0}}</p>
            <!-- 平均放电时间 -->
            <p>{{$t('history.avgDischargeDuration')}}(h)</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.fluidSupplementTimes || 0}}</p>
            <!-- 补水次数 -->
            <p>{{$t('history.fluidTimes')}}</p>
          </li>
          <li>
            <p class="history_count_val">{{summary.avgFluidSupplementDuration || 0}}</p>
            <!-- 平均补水时长 -->
            <p>{{$t('history.avgFluidDuration')}}(h)</p>
          </li>
        </ul>
      </div>
      <chart-pie :loading="loading" :peiData="peiObj"></chart-pie>
    </div>
    <div class="alarmTab">
      <div class="tabInfo">
        {{$t('history.historyWarn')}}
        <!-- <a class="active">{{$t('history.historyWarn')}}</a> -->
      </div>
    </div>
    <div class="tables">
      <i-alarm :alarmData="alarmData" v-show="active === 'alarm'"></i-alarm>
      <div class="page">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from "AMap";
import utils from "@/utils/utils";
import echartMap from "@/components/real/historey-chart";
import iAlarm from "@/components/real/alarm-data";
import chartPie from "@/components/real/echartPie";
import t from "@/utils/translate";
import mixin from '@/mixins/mixin';

let map;
let pathSimplifierIns;
let navg;
let infoWindow;
let heatmap;
let address;
export default {
  props: ["hostObj", "propData"],
  mixins: [mixin],
  components: {
    chartPie,
    echartMap,
    iAlarm,
  },
  data () {
    return {
      trajectory: true,
      btnTypeDown: "info",
      btnTypeUp: "info",
      narrowBtn: true,
      enlargeBtn: true,
      alldistance: 0,
      timeSeconds: 50,
      markerArr: [],
      defaultGray: true,
      active: "alarm",
      hasgetData: false,
      loading: false,
      eventSummary: {},
      summary: {},
      peiObj: {
        eventSummary: {},
        summary: {}
      },
      dataObj: {
        timeArr: [],
        singleVoltage: [],
        temperature: [],
        voltage: [],
        current: []
      },
      positions: {},
      start: utils.getWeek(),
      end: new Date(),
      timevalue: "week",
      defaultGet: true,
      heatData: [],
      alarmData: [],
      liquidData: [],
      zoomArr: [],
      waterLastOneTime: {},
      resultList: []
    };
  },
  mounted () {
    this.getChartData();
    // this.mapInit();
  },
  destroyed () {
    this.waterLastOneTime = {};
  },
  methods: {
    timeChanges () {
      this.defaultGray = true;
    },
    selectTimeChanges () {
      this.defaultGray = false;
    },
    /* 确认按钮 */
    getChartData () {
      let startTime = utils.toUTCTime(utils.startTime(this.start));
      let endTime = utils.toUTCTime(utils.endTime(this.end));
      this.getChartDatafun(startTime, endTime);
    },
    /* 获取Echart相关数据 以及 地图坐标 */
    getChartDatafun (startTime, endTime) {
      this.loading = true;
      let endTimes = `${endTime}`.length > 8 ? endTime : `${endTime}235959`;
      if (!this.hostObj.hostId || !this.hostObj.device) {
        return;
      }
      this.$api
        .historyData(
          this.hostObj.hostId,
          this.hostObj.device,
          startTime,
          endTimes
        )
        .then(res => {
          this.dataObj = {
            timeArr: [],
            singleVoltage: [],
            temperature: [],
            voltage: [],
            current: [],
            capacity: []
          };
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            this.exportData = result.list;
            this.positions = {
              travel: [],
              heatmap: []
            }; // 轨迹点集合
            // let positions = [];
            this.heatData = []; // 热力图集合
            this.resultList = result.list;
            if (this.resultList.length < 300) {
              this.btnTypeUp = "info";
              this.enlargeBtn = true;
            }
            this.resultList.forEach((key, index) => {
              let timeArr = utils.TimeSconds(key.time); // 时间
              let capacity = Math.round(key.capacity * 100);
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
              this.dataObj.capacity.push({
                name: timeArr,
                value: [timeArr, capacity]
              });
              let gcjLongitude = Number(key.gcjLongitude);
              let gcjLatitude = Number(key.gcjLatitude);
              if (
                gcjLongitude > -180 &&
                gcjLatitude > -90 &&
                gcjLatitude <= 90 &&
                gcjLongitude <= 180 &&
                Math.abs(gcjLongitude) > 1 &&
                Math.abs(gcjLatitude) > 1
              ) {
                this.positions.travel.push([
                  key.gcjLongitude,
                  key.gcjLatitude,
                  timeArr
                ]); // 坐标
                this.positions.heatmap.push({
                  lng: key.gcjLongitude,
                  lat: key.gcjLatitude,
                  count: 100
                });
              }
            });
            this.enlargeBtn = true; // 放大按钮禁止
            this.btnTypeUp = "info"; // 修改el-button的type
            this.loading = false;
            let sums = result.summary;
            this.eventSummary = result.eventSummary || {};
            this.summary = {
              chargeDuration: (sums.chargeDuration / 60).toFixed(2),
              dischargeDuration: (sums.dischargeDuration / 60).toFixed(2),
              cycle: sums.cycle,
              avgChargeDuration: (+sums.avgChargeDuration / 60).toFixed(2),
              avgDischargeDuration: (+sums.avgDischargeDuration / 60).toFixed(
                2
              ),
              fluidSupplementTimes: sums.fluidSupplementTimes,
              avgFluidSupplementDuration: (
                sums.avgFluidSupplementDuration / 60
              ).toFixed(2),
              idleDuration: (sums.idleDuration / 60).toFixed(2)
            };
            this.peiObj.eventSummary = result.eventSummary || {};
            this.peiObj.summary = this.summary || {};
            // this.heatMapFun();
            // this.positionChange(positions);
          }
        });
      this.getAlarmData();
    },
    /* 快速选择日期 */
    changeTime () {
      if (this.timevalue === "week") {
        this.start = utils.getWeek();
      }
      if (this.timevalue === "mounth") {
        this.start = utils.getMouth();
      }
      if (this.timevalue === "threemonth") {
        this.start = utils.getThreeMounth();
      }
      if (this.timevalue === "sixmounth") {
        this.start = utils.getSixMounth();
      }
      if (this.timevalue === "year") {
        this.start = utils.getYear();
      }
      if (this.timevalue === "all") {
        this.start = "2000-01-01";
      }
    },
    /* 分页方法 */
    handleCurrentChange (val) {
      this.currentPage = val;
      if (this.active === "alarm") {
        this.getAlarmData();
      } else {
        this.getliquidData();
      }
    },
    /* 历史补水 */
    getliquidData () {
      let startTime = utils.sortTime(this.start);
      let endTime = utils.sortTime(this.end);
      let pageObj = {
        pageSize: 10,
        pageNum: this.currentPage,
        startTime: `${startTime}000000`,
        endTime: `${endTime}235959`
      };
      this.$api
        .historyFluid(this.hostObj.hostId, this.hostObj.device, pageObj)
        .then(res => {
          console.log(res);
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            if (result) {
              this.total = result.total;
              this.liquidData = [];
              let dataArr = [];
              if (result.pageData.length > 0) {
                result.pageData.forEach((key, index) => {
                  let currentTime = utils.TimeSconds(key.time);
                  key.position = new AMap.LngLat(
                    key.gcjLongitude,
                    key.gcjLatitude
                  );
                  if (index + 1 < result.pageData.length) {
                    key.updateWater = utils.Days(
                      currentTime -
                      utils.TimeSconds(result.pageData[index + 1].time)
                    );
                  } else {
                    key.updateWater = "-";
                  }

                  key.temperature = `${key.temperature}°C`;
                  key.Replenishing = utils.UTCTime(key.time);
                  key.address = t('history.address');
                  key.disabled = false;
                  if (index < 10) {
                    dataArr.push(key);
                  }
                });
                this.liquidData = dataArr;
              }
            }
          }
        });
    },
    /* 历史告警 */
    getAlarmData () {
      let startTime = utils.sortTime(this.start);
      let endTime = utils.sortTime(this.end);
      let pageObj = {
        pageSize: 10,
        pageNum: this.currentPage
      };
      this.$api
        .historyAlarm(this.hostObj.hostId, startTime, endTime, pageObj)
        .then(res => {
          // console.log(res);
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            if (result) {
              this.total = result.total;
              this.alarmData = [];
              if (result.pageData.length > 0) {
                // this.alarmData = result.pageData;
                result.pageData.forEach(key => {
                  // key.alarmtime = utils.fomats(key.time);
                  key.levels = utils.level(key.level);
                  key.hierarchy = key.hierarchy === "Group" ? t('group.allGroup') : t('group.single');
                  key.items = utils.item(key.item);
                  if (key.item === "Fluid") {
                    key.thresholdValue = "-";
                    key.actualValue = t('realTime.abnormal');
                  }
                  this.alarmData.push(key);
                });
              }
            }
          }
        });
    },
    historAlarm () {
      this.currentPage = 1;
      this.total = 0;
      this.active = "alarm";
    },
    historyLiquid () {
      this.active = "liquid";
      this.total = 0;
      this.currentPage = 1;
      this.getliquidData();
    },
    timeZoom (data) {
      // console.log(data);
      this.zoomBar = data;
      if (
        this.resultList.length >= 300 &&
        (data.batchStart !== 0 || data.batchEnd !== 100)
      ) {
        this.enlargeBtn = false;
        this.btnTypeUp = "primary";
      } else {
        this.enlargeBtn = true;
        this.btnTypeUp = "info";
      }
    },
    /* 缩小 */
    narrow () {
      if (!this.zoomBar || this.Timeindex < -2) {
        return;
      }
      if (this.Timeindex === -1) {
        // this.getChartDatafun(this.zoomArr[0].start, this.zoomArr[0].end);
        this.getChartData();
        this.zoomArr = [];
        this.btnTypeDown = "info";
        this.narrowBtn = true;
        this.btnTypeUp = "info";
        this.enlargeBtn = true;
        // this.Timeindex--;
      } else {
        let timeObj = this.zoomArr[this.Timeindex];
        this.getChartDatafun(timeObj.start, timeObj.end);
        this.zoomArr.pop();
        this.Timeindex--;
      }
      // console.log("this.zoomArr", this.zoomArr);
    },
    /* 放大 */
    enlarge () {
      if (
        !this.zoomBar &&
        (this.zoomBar.batchEnd === 100 && this.zoomBar.batchStart === 0)
      ) {
        return;
      }
      this.btnTypeDown = "primary";
      this.narrowBtn = false;
      let obj = {
        start: utils.toUTCTime(this.zoomBar.tstart),
        end: utils.toUTCTime(this.zoomBar.tend)
      };
      this.zoomArr.push(obj);
      this.getChartDatafun(obj.start, obj.end);
      let len = this.zoomArr.length;
      this.Timeindex = len - 2;
    },
    /* 导出 Excel */
    exportExcel () {
      let storage = JSON.parse(utils.getStorage("loginData"));
      let arr = [
        [t('history.makeTime'), new Date()],
        [t('history.maker'), `${storage.companyName}-${storage.account}`],
        [
          t('positions.deviceCode'),
          this.propData.deviceCode,
          t('positions.batteryCode'),
          this.propData.code
        ],
        [t('realTime.time'), t('realTime.temperature'), t('realTime.voltage'), t('realTime.current'), t('realTime.singleVoltage'), t('realTime.quantity')]
      ];
      this.$messageBox
        .prompt(t('history.fileName'), t('history.tips'), {
          confirmButtonText: t('timeBtn.sure'),
          cancelButtonText: t('timeBtn.cancle')
        })
        .then(({ value }) => {
          if (!value) {
            this.$message(t('history.fileName'));
          } else {
            if (this.exportData.length < 1) return;
            this.exportData.forEach(key => {
              let opts = [
                utils.UTCTime(key.time),
                `${key.temperature} ℃`,
                `${key.voltage} V`,
                `${-key.current} A`,
                `${key.singleVoltage} V`,
                `${Math.round(key.capacity * 100)}%`
              ];
              arr.push(opts);
            });
            this.$outputXlsxFile(arr, value);
          }
        })
    }
  }
};
</script>
<style lang="scss">
.history {
  box-sizing: border-box;
  border-radius: 5px;
  .timeBar {
    padding: 24px;
    background: #ffffff;
    // margin-bottom: 60px;
    .lables {
      display: inline-block;
      text-align: right;
      color: #484848;
      font-size: 13px;
      margin-right: 15px;
      width: 8.5%;
    }
    .lable {
      color: #484848;
      font-size: 13px;
      margin: 0 5px;
    }
    .queryTime {
      width: 21%;
    }
    .timeSelect {
      .el-input__inner {
        color: #e5e5e5;
      }
    }
    .queryBtn {
      margin-left: 20px;
    }
  }
  .charts {
    box-sizing: border-box;
    padding: 24px;
    background: #ffffff;
    // margin-bottom: 20px;
    width: 100%;
    display: flex;
    .info {
      flex: 1;
      height: 400px;
    }
  }
  .batteryChart {
    background: #ffffff;
    padding: 24px;
  }
  .addbattery {
    background: #ffffff;
    padding: 24px 0;
    ul {
      display: flex;
      li {
        flex: 1;
        text-align: center;
        p {
          height: 19px;
          font-size: 15px;
          font-weight: 600;
          color: #484848;
          &.history_count_val {
            height: 24px;
            font-size: 18px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .circel {
    background: #ffffff;
    padding: 24px 0;
    display: flex;
    .circelInfo {
      flex: 1;
      height: 400px;
      .item-history_alarm_divider {
        box-sizing: border-box;
        height: 200px;
        border-left: 1px solid #d7d7d7;
        margin: 163px auto 0;
        margin-left: 140px;
        padding-left: 70px;
        padding-top: 74px;
        p {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          &.times {
            height: 24px;
            font-size: 18px;
            font-weight: 600;
          }
        }
      }
    }
  }
  .alarmTab {
    margin: 20px;
    .tabInfo {
      width: 330px;
      background: #fff;
      padding: 15px 0;
      border-radius: 10px;
      margin: 0 auto;
      color: #484848;
      font-size: 14px;
      text-align: center;
    }
  }
  .tables {
    background: #ffffff;
    padding: 24px;
    margin-bottom: 20px;
  }

  .pb {
    padding-bottom: 50px;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 50px;
  }
  .pt {
    padding-top: 60px;
  }
  .page {
    padding-top: 20px;
    text-align: right;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    .btns-item {
      flex: 1;
      padding-left: 50px;
      &:nth-last-child(1) {
        text-align: right;
        padding-right: 50px;
      }
    }
  }
}
</style>
