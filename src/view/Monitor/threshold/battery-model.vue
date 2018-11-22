<template>
  <div class="container">
    <div class="search">
      <div class="tab">
        <!-- 电池编号 -->
        <el-select size="small"
          v-model="batteryModelId"
          :placeholder="$t('batteryList.battertModel')"
          @change="ChooseBatteryModel">
          <el-option v-for="item in group"
            :key="item.id"
            :label="item.dicKey"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="tab">
        <!-- 修改阈值 -->
        <el-button @click="modifyThreshold"
          size="small"
          type="primary">{{$t('threshold.changeThreshold')}}</el-button>
        <!-- 恢复全局 -->
        <el-button @click="getTemplate"
          size="small"
          plain>{{$t('threshold.recovery')}}</el-button>
      </div>
    </div>
    <div class="warrp">
      <el-form :model="batteryForm"
        :rules="batteryFormRules"
        ref="batteryForm">
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 单体充电电压上限阈值 (V)-->
            <el-form-item :label="`${$t('threshold.singleVoltage')}(V)`"
              prop="singleMaxChargeVoltage">
              <el-input-number controls-position="right"
                size="small"
                v-model="batteryForm.singleMaxChargeVoltage"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 单体放电电压下限阈值 -->
            <el-form-item :label="`${$t('threshold.singleDisVoltage')}(V)`"
              prop="singleMinDischargeVoltage">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.singleMinDischargeVoltage"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 整组充电电压上限阈值(V) -->
            <el-form-item :label="`${$t('threshold.maxColtage')}(V)`"
              prop="maxChargeVoltage">
              <el-input-number controls-position="right"
                size="small"
                v-model="batteryForm.maxChargeVoltage"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 整组放电电压下限阈值(V) -->
            <el-form-item :label="`${$t('threshold.minDVoltage')}(V)`"
              prop="minDischargeVoltage">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.minDischargeVoltage"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 充电电流上限阈值系数 -->
            <el-form-item :label="$t('threshold.maxCCurrent')"
              prop="maxChargeCurrent">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxChargeCurrent"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 放电电流上限阈值系数 -->
            <el-form-item :label="$t('threshold.maxDCurrent')"
              prop="maxDischargeCurrent">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxDischargeCurrent"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 充电温度上限阈值(℃) -->
            <el-form-item :label="`${$t('threshold.maxCTemperat')}(℃)`"
              prop="maxChargeTemperature">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxChargeTemperature"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 充电温度下限阈值(℃) -->
            <el-form-item :label="`${$t('threshold.minCTemperat')}(℃)`"
              prop="minChargeTemperature">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.minChargeTemperature"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 放电温度上限阈值(℃) -->
            <el-form-item :label="`${$t('threshold.maxDTemperat')}(℃)`"
              prop="maxDischargeTemperature">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxDischargeTemperature"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 放电温度下限阈值(℃) -->
            <el-form-item :label="`${$t('threshold.minDTemperat')}(℃)`"
              prop="minDischargeTemperature">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.minDischargeTemperature"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 补水超限天数 -->
            <el-form-item :label="$t('threshold.maxFODays')"
              prop="maxFluidOverDays">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxFluidOverDays"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <!-- 充电容量上限阈值系数 -->
            <el-form-item :label="$t('threshold.maxCCapacity')"
              prop="maxChargeCapacity">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.maxChargeCapacity"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 充电容量下限阈值系数 -->
            <el-form-item :label="$t('threshold.minCCapacity')"
              prop="minChargeCapacity">
              <el-input-number controls-position="right"
                size="small"
                v-model.number="batteryForm.minChargeCapacity"
                :style="inputWidth"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import t from '@/utils/translate';

