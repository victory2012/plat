<template>
  <div class="pieWarper">
    <div class="pieItme shadow">
      <p>{{$t("overview.effectiveRate")}}</p>
      <div class="chat"
        id="pieChart1"></div>
    </div>
    <div class="pieItme shadow">
      <p>{{$t("overview.RunNormal")}}</p>
      <div class="chat"
        id="pieChart2"></div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import echarts from "echarts";
import { mapGetters } from 'vuex';
import utils from "@/utils/utils";
import options from "@/dataConfig/echart/dashboard-option";
import { debounce } from "@/utils/functions";
import t from "@/utils/translate";

export default {
  // props: {
  //   cardData: {
  //     type: Object,
  //     default: () => { }
  //   }
  // },
  data () {
    return {
      pieChart1: "",
      pieChart2: "",
    };
  },
  watch: {
    carData: {
      handler: function (val) {
        this.dataChange(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      carData: 'monitor/GETCARDDATA'
    })
  },
  mounted () {
    this.init();
    this._resizeHanlder = debounce(() => {
      this.pieChart1.resize();
      this.pieChart2.resize();
    }, 100);
    window.addEventListener("resize", this._resizeHanlder);
  },
  methods: {
    init () {
      let $pieChart1 = document.getElementById("pieChart1");
      let $pieChart2 = document.getElementById("pieChart2");
      this.pieChart1 = echarts.init($pieChart1);
      this.pieChart2 = echarts.init($pieChart2);
      this.dataChange(this.carData);
    },
    dataChange (data) {
      console.log(data);
      let jiankongshu;
      let namals;
      let defrence = Number(data.activeTotal) - Number(data.alarmedTotal); // 运行正常数
      let runNomal = defrence < 0 ? 0 : defrence;

      if (!data) {
        data = {
          activeTotal: 0,
          alarmedTotal: 0,
          currentMonthTotal: 0,
          total: 0
        };
        jiankongshu = 0;
        namals = 0;
      }
      if (data.total === 0) {
        jiankongshu = 0;
        namals = 0;
      } else {
        let effective = Number(data.activeTotal) / Number(data.total); // 有效数
        jiankongshu = (effective * 100).toFixed(2);
        if (defrence > 0) {
          namals = ((defrence / Number(data.total)) * 100).toFixed(2);
        } else {
          namals = 0;
        }
      }
      let voltageOptions = options(); // deepClone(this.pieOption);
      voltageOptions.tooltip.formatter = p => {
        let item = `${this.$t("overview.total")}：${data.total}<br />${this.$t(
          "overview.effectiveRate"
        )}：${p.data.per || 0}<br />${p.data.value}%`;
        return item;
      };
      // voltageOptions.title.text = t("overview.valid");
      voltageOptions.series[0].data = [
        {
          per: data.activeTotal,
          value: jiankongshu || 0
          // name: "有效监控"
        }
      ];
      this.pieChart1.setOption(voltageOptions);
      let currentOptions = options(); // deepClone(this.pieOption);
      // currentOptions.title.text = t("overview.RunNormal");
      currentOptions.tooltip.formatter = p => {
        let item = `${this.$t("overview.total")}：${data.total}<br />${this.$t(
          "overview.RunNormal"
        )}：${p.data.per || 0}<br />${p.data.value}%`;
        return item;
      };
      currentOptions.series[0].data = [
        {
          value: namals || 0,
          per: runNomal
        }
      ];
      this.pieChart2.setOption(currentOptions);
    }
  }
};
</script>
<style lang="scss" scoped>
.pieWarper {
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  .pieItme {
    box-sizing: border-box;
    padding: 10px;
    flex: 0 0 49%;
    height: 350px;
    background: #ffffff;
    p {
      color: #484848;
      // font-weight: bolder;
      font-weight: 800;
      line-height: 26px;
      font-family: 'Helvetica Neue', sans-serif;
    }
    .chat {
      width: 100%;
      height: 304px;
    }
  }
  .shadow {
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  }
}
</style>
