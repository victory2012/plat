<template>
  <div class="batteryList">
    <div class="topTab">
      <div class="icons">
        <add-battery class="item"
          @hasCreated="reloadBattery"></add-battery>
        <up-loade></up-loade>
      </div>
      <div class="select">
        <div class="item">
          <el-input size="small"
            v-model.trim="batteryId"
            :placeholder="$t('batteryList.searchContent')"></el-input>
        </div>
        <div class="item">
          <el-select size="small"
            v-model="batteryModel"
            :placeholder="$t('batteryList.model')">
            <el-option v-for="item in Modeloptions"
              :key="item.id"
              :label="item.dicKey"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div v-if="userRole().selectProd"
          class="item">
          <el-select size="small"
            v-model="manufacter"
            :placeholder="$t('batteryList.enterprise')">
            <el-option v-for="item in companyArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div v-if="userRole().selectCus"
          class="item">
          <el-select size="small"
            v-model="batCustom"
            :placeholder="$t('batteryList.customer')">
            <el-option v-for="item in batCustomOpts"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>

        <div class="item">
          <el-select size="small"
            v-model="bindStatus"
            :placeholder="$t('batteryList.binding')">
            <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-button @click="getBatteryList"
            size="mini"
            type="primary">{{$t('batteryList.search')}}</el-button>
          <el-button @click="clearOptions"
            size="small"
            plain>{{$t('batteryList.clear')}}</el-button>
        </div>
      </div>
    </div>
    <div class="tables">
      <el-table v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :highlight-current-row="true">
        <!-- 序号 -->
        <el-table-column type="index"
          width="50"
          align="center"
          :label="$t('batteryList.serial')">
        </el-table-column>
        <!-- 电池编号 -->
        <el-table-column prop="code"
          align="center"
          :label="$t('batteryList.batteryCode')">
        </el-table-column>
        <!-- 电池型号 -->
        <el-table-column prop="model"
          align="center"
          :label="$t('batteryList.model')">
        </el-table-column>
        <!-- 电池组规格 -->
        <el-table-column prop="norm"
          align="center"
          :label="$t('batteryList.specif')">
        </el-table-column>
        <!-- 生产企业名称 -->
        <el-table-column v-if="userRole().listProd"
          prop="parentCompanyName"
          align="center"
          :label="$t('batteryList.enterprise')">
        </el-table-column>
        <!-- 客户企业名称 -->
        <el-table-column v-if="userRole().listCus"
          prop="companyName"
          align="center"
          :label="$t('batteryList.customer')">
        </el-table-column>
        <!-- 监测设备编号 -->
        <el-table-column prop="deviceCode"
          align="center"
          :label="$t('batteryList.deviceCode')">
        </el-table-column>
        <!-- 绑定状态 -->
        <el-table-column prop="bindingName"
          align="center"
          :label="$t('batteryList.bindStatus')">
        </el-table-column>
        <!-- 运行状态 -->
        <el-table-column align="center"
          :label="$t('batteryList.runStatus')">
          <template slot-scope="scope">
            <el-button @click.native.prevent="lookFor(scope.row)"
              :disabled="scope.row.hasbind"
              type="text"
              size="small">
              {{$t('batteryList.view')}}
            </el-button>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center"
          width="280"
          :label="$t('batteryList.handle')">
          <template slot-scope="scope">
            <!-- 详情 -->
            <el-button @click="details(scope.row)"
              type="text"
              size="small">{{$t('batteryList.batteryDetail')}}</el-button>
            <!-- 绑定 -->
            <el-button @click="bindDeviceClick(scope.row)"
              :disabled="!scope.row.hasbind || scope.row.isPlat"
              type="text"
              size="small">{{$t('batteryList.bind')}}</el-button>
            <!-- 解绑 -->
            <el-button @click="unbindClick(scope.row)"
              :disabled="scope.row.hasbind || scope.row.isPlat"
              type="text"
              size="small">{{$t('batteryList.unBind')}}</el-button>
            <!-- 拉黑 -->
            <el-button @click="addBlack(scope.row)"
              :disabled="!AdminRoles.addblack || scope.row.hasbind"
              type="text"
              size="small">{{$t('batteryList.black')}}</el-button>
            <!-- 删除 -->
            <el-button @click="deleteBattery(scope.row)"
              :disabled="!scope.row.canDelete || scope.row.isPlat"
              type="text"
              size="small">{{$t('batteryList.detele')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 电池绑定 -->
    <el-dialog width="600px"
      :title="$t('batteryList.batteryBindDevice')"
      :visible.sync="bindDevice">
      <el-form :model="deviceModel"
        label-width="150px"
        label-position="right"
        ref="deviceModel"
        style="margin-top:20px;">
        <el-form-item :title="$t('batteryList.deviceCode')"
          prop="deviceId"
          :rules="bindRole">
          <el-select size="small"
            style="width:210px"
            v-model="deviceModel.deviceId"
            :placeholder="$t('batteryList.deviceCode')">
            <el-option v-for="item in deviceIdOpts"
              :key="item.id"
              :label="item.code"
              :value="item.id"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="resetBind">{{$t('batteryList.cancel')}}</el-button>
        <el-button :loading="bindings"
          size="small"
          @click="submitBind"
          type="primary">{{$t('batteryList.sure')}}</el-button>
      </div>
    </el-dialog>
    <battery-detail @hasCreated="reloadBattery"></battery-detail>
  </div>
</template>

<script>
import permissionFun from '@/permision/valated';
import { mapState, mapActions, mapGetters } from 'vuex';
import { Message } from 'element-ui';
// import utils from '@/utils/utils';
import mqttConfig from '@/api/mqtt.config';
/* eslint-disable */
import Paho from 'Paho';
import t from '@/utils/translate';
import upLoade from './upload';
import batteryDetail from './details';
import addBattery from './addBattery';

// let wb; // 读取完成的数据
// let rABS = false; // 是否将文件读取为二进制字符串
let mqttClient = {};
export default {
  components: {
    batteryDetail,
    upLoade,
    addBattery
  },
  data () {
    return {
      AdminRoles: permissionFun(),
      // companyArr: [], // 生产企业公司名称
      manufacter: '', // 选中的生产企业
      bindings: false,
      deviceModel: {},
      bindDevice: false,
      addType: '',
      batteryId: '',
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      batteryForm: {},
      batteryFormRules: {},
      // Modeloptions: [],
      batteryModel: '',
      batCustom: '',
      bindStatus: '',
      // deviceIdOpts: [],
      bindRole: [
        {
          required: true,
          message: this.$t('batteryList.warn.deviceId'),
          trigger: 'change',
        },
      ],
      options: [
        {
          value: 1,
          label: t('batteryList.hasBind'),
        },
        {
          value: 0,
          label: t('batteryList.noBind'),
        },
      ],
      bindOptions: [],
      value: '',
      tableData: [],
      detailData: {},
    };
  },
  computed: {
    ...mapState(['userData']),
    ...mapGetters({
      deviceIdOpts: 'monitor/GETdeviceList',
      Modeloptions: 'monitor/GETbatteryModelList',
      companyArr: 'monitor/GETManufacturer',
      batCustomOpts: 'monitor/GETCustomerList'
    })
  },
  mounted () {
    this.init();
    if (
      this.userData.type === 1 ||
      (this.userData.type === 3 && this.userData.layerName === '平台')
    ) {
      this.getCompany(); // 查询生产企业
    }
    this.getBatteryList();
    this.connectMqtt();
  },
  methods: {
    ...mapActions({
      getCompanyId: 'monitor/getCompanyList',
      getBatteryModelList: 'monitor/getBatteryModelList',
      getDeviceList: 'monitor/getDeviceList',
      getCompany: 'monitor/getManufacturer'
    }),
    init () {
      this.getCompanyId(); // 获取客户企业表
      this.getBatteryModelList(); // 获取电池型号列表
      this.getDeviceList(); // 获取设备列表
    },
    connectMqtt () {
      const config = mqttConfig();
      mqttClient = new Paho.MQTT.Client(
        config.hostname,
        config.port,
        config.clientId,
      );
      mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: config.reconnect,
        keepAliveInterval: config.keepAliveInterval,
        useSSL: config.useSSL,
        timeout: config.timeout,
      });
      mqttClient.onFailure = (res) => {
        console.log(res);
      };
      mqttClient.onConnectionLost = (responseObject) => {
        console.log('mqtt-closed:', responseObject);
      };
      mqttClient.onMessageArrived = (message) => {
        console.log('message', message);
      };
    },
    onConnect () {
      console.log('mqtt is connected');
    },
    /* 拉黑 */
    addBlack (row) {
      const deviceObj = {
        id: row.deviceId,
        status: -1,
      };
      this.$api.betteryBlack(deviceObj).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          Message({
            type: 'success',
            message: t('successTips.addBlackSucc'),
          });
          this.getBatteryList();
        }
      });
    },

    reloadBattery () {
      this.getBatteryList();
    },
    /* 查看详情 */
    details (data) {
      this.$api.betteryDetails(data.id).then((res) => {
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          result.deviceCode = data.deviceCode;
          this.$store.commit('monitor/showBatteryDetail', true);
          this.$store.commit('monitor/setBatteryDetail', result);
        }
      });
    },
    /* 取消电池绑定 */
    resetBind () {
      this.$refs.deviceModel.resetFields();
      this.deviceModel = {};
    },
    /* 电池绑定 */
    submitBind () {
      this.$refs.deviceModel.validate((vlited) => {
        if (vlited) {
          this.bindings = true;
          this.deviceIdOpts.forEach((key) => {
            if (this.deviceModel.deviceId === key.id) {
              this.deviceModel.code = key.code;
            }
          });
          const bindObj = {
            hostId: this.bindRows.hostId,
            deviceId: this.deviceModel.deviceId,
            hostCode: this.bindRows.code,
            deviceCode: this.deviceModel.code,
          };
          this.$api.betteryBind(bindObj).then((res) => {
            this.bindings = false;
            if (res.data && res.data.code === 0) {
              Message({
                type: 'success',
                message: t('successTips.bindSuccess'),
              });
              this.resetBind();
              this.bindDevice = false;
              this.bindHostId = null;
              const message = new Paho.MQTT.Message(`k:${this.bindRows.code}`);
              message.destinationName = `cmd/${bindObj.deviceCode}`;
              console.log(message);
              mqttClient.send(message);

              this.getBatteryList();
            }
          });
        }
      });
    },
    /* 每页显示的数量 */
    handleSizeChange (val) {
      this.loading = true;
      this.pageSize = val;
      this.getBatteryList();
    },
    /* 显示第几页 */
    handleCurrentChange (val) {
      this.currentPage = val;
      this.loading = true;
      this.getBatteryList();
    },
    lookFor (row) {
      this.$router.push({
        path: 'battery/run',
        query: {
          deviceId: row.deviceId,
          deviceCode: row.deviceCode,
          hostId: row.hostId,
          id: row.id,
        },
      });
    },
    /* 删除 */
    deleteBattery (row) {
      if (!row.id) return;
      this.$messageBox.alert(`${t('batteryList.deleteTip')}`, {
        showCancelButton: true,
        confirmButtonText: t('batteryList.sure'),
        cancelButtonText: t('batteryList.cancel'),
        callback: (action) => {
          if (action === 'confirm') {
            this.$api.batteryDetele(row.id).then((res) => {
              if (res.data && res.data.code === 0) {
                Message({
                  type: 'success',
                  message: t('successTips.delSuccess'),
                });
                this.getBatteryList();
              }
            });
          }
        },
      });
    },
    /* 绑定按钮 */
    bindDeviceClick (row) {
      this.bindDevice = true;
      this.bindRows = row;
    },
    /* 解绑按钮 */
    unbindClick (row) {
      this.$api.batteryUnBind(row.hostId).then((res) => {
        if (res.data && res.data.code === 0) {
          Message({
            type: 'success',
            message: t('successTips.unbindSuccess'),
          });
          this.getDeviceList();
          this.getBatteryList();
        }
      });
    },

    /* 清空 */
    clearOptions () {
      this.batCustom = '';
      this.batteryId = '';
      this.batteryModel = '';
      this.bindStatus = '';
      this.getBatteryList();
    },
    /* 获取电池列表 */
    getBatteryList () {
      const options = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        companyName: `${this.batCustom}`,
        batteryGroupOrDeviceCode: this.batteryId,
        modelId: this.batteryModel,
        bindingStatus: this.bindStatus,
        status: 0,
      };
      if (
        (this.userData.type === 1 ||
          (this.userData.type === 3 && this.userData.layerName === '平台')) &&
        this.manufacter
      ) {
        options.parentCompanyId = this.manufacter;
      }
      this.$api.batteryList(options).then((res) => {
        this.tableData = [];
        this.loading = false;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          if (!result) return;
          this.total = result.total;
          // AdminRoles
          result.pageData.forEach((key) => {
            key.onLine = key.onlineStatus === 0 || key.onlineStatus === null;
            if (key.deviceId) {
              key.hasbind = false;
              key.deviceCode = key.deviceCode;
              key.bindingName = t('batteryList.hasBind');
            } else {
              key.bindingName = t('batteryList.noBind');
              key.hasbind = true;
              key.deviceCode = '';
            }
            if (this.userData.type === 1 || this.userData.type === 3) {
              key.isPlat = true;
            } else {
              key.canDelete = false;
              if (this.AdminRoles.deleteBattery && key.hasbind) {
                key.canDelete = true;
              } else {
                key.canDelete = false;
              }
            }
            this.tableData.push(key);
          });
        }
      });
    },


    /* 用户权限 */
    userRole () {
      const userObj = {};
      if (
        this.userData.type === 1 ||
        (this.userData.type === 3 && this.userData.layerName === '平台')
      ) {
        userObj.listCus = true;
        userObj.listProd = true;
        userObj.selectCus = false;
        userObj.selectProd = true;
      }
      if (
        this.userData.type === 2 ||
        (this.userData.type === 3 && this.userData.layerName === '生产企业')
      ) {
        userObj.listCus = true;
        userObj.listProd = false;
        userObj.selectCus = true;
        userObj.selectProd = false;
      }
      // if (
      //   this.userData.type === 3 &&
      //   this.userData.layerName === "采购企业"
      // ) {
      //   userObj.listCus = true;
      //   userObj.listProd = false;
      //   userObj.selectCus = false;
      //   userObj.selectProd = false;
      // }
      return userObj;
    },
  },
  destroyed () {
    if (
      typeof mqttClient === 'object' &&
      typeof mqttClient.isConnected === 'function'
    ) {
      mqttClient.disconnect();
      mqttClient = null;
    }
  },
};
</script>
<style lang="scss" scoped>
.batteryList {
  background: #ffffff;
  border-radius: 5px;
  padding: 20px;
  // min-width: 1180px;
  overflow: auto;

  .topTab {
    display: flex;
    height: 60px;
    margin-bottom: 40px;

    .icons {
      flex: 0 0 35%;
      overflow: hidden;
      & > div {
        text-align: center;
        float: left;
      }
      .items {
        width: 116px;
        float: left;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        .fileUpload {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 0;
          width: 116px;
          height: 58px;
          opacity: 0;
          cursor: pointer;
        }
        img {
          width: 28px;
          margin-bottom: 8px;
        }
      }
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

  .page {
    padding-top: 20px;
    text-align: right;
  }
}

#import {
  margin-bottom: 12px;
}

#recover {
  margin-bottom: 14px;
}

#upers {
  margin-bottom: 11px;
}
</style>
