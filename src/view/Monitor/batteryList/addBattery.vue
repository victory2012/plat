<template>
  <el-dialog width="600px"
    :title="$t('batteryList.batteryAddBtn')"
    @close="closeTt"
    :visible.sync="addBattery">
    <!-- 电池登记 -->
    <el-form :model="batteryForm"
      :rules="batteryFormRules"
      ref="batteryForm">
      <el-row :gutter="60">
        <el-col :span="12">
          <!-- 生产企业 -->
          <el-form-item :label="$t('batteryList.enterprise')"
            prop="account">
            <el-input size="small"
              disabled
              v-model="account"
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
</template>
<script>
/* eslint-disable */

import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import t from "@/utils/translate";

export default {
  data () {
    return {
      account:
        JSON.parse(sessionStorage.getItem("loginData")).companyName || "",
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
    ...mapGetters([
      "getCustomOpts",
      "getGroupModelOpts",
      "getDeviceIdOpts",
      "getSingleBatteryOpts",
      "getBatGroupSpecifOpts"
    ]),
    addBattery: {
      get: function () {
        return this.$store.state.addBattery;
      },
      set: function () { }
    }
  },
  methods: {
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
              this.$emit("hasCreated", { value: true });
              this.batteryForm = {};
              this.$store.state.addBattery = false;
            }
          });
        }
      });
    },
    /* 关闭窗口回调方法 */
    closeTt () {
      this.$refs.batteryForm.resetFields();
      this.batteryForm = {};
      this.$store.state.addBattery = false;
    }
  }
};
</script>

