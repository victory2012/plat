<template>
  <div class="alarmTable">
    <el-table :data="tableData"
      style="width: 100%">
      <el-table-column prop="hostCode"
        align="center"
        :label="$t('batteryList.batteryCode')">
      </el-table-column>
      <el-table-column prop="code"
        align="center"
        :label="$t('batteryList.deviceCode')">
      </el-table-column>
      <el-table-column prop="companyName"
        align="center"
        :label="$t('batteryList.name')">
      </el-table-column>
      <!-- <el-table-column prop="regstate" align="center" label="设备注册状态">
      </el-table-column> -->
      <el-table-column prop="bindState"
        align="center"
        :label="$t('batteryList.binding')">
      </el-table-column>
      <el-table-column align="center"
        :label="$t('batteryList.handle')"
        width="120">
        <template slot-scope="scope">
          <el-button size="small"
            @click.native.prevent="recovery(scope.row)"
            type="text">
            {{$t('batteryList.recovery')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import t from '@/utils/translate';

export default {
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
    };
  },
  methods: {
    recovery(data) {
      const deviceObj = {
        id: data.id,
        status: 0,
      };
      this.$api.betteryBlack(deviceObj).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.recoverySuccess'),
          });
          this.getDeviceList();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDeviceList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeviceList();
    },
    getDeviceList() {
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        time: new Date().getTime(),
        status: -1,
        bindingStatus: '1',
      };
      this.$api.deviceBlackList(pageObj).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          this.tableData = [];
          if (result.pageData.length > 0) {
            result.pageData.forEach((key) => {
              key.online = key.onlineStatus === 0;
              // key.batteryCode = key.hostCode ? key.hostCode : "-";
              key.blackStatus = key.status === -1;
              key.bindStatus = key.hostId === null;
              key.bindState =
                key.hostId === null
                  ? t('batteryList.noBind')
                  : t('batteryList.hasBind');
              this.tableData.push(key);
            });
          }
        }
      });
    },
  },
  mounted() {
    this.getDeviceList();
  },
};
</script>
<style lang="scss" scoped>
.alarmTable {
  padding: 24px;
  background: #ffffff;
  .page {
    padding-top: 20px;
    text-align: right;
  }
}
</style>
