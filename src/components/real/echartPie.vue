<template>
  <div class="circel">
    <div class="circelInfo">
      <div class="pei"
        id="peiCharts1"></div>
    </div>
    <div class="circelInfo">
      <div class="item-history_alarm_divider">
        <p class="times">{{alarmTime ||0}}</p>
        <p>{{$t('realTime.totalWarn')}}</p>
      </div>
    </div>
    <div class="circelInfo">
      <div class="pei"
        id="peiCharts2"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import options from "@/dataConfig/echart/pie-chart-option";
import t from "@/utils/translate";
import { deepClone } from "@/utils/functions";

export default {
  props: {
    peiData: {
      type: Object,
      default: () => {
        return {
          summary: {},
          eventSummary: {}
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
      // pieOption: {
      //   tooltip: {
      //     trigger: "item",
      //     formatter: "{b}: {d}%"
      //   },
      //   legend: {
      //     // orient: "vertical",
      //     // x: "left",
      //     bottom: 10,
      //     left: "center",
      //     data: []
      //   },
      //   series: [
      //     {
      //       type: "pie",
      //       radius: ["30%", "50%"],
      //       center: ["50%", "40%"],
      //       data: [],
      //       itemStyle: {
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: "rgba(0, 0, 0, 0.5)"
      //         }
      //       },
      //       label: {
      //         normal: {
      //           show: true,
      //           textStyle: {
      //             fontWeight: 300,
      //             fontSize: 16 // 文字的字体大小
      //           },
      //           formatter: "{c}"
      //         }
      //       }
      //     }
      //   ]
      // },
      alarmTime: 0
    };
  },
  watch: {
    peiData: {
      handler: function (vals) {
        this.dataChange(vals);
      },
      deep: true
    },
    loading: {
      handler: function (vals) {
        this.loadingChange(vals);
      },
      deep: true
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let BarDOM1 = document.getElementById("peiCharts1");
      let BarDOM2 = document.getElementById("peiCharts2");

      this.peiEcharts1 = echarts.init(BarDOM1);
      this.peiEcharts2 = echarts.init(BarDOM2);
      this.loadingChange(this.loading);
      this.dataChange(this.peiData);
    },
    loadingChange (loading) {
      if (loading) {
        this.peiEcharts1.showLoading();
        this.peiEcharts2.showLoading();
      } else {
        this.peiEcharts1.hideLoading();
        this.peiEcharts2.hideLoading();
      }
    },
    dataChange (peiData) {
      let voltageOptions = deepClone(options);
      voltageOptions.legend.data = [t('history.chargeDuration'), t('history.dischargeDuration'), t('history.empty')]; // ["充电时间", "放电时间", "空载时间"];
      voltageOptions.tooltip.formatter = p => {
        let item = `${p.percent}%<br />${p.data.name}: ${p.data.value}h`;
        return item;
      };
      voltageOptions.series[0].data = [
        { value: peiData.summary.chargeDuration || 0, name: t('history.chargeDuration') },
        { value: peiData.summary.dischargeDuration || 0, name: t('history.dischargeDuration') },
        { value: peiData.summary.idleDuration || 0, name: t('history.empty') }
      ];
      voltageOptions.series[0].label.normal.formatter = "{c}h";
      this.peiEcharts1.setOption(voltageOptions);

      this.alarmTime =
        Number(peiData.eventSummary.temperature) +
        Number(peiData.eventSummary.fluidLevel) +
        Number(peiData.eventSummary.voltage) +
        Number(peiData.eventSummary.current);
      let currentOptions = deepClone(options);
      currentOptions.legend.data = [t('realTime.temperature'), t('realTime.fluid'), t('realTime.voltage'), t('realTime.current')]; // ["温度", "液位", "电压", "电流"];
      currentOptions.tooltip.formatter = p => {
        let item = `${p.percent}%<br />${p.data.name}-${t('realTime.warn')}: ${p.data.value}${t('realTime.times')}`;
        return item;
      };
      currentOptions.series[0].data = [
        { value: peiData.eventSummary.temperature || 0, name: t('realTime.temperature') },
        { value: peiData.eventSummary.fluidLevel || 0, name: t('realTime.fluid') },
        { value: peiData.eventSummary.voltage || 0, name: t('realTime.voltage') },
        { value: peiData.eventSummary.current || 0, name: t('realTime.current') }
      ];
      this.peiEcharts2.setOption(currentOptions);
    }
  }
};
</script>

<style scoped lang="scss">
.circel {
  background: #ffffff;
  padding: 24px 0;
  display: flex;
  .circelInfo {
    flex: 1;
    height: 400px;
    .pei {
      height: 400px;
    }
    .item-history_alarm_divider {
      box-sizing: border-box;
      height: 260px;
      border-left: 1px solid #d7d7d7;
      margin: 70px auto 0;
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
</style>