export default {
  data() {
    return {
      inputWidth: 'width:400px',
      batteryModelTempId: null,
      hasTemp: true,
      batteryForm: {},
      batteryFormRules: {
        singleMaxChargeVoltage: [
          {
            required: true,
            message: t('threshold.warn.singleVoltage'), // "请输入单体充电电压上限阈值",
            trigger: 'blur',
          },
        ],
        singleMinDischargeVoltage: [
          {
            required: true,
            message: t('threshold.warn.singleDisVoltage'), // "请输入单体放电电压下限阈值",
            trigger: 'blur',
          },
        ],
        maxChargeVoltage: [
          {
            required: true,
            message: t('threshold.warn.maxColtage'), // "请输入整组充电电压上限阈值",
            trigger: 'blur',
          },
        ],
        minDischargeVoltage: [
          {
            required: true,
            message: t('threshold.warn.minDVoltage'), // "请输入整组放电电压下限阈值",
            trigger: 'blur',
          },
        ],
        maxChargeCurrent: [
          {
            required: true,
            message: t('threshold.warn.maxCCurrent'), // "请输入充电电流上限阈值系数",
            trigger: 'blur',
          },
        ],
        maxDischargeCurrent: [
          {
            required: true,
            message: t('threshold.warn.maxDCurrent'), // "请输入放电电流上限阈值系数",
            trigger: 'blur',
          },
        ],
        maxChargeTemperature: [
          {
            required: true,
            message: t('threshold.warn.maxCTemperat'), // "请输入充电温度上限阈值",
            trigger: 'blur',
          },
        ],
        minChargeTemperature: [
          {
            required: true,
            message: t('threshold.warn.minCTemperat'), // "请输入充电温度下限阈值",
            trigger: 'blur',
          },
        ],
        maxDischargeTemperature: [
          {
            required: true,
            message: t('threshold.warn.maxDTemperat'), // "请输入放电温度上限阈值",
            trigger: 'blur',
          },
        ],
        minDischargeTemperature: [
          {
            required: true,
            message: t('threshold.warn.minDTemperat'), // "请输入放电温度下限阈值",
            trigger: 'blur',
          },
        ],
        maxFluidOverDays: [
          { required: true,
            message: t('threshold.warn.maxFODays'), // "请输入补水超限天数",
            trigger: 'blur',
          },
        ],
        maxChargeCapacity: [
          {
            required: true,
            message: t('threshold.warn.maxCCapacity'), // "请输入充电容量上限阈值系数",
            trigger: 'blur',
          },
        ],
        minChargeCapacity: [
          {
            required: true,
            message: t('threshold.warn.minCCapacity'), // "请输入充电容量下限阈值系数",
            trigger: 'blur',
          },
        ],
      },
      batteryModelId: '',
      group: [],
      setings: {},
    };
  },
  methods: {
    modifyThreshold() {
      if (!this.batteryModelId && !this.hasTemp) {
        this.$message({
          message: t('threshold.warn.selectBatModel'), // "请选择电池型号",
          type: 'error',
        });
        return;
      }
      this.$refs.batteryForm.validate((valid) => {
        if (valid) {
          const params = {
            modelId: this.batteryModelId,
            singleMaxChargeVoltage: this.batteryForm.singleMaxChargeVoltage,
            singleMinDischargeVoltage: this.batteryForm
              .singleMinDischargeVoltage,
            maxChargeVoltage: this.batteryForm.maxChargeVoltage,
            minDischargeVoltage: this.batteryForm.minDischargeVoltage,
            maxChargeCurrent: this.batteryForm.maxChargeCurrent,
            maxDischargeCurrent: this.batteryForm.maxDischargeCurrent,
            maxChargeTemperature: this.batteryForm.maxChargeTemperature,
            minChargeTemperature: this.batteryForm.minChargeTemperature,
            maxDischargeTemperature: this.batteryForm.maxDischargeTemperature,
            minDischargeTemperature: this.batteryForm.minDischargeTemperature,
            maxFluidOverDays: this.batteryForm.maxFluidOverDays,
            maxChargeCapacity: this.batteryForm.maxChargeCapacity,
            minChargeCapacity: this.batteryForm.minChargeCapacity,
          };
          console.log(params);
          if (this.hasTemp) {
            params.id = this.batteryModelTempId;
            this.modifyFunction(params);
          } else {
            this.addFunction(params);
          }
        }
      });
    },
    /* 添加 */
    addFunction(data) {
      this.$api.batteryAddPolicy(data).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            message: t('successTips.addSuccess'), // "添加成功",
            type: 'success',
          });
        }
      });
    },
    /* 修改 */
    modifyFunction(data) {
      this.$api.batteryChangePolicy(data).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            message: t('successTips.changeSuccess'), // "修改成功",
            type: 'success',
          });
        }
      });
    },
    ChooseBatteryModel() {
      this.batteryForm = {};
      this.$refs.batteryForm.resetFields();
      this.$api.getBatteryPolicy(this.batteryModelId).then((res) => {
        if (res.data && res.data.code === 0) {
          const result = res.data;
          if (result.data === null) {
            this.$message({
              message: t('threshold.warn.modelNoThres'), // "此电池型号暂未设置阈值",
              type: 'warning',
            });
            this.hasTemp = false;
          } else {
            this.hasTemp = true;
            this.batteryForm = result.data;
            this.batteryModelTempId = result.data.id;
          }
        }
      });
    },
    getBatteryModel() {
      this.$api.batteryModelList().then((res) => {
        // console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          console.log(res.data);
          this.group = res.data.data;
        }
      });
    },
    getTemplate() {
      if (!this.batteryModelId) {
        this.$message({
          message: t('threshold.warn.selectBatModel'), // "请选择电池型号",
          type: 'error',
        });
        return;
      }
      this.$api.getTempPolicy().then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          const result = res.data;
          if (result.data === null) {
            this.$message({
              message: t('threshold.warn.NOverall'), // "暂未设置全局阈值",
              type: 'warning',
            });
          } else {
            this.batteryForm = result.data;
          }
        }
      });
    },
  },
  mounted() {
    this.getBatteryModel();
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 24px;
  background: #ffffff;
}
.search {
  display: flex;
  margin-bottom: 40px;
  .tab {
    flex: 1;
    &:nth-child(1) {
      text-align: right;
      padding-right: 150px;
      margin-right: 50px;
    }
  }
}
.warrp {
  width: 1080px;
  margin: 0 auto;
  .item {
    color: #484848;
    margin-bottom: 26px;
    p {
      font-size: 14px;
      line-height: 32px;
    }
  }
}
</style>
