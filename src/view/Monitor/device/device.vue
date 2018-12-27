<template>
  <div class="device">
    <div class="topTab">
      <div class="icons">
        <reg-btn v-if="manufacturerName"></reg-btn>
      </div>
      <div class="select">
        <div class="item">
          <!-- 设备编号 -->
          <el-input size="small" style="width:100%" v-model.trim="content" :placeholder="$t('device.deviceCode')"></el-input>
        </div>
        <div class="item" v-if="manufacturerName">
          <!-- 生产企业 -->
          <el-select size="small" style="width:100%" v-model="manufactur" :placeholder="$t('device.enterprise')">
            <el-option v-for="item in companyArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="item">
          <!-- 绑定状态 -->
          <el-select size="small" style="width:100%" v-model="bindState" :placeholder="$t('device.bindStatus')">
            <el-option v-for="item in bindOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <!-- 确定 -->
          <el-button @click="searchList" size="small" type="primary">{{$t('timeBtn.sure')}}</el-button>
          <!-- 清空 -->
          <el-button @click="clearAll" size="small" plain>{{$t('timeBtn.clear')}}</el-button>
        </div>
      </div>
    </div>
    <div class="tableContent">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="code" align="center" :label="$t('device.deviceCode')" />
        <!-- 企业名称 -->
        <el-table-column prop="companyName" align="center" :label="$t('batteryList.name')" />
        <!-- 客户企业 -->
        <el-table-column prop="subCompanyName" align="center" :label="$t('batteryList.customer')" />
        <!-- 电池绑定状态 -->
        <el-table-column prop="bindState" align="center" :label="$t('device.bindStatus')" />
        <!-- 监测设备 -->
        <el-table-column align="center" :label="$t('device.handel')">
          <template slot-scope="scope">
            <el-button @click.native.prevent="MonitorDevice(scope.row)" type="text" size="small">
              {{$t('batteryList.view')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('batteryList.handle')" align="center" width="200px">
          <template slot-scope="scope">
            <!-- 拉黑 -->
            <el-button @click.native.prevent="addBlack(scope.row)" type="text" :disabled="scope.row.blackStatus" size="small">
              {{$t('batteryList.black')}}
            </el-button>
            <!-- 删除 -->
            <el-button @click.native.prevent="deleteRow(scope.row)" :disabled="scope.row.delete" type="text" size="small">
              {{$t('batteryList.detele')}}
            </el-button>
            <!-- 设备升级 -->
            <el-button @click.native.prevent="uplevel(scope.row)" :disabled="scope.row.uplevels" type="text" size="small">
              {{$t('device.upLevel')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="['10','20','30','50']" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import t from '@/utils/translate';
import regBtn from './upload';

export default {
  components: {
    regBtn,
  },
  data() {
    return {
      manufacturerName: false,
      storge: '',
      manufactur: '', // 生产企业名称
      regDevice: false,
      total: 0, // 总数量
      currentPage: 1, // 当前页
      pageSize: 10,
      content: '',
      regform: {},
      loading: true,
      regState: '',
      bindState: '',
      // companyArr: [],
      tableData: [],
      manufacturOptions: [],
      stateOptions: [
        {
          value: '1',
          label: t('device.registed'), // "已注册"
        },
        {
          value: '0',
          label: t('device.noregist'), // "未注册"
        },
      ],
      bindOptions: [
        {
          value: '1',
          label: t('batteryList.hasBind'), // "已绑定"
        },
        {
          value: '0',
          label: t('batteryList.noBind'), // "未绑定"
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      companyArr: 'monitor/GETManufacturer',
      userData: 'getloginData',
    }),
  },
  methods: {
    ...mapActions({
      getCompany: 'monitor/getManufacturer',
    }),
    /* 改变每页显示的数量 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDeviceList();
    },
    /* 改变当前页 */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeviceList();
    },
    searchList() {
      this.currentPage = 1;
      this.getDeviceList();
    },
    /* 查看 */
    MonitorDevice(data) {
      this.$router.push({
        path: '/monitor/device/real',
        query: {
          deviceCode: data.code,
          hostId: data.hostId,
          id: data.id,
        },
      });
    },
    /* 添加黑名单 */
    addBlack(data) {
      console.log(data);
      // if (data.)
      const deviceObj = {
        id: data.id,
        status: -1,
      };
      this.$api.deviceAddBlack(deviceObj).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.addBlackSucc'), // 添加黑名单成功
          });
          this.getDeviceList();
        }
      });
    },
    /* 删除设备 */
    deleteRow(data) {
      /* 确定删除此设备吗？ */
      this.$messageBox.alert(`${t('device.delTips')}`, {
        showCancelButton: true,
        confirmButtonText: `${t('timeBtn.confirm')}`, // "确定",
        cancelButtonText: `${t('timeBtn.cancle')}`, // "取消",
        callback: (action) => {
          if (action === 'confirm') {
            this.$api.deviceDetele(data.id).then((res) => {
              console.log(res);
              if (res.data && res.data.code === 0) {
                this.$message({
                  message: t('successTips.delSuccess'), // "删除成功",
                  type: 'success',
                });
                this.getDeviceList();
              }
            });
          }
        },
      });
    },
    /* 设备升级 */
    uplevel() { },

    /* 清空 */
    clearAll() {
      this.regState = '';
      this.bindState = '';
      this.content = '';
      this.manufactur = '';
      this.getDeviceList();
    },
    searchDevice() {
      this.getDeviceList();
    },
    /* 获取设备列表 */
    getDeviceList() {
      this.loading = true;
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        // registerStatus: this.regState,
        status: 0,
        topLayerCompanyId: this.manufactur,
        bindingStatus: this.bindState,
      };
      if (this.content || this.content === 0) {
        pageObj.code = this.content;
      }
      this.$api.deviceList(pageObj).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          this.tableData = [];

          if (result.pageData.length > 0) {
            result.pageData.forEach((key) => {
              key.online = key.onlineStatus === 0;
              key.blackStatus = key.status === -1;
              key.subCompanyName = key.subCompanyName
                ? key.subCompanyName
                : '-';
              key.registerCode =
                key.registerCode === null ? t('device.noregist') : t('device.registed');// "未注册" : "已注册";
              key.bindStatus = key.hostId === null;
              key.canlook = key.hostId === null;
              key.delete = !key.bindStatus;
              key.bindState = key.hostId === null ? t('batteryList.noBind') : t('batteryList.hasBind'); // "未绑定" : "已绑定";
              if (this.userData.type !== 1 && this.userData.layerName !== '平台') {
                key.blackStatus = true;
                key.delete = true;
                key.uplevels = true;
              }
              this.tableData.push(key);
            });
          }
        }
      });
    },
  },
  mounted() {
    this.getDeviceList();
    if (this.userData.layerName === '平台') {
      this.manufacturerName = true;
      this.getCompany();
    }
  },
};
</script>
<style lang="scss" scoped>
.device {
  background: #ffffff;
  padding: 24px;
  .topTab {
    min-width: 1014px;
    display: flex;
    height: 60px;
    .icons {
      flex: 0 0 42%;
    }
    .select {
      flex: 1;
      display: flex;
      .item {
        flex: 1;
        padding: 10px 5px;
      }
    }
  }
  .tableContent {
    padding-top: 50px;
  }
}
.page {
  padding-top: 20px;
  text-align: right;
}
</style>
