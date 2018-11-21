<template>
  <div class="different">
    <div class="top">
      <!-- 比较数据 -->
      <h2 class="textAlain title">{{$t('comparison.comparData')}}</h2>
      <div class="textAlain">
        <div class="compare-add addone"
          v-show="contrastDatas">
          <p v-for="(tag, index) in stacks1"
            :key="tag.hostId">{{$t('comparison.batteryCode')}}{{index+1}}: {{tag.code}}</p>
          <!-- <p>电池编号2: {{stacks1[1].code}}</p> -->
        </div>
        <div @click="openTable"
          class="compare-add">{{chooseText}}</div>
      </div>
    </div>
    <div class="timeCenter">
      <div class="timeBar">
        <span class="lables">{{$t('history.from')}}</span>
        <el-date-picker class="queryTime"
          :class="{'timeSelect': !defaultGray}"
          @focus="timeChanges"
          size="small"
          v-model="start"
          type="date"
          :placeholder="$t('history.startTime')"></el-date-picker>
        <span class="lable">{{$t('history.to')}}</span>
        <el-date-picker class="queryTime"
          :class="{'timeSelect': !defaultGray}"
          @focus="timeChanges"
          size="small"
          v-model="end"
          type="date"
          :placeholder="$t('history.endTime')"></el-date-picker>
        <el-select class="queryTime"
          :class="{'timeSelect': defaultGray}"
          @focus="selectTimeChanges"
          @change="changeTime"
          size="small"
          v-model="timevalue"
          :placeholder="$t('comparison.timeRange')">
          <el-option v-for="item in weekOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="sureBtnSearch"
          class="queryBtn"
          size="small"
          type="primary">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </div>
    <div class="chart">
      <com-chart :loading="chartloading"
        :chartData="dataArr"
        :chartBarData="summary"></com-chart>
    </div>

    <el-dialog :title="$t('comparison.addCompar')"
      width="800px"
      :visible.sync="tableVisible">
      <div class="TopWrapper">
        <div class="item">{{$t('comparison.most')}}
          <span style="color:#71bfdb">2</span>
          {{$t('comparison.item')}}&nbsp;&nbsp;{{$t('comparison.deviceId')}}：
          <el-tag v-for="tag in stacks1"
            :key="tag.hostId+new Date()"
            @close="closeTags(tag)"
            :type="''">
            {{tag.code}}
          </el-tag>
        </div>

        <div class="item2">
          <el-input size="small"
            @change="remoteMethod"
            :placeholder="$t('batteryList.searchContent')"
            suffix-icon="el-icon-search"
            v-model.trim="searchCont">
          </el-input>
        </div>
      </div>
      <el-table :data="gridData"
        v-loading="loading">
        <!-- 电池编号 -->
        <el-table-column property="code"
          :label="$t('batteryList.batteryCode')"></el-table-column>
        <!-- 电池型号 -->
        <el-table-column property="model"
          :label="$t('batteryList.model')"></el-table-column>
        <!-- 电池组规格 -->
        <el-table-column property="norm"
          :label="$t('batteryList.specif')"></el-table-column>
        <!-- 监测设备编号 -->
        <el-table-column property="deviceCode"
          :label="$t('batteryList.deviceCode')"></el-table-column>
        <el-table-column :label="$t('alarmList.handle')"
          width="70">
          <template slot-scope="scope">
            <el-checkbox @change="toggleCheck(scope.row)"
              v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="8"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="cancelHandle">{{$t('timeBtn.cancle')}}</el-button>
        <el-button size="small"
          type="primary"
          @click="sureBtn">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import utils from '@/utils/utils';
import t from '@/utils/translate';
// import comChart from './compare-chart';

