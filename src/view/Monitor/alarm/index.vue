<template>
  <div class="alarmTable">
    <div class="select">
      <div class="item btns">
        <el-button size="small" @click="search" type="primary">{{$t('timeBtn.sure')}}</el-button>
        <el-button size="small" @click="clearAll" plain>{{$t('timeBtn.clear')}}</el-button>
      </div>
      <div class="item">
        <!-- 告警级别 -->
        <el-select size="small" style="width:100%" v-model="alarm.level" :placeholder="$t('alarmList.alarmLevel')">
          <el-option v-for="item in levelArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="item">
        <!-- 告警层级 -->
        <el-select size="small" style="width:100%" v-model="alarm.hierarchy" :placeholder="$t('alarmList.alarmHierarchy')">
          <el-option v-for="item in hierarchyArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="item">
        <!-- 告警项目 -->
        <el-select size="small" style="width:100%" v-model="alarm.item" :placeholder="$t('alarmList.alarmItem')">
          <el-option v-for="item in alarmArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="item">
        <!-- 电池组编号 -->
        <el-input size="small" style="width:100%" v-model="alarm.code" :placeholder="$t('alarmList.batteryCode')"></el-input>
      </div>
      <div class="item">
        <!-- 结束时间 -->
        <el-date-picker size="small" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" v-model="alarm.endTime" type="date" :placeholder="$t('alarmList.endTime')">
        </el-date-picker>
      </div>
      <div class="item">
        <!-- 开始时间 -->
        <el-date-picker size="small" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" v-model="alarm.startTime" type="date" :placeholder="$t('alarmList.startTime')">
        </el-date-picker>
      </div>

    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index" align="center" :label="$t('alarmList.serial')" width="50">
      </el-table-column>
      <!-- 告警发生时间 -->
      <el-table-column prop="createTime" align="center" :label="$t('alarmList.time')" width="180">
      </el-table-column>
      <!-- 告警项目 -->
      <el-table-column prop="items" align="center" :label="$t('alarmList.alarmItem')">
      </el-table-column>
      <!-- 告警阈值 -->
      <el-table-column prop="thresholdValue" align="center" :label="$t('alarmList.thride')">
      </el-table-column>
      <!-- 实际值 -->
      <el-table-column prop="actualValue" align="center" :label="$t('alarmList.realDate')">
      </el-table-column>
      <!-- 电池组编号 -->
      <el-table-column prop="hostCode" align="center" :label="$t('alarmList.batteryCode')">
      </el-table-column>
      <!-- 告警内容 -->
      <el-table-column prop="content" align="center" :label="$t('alarmList.content')" width="240">
      </el-table-column>
      <!-- 告警层级 -->
      <el-table-column prop="hierarchy" align="center" :label="$t('alarmList.alarmHierarchy')">
      </el-table-column>
      <!-- 告警级别 -->
      <el-table-column prop="levels" align="center" :label="$t('alarmList.alarmLevel')">
      </el-table-column>
      <!-- 详情 -->
      <el-table-column prop="address" align="center" :label="$t('alarmList.detail')" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleClick(scope.row)" type="text">
            {{$t('alarmList.view')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="$t('alarmList.detail')" :visible.sync="details" width="770px">
      <div class="detailCenter">
        <table>
          <tr>
            <!-- 告警发生时间 -->
            <td class="titles">{{$t('alarmList.time')}}</td>
            <td>
              <p>{{rowObj.createTime}}</p>
            </td>
            <!-- 电池组编号 -->
            <td class="titles">{{$t('alarmList.batteryCode')}}</td>
            <td>
              <p>{{rowObj.hostCode}}</p>
            </td>
          </tr>
          <tr>
            <!-- 告警值 -->
            <td class="titles">{{$t('alarmList.warnData')}}</td>
            <td>
              <p>{{rowObj.actualValue}}</p>
            </td>
            <!-- 告警项目 -->
            <td class="titles">{{$t('alarmList.alarmItem')}}</td>
            <td>
              <p>{{rowObj.items}}</p>
            </td>
          </tr>
          <tr>
            <!-- 告警层级 -->
            <td class="titles">{{$t('alarmList.alarmHierarchy')}}</td>
            <td>
              <p>{{rowObj.hierarchy}}</p>
            </td>
            <!-- 告警级别 -->
            <td class="titles">{{$t('alarmList.alarmLevel')}}</td>
            <td>
              <p>{{rowObj.levels}}</p>
            </td>
          </tr>
          <tr>
            <!-- 告警内容 -->
            <td class="titles">{{$t('alarmList.content')}}</td>
            <td colspan="3">
              <p>{{rowObj.content}}</p>
            </td>
          </tr>
          <tr>
            <!-- 客户 -->
            <td class="titles">{{$t('alarmList.custorm')}}</td>
            <td>
              <p>{{rowObj.companyName}}</p>
            </td>
            <!-- 位置 -->
            <td class="titles">{{$t('alarmList.latLng')}}</td>
            <td>
              <p>{{rowObj.address}}</p>
            </td>
          </tr>
          <tr>
            <!-- 液位 -->
            <td class="titles">{{$t('realTime.fluid')}}</td>
            <td>
              <p>{{rowObj.fluidLevel}}</p>
            </td>
            <!-- 温度 -->
            <td class="titles">{{$t('realTime.temperature')}}</td>
            <td>
              <p>{{rowObj.temperature}}</p>
            </td>
          </tr>
          <tr>
            <!-- 电压 -->
            <td class="titles">{{$t('realTime.voltage')}}</td>
            <td>
              <p>{{rowObj.voltage}}</p>
            </td>
            <!-- 电流 -->
            <td class="titles">{{$t('realTime.current')}}</td>
            <td>
              <p>{{rowObj.current}}</p>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="details = false">{{$t('timeBtn.confirm')}}</el-button>
        <!-- <el-button size="small" type="primary" @click="details = false">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/utils/utils';
import lnglatTrabsofor from '@/utils/longlatTransfor';
import t from '@/utils/translate';

export default {
  data() {
    return {
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rowObj: {},
      details: false,
      tableData: [],
      alarm: {},
      hierarchyArr: [
        {
          id: '',
          name: t('timeBtn.all'),
        },
        {
          id: 'Group',
          name: t('group.allGroup'),
        },
        {
          id: 'Single',
          name: t('group.single'),
        },
      ],
      levelArr: [
        {
          id: '',
          name: t('timeBtn.all'),
        },
        {
          id: 1,
          name: t('group.high'),
        },
        {
          id: 2,
          name: t('group.mid'),
        },
        {
          id: 3,
          name: t('group.low'),
        },
      ],
      alarmArr: [
        {
          id: '',
          name: t('timeBtn.all'),
        },
        {
          id: 'Voltage',
          name: t('realTime.voltage'),
        },
        {
          id: 'Current',
          name: t('realTime.current'),
        },
        {
          id: 'Temperature',
          name: t('realTime.temperature'),
        },
        {
          id: 'Fluid',
          name: t('realTime.fluid'),
        },
      ],
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    handleClick(row) {
      this.rowObj = row;
      this.$api.allAlarmData(row.dataId).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          if (result) {
            const position = [result.gcjLongitude, result.gcjLatitude];
            lnglatTrabsofor(position, (callRes) => {
              this.rowObj.fluidLevel =
                result.fluidLevel === 0 ? t('realTime.normal') : t('realTime.abnormal');
              this.rowObj.temperature = result.temperature;
              this.rowObj.voltage = result.voltage;
              this.rowObj.current = result.current;
              this.rowObj.address = callRes.formattedAddress || '--';
              this.details = true;
            });
          }
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    search() {
      this.currentPage = 1;
      this.getListData();
    },
    clearAll() {
      this.currentPage = 1;
      this.alarm = {};
      this.getListData();
    },
    getListData() {
      this.loading = true;
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      if (this.alarm.startTime) {
        pageObj.startCreateTime = this.alarm.startTime;
      }
      if (this.alarm.endTime) {
        pageObj.endCreateTime = utils.creatTimeEnd(this.alarm.endTime);
      }
      if (this.alarm.item) {
        pageObj.item = this.alarm.item;
      }
      if (this.alarm.code) {
        pageObj.code = this.alarm.code;
      }

      if (this.alarm.level) {
        pageObj.level = this.alarm.level;
      }
      if (this.alarm.hierarchy) {
        pageObj.hierarchy = this.alarm.hierarchy;
      }
      this.$api.alarmData(pageObj).then((res) => {
        this.loading = false;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          this.tableData = [];
          if (result.pageData.length > 0) {
            result.pageData.forEach((key) => {
              // key.alarmtime = utils.fomats(key.time);
              key.levels = utils.level(key.level);
              key.hierarchy = key.hierarchy === 'Group' ? t('group.allGroup') : t('group.single');
              key.items = utils.item(key.item);
              if (key.item === 'Fluid') {
                key.thresholdValue = '-';
                key.actualValue = t('realTime.abnormal');
              }
              this.tableData.push(key);
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.alarmTable {
  padding: 10px 20px;
  background: #ffffff;
  .page {
    padding-top: 20px;
    text-align: right;
  }
}
.select {
  margin-bottom: 30px;
  width: 85%;
  display: flex;
  flex-direction: row-reverse;
  .item {
    flex: 1;
    padding: 10px 5px;
    &.btns {
      flex: 0 0 140px;
    }
  }
}
.detailCenter {
  width: 100%;
  .temp {
    text-align: right;
    margin-bottom: 10px;
  }
  table {
    width: 100%;
    tr {
      height: 56px;
    }
    td {
      p {
        background: #f2f2f2;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        padding: 0 10px;
      }
      &.titles {
        padding-right: 15px;
        width: 86px;
        background: #ffffff;
        text-align: right;
      }
    }
  }
}
</style>
