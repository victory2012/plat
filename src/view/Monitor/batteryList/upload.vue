<template>
  <div>
    <div class="items"
      v-if="AdminRoles.AddBatteries">
      <el-dropdown trigger="click"
        placement="bottom"
        @command="handleCommand">
        <span>
          <img src="../../../../static/img/device_reg.png"
            alt=""><br />
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
    <div class="items"
      v-if="AdminRoles.AddBatteries"
      style="position: relative">
      <input class="fileUpload"
        type="file"
        @change="fileUpload"
        v-loading.fullscreen.lock="fullscreenLoading" />
      <img id="upers"
        src="../../../../static/img/device_import.png"
        alt="">
      <p>{{$t('batteryList.batchImport')}}</p>
    </div>
    <div class="items"
      v-if="AdminRoles.addblack"
      @click="recovery">
      <img id="recover"
        src="../../../../static/img/device_recover.png"
        alt="">
      <p>{{$t('batteryList.defriend')}}</p>
    </div>
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
// import XLSX from "xlsx";
import t from "@/utils/translate";
import permissionFun from "@/utils/valated";
import utils from "@/utils/utils";

let wb; // 读取完成的数据
let rABS = false; // 是否将文件读取为二进制字符串
export default {
  name: "",
  props: [""],
  data () {
    return {
      AdminRoles: permissionFun(),
      fullscreenLoading: false,
      addModel: false,
      labels: "",
      titles: "",
      addallTypes: false,
      modelForm: {},
      modelFormRules: {
        dicValue: [
          {
            required: true,
            message: t("batteryList.warn.content"),
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted () {
    this.getGroupSpecif(); // 获取电池规格列表
    this.getSinglBattery(); // 获取电池单体型号列表
    this.getBatteryModelList(); // 获取电池型号列表
  },

  methods: {
    fileUpload (event) {
      console.log(event);
      this.fullscreenLoading = true;
      this.eventUpload = event.target;
      let obj = event.target;
      if (!obj.files) {
        this.eventUpload.value = "";
        this.fullscreenLoading = false;
        return;
      }
      const IMPORTFILE_MAXSIZE = 1 * 1024; // 这里可以自定义控制导入文件大小
      let suffix;
      if (obj.files[0].name) {
        suffix = obj.files[0].name.split(".")[1];
      }

      if (suffix !== "xls" && suffix !== "xlsx") {
        // 请导入xls格式或者xlsx格式
        this.$message({
          type: "error",
          message: t("batch.formatErr")
        });
        this.eventUpload.value = "";
        this.fullscreenLoading = false;
        return;
      }
      if (obj.files[0].size / 1024 > IMPORTFILE_MAXSIZE) {
        this.$message({
          type: "error",
          message: t("batch.volumeErr")
        });
        this.eventUpload.value = "";
        this.fullscreenLoading = false;
        return;
      }
      let f = obj.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {
            // 手动转化
            type: "base64"
          });
        } else {
          wb = XLSX.read(data, {
            type: "binary"
          });
        }
        // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // wb.Sheets[Sheet名]获取第一个Sheet的数据
        // document.getElementById("demo").innerHTML = JSON.stringify(
        //   XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // );

        let resultObj = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log("resultObj ====>>>", resultObj);
        if (resultObj.length < 1) {
          this.$message.error(t("batch.nodata"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
        } else {
          // 判断模板是中文还是英文
          let ZhTemp = resultObj[0].Battery_Id ? false : true;
          if (ZhTemp) {
            this.ZHuploadDataCheck(resultObj);
          } else {
            this.ENuploadDataCheck(resultObj);
          }

        }
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    ENuploadDataCheck (resultObj) {
      console.log('英文');
      let valuesObj = [];
      for (let i = 0; i < resultObj.length; i++) {
        let results = resultObj[i];
        if (
          !results.Battery_Id ||
          !results.Battery_Model ||
          !results.Battery_Specification ||
          !results.Battery_Rated_Voltage ||
          !results.Battery_Rated_Capacity ||
          !results.Unit_Specification ||
          !results.Customer ||
          !results.Production_Date ||
          !results.Manufacture_Date ||
          !results.Warranty
        ) {
          this.$message.error(t("batch.complete"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        if (
          resultObj[i + 1] &&
          results.Battery_Id === resultObj[i + 1].Battery_Id
        ) {
          this.$message.error(t("batch.betteryCodeRepeat"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        if (
          !utils.checkDate(results.Production_Date) ||
          !utils.checkDate(results.Manufacture_Date) ||
          !utils.checkDate(results.Warranty)
        ) {
          this.$message.warning(t("batch.timeFormatErr"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        let ItemObj = {
          code: results.Battery_Id,
          model: results.Battery_Model,
          norm: results.Battery_Specification,
          voltage: results.Battery_Rated_Voltage,
          capacity: results.Battery_Rated_Capacity,
          singleModel: results.Unit_Specification,
          subCompanyName: results.Customer,
          productionDate: utils.yyyymmdd(results.Production_Date),
          manufacturerDate: utils.yyyymmdd(results.Manufacture_Date),
          qualityGuaranteeDate: utils.yyyymmdd(results.Warranty),
          deviceCode: results.Device_Id || ""
        };
        valuesObj.push(ItemObj);
      }
      this.fileUploadTo(valuesObj);
    },
    ZHuploadDataCheck (resultObj) {
      console.log('中文');
      let valuesObj = [];
      for (let i = 0; i < resultObj.length; i++) {
        let results = resultObj[i];
        if (
          !results["电池组编号"] ||
          !results["电池组型号"] ||
          !results["电池组规格"] ||
          !results["电池组额定电压"] ||
          !results["电池组额定容量"] ||
          !results["电池单体型号"] ||
          !results["采购企业"] ||
          !results["生产日期"] ||
          !results["出产日期"] ||
          !results["质保期"]
        ) {
          this.$message.error(t("batch.complete"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        if (
          resultObj[i + 1] &&
          results["电池组编号"] === resultObj[i + 1]["电池组编号"]
        ) {
          this.$message.error(t("batch.betteryCodeRepeat"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        if (
          !utils.checkDate(results["生产日期"]) ||
          !utils.checkDate(results["出产日期"]) ||
          !utils.checkDate(results["质保期"])
        ) {
          this.$message.warning(t("batch.timeFormatErr"));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
          return;
        }
        let ItemObj = {
          code: results["电池组编号"],
          model: results["电池组型号"],
          norm: results["电池组规格"],
          voltage: results["电池组额定电压"],
          capacity: results["电池组额定容量"],
          singleModel: results["电池单体型号"],
          subCompanyName: results["采购企业"],
          productionDate: utils.yyyymmdd(results["生产日期"]),
          manufacturerDate: utils.yyyymmdd(results["出产日期"]),
          qualityGuaranteeDate: utils.yyyymmdd(results["质保期"]),
          deviceCode: results["监测设备编号"] || ""
        };
        // ItemObj.companyName = results["生产企业"];
        // ItemObj.deviceCodes.push(results["编号"]);
        valuesObj.push(ItemObj);
      }
      this.fileUploadTo(valuesObj);
    },
    fixdata (data) {
      // 文件流转BinaryString
      let o = "";
      let l = 0;
      let w = 10240;
      for (; l < data.byteLength / w; l++) {
        o += String.fromCharCode.apply(
          null,
          /* eslint-disable */
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    fileUploadTo (data) {
      this.$api.batteryUpLoadAll(data).then(res => {
        console.log(res);
        this.fullscreenLoading = false;
        if (res.data && res.data.code === 0) {
          this.$message.success(t("successTips.batchSuccess"));
          this.eventUpload.value = "";
          this.getBatteryList();
        } else {
          if (this.eventUpload) {
            this.eventUpload.value = "";
          }
        }
      });
    },
    recovery () {
      this.$router.push("/battery/defriend");
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCommand (command) {
      this.addType = command;
      // this.modelForm.value = "";
      if (command === "addBattery") {
        this.$store.commit("triggerAddBattery");
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
    /* 获取电池型号列表 */
    getBatteryModelList () {
      this.$api.batteryModelList().then(res => {
        console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          this.Modeloptions = res.data.data;
          // console.log(utils);
          utils.setStorage("Modeloptions", JSON.stringify(res.data.data));
          this.$store.commit(
            "SETGroupModelOpts",
            JSON.stringify(res.data.data)
          );
        }
      });
    },
    /* 获取电池组规格列表 */
    getGroupSpecif () {
      this.$api.batteryGroupSpecif().then(res => {
        console.log("电池组规格", res);
        if (res.data && res.data.code === 0) {
          this.$store.commit(
            "SETbatGroupSpecifOpts",
            JSON.stringify(res.data.data)
          );
        }
      });
    },
    /* 获取电池单体型号列表 */
    getSinglBattery () {
      this.$api.batterySingleModel().then(res => {
        console.log("电池单体型号", res);
        if (res.data && res.data.code === 0) {
          this.$store.commit(
            "SETsingleBatteryOpts",
            JSON.stringify(res.data.data)
          );
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
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
</style>
