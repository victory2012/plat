<template>
  <div>
    <div v-if="manufacturerName"
      class="items"
      @click="regDialog">
      <img src="../../../assets/img/device_reg.png"
        alt="">
      <p>{{$t('device.regDevice')}}</p>
      <!-- 设备注册 -->
    </div>
    <div v-if="manufacturerName"
      class="items"
      style="position: relative">
      <input class="fileUpload"
        type="file"
        @change="fileUpload"
        v-loading.fullscreen.lock="fullscreenLoading" />
      <img src="../../../assets/img/device_import.png"
        alt="">
      <p>{{$t('batteryList.batchImport')}}</p>
      <!-- 批量导入 -->
    </div>
    <div v-if="manufacturerName"
      class="items">
      <router-link to="/device/defriend">
        <img src="../../../assets/img/device_recover.png"
          alt="">
        <p>{{$t('menu.defriend')}}</p>
        <!-- 恢复拉黑设备 -->
      </router-link>
    </div>
    <!-- 设备注册 -->
    <el-dialog :title="$t('device.regDevice')"
      width="600px"
      :visible.sync="regDevice">
      <el-form :model="regform"
        :rules="regRules"
        ref="regform">
        <!-- 设备编号 -->
        <el-form-item prop="name"
          :label="$t('device.deviceCode')"
          label-width="150px">
          <el-input style="width:200px;"
            size="small"
            v-model.trim="regform.name"
            :placeholder="$t('device.deviceCode')"
            auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="deviceType"
          :label="$t('device.deviceCategory')"
          :label-width=" '150px' ">
          <el-select style="width:200px;"
            size="small"
            v-model="regform.deviceType "
            :placeholder="$t('device.deviceCategory')">
            <!-- 设备类别 -->
            <el-option v-for="item in categoryArr"
              :key="item.name"
              :label="item.label"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 相关企业 -->
        <el-form-item prop="company"
          :label="$t('device.company')"
          :label-width=" '150px' ">
          <el-select style="width:200px;"
            size="small"
            v-model="regform.company "
            :placeholder="$t('device.company')">
            <el-option v-for="item in companyArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="resetRegform('regform')">{{$t('timeBtn.cancle')}}</el-button>
        <el-button :loading="createDevice"
          size="small"
          type="primary "
          @click="submitRegForm('regform')">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import XLSX from "xlsx";
import utils from "@/utils/utils";
import { mapGetters } from "vuex";
import t from "@/utils/translate";

