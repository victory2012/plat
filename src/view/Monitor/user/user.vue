<template>
  <div class="alarmTable">
    <adduser-info @hasCreated="reloadData"></adduser-info>
    <!-- <div class="addWarrp">
      <div @click="adduser(index, key)"
        v-for="(key, index) in userData"
        class="addBox"
        :key="key.role">
        <img src="../../../static/img/add-admin.png"
          alt=""
          srcset="">
        <p>{{key.text}}</p>
      </div>
    </div> -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <!-- 用户名 -->
      <el-table-column prop="account" align="center" :label="$t('useMsg.name')">
      </el-table-column>
      <!-- 昵称 -->
      <el-table-column prop="nickName" align="center" :label="$t('useMsg.nickName')">
      </el-table-column>
      <!-- 账户身份 -->
      <el-table-column prop="role" align="center" :label="$t('useMsg.accountRole')">
      </el-table-column>
      <!-- 企业身份 -->
      <el-table-column prop="layerName" align="center" :label="$t('useMsg.enterpriseRole')">
      </el-table-column>
      <!-- 企业名称 -->
      <el-table-column prop="companyName" align="center" :label="$t('useMsg.enterpriseName')">
      </el-table-column>
      <!-- 手机号码 -->
      <el-table-column prop="phone" align="center" :label="$t('useMsg.phone')">
      </el-table-column>
      <!-- 邮箱 -->
      <el-table-column prop="email" align="center" :label="$t('useMsg.email')" width="240">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" :label="$t('batteryList.handle')" :width="width">
        <template slot-scope="scope">
          <!-- 修改权限 -->
          <el-button :disabled="!scope.row.changePermison" size="small" class="limite" @click.native.prevent="changeQuanxian(scope.row)" type="text">
            {{$t('useMsg.changeRole')}}
          </el-button>
          <!-- 删除 -->
          <el-button size="small" type="text" @click="secondary(scope.row)" :disabled="!scope.row.canNotDelete">{{$t('timeBtn.del')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <!-- 权限 -->
    <el-dialog :title="$t('useMsg.changeRole')" width="600px" :visible.sync="jurisdiction">
      <div>
        <ul class="jurisdiction-warrp">
          <li v-for="key in userRole" :key="key.id" class="jurisdiction-itme">
            <div class="pre">{{key.label}}</div>
            <div class="pre">
              <el-checkbox v-model="key.value"></el-checkbox>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- 取消 -->
        <el-button size="small" @click="jurisdiction = false">{{$t('timeBtn.cancle')}}</el-button>
        <el-button size="small" type="primary" @click="doChangeJur">{{$t('timeBtn.sure')}}</el-button>
        <!-- 确定 -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
// import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import permissionFun from "@/permision/monitor-valated";
import defaultPermision from "@/permision/Monitor-permision";
import t from "@/utils/translate";
import adduserInfo from "./addUser"
import defaultPerList from '@/utils/permisionList'

export default {
  components: {
    adduserInfo
  },
  data() {
    return {
      width: localStorage.getItem('locale') === 'en' ? 230 : 150,
      AdminRoles: permissionFun(),
      checked1: false,
      loading: true,
      jurisdiction: false, // 权限
      componentId: "",
      userData: [],
      clicked: "",
      total: 0,
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      showmanfictor: {
        show: false
      },
      userId: null,
      addType: null, // 添加公司的类型
      tableData: [],
      storge: "",
      userRole: []
    };
  },
  mounted() {
    this.storge = JSON.parse(utils.getStorage("loginData"));
    this.getUserList();
  },
  methods: {
    /* 删除按钮 */
    secondary(item) {
      console.log(item);
      if (item.type === 2) {
        this.deleteAdmin(item);
      }
      if (item.type === 3) {
        this.deleteUser(item);
      }
    },
    /* 删除用户 */
    deleteUser(item) {
      // 此操作将删除该用户, 是否继续?
      this.$messageBox
        .confirm(`${t('useMsg.delUserWarn')}`, `${t('loginMsg.tips')}`, {
          confirmButtonText: t('timeBtn.sure'), //"确定",
          cancelButtonText: t('timeBtn.cancle'), // "取消",
          type: "warning"
        })
        .then(() => {
          this.$api.deleteUser(item.id).then(res => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              this.$message({
                message: `${t('successTips.delSuccess')}`, // "删除成功",
                type: "success"
              });
              this.getUserList();
            }
          });
        }).catch((err) => {
          console.log(err)
        });
    },
    /* 刪除企业 */
    deleteAdmin(item) {
      // 此操作将删除该企业以及该企业下的所有用户, 是否继续?
      this.$messageBox
        .confirm(
          `${t('useMsg.delCompanyWarn')}`, `${t('loginMsg.tips')}`,
          {
            confirmButtonText: t('timeBtn.sure'), //"确定",
            cancelButtonText: t('timeBtn.cancle'), // "取消",
            type: "warning"
          }
        )
        .then(() => {
          this.$api.deleteCompany(item.id).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: `${t('successTips.delSuccess')}`, // "删除成功",
                type: "success"
              });
              this.getUserList();
            }
          });
        }).catch((err) => {
          console.log(err)
        });
    },
    /* 修改权限 -- 按钮 */
    changeQuanxian(item) {
      this.userRole = defaultPerList(item);
      console.log(item)
      this.userId = item.id;
      this.$api.permissions(item.id).then(res => {
        if (res.data && res.data.code === 0) {
          if (res.data.data !== null) {
            let permis = JSON.parse(res.data.data);
            let keys = Object.keys(permis);
            let values = Object.values(permis);
            this.userRole.forEach((key, index) => {
              keys.forEach(i => {
                if (key.id === i) {
                  key.value = values[index];
                }
              });
            });
          } else {
            let defaus;
            if (item.type === 2 && item.layerName === "采购企业") {
              defaus = defaultPermision.custormAdmin();
            }
            if (item.type === 3 && item.layerName === "采购企业") {
              defaus = defaultPermision.custormPer();
            }
            if (item.layerName === "生产企业") {
              defaus = defaultPermision.productPer();
            }
            let defaultValues = Object.keys(defaus);
            this.userRole.forEach(key => {
              defaultValues.forEach(item => {
                if (key.id === item) {
                  key.value = defaus[item];
                }
              });
            });
          }
          this.jurisdiction = !this.jurisdiction;
        }
      });
    },
    /* 修改权限 -- 方法 */
    doChangeJur() {
      let permission = {};
      this.userRole.forEach(key => {
        permission[key.id] = key.value;
      });
      let roleObj = {
        userId: this.userId,
        permission: JSON.stringify(permission)
      };
      this.$api.ChangePermissions(roleObj).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            message: t('successTips.changeSuccess'), // 修改成功
            type: "success"
          });
          this.jurisdiction = !this.jurisdiction;
        }
      });
    },
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },
    reloadData() {
      this.getUserList();
    },
    getUserList() {
      this.loading = true;
      let pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.$api.getUserList(pageObj).then(res => {
        console.log(res);
        this.loading = false;
        if (res.data && res.data.code === 0) {
          let result = res.data;
          this.tableData = [];
          this.total = result.data.total;
          // let storge = JSON.parse(utils.getStorage("loginData"));
          if (result.data.pageData.length > 0) {
            // console.log(this.AdminRoles);
            result.data.pageData.forEach(key => {
              key.role = utils.accountType(key.type);
              key.userType = this.AdminRoles.deleteAdmin;
              key.email = key.email || "-";
              if (this.storge.companyId === key.companyId && this.storge.type === key.type) {
                key.canNotDelete = false;
                key.changePermison = false;
              } else {
                key.changePermison = false;
                key.canNotDelete = false;
                if (key.layerName === "平台") {
                  key.changePermison = false;
                  key.canNotDelete = false;
                }
                if (this.storge.layerName === "平台" && key.type === 2 && key.layerName === "生产企业") {
                  key.canNotDelete = true;
                  key.changePermison = false;
                }
                if (this.storge.type === 2 && this.storge.layerName === "生产企业" && key.type === 2 && key.layerName === "采购企业") {
                  key.canNotDelete = true;
                  key.changePermison = true;
                }
                if (this.storge.type === 2 && this.storge.layerName === "生产企业" && key.type === 3 && key.layerName === "生产企业") {
                  key.canNotDelete = true;
                  key.changePermison = true;
                }
                if (this.storge.type === 2 && this.storge.layerName === "生产企业" && key.type === 2 && key.layerName === "采购企业") {
                  key.canNotDelete = true;
                  key.changePermison = true;
                }
                if (this.storge.type === 2 && this.storge.layerName === "采购企业" && key.type === 3 && key.layerName === "采购企业") {
                  key.changePermison = true;
                  key.canNotDelete = true;
                }
                if (this.storge.type === 3 && this.storge.layerName !== "生产企业" && key.type === 3 && key.layerName === "采购企业") {
                  key.changePermison = false;
                  key.canNotDelete = false;
                }
                if (this.storge.type === 3 && this.storge.layerName !== "平台") {
                  key.changePermison = false;
                  key.canNotDelete = false;
                }
              }
              this.tableData.push(key);
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  padding-top: 20px;
  text-align: right;
}
.alarmTable {
  padding: 24px;
  background: #ffffff;
  border-radius: 5px;
}
.addWarrp {
  display: flex;
  margin-bottom: 50px;
  .addBox {
    margin-right: 15px;
    padding: 8px;
    box-sizing: border-box;
    flex: 0 0 150px;
    height: 78px;
    text-align: center;
    border-radius: 6px;
    cursor: pointer;
    &.active {
      background: #71bfdb;
      color: #ffffff;
    }
    img {
      width: 28px;
      height: auto;
      margin-bottom: 8px;
    }
    p {
      font-size: 12px;
    }
  }
}
.jurisdiction-warrp {
  padding: 0 44px;
  .jurisdiction-itme {
    display: flex;
    justify-content: space-between;
    line-height: 38px;
    .pre {
      flex: 1;
      &:nth-child(2) {
        text-align: right;
      }
    }
  }
}
.el-button--text {
  margin-right: 10px;
}
</style>
