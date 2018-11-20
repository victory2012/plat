<template>
  <el-dialog :title="$t('batteryList.batteryDetail')"
    @close="closeDetails"
    :visible="getBatteryDetailShow"
    width="770px">
    <div class="detailCenter">
      <div class="edit"
        v-if="AdminRoles.AddBatteries">
        <el-button size="mini"
          type="primary"
          @click="editDetails">{{$t('user.edit')}}</el-button>
      </div>
      <table>
        <tr>
          <!-- 电池组客户企业 -->
          <td class="titles">{{$t('batteryList.customer')}}</td>
          <td>
            <p>{{BATTERYDETAILDATA.companyName}}</p>
          </td>
          <!-- 电池组编号 -->
          <td class="titles">{{$t('batteryList.batteryCode')}}</td>
          <td>
            <p>{{BATTERYDETAILDATA.code}}</p>
          </td>
        </tr>
        <tr>
          <!-- 电池组型号 -->
          <td class="titles">{{$t('batteryList.model')}}</td>
          <td>
            <!-- <el-input size="mini" v-show="Edit" v-model="editObj.model"></el-input> -->
            <el-select v-show="Edit"
              size="mini"
              style="width: 195px"
              v-model="editObj.modelId"
              :placeholder="$t('batteryList.batteryCode')">
              <el-option v-for="item in getGroupModelOpts"
                :key="item.id"
                :label="item.dicKey"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-show="!Edit">{{BATTERYDETAILDATA.model}}</p>
          </td>
          <td class="titles">{{$t('batteryList.specif')}}</td>
          <td>
            <el-select v-show="Edit"
              size="mini"
              style="width: 195px"
              v-model="editObj.normId"
              :placeholder="$t('batteryList.specif')">
              <el-option v-for="item in getBatGroupSpecifOpts"
                :key="item.id"
                :label="item.dicKey"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input size="mini" v-show="Edit" v-model="editObj.norm"></el-input> -->
            <p v-show="!Edit">{{BATTERYDETAILDATA.norm}}</p>
          </td>
        </tr>
        <tr>
          <!-- 电池组额定电压 -->
          <td class="titles">{{$t('batteryList.batteryVoltage')}}</td>
          <td>
            <el-input size="mini"
              v-show="Edit"
              style="width: 195px"
              value="number"
              v-model.trim="editObj.voltage"></el-input>
            <p v-show="!Edit">{{BATTERYDETAILDATA.voltage}}</p>
          </td>
          <!-- 电池组额定容量 -->
          <td class="titles">{{$t('batteryList.batteryCapacity')}}</td>
          <td>
            <el-input size="mini"
              v-show="Edit"
              style="width: 195px"
              value="number"
              v-model.trim="editObj.capacity"></el-input>
            <p v-show="!Edit">{{BATTERYDETAILDATA.capacity}}</p>
          </td>
        </tr>
        <tr>
          <!-- 电池单体型号 -->
          <td class="titles">{{$t('batteryList.singleBattery')}}</td>
          <!-- colspan="3" -->
          <td>
            <el-select v-show="Edit"
              size="mini"
              style="width: 195px"
              v-model="editObj.singleModelId"
              :placeholder="$t('batteryList.singleBattery')">
              <el-option v-for="item in getSingleBatteryOpts"
                :key="item.id"
                :label="item.dicKey"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input size="mini" v-show="Edit" v-model="editObj.singleModel"></el-input> -->
            <p v-show="!Edit">{{BATTERYDETAILDATA.singleModel}}</p>
          </td>
        </tr>
        <tr>
          <!-- 电池组生产日期 -->
          <td class="titles">{{$t('batteryList.createDate')}}</td>
          <td>
            <el-date-picker v-show="Edit"
              size="small"
              :clearable='false'
              value-format="yyyy-MM-dd"
              style="width: 195px"
              :default-value="editObj.manufacturerDate"
              v-model="editObj.manufacturerDate"
              type="date"
              :placeholder="$t('batteryList.createDate')">
            </el-date-picker>
            <p v-show="!Edit">{{BATTERYDETAILDATA.manufacturerDate}}</p>
          </td>
          <!-- 电池组出厂日期 -->
          <td class="titles">{{$t('batteryList.manufactureDate')}}</td>
          <td>
            <el-date-picker v-show="Edit"
              size="small"
              :clearable='false'
              value-format="yyyy-MM-dd"
              style="width: 195px"
              :default-value="editObj.productionDate"
              v-model="editObj.productionDate"
              type="date"
              :placeholder="$t('batteryList.manufactureDate')">
            </el-date-picker>
            <p v-show="!Edit">{{BATTERYDETAILDATA.productionDate}}</p>
          </td>
        </tr>
        <tr>
          <!-- 电池组质保期 -->
          <td class="titles">{{$t('batteryList.warrantyDate')}}</td>
          <td>
            <el-date-picker v-show="Edit"
              size="small"
              :clearable='false'
              value-format="yyyy-MM-dd"
              style="width: 195px"
              :default-value="editObj.qualityGuaranteeDate"
              v-model="editObj.qualityGuaranteeDate"
              type="date"
              :placeholder="$t('batteryList.warrantyDate')">
            </el-date-picker>
            <p v-show="!Edit">{{BATTERYDETAILDATA.qualityGuaranteeDate}}</p>
          </td>
          <td class="titles">{{$t('batteryList.deviceCode')}}</td>
          <td>
            <p>{{BATTERYDETAILDATA.deviceCode || ''}}</p>
          </td>
        </tr>
      </table>
    </div>
    <div slot="footer"
      class="dialog-footer">
      <el-button v-show="Edit"
        size="small"
        @click="cancelSaveDetails">{{$t('timeBtn.cancle')}}</el-button>
      <el-button v-show="Edit"
        type="danger"
        size="small"
        @click="saveDetails">{{$t('timeBtn.save')}}</el-button>

      <el-button v-show="!Edit"
        size="small"
        @click="closeDetails">{{$t('timeBtn.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
/* eslint-disable */
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/functions";
import permissionFun from "@/utils/valated";
import t from "@/utils/translate";

export default {
  props: {
    rowData: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    ...mapGetters([
      "getBatteryDetailShow",
      "BATTERYDETAILDATA",
      "getGroupModelOpts",
      "getBatGroupSpecifOpts",
      "getSingleBatteryOpts"
    ])
  },
  data () {
    return {
      editObj: {},
      Edit: false,
      AdminRoles: permissionFun()
    };
  },
  methods: {
    closeDetails () {
      this.Edit = false;
      this.$store.commit("SETBATTERYDETAIL", false);
    },
    /* 编辑 */
    editDetails () {
      this.Edit = true;
      this.editObj = deepClone(this.BATTERYDETAILDATA);
    },
    /* 保存 */
    saveDetails () {
      if (!this.AdminRoles.AddBatteries) {
        return;
      }
      if (!this.editObj.voltage) {

        this.$message.error(t('batteryList.warn.batteryVoltage'));
        return;
      }
      if (!this.editObj.capacity) {

        this.$message.error(t('batteryList.warn.batteryCapacity'));

        return;
      }

      if (
        new Date(this.editObj.manufacturerDate) > new Date(this.editObj.productionDate)) {

        this.$message.error(t('batteryList.warn.CheckmanufactureDate'));

        return
      }
      if (new Date(this.editObj.manufacturerDate) > new Date(this.editObj.qualityGuaranteeDate)) {
        this.$message.error(t('batteryList.warn.CheckWarrantyDate'));

        return
      }
      this.getSingleBatteryOpts.forEach(key => {
        if (key.id === this.editObj.singleModelId) {
          this.editObj.singleMode = key.dicKey;
        }
      });
      this.getGroupModelOpts.forEach(key => {
        if (key.id === this.editObj.modelId) {
          this.editObj.model = key.dicKey;
        }
      });
      this.getBatGroupSpecifOpts.forEach(key => {
        if (key.id === this.editObj.normId) {
          this.editObj.norm = key.dicKey;
        }
      });
      let options = {
        normId: this.editObj.normId,
        norm: this.editObj.norm,
        modelId: this.editObj.modelId,
        model: this.editObj.model,
        singleModelId: this.editObj.singleModelId,
        singleModel: this.editObj.singleMode,
        voltage: this.editObj.voltage,
        capacity: this.editObj.capacity,
        productionDate: this.editObj.productionDate,
        manufacturerDate: this.editObj.manufacturerDate,
        qualityGuaranteeDate: this.editObj.qualityGuaranteeDate
      };
      console.log(options);
      this.$api.changeBatteryDetail(this.editObj.id, options).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            type: "success",
            message: t('successTips.changeSuccess')
          });
          this.$emit("hasCreated", { value: true });
          this.closeDetails();
        }
      });
    },
    /* 取消保存 */
    cancelSaveDetails () {
      // this.editObj = deepClone(this.BATTERYDETAILDATA);
      this.Edit = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {
  text-align: right;
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
        height: 28px;
        line-height: 28px;
        border-radius: 3px;
        padding: 0 10px;
      }
      &.titles {
        padding-right: 15px;
        width: 130px;
        background: #ffffff;
        text-align: right;
      }
    }
  }
}
</style>