let wb; // 读取完成的数据
let rABS = false; // 是否将文件读取为二进制字符串
export default {
  data () {
    return {
      manufacturerName: true,
      regDevice: false,
      storge: '',
      createDevice: false,
      fullscreenLoading: false,
      regform: {},
      categoryArr: [],
      // companyArr: [],
      regRules: {
        name: [
          { required: true, message: t('addDevice.errorTip'), trigger: "change" } // 请输入设备编号
        ],
        deviceType: [
          { required: true, message: t('device.deviceCategory'), trigger: "change" } // 请选择设备类别
        ],
        company: [{ required: true, message: t('device.selectCampany'), trigger: "change" }] // 请选择企业
      },
    };
  },
  computed: {
    ...mapGetters({
      companyArr: 'monitor/GETManufacturer',
      userData: 'getloginData'
    }),
  },
  mounted () {
    // this.storge = JSON.parse(utils.getStorage("loginData"));
    if (
      this.userData.type === 1 ||
      (this.userData.type === 3 && this.userData.layerName === "平台")
    ) {
      this.manufacturerName = true;
      this.getCompany();
    }
  },

  methods: {
    /* 获取添加的设备属于哪个项目 */
    getCompany () {
      this.$api.deviceCategory().then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.categoryArr = [];
          result.forEach(key => {
            if (key.id === 1) {
              key.label = t('device.batteryGps'); // "电池追踪";
            }
            if (key.id === 2) {
              key.label = t('device.batteryMonitor'); // "电池监测";
            }
            this.categoryArr.push(key);
          });
        }
      });
    },
    resetRegform (form) {
      this.regDevice = false;
      this.$refs[form].resetFields();
    },
    submitRegForm (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.createDevice = true;
          let category;
          let companyName;
          this.categoryArr.forEach(key => {
            if (key.id === this.regform.deviceType) {
              category = key.name;
            }
          });
          this.companyArr.forEach(key => {
            if (key.id === this.regform.company) {
              companyName = key.name;
            }
          });
          let deviceObj = {
            code: this.regform.name, // 设备编号
            companyId: this.regform.company, // 公司id
            categoryId: this.regform.deviceType,
            companyName: companyName,
            category: category
          };
          this.$api.deviceAdd(deviceObj).then(res => {
            console.log(res);
            this.createDevice = false;
            if (res.data && res.data.code === 0) {
              this.$message({
                type: "success",
                message: t('successTips.regDevice') // "设备注册成功"
              });
              this.getDeviceList();
              this.regDevice = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    regDialog () {
      this.regDevice = true;
    },
    fileUpload (event) {
      console.log(event);
      this.fullscreenLoading = true;
      this.eventUpload = event.target;
      let obj = event.target;
      if (!obj.files) {
        this.fullscreenLoading = false;
        this.eventUpload.value = "";
        return;
      }
      const IMPORTFILE_MAXSIZE = 1 * 1024; // 这里可以自定义控制导入文件大小
      let suffix;
      if (obj.files[0].name) {
        suffix = obj.files[0].name.split(".")[1];
      }

      if (suffix !== "xls" && suffix !== "xlsx") {
        this.$message({
          type: "error",
          message: t('batch.formatErr') // "请导入xls格式或者xlsx格式"
        });
        this.eventUpload.value = "";
        this.fullscreenLoading = false;
        return;
      }
      if (obj.files[0].size / 1024 > IMPORTFILE_MAXSIZE) {
        this.$message({
          type: "error",
          message: t('batch.volumeErr') // "导入的表格文件不能大于1M"
        });
        this.fullscreenLoading = false;
        this.eventUpload.value = "";
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
        console.log(resultObj);
        if (resultObj.length < 1) {
          // "上传的文件内容为空，请检查文件"
          this.$message.error(t('batch.nodata'));
          this.eventUpload.value = "";
          this.fullscreenLoading = false;
        } else {
          let ZhTemp = resultObj[0].Device_Id ? false : true;
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
      let valuesObj = [];
      for (let i = 0; i < resultObj.length; i++) {
        let results = resultObj[i];
        console.log(results);
        if (!results.Device_Id || !results.Manufacturer) {
          this.$message.error(t('batch.complete')); // "生产企业或设备编号不能为空，请检查文件"
          this.fullscreenLoading = false;
          return;
        }
        if (
          resultObj[i + 1] &&
          results.Manufacturer === resultObj[i + 1].Manufacturer
        ) {
          this.$message.error(t('batch.betteryCodeRepeat')); // "设备编号不能重复，请检查文件"
          this.fullscreenLoading = false;
          return;
        }
        let ItemObj = {
          companyName: "",
          deviceCodes: []
        };
        ItemObj.companyName = results.Device_Id;
        ItemObj.deviceCodes.push(results.Manufacturer);
        valuesObj.push(ItemObj);
      }
      // console.log(valuesObj);
      this.fileUploadTo(valuesObj);
    },
    ZHuploadDataCheck (resultObj) {
      let valuesObj = [];
      for (let i = 0; i < resultObj.length; i++) {
        let results = resultObj[i];
        console.log(results);
        if (!results["生产企业"] || !results["编号"]) {
          this.$message.error(t('batch.complete')); // "生产企业或设备编号不能为空，请检查文件"
          this.fullscreenLoading = false;
          this.eventUpload.value = "";
          return;
        }
        if (
          resultObj[i + 1] &&
          results["编号"] === resultObj[i + 1]["编号"]
        ) {
          this.$message.error(t('batch.betteryCodeRepeat')); // "设备编号不能重复，请检查文件"
          this.fullscreenLoading = false;
          this.eventUpload.value = "";
          return;
        }
        let ItemObj = {
          companyName: "",
          deviceCodes: []
        };
        ItemObj.companyName = results["生产企业"];
        ItemObj.deviceCodes.push(results["编号"]);
        valuesObj.push(ItemObj);
      }
      // console.log(valuesObj);
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
      this.$api.deviceBatchAdd(data).then(res => {
        console.log(res);
        this.fullscreenLoading = false;
        if (res.data && res.data.code === 0) {
          this.$message.success(t('successTips.batchSuccess'));
          this.getDeviceList();
        } else {
          if (this.eventUpload) {
            this.eventUpload.value = "";
          }
        }
      });
    },
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
  a {
    color: #484848;
  }
  img {
    margin-bottom: 8px;
  }
}
</style>
