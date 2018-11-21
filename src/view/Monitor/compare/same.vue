<template>
  <div class="same">
    <div class="top">
      <!-- 比较数据 -->
      <h2 class="textAlain title">{{$t('comparison.comparData')}}</h2>
      <div class="textAlain">
        <div class="compare-add addone"
          v-show="contrastData">
          <!-- 电池编号 -->
          <p>{{$t('comparison.batteryCode')}}: {{chooseObj.code}}</p><br />
        </div>
        <!-- <div class="compare-add addone"
          v-show="contrastDatas">
          <p v-for="(tag, index) in stacks1"
            :key="tag.hostId">{{$t('comparison.batteryCode')}}{{index+1}}: {{tag.code}}</p>
          <p>电池编号2: {{stacks1[1].code}}</p>
        </div> -->
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
          @change="changeTime"
          size="small"
          @focus="selectTimeChanges"
          v-model="timevalue"
          :placeholder="$t('comparison.timeRange')">
          <!-- 请选择时间范围 -->
          <el-option v-for="item in weekOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select class="queryTime"
          size="small"
          clearable
          v-model="contrastWay"
          :placeholder="$t('comparison.comparWay')">
          <!-- 请选择对比方式 -->
          <el-option v-for="item in compare"
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
          <span style="color:#71bfdb;font-size: 16px;">1</span>
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
          @click="tableVisible = false">{{$t('timeBtn.cancle')}}</el-button>
        <el-button size="small"
          type="primary"
          @click="sureBtn">{{$t('timeBtn.sure')}}</el-button>
        <!-- 确 定 -->
      </div>
    </el-dialog>

  </div>
</template>
<script>
import utils from '@/utils/utils';
import t from '@/utils/translate';
import comChart from './compare-chart';

