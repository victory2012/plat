<template>
  <div class="bgFFF">
    <div class="btns">
      <!-- <el-button @click="exportExcel" type="primary">导出Excel</el-button> -->
    </div>
    <div class="chartWarrp">
      <div class="chartInfo"
        id="echart1"></div>
      <div class="chartInfo"
        id="echart2"></div>
    </div>
    <div class="chartWarrp">
      <div class="chartInfo"
        id="echart3"></div>
      <div class="chartInfo"
        id="echart5"></div>
    </div>
    <div class="chartWarrp">
      <div class="chartInfo"
        id="echart4"></div>
      <div class="chartInfo"></div>
    </div>
    <div class="chartWarrp">
      <div class="chartInfo">
        <div class="echartBarTimes1"
          id="echartBarTimes1"></div>
        <div class="echartBar1"
          id="echartBar1"></div>
      </div>
      <div class="chartInfo">
        <div class="echartBarTimes1"
          id="echartBarTimes2"></div>
        <div class="echartBar1"
          id="echartBar2"></div>
      </div>
    </div>
    <div class="chartWarrp">
      <div class="chartInfo"
        id="echartBar3"></div>
      <div class="chartInfo"
        id="echartBar4"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import utils from "@/utils/utils";
import options from "@/dataConfig/echart/more-line-chart";
import BarOptions from "@/dataConfig/echart/bar-chart-option";
import t from "@/utils/translate";
import { deepClone } from "@/utils/functions"