export default {
  components: {
    comChart: () => import('./compare-chart.vue'),
  },
  data() {
    return {
      defaultGray: true,
      contrastDatas: false,
      contrastWay: '',
      loading: false,
      chartloading: false,
      contrastData: false,
      total: 0,
      dataArr: {
        batteryCode: [],
        dataObjFirst: {
          timeArr: [],
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
        },
        dataObjSecond: {
          timeArr: [],
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
        },
      },
      chooseObj: {},
      dataObjFirst: {},
      dataObjSecond: {},
      batteryGroup: '',
      chooseText: t('comparison.addCompar'),
      searchCont: '',
      tableVisible: false,
      summary: {},
      now_eventSummary: {},
      last_eventSummary: {},
      now: {},
      last: {},
      currentPage: 1,
      start: utils.getWeek(),
      end: new Date(),
      timevalue: 'week',
      weekOption: [
        {
          value: 'week',
          label: t('history.week'),
        },
        {
          value: 'mounth',
          label: t('history.mounth'),
        },
        {
          value: 'threemonth',
          label: t('history.threemonth'),
        },
        {
          value: 'sixmounth',
          label: t('history.sixmounth'),
        },
        {
          value: 'year',
          label: t('history.year'),
        },
        {
          value: 'all',
          label: t('history.all'),
        },
      ],
      searchList: [],
      gridData: [],
      stacks1: [],
      stacks2: [],
      compareTime: '', // 对比时间
    };
  },
  methods: {
    timeChanges() {
      this.defaultGray = true;
    },
    selectTimeChanges() {
      this.defaultGray = false;
    },
    cancelHandle() {
      this.stacks1 = [];
      this.tableVisible = false;
    },
    sureBtnSearch() {
      if (this.stacks1.length < 2) {
        this.$message.error(t('comparison.selectBattery'));
        return;
      }
      if (this.stacks1.length !== 2) {
        this.$message.error(t('comparison.selectBattery'));
        return;
      }
      if (!this.start) {
        this.$message.error(t('history.startTime'));
        return;
      }
      if (!this.end) {
        this.$message.error(t('history.endTime'));
        return;
      }

      // let nowStart = `${utils.sortTime(this.start)}000000`;
      // let nowEnd = `${utils.sortTime(this.end)}235959`;
      const nowStart = utils.toUTCTime(utils.startTime(this.start));
      const nowEnd = utils.toUTCTime(utils.endTime(this.end));

      this.getDataNow(nowStart, nowEnd);
    },
    changeTime() {
      if (this.timevalue === 'week') {
        this.start = utils.getWeek();
      }
      if (this.timevalue === 'mounth') {
        this.start = utils.getMouth();
      }
      if (this.timevalue === 'threemonth') {
        this.start = utils.getThreeMounth();
      }
      if (this.timevalue === 'sixmounth') {
        this.start = utils.getSixMounth();
      }
      if (this.timevalue === 'year') {
        this.start = utils.getYear();
      }
      if (this.timevalue === 'all') {
        this.start = '2000-01-01';
      }
    },
    getDataNow(startTime, endTime) {
      // console.log(this.stacks1);
      this.chartloading = true;
      this.$api
        .historyData(
          this.stacks1[0].hostId,
          this.stacks1[0].deviceId,
          startTime,
          endTime,
        )
        .then((res) => {
          console.log(res);
          this.dataObjFirst = {
            timeArr: [],
            singleVoltage: [],
            temperature: [],
            voltage: [],
            current: [],
            capacity: [],
          };
          if (res.data && res.data.code === 0) {
            const result = res.data.data;
            result.list.forEach((key) => {
              // this.dataObjFirst.timeArr.push(utils.fomats(key.time)); // 时间
              const timeArr = utils.TimeSconds(key.time); // 时间
              const capacity = Math.round(key.capacity * 100);
              this.dataObjFirst.singleVoltage.push({
                name: timeArr,
                value: [timeArr, key.singleVoltage],
              }); // 单体电压
              this.dataObjFirst.temperature.push({
                name: timeArr,
                value: [timeArr, key.temperature],
              }); // 温度
              this.dataObjFirst.voltage.push({
                name: timeArr,
                value: [timeArr, key.voltage],
              }); // 电压
              this.dataObjFirst.current.push({
                name: timeArr,
                value: [timeArr, -key.current],
              }); // 电流
              this.dataObjFirst.capacity.push({
                name: timeArr,
                value: [timeArr, capacity],
              }); // 电量
            });
            this.now = result.summary || {};
            this.now_eventSummary =
              result.eventSummary === null ? {} : result.eventSummary;
            this.getDataPrev(startTime, endTime);
          }
        });
    },
    getDataPrev(startTime, endTime) {
      this.$api
        .historyData(
          this.stacks1[1].hostId,
          this.stacks1[1].deviceId,
          startTime,
          endTime,
        )
        .then((res) => {
          console.log(res);
          this.dataObjSecond = {
            timeArr: [],
            singleVoltage: [],
            temperature: [],
            voltage: [],
            current: [],
            capacity: [],
          };
          if (res.data && res.data.code === 0) {
            const result = res.data.data;
            result.list.forEach((key) => {
              const timeArr = utils.TimeSconds(key.time); // 时间
              const capacity = Math.round(key.capacity * 100);
              this.dataObjSecond.singleVoltage.push({
                name: timeArr,
                value: [timeArr, key.singleVoltage],
              }); // 单体电压
              this.dataObjSecond.temperature.push({
                name: timeArr,
                value: [timeArr, key.temperature],
              }); // 温度
              this.dataObjSecond.voltage.push({
                name: timeArr,
                value: [timeArr, key.voltage],
              }); // 电压
              this.dataObjSecond.current.push({
                name: timeArr,
                value: [timeArr, -key.current],
              }); // 电流
              this.dataObjSecond.capacity.push({
                name: timeArr,
                value: [timeArr, capacity],
              }); // 电量
            });
            this.chartloading = false;
            this.last = result.summary || {};
            this.last_eventSummary =
              result.eventSummary === null ? {} : result.eventSummary;
            this.dataArr = {
              dataObjFirst: this.dataObjFirst,
              dataObjSecond: this.dataObjSecond,
              battertCode: this.stacks1,
            };
            this.summary = {
              now: this.now,
              last: this.last,
              now_eventSummary: this.now_eventSummary,
              last_eventSummary: this.last_eventSummary,
              battertCode: this.stacks1,
            };
            console.log(this.summary);
          }
        });
    },
    remoteMethod() {
      this.batteryGroup = this.searchCont;
      this.getBatteryList();
    },
    sureBtn() {
      if (this.stacks1.length < 2) {
        this.$message({
          type: 'warning',
          message: t('comparison.addTwoBattery'),
        });
        return;
      }
      this.chooseText = t('comparison.changeBattery');
      this.contrastDatas = true;
      this.tableVisible = false;
    },
    openTable() {
      this.stacks1 = [];
      this.tableVisible = true;
      this.gridData.forEach((key) => {
        key.checked = false;
      });
    },
    handleSizeChange() { },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBatteryList();
    },
    toggleCheck(data) {
      // this.chooseLen = 2;
      if (!data.checked) {
        this.stacks1.forEach((key, index) => {
          if (key.code === data.code) {
            this.stacks1.splice(index, 1);
          }
        });
      } else {
        this.stacks1.push(data);
        if (this.stacks1.length > 2) {
          this.stacks1[0].checked = false;
          this.stacks1.shift();
        }
      }
    },
    closeTags(tag) {
      this.stacks1.splice(this.stacks1.indexOf(tag), 1);
    },
    /* 获取电池列表 */
    getBatteryList() {
      this.stacks1 = [];
      this.loading = true;
      const options = {
        pageSize: 8,
        pageNum: this.currentPage,
        companyName: '',
        batteryGroupOrDeviceCode: this.batteryGroup,
        modelId: '',
        bindingStatus: 1,
      };
      this.$api.batteryList(options).then((res) => {
        console.log(res);
        this.loading = false;
        this.gridData = [];
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          result.pageData.forEach((key) => {
            key.checked = false;
            this.gridData.push(key);
          });
        }
      });
    },
  },
  mounted() {
    this.getBatteryList();
  },
};
</script>
<style lang="scss">
.different {
  .textAlain {
    text-align: center;
  }
  .top {
    margin-bottom: 15px;
    .title {
      font-weight: 500;
      font-size: 18px;
      margin: 16px auto;
    }
    .compare-add {
      border: 1px dashed #898989;
      width: 232px;
      height: 120px;
      border-radius: 10px;
      font-weight: 550;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;
      margin: 0 24px;
      font-size: 12px;
      &.addone {
        border: none;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        vertical-align: middle;
        background: #ffffff;
      }
    }
  }
  .timeCenter {
    margin-bottom: 20px;
  }
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
      width: 16%;
    }
    .queryBtn {
      margin-left: 20px;
    }
    .timeSelect {
      .el-input__inner {
        color: #e5e5e5;
      }
    }
  }
  .page {
    padding-top: 20px;
    text-align: right;
  }
  .TopWrapper {
    display: flex;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
    .item {
      flex: 1;
    }
    .item2 {
      flex: 0 0 200px;
    }
  }
}
</style>