export default {
  components: {
    comChart,
  },
  data() {
    return {
      defaultGray: true,
      // contrastDatas: false,
      contrastWay: '',
      loading: false,
      chartloading: false,
      contrastData: false,
      total: 0,
      dataArr: {
        dataObjFirst: {
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
          capacity: [],
        },
        dataObjSecond: {
          // timeArr: [],
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
          capacity: [],
        },
      },
      chooseObj: {},
      dataObjFirst: {
      },
      dataObjSecond: {
      },
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
      // actived: "same",
      start: utils.getWeek(),
      end: new Date(),
      timevalue: 'week',
      compare: [
        {
          label: t('comparison.YearOnYear'),
          value: 'year',
        },
        {
          label: t('comparison.monthOnMonth'),
          value: 'mounth',
        },
      ],
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
    sureBtnSearch() {
      if (JSON.stringify(this.chooseObj) === '{}') {
        this.$message.error(`${t('comparison.selectBattery')}`);
        return;
      }
      // if (this.stacks1.length !== 2 && this.actived === "diff") {
      //   this.$message.error("请选择电池组");
      //   return;
      // }
      if (!this.start) {
        this.$message.error(t('history.startTime'));
        return;
      }
      if (!this.end) {
        this.$message.error(t('history.endTime'));
        return;
      }

      if (!this.contrastWay) {
        this.$message.error(t('comparison.comparWay')); // 请选择对比方式
        return;
      }
      this.differTime = utils.DifferTime(
        utils.startTime(this.start),
        utils.endTime(this.end),
      );
      // console.log("differTime", this.differTime);
      const nowStart = utils.toUTCTime(utils.startTime(this.start));
      const nowEnd = utils.toUTCTime(utils.endTime(this.end));
      const startFormat = utils.startTime(this.start);
      const endFormat = utils.startTime(this.end);

      if (this.contrastWay === 'year') {
        this.compareTime = utils.year2year(startFormat, endFormat);
      } else {
        this.compareTime = utils.m2m(startFormat, endFormat);
      }
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
      const hostId = this.chooseObj.hostId;
      const deviceId = this.chooseObj.deviceId;
      this.chartloading = true;
      this.$api.historyData(hostId, deviceId, startTime, endTime).then((res) => {
        console.log(res);
        this.dataObjFirst = {
          // timeArr: [],
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
          capacity: [],
        };
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          result.list.forEach((key) => {
            const timeArrs = utils.TimeSconds(key.time); // 时间
            const capacity = Math.round(key.capacity * 100);
            this.dataObjFirst.singleVoltage.push({
              name: timeArrs,
              value: [timeArrs, key.singleVoltage],
            }); // 单体电压
            this.dataObjFirst.temperature.push({
              name: timeArrs,
              value: [timeArrs, key.temperature],
            }); // 温度
            this.dataObjFirst.voltage.push({
              name: timeArrs,
              value: [timeArrs, key.voltage],
            }); // 电压
            this.dataObjFirst.current.push({
              name: timeArrs,
              value: [timeArrs, -key.current],
            }); // 电流
            this.dataObjFirst.capacity.push({
              name: timeArrs,
              value: [timeArrs, capacity],
            }); // 电量
          });
          this.now = result.summary || {};
          this.now_eventSummary =
            result.eventSummary === null ? {} : result.eventSummary;
          if (this.compareTime.startTime && this.compareTime.endTime) {
            this.getDataPrev(
              this.compareTime.startTime,
              this.compareTime.endTime,
              hostId,
              deviceId,
            );
          }
        }
      });
    },
    getDataPrev(startTime, endTime, id, deviceId) {
      this.$api.historyData(id, deviceId, startTime, endTime).then((res) => {
        console.log(res);
        this.dataObjSecond = {
          // timeArr: [],
          singleVoltage: [],
          temperature: [],
          voltage: [],
          current: [],
          capacity: [],
        };
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          result.list.forEach((key) => {
            const timeArrs = utils.TimeSconds(key.time) + this.differTime; // 时间
            const capacity = Math.round(key.capacity * 100);
            this.dataObjSecond.singleVoltage.push({
              name: timeArrs,
              value: [timeArrs, key.singleVoltage],
            }); // 单体电压
            this.dataObjSecond.temperature.push({
              name: timeArrs,
              value: [timeArrs, key.temperature],
            }); // 温度
            this.dataObjSecond.voltage.push({
              name: timeArrs,
              value: [timeArrs, key.voltage],
            }); // 电压
            this.dataObjSecond.current.push({
              name: timeArrs,
              value: [timeArrs, -key.current],
            }); // 电流
            this.dataObjSecond.capacity.push({
              name: timeArrs,
              value: [timeArrs, capacity],
            }); // 电量
          });
          this.chartloading = false;
          this.last = result.summary || {};
          this.last_eventSummary =
            result.eventSummary === null ? {} : result.eventSummary;
          this.dataArr = {
            dataObjFirst: this.dataObjFirst,
            dataObjSecond: this.dataObjSecond,
            different: this.differTime,
            batteryCode: this.chooseObj.code,
            deviceCode: this.chooseObj.deviceCode,
          };
          this.summary = {
            now: this.now,
            last: this.last,
            now_eventSummary: this.now_eventSummary,
            last_eventSummary: this.last_eventSummary,
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
      if (this.stacks1.length === 0) {
        this.$message({
          type: 'warning',
          message: t('comparison.addOneBattery'),
        }); // 需添加1组电池
        return;
      }
      this.chooseText = t('comparison.changeBattery'); // 更换电池单元
      this.tableVisible = false;
      this.contrastData = true;
      // if (this.actived === "same") {
      //   this.contrastData = true;
      // }
      // if (this.actived === "diff") {
      //   this.contrastDatas = true;
      // }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBatteryList();
    },
    openTable() {
      this.stacks1 = [];
      this.tableVisible = true;
      this.gridData.forEach((key) => {
        key.checked = false;
      });
    },
    toggleCheck(data) {
      // console.log(data);
      this.stacks1 = [];
      this.gridData.forEach((key) => {
        key.checked = false;
      });
      data.checked = !data.checked;
      if (data.checked) {
        // this.chooseObj.push();
        this.stacks1.push(data);
        this.chooseObj = data;
        this.chooseLen = 1;
      }
    },
    closeTags(tag) {
      this.stacks1.splice(this.stacks1.indexOf(tag), 1);
    },
    /* 获取电池列表 */
    getBatteryList() {
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
.same {
  .textAlain {
    text-align: center;
  }
  .titleTab {
    margin-bottom: 20px;
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
