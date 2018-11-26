<template>
  <div>
    <!-- <div class="items"
      v-if="AdminRoles.AddBatteries">
      <add-battery></add-battery>
    </div> -->
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

  </div>
</template>

<script>
/* eslint-disable */
import XLSX from "xlsx";
import { mapActions } from 'vuex'
import t from "@/utils/translate";
import permissionFun from "@/utils/valated";
import utils from "@/utils/utils";
// import addBattery from './addBattery';

let wb; // 读取完成的数据
let rABS = false; // 是否将文件读取为二进制字符串
export default {
  // components: {
  //   addBattery
  // },
  data () {
    return {
      AdminRoles: permissionFun(),
      fullscreenLoading: false,
      addModel: false,
      titles: "",
    };
  },
  mounted () {
    this.getGroupSpecif(); // 获取电池规格列表
    this.getSinglBattery(); // 获取电池单体型号列表
    this.getBatteryModelList(); // 获取电池型号列表
  },

  methods: {
    ...mapActions({
      getGroupSpecif: 'monitor/getBatterySpecif',
      getSinglBattery: 'monitor/getbatterySingleModel',
      getBatteryModelList: 'monitor/getBatteryModelList',
    }),
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
