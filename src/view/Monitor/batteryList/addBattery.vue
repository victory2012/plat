<template>
  <div>
    <div class="items"
      v-if="AdminRoles.AddBatteries">
      <el-dropdown trigger="click"
        placement="bottom"
        @command="handleCommand">
        <span>
          <img class="addBattery"
            src="../../../../static/img/device_reg.png"><br />
          <span class="el-dropdown-link">{{$t('batteryList.batteries')}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="addBattery">
            {{$t('batteryList.batteryAddBtn')}}
          </el-dropdown-item>
          <el-dropdown-item command="addModel">
            {{$t('batteryList.addModel')}}
          </el-dropdown-item>
          <el-dropdown-item command="addSpfic">
            {{$t('batteryList.addSpecif')}}
          </el-dropdown-item>
          <el-dropdown-item command="addSingel">
            {{$t('batteryList.addSinggleSpecif')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog width="600px"
      :title="$t('batteryList.batteryAddBtn')"
      @close="closeTt"
      top="10vh"
      :center='false'
      :visible.sync="batteryShow">
      <!-- 电池登记 -->
      <el-form :model="batteryForm"
        :rules="batteryFormRules"
        style="padding-left: 20px;"
        ref="batteryForm">
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 生产企业 -->
            <el-form-item :label="$t('batteryList.enterprise')"
              prop="account">
              <el-input size="small"
                disabled
                v-model="userData.companyName"
                auto-complete="off"
                style="width:210px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 电池组客户企业 -->
            <el-form-item :label="$t('batteryList.customer')"
              prop="batCustom">
              <el-select size="small"
                style="width:210px"
                v-model="batteryForm.batCustom"
                :placeholder="$t('batteryList.customer')">
                <el-option v-for="item in getCustomOpts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 电池组编号 -->
            <el-form-item :label="$t('batteryList.batteryCode')"
              prop="groupNum">
              <el-input size="small"
                v-model.trim="batteryForm.groupNum"
                style="width:210px;"
                :placeholder="$t('batteryList.batteryCode')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 电池组型号 -->
            <el-form-item :label="$t('batteryList.model')"
              prop="batGroupModel">
              <el-select size="small"
                style="width:210px"
                v-model="batteryForm.batGroupModel"
                :placeholder="$t('batteryList.model')">
                <el-option v-for="item in getGroupModelOpts"
                  :key="item.id"
                  :label="item.dicKey"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 电池组规格 -->
            <el-form-item :label="$t('batteryList.specif')"
              prop="batGroupSpecif">
              <el-select size="small"
                style="width:210px"
                v-model="batteryForm.batGroupSpecif"
                :placeholder="$t('batteryList.specif')">
                <el-option v-for="item in getBatGroupSpecifOpts"
                  :key="item.id"
                  :label="item.dicKey"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 电池组额定电压 -->
            <el-form-item :label="$t('batteryList.batteryVoltage')"
              prop="batteryVoltage">
              <el-input size="small"
                v-model.number="batteryForm.batteryVoltage"
                style="width:210px;"
                :placeholder="$t('batteryList.batteryVoltage')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 电池组额定容量 -->
            <el-form-item :label="$t('batteryList.batteryCapacity')"
              prop="batteryCapacity">
              <el-input size="small"
                v-model.number="batteryForm.batteryCapacity"
                style="width:210px;"
                :placeholder="$t('batteryList.batteryCapacity')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 电池单体型号 -->
            <el-form-item :label="$t('batteryList.singleBattery')"
              prop="singleBattery">
              <el-select size="small"
                style="width:210px"
                v-model="batteryForm.singleBattery"
                :placeholder="$t('batteryList.singleBattery')">
                <el-option v-for="item in getSingleBatteryOpts"
                  :key="item.id"
                  :label="item.dicKey"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 电池组生产日期 -->
            <el-form-item :label="$t('batteryList.createDate')"
              prop="productDate">
              <el-date-picker size="small"
                style="width: 210px"
                value-format="yyyy-MM-dd"
                v-model="batteryForm.productDate"
                type="date"
                :placeholder="$t('batteryList.createDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 电池组出厂日期 -->
            <el-form-item :label="$t('batteryList.manufactureDate')"
              prop="factoryDate">
              <el-date-picker size="small"
                style="width: 210px"
                value-format="yyyy-MM-dd"
                v-model="batteryForm.factoryDate"
                type="date"
                :placeholder="$t('batteryList.manufactureDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <!-- 电池组质保期 -->
            <el-form-item :label="$t('batteryList.warrantyDate')"
              prop="qualityDate">
              <el-date-picker size="small"
                style="width: 210px"
                value-format="yyyy-MM-dd"
                v-model="batteryForm.qualityDate"
                type="date"
                :placeholder="$t('batteryList.warrantyDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 监测设备编号（选填） -->
            <el-form-item :label="$t('batteryList.choseDevice')"
              prop="deviceId">
              <el-select size="small"
                style="width:210px"
                v-model="batteryForm.deviceId"
                :placeholder="$t('batteryList.deviceCode')">
                <el-option v-for="item in getDeviceIdOpts"
                  :key="item.code"
                  :label="item.code"
                  :value="item.id"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <!-- 重 置 -->
        <el-button size="small"
          @click="resetBatteryAdd">{{$t('timeBtn.reset')}}</el-button>
        <el-button size="small"
          @click="submitBatteryAdd"
          type="primary">{{$t('timeBtn.sure')}}</el-button>
        <!-- 确认 -->
      </div>
    </el-dialog>
    <el-dialog width="600px"
      :title="titles"
      :visible.sync="addModel">
      <el-form :model="modelForm"
        label-position="right"
        :rules="modelFormRules"
        ref="modelForm">
        <el-form-item :label="labels"
          prop="dicValue">
          <el-input size="small"
            v-model="modelForm.dicValue"
            auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="resetModelAdd">{{$t('batteryList.cancel')}}</el-button>
        <el-button :loading="addallTypes"
          size="small"
          @click="submitModelAdd"
          type="primary">{{$t('batteryList.sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */

import { mapGetters, mapActions } from "vuex";
import permissionFun from '@/permision/valated';
import utils from "@/utils/utils";
import t from "@/utils/translate";

export default {
  data () {
    return {
      AdminRoles: permissionFun(),
      addallTypes: false,
      labels: "",
      addModel: false,
      batteryShow: false,
      titles: '',
      modelForm: {},
      modelFormRules: {
        dicValue: [
          {
            required: true,
            message: t("batteryList.warn.content"),
            trigger: "change"
          }
        ]
      },
      batteryForm: {},
      batteryFormRules: {
        batCustom: [
          {
            required: true,
            message: t('batteryList.warn.customerCom'), // "请选择电池组客户企",
            trigger: "blur"
          }
        ],
        groupNum: [
          {
            required: true,
            message: t('batteryList.warn.batteryCode'), // "请选择电池组编号",
            trigger: "blur"
          }
        ],
        batGroupModel: [
          {
            required: true,
            message: t('batteryList.warn.model'), // "请选择电池组型号",
            trigger: "blur"
          }
        ],
        batGroupSpecif: [
          {
            required: true,
            message: t('batteryList.warn.specif'), // "请选择电池组规格",
            trigger: "blur"
          }
        ],
        batteryVoltage: [
          {
            required: true,
            message: t('batteryList.warn.batteryVoltage')
          }
        ],
        batteryCapacity: [
          {
            required: true,
            message: t('batteryList.warn.batteryCapacity')
          }
        ],
        singleBattery: [
          {
            required: true,
            message: t('batteryList.warn.singleBattery'),
            trigger: "blur"
          }
        ],
        productDate: [
          {
            required: true,
            message: t('batteryList.warn.createDate'), // "请选择电池组生产日期",
            trigger: "blur"
          }
        ],
        factoryDate: [
          {
            required: true,
            message: t('batteryList.warn.manufactureDate'), // 电池组出厂日期",
            trigger: "blur"
          }
        ],
        qualityDate: [
          {
            required: true,
            message: t('batteryList.warn.warrantyDate'), // "请选择电池组质保期",
            trigger: "blur"
          }
        ]
      },
      GroupModelOpts: [],
      batGroupModel: "",
      batCustomOpts: [], // 电池组客户企业列表
      batCustom: "", // 电池组客户企业
      batGroupSpecif: "",
      batGroupSpecifOpts: [],
      singleBattery: "",
      singleBatteryOpts: [],
      deviceId: "",
      deviceIdOpts: [],
      productDate: "",
      factoryDate: "",
      qualityDate: ""
    };
  },
  computed: {
    ...mapGetters({
      userData: 'getloginData',
      getCustomOpts: 'monitor/GETCustomerList',
      getGroupModelOpts: 'monitor/GETbatteryModelList',
      getSingleBatteryOpts: 'monitor/GETbatterySingleModel',
      getBatGroupSpecifOpts: 'monitor/GETbatteryGroupSpecif',
      getDeviceIdOpts: 'monitor/GETdeviceList'
    }),
  },
  methods: {
    ...mapActions({
      getGroupSpecif: 'monitor/getBatterySpecif',
      getSinglBattery: 'monitor/getbatterySingleModel',
      getBatteryModelList: 'monitor/getBatteryModelList',
    }),
    handleCommand (command) {
      this.addType = command;
      // this.modelForm.value = "";
      if (command === "addBattery") {
        this.batteryShow = true;
        // this.showAdd = "add-battery";
      }
      if (command === "addModel") {
        this.addModel = true;
        this.titles = t("batteryList.addModel");
        this.labels = t("batteryList.model");
      }
      if (command === "addSpfic") {
        this.addModel = true;
        this.titles = t("batteryList.addSpecif");
        this.labels = t("batteryList.specif");
      }
      if (command === "addSingel") {
        this.addModel = true;
        this.titles = t("batteryList.addSinggleSpecif");
        this.labels = t("batteryList.singgleSpecif");
      }
    },
    resetModelAdd () {
      this.$refs.modelForm.resetFields();
      this.modelForm = {};
    },
    submitModelAdd () {
      console.log(this.batteryForm);
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          this.addallTypes = true;
          let params = {
            dicKey: this.modelForm.dicValue,
            categoryId: 2
          };
          if (this.addType === "addModel") {
            params.type = "Model"; // 电池组型号
          }
          if (this.addType === "addSpfic") {
            params.type = "Norm"; // 电池组规格
          }
          if (this.addType === "addSingel") {
            params.type = "SingleModel"; // 单体规格
          }
          this.$api.batteryADDALL(params).then(res => {
            console.log(this.addType, res);
            this.addallTypes = false;
            if (res.data && res.data.code === 0) {
              this.$message({
                type: "success",
                message: t("batteryList.success")
              });
              this.addModel = false;
              this.modelForm = {};
              if (params.type === "Model") {
                this.getBatteryModelList();
              }
              if (params.type === "Norm") {
                this.getGroupSpecif();
              }
              if (params.type === "SingleModel") {
                this.getSinglBattery();
              }
            }
          });
        }
      });
    },
    resetBatteryAdd () {
      this.$refs.batteryForm.resetFields();
      this.batteryForm = {};
    },
    submitBatteryAdd () {
      this.$refs.batteryForm.validate(valid => {
        if (valid) {
          console.log("submit!", this.batteryForm);
          this.getGroupModelOpts.forEach(key => {
            if (key.id === this.batteryForm.batGroupModel) {
              this.batteryForm.model = key.dicKey;
            }
          });
          this.getBatGroupSpecifOpts.forEach(key => {
            if (key.id === this.batteryForm.batGroupSpecif) {
              this.batteryForm.norm = key.dicKey;
            }
          });
          this.getCustomOpts.forEach(key => {
            if (key.id === this.batteryForm.batCustom) {
              this.batteryForm.company = key.name;
            }
          });
          this.getSingleBatteryOpts.forEach(key => {
            if (key.id === this.batteryForm.singleBattery) {
              this.batteryForm.singleMode = key.dicKey;
            }
          });
          let params = {
            code: this.batteryForm.groupNum,
            modelId: this.batteryForm.batGroupModel,
            model: this.batteryForm.model,
            normId: this.batteryForm.batGroupSpecif,
            norm: this.batteryForm.norm,
            companyId: this.batteryForm.batCustom,
            companyName: this.batteryForm.company,
            voltage: this.batteryForm.batteryVoltage,
            capacity: this.batteryForm.batteryCapacity,
            singleModelId: this.batteryForm.singleBattery,
            singleModel: this.batteryForm.singleMode,
            productionDate: this.batteryForm.productDate,
            manufacturerDate: this.batteryForm.factoryDate,
            qualityGuaranteeDate: this.batteryForm.qualityDate
          };

          this.getDeviceIdOpts &&
            this.getDeviceIdOpts.forEach(key => {
              if (key.id === this.batteryForm.deviceId) {
                params.deviceId = this.batteryForm.deviceId;
                params.deviceCode = key.code;
              }
            });
          console.log(params);
          this.$api.batteryAddGroup(params).then(res => {
            console.log("添加电池组", res);
            if (res.data && res.data.code === 0) {
              this.$message({
                type: "success",
                message: t('successTips.regBattery')
              });
              this.$emit('hasCreated', true);
              this.batteryForm = {};
              this.batteryShow = false;
            }
          });
        }
      });
    },
    /* 关闭窗口回调方法 */
    closeTt () {
      this.$refs.batteryForm.resetFields();
      this.batteryForm = {};
      this.batteryShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.items {
  width: 116px;
  cursor: pointer;
}
.addBattery {
  display: inline-block;
  width: 28px;
  margin-bottom: 4px;
}
</style>