export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {
          dataObjFirst: {
            timeArr: [],
            singleVoltage: [],
            temperature: [],
            voltage: [],
            current: []
          },
          dataObjSecond: {
            timeArr: [],
            singleVoltage: [],
            temperature: [],
            voltage: [],
            current: []
          },
          different: ""
        };
      }
    },
    chartBarData: {
      type: Object,
      default: () => {
        return {
          now: {},
          last: {},
          last_eventSummary: {},
          now_eventSummary: {}
        };
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data () {
    return {
      timeArr: [],
      singleVoltage: [],
      temperature: [],
      voltage: [],
      current: [],
      myEcharts: null,
      isOptionAbnormal: false,
      exportData: ""
    };
  },
  watch: {
    chartData: {
      handler: function (vals) {
        // console.log(vals);
        this.dataChange(vals);
      },
      deep: true
    },
    loading: {
      handler: function (vals) {
        this.showLoading(vals);
        // console.log(vals);
      },
      deep: true
    },
    chartBarData: {
      handler: function (vals) {
        this.barDataChange(vals);
        this.barTime(vals);
        // console.log(vals);
      },
      deep: true
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let $echartsDOM1 = document.getElementById("echart1");
      let $echartsDOM2 = document.getElementById("echart2");
      let $echartsDOM3 = document.getElementById("echart3");
      let $echartsDOM4 = document.getElementById("echart4");
      let $echartsDOM5 = document.getElementById("echart5");
      let BarDOM1 = document.getElementById("echartBar1");
      let BarDOM2 = document.getElementById("echartBar2");
      let BarDOM3 = document.getElementById("echartBar3");
      let BarDOM4 = document.getElementById("echartBar4");
      let BarDOMTime1 = document.getElementById("echartBarTimes1");
      let BarDOMTime2 = document.getElementById("echartBarTimes2");
      this.myBarEcharts1 = echarts.init(BarDOM1);
      this.myBarEcharts2 = echarts.init(BarDOM2);
      this.myBarEcharts3 = echarts.init(BarDOM3);
      this.myBarEcharts4 = echarts.init(BarDOM4);
      this.lineEcharts5 = echarts.init($echartsDOM5); // 电量
      this.lineEcharts1 = echarts.init($echartsDOM1);
      this.lineEcharts2 = echarts.init($echartsDOM2);
      this.lineEcharts3 = echarts.init($echartsDOM3);
      this.lineEcharts4 = echarts.init($echartsDOM4);
      this.berCharts1 = echarts.init(BarDOMTime1);
      this.berCharts2 = echarts.init(BarDOMTime2);

      echarts.connect([
        this.lineEcharts1,
        this.lineEcharts2,
        this.lineEcharts3,
        this.lineEcharts4,
        this.lineEcharts5
      ]);
      window.onresize = () => {
        this.lineEcharts1.resize();
        this.lineEcharts2.resize();
        this.lineEcharts3.resize();
        this.lineEcharts4.resize();
        this.lineEcharts5.resize();
        this.myBarEcharts1.resize();
        this.myBarEcharts2.resize();
        this.myBarEcharts3.resize();
        this.myBarEcharts4.resize();
        this.berCharts1.resize();
        this.berCharts2.resize();
      };
      this.dataChange(this.chartData);
      this.showLoading(this.loading);
      this.barDataChange({
        now: {},
        last: {},
        last_eventSummary: {},
        now_eventSummary: {}
      });
      this.barTime({
        now: {},
        last: {}
      });
    },
    showLoading (curVal) {
      if (curVal) {
        this.lineEcharts1.showLoading();
        this.lineEcharts2.showLoading();
        this.lineEcharts3.showLoading();
        this.lineEcharts4.showLoading();
        this.myBarEcharts1.showLoading();
        this.myBarEcharts2.showLoading();
        this.myBarEcharts3.showLoading();
        this.myBarEcharts4.showLoading();
        this.lineEcharts5.showLoading();
      } else {
        this.lineEcharts1.hideLoading();
        this.lineEcharts2.hideLoading();
        this.lineEcharts3.hideLoading();
        this.lineEcharts4.hideLoading();
        this.myBarEcharts1.hideLoading();
        this.myBarEcharts2.hideLoading();
        this.myBarEcharts3.hideLoading();
        this.myBarEcharts4.hideLoading();
        this.lineEcharts5.hideLoading();
      }
    },
    dataChange (datas) {
      // console.log(datas);
      this.exportData = datas;
      let name1;
      let name2;
      if (datas.battertCode) {
        name1 = datas.battertCode[0].code;
        name2 = datas.battertCode[1].code;
      } else {
        name1 = t('comparison.thisPeriod');
        name2 = t('comparison.lastPeriod');
      }
      options.series[0].name = name1;
      options.series[1].name = name2;
      options.legend.data = [name1, name2];
      // options.xAxis.data = datas.dataObjFirst.timeArr;

      let voltageOptions = deepClone(options);
      voltageOptions.title.text = t('realTime.voltage'); // 电压
      voltageOptions.yAxis.axisLabel.formatter = "{value} v";
      voltageOptions.series[0].data = datas.dataObjFirst.voltage;
      voltageOptions.series[1].data = datas.dataObjSecond.voltage;
      if (!datas.battertCode) {
        voltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          if (p[0].seriesName === t('comparison.lastPeriod')) {
            item = `${utils.dateFomat(p[0].value[0] - datas.different)}<br/>${
              v.seriesName
              }:${v.value[1]}<br/>`;
          } else {
            item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}:${
              v.value[1]
              }<br/>`;
          }
          return item;
        };
      } else {
        voltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          // console.log(v);
          item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}:${
            v.value[1]
            }<br/>`;
          return item;
        };
      }
      this.lineEcharts1.setOption(voltageOptions);

      let singleVoltageOptions = deepClone(options);
      singleVoltageOptions.title.text = t('realTime.singleVoltage'); // 单体电压
      singleVoltageOptions.yAxis.axisLabel.formatter = "{value} v";
      singleVoltageOptions.series[0].data = datas.dataObjFirst.singleVoltage;
      singleVoltageOptions.series[1].data = datas.dataObjSecond.singleVoltage;
      if (!datas.battertCode) {
        singleVoltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          if (p[0].seriesName === t('comparison.lastPeriod')) {
            item = `${utils.dateFomat(p[0].value[0] - datas.different)}<br/>${
              v.seriesName
              }: ${v.value[1]}<br/>`;
          } else {
            item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
              v.value[1]
              }<br/>`;
          }
          return item;
        };
      } else {
        voltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          // console.log(v);
          item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
            v.value[1]
            }<br/>`;
          return item;
        };
      }
      this.lineEcharts2.setOption(singleVoltageOptions);

      let currentOptions = deepClone(options);
      currentOptions.title.text = t('realTime.current'); // 电流
      currentOptions.yAxis.axisLabel.formatter = "{value} A";
      currentOptions.series[0].data = datas.dataObjFirst.current;
      currentOptions.series[1].data = datas.dataObjSecond.current;
      if (!datas.battertCode) {
        currentOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          if (p[0].seriesName === t('comparison.lastPeriod')) {
            item = `${utils.dateFomat(p[0].value[0] - datas.different)}<br/>${
              v.seriesName
              }: ${v.value[1]}<br/>`;
          } else {
            item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
              v.value[1]
              }<br/>`;
          }
          return item;
        };
      } else {
        voltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          // console.log(v);
          item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
            v.value[1]
            }<br/>`;
          return item;
        };
      }
      this.lineEcharts3.setOption(currentOptions);

      let temperatureOptions = deepClone(options);
      temperatureOptions.title.text = t('realTime.temperature'); // 温度
      temperatureOptions.yAxis.axisLabel.formatter = "{value} ℃";
      temperatureOptions.series[0].data = datas.dataObjFirst.temperature;
      temperatureOptions.series[1].data = datas.dataObjSecond.temperature;
      if (!datas.battertCode) {
        temperatureOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          if (v.seriesName === t('comparison.lastPeriod')) {
            item = `${utils.dateFomat(p[0].value[0] - datas.different)}<br/>${
              v.seriesName
              }: ${v.value[1]}<br/>`;
          } else {
            item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
              v.value[1]
              }<br/>`;
          }
          return item;
        };
      } else {
        voltageOptions.tooltip.formatter = p => {
          let item;
          let v = p[0];
          // console.log(v);
          item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}:${
            v.value[1]
            }<br/>`;
          return item;
        };
      }
      this.lineEcharts4.setOption(temperatureOptions);

      let capacity = deepClone(options);
      capacity.title.text = t('realTime.quantity'); // "电量";
      capacity.yAxis.axisLabel.formatter = "{value} %";
      capacity.series[0].data = datas.dataObjFirst.capacity;
      capacity.series[1].data = datas.dataObjSecond.capacity;
      if (!datas.battertCode) {
        capacity.tooltip.formatter = p => {
          let item;
          let v = p[0];
          if (v.seriesName === t('comparison.lastPeriod')) {
            item = `${utils.dateFomat(p[0].value[0] - datas.different)}<br/>${
              v.seriesName
              }: ${v.value[1]}%<br/>`;
          } else {
            item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
              v.value[1]
              }%<br/>`;
          }
          return item;
        };
      } else {
        capacity.tooltip.formatter = p => {
          let item;
          let v = p[0];
          // console.log(v);
          item = `${utils.dateFomat(p[0].value[0])}<br/>${v.seriesName}: ${
            v.value[1]
            }%<br/>`;
          return item;
        };
      }
      this.lineEcharts5.setOption(capacity);
    },
    barDataChange (datas) {
      // console.log(datas);legend
      let name1;
      let name2;
      if (datas.battertCode) {
        name1 = datas.battertCode[0].code;
        name2 = datas.battertCode[1].code;
      } else {
        name1 = t('comparison.thisPeriod');
        name2 = t('comparison.lastPeriod');
      }
      BarOptions.legend.data = [name1, name2];
      BarOptions.series[0].name = name1;
      BarOptions.series[1].name = name2;
      let voltageBarOptions = deepClone(BarOptions);
      // voltageBarOptions.title.text = "";
      voltageBarOptions.xAxis[0].data = [
        // "充电次数",
        `${t('history.chargeDuration')}`, // 充电时间
        `${t('history.avgChargeDuration')}`, // "平均充电时间"
      ];
      voltageBarOptions.legend.show = false;
      voltageBarOptions.series[0].data = [
        // datas.now.chargeTimes,
        (datas.now.chargeDuration / 60).toFixed(2),
        (datas.now.avgChargeDuration / 60).toFixed(2)
      ];
      voltageBarOptions.series[1].data = [
        // datas.last.chargeTimes,
        (datas.last.chargeDuration / 60).toFixed(2),
        (datas.last.avgChargeDuration / 60).toFixed(2)
      ];
      this.myBarEcharts1.setOption(voltageBarOptions);

      let singleVoltageBarOptions = deepClone(BarOptions);
      // singleVoltageBarOptions.title.text = "放电情况";
      singleVoltageBarOptions.xAxis[0].data = [
        // "工作次数",
        `${t('history.dischargeDuration')}`, //"放电时间",
        `${t('history.avgDischargeDuration')}` //"平均放电时间"
      ];
      singleVoltageBarOptions.legend.show = false;
      singleVoltageBarOptions.series[0].data = [
        // datas.now.dischargeTimes,
        (datas.now.dischargeDuration / 60).toFixed(2),
        (datas.now.avgDischargeDuration / 60).toFixed(2)
      ];
      singleVoltageBarOptions.series[1].data = [
        // datas.last.dischargeTimes,
        (datas.last.dischargeDuration / 60).toFixed(2),
        (datas.last.avgDischargeDuration / 60).toFixed(2)
      ];
      this.myBarEcharts2.setOption(singleVoltageBarOptions);

      let currentBarOptions = deepClone(BarOptions);
      currentBarOptions.title.text = `${t('comparison.batteryUse')}`; //"电池使用情况";
      currentBarOptions.xAxis[0].data = [`${t('history.chargeDuration')}`, `${t('history.dischargeDuration')}`, `${t('history.empty')}`]; // ["充电时间", "放电时间", "空截时间"];
      currentBarOptions.series[0].data = [
        (datas.now.chargeDuration / 60).toFixed(2),
        (datas.now.dischargeDuration / 60).toFixed(2),
        (datas.now.idleDuration / 60).toFixed(2)
      ];
      currentBarOptions.series[1].data = [
        (datas.last.chargeDuration / 60).toFixed(2),
        (datas.last.dischargeDuration / 60).toFixed(2),
        (datas.last.idleDuration / 60).toFixed(2)
      ];
      this.myBarEcharts3.setOption(currentBarOptions);

      let result1 =
        Number(datas.now_eventSummary.temperature) +
        Number(datas.now_eventSummary.fluidLevel) +
        Number(datas.now_eventSummary.current) +
        Number(datas.now_eventSummary.voltage);
      let result2 =
        Number(datas.last_eventSummary.temperature) +
        Number(datas.last_eventSummary.fluidLevel) +
        Number(datas.last_eventSummary.current) +
        Number(datas.last_eventSummary.voltage);
      let temperatureBarOptions = deepClone(BarOptions);
      temperatureBarOptions.title.text = t('comparison.alarm');
      temperatureBarOptions.xAxis[0].data = [
        `${t('comparison.alarmTimes')}`, // "告警次数",
        `${t('realTime.temperature')}`, //"温度",
        `${t('realTime.fluid')}`, //"液位",
        `${t('realTime.current')}` //"电流"
      ];
      temperatureBarOptions.series[0].data = [
        result1,
        datas.now_eventSummary.temperature,
        datas.now_eventSummary.fluidLevel,
        datas.now_eventSummary.current
      ];
      temperatureBarOptions.series[1].data = [
        result2,
        datas.last_eventSummary.temperature,
        datas.last_eventSummary.fluidLevel,
        datas.last_eventSummary.current
      ];
      this.myBarEcharts4.setOption(temperatureBarOptions);
    },
    barTime (datas) {
      let chargeTimesOption = deepClone(BarOptions);
      chargeTimesOption.title.text = `${t('comparison.charageSituation')}`; //"充电情况";
      chargeTimesOption.xAxis[0].data = [`${t('comparison.charageTimes')}`]; // ["充电次数"];
      chargeTimesOption.series[0].data = [datas.now.chargeTimes];
      chargeTimesOption.series[1].data = [datas.last.chargeTimes];
      this.berCharts1.setOption(chargeTimesOption);

      let DsiChargeTimesOption = deepClone(BarOptions);
      DsiChargeTimesOption.title.text = `${t('comparison.discharageSituation')}`; //"放电情况";
      DsiChargeTimesOption.xAxis[0].data = [`${t('comparison.discharageTimes')}`]; // ["工作次数"];
      DsiChargeTimesOption.series[0].data = [datas.now.dischargeTimes];
      DsiChargeTimesOption.series[1].data = [datas.last.dischargeTimes];
      this.berCharts2.setOption(DsiChargeTimesOption);
    },
    /* 导出 Excel */
    exportExcel () {
      let storage = JSON.parse(utils.getStorage("loginData"));
      let arr = [
        [`${t('history.makeTime')}`, new Date()], // 制表时间
        [`${t('history.maker')}`, `${storage.companyName}-${storage.account}`], // 制表人
        [
          `${t('batteryList.deviceCode')}`,
          this.exportData.deviceCode,
          `${t('batteryList.batteryCode')}`,
          this.exportData.batteryCode
        ],
        ["时间", "温度", "电压", "电流", "单体电压"]
      ];
      this.$messageBox
        .prompt("请输入导出文件名", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          if (!value) {
            this.$message("请输入文件名");
          } else {
            // if (this.exportData.length < 1) return;
            // this.exportData.forEach(key => {
            //   let opts = [
            //     utils.UTCTime(key.time),
            //     key.temperature,
            //     key.voltage,
            //     key.current,
            //     key.singleVoltage
            //   ];
            //   arr.push(opts);
            // });
            // this.$outputXlsxFile(arr, value);
          }
          // this.$outputXlsxFile(arr, value);
        })
        .catch(() => { });
    }
  }
};
</script>

<style scoped lang="scss">
.bgFFF {
  background: #ffffff;
  padding-top: 30px;
}
.chartWarrp {
  display: flex;
  padding-bottom: 50px;
  .chartInfo {
    padding: 0 15px;
    flex: 1;
    width: 100%;
    height: 400px;
    display: flex;
    .echartBarTimes1 {
      flex: 1;
    }
    .echartBar1 {
      flex: 2;
    }
  }
}
.btns {
  // padding-left: 22px;
  padding: 0 30px;
  margin-bottom: 20px;
  text-align: right;
}
// .echarts {
//   width: 100%;
//   height: 100%;
// }
</style>
