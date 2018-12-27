<template>
  <div class="userMsg">
    <div class="editorBtn">
      <!-- 编辑 -->
      <el-button size="small" type="primary" @click="openEdit" class="editorContent">{{$t('user.edit')}}</el-button>
      <!-- 编辑 -->
      <el-button size="small" type="primary" @click="openCompanyEdit" class="editorContent">修改公司名</el-button>
    </div>
    <div class="center">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 昵称 -->
              <p class="tips">{{$t('useMsg.nickName')}}</p>
              <p class="gridInput">{{userArr.nickName}}</p>
              <!-- <el-input v-model="userArr.userName" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 账户身份 -->
              <p class="tips">{{$t('useMsg.accountIdentity')}}</p>
              <p class="gridInput">{{userArr.accountType}}</p>
              <!-- <el-input v-model="userArr.userRole" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 企业身份 -->
              <p class="tips">{{$t('useMsg.companyIdentity')}}</p>
              <p class="gridInput">{{userArr.layerName}}</p>
              <!-- <el-input v-model="userArr.enterpriseRole" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="center">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 企业名称 -->
              <p class="tips">{{$t('useMsg.enterpriseName')}}</p>
              <p class="gridInput">{{userArr.companyName}}</p>
              <!-- <el-input v-model="userArr.enterpriseName" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 手机号码 -->
              <p class="tips">{{$t('useMsg.phone')}}</p>
              <p class="gridInput">{{userArr.phone}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <!-- 邮箱 -->
              <p class="tips">{{$t('useMsg.email')}}</p>
              <p class="gridInput">{{userArr.email}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="600px" :title="$t('user.userInfo')" :visible.sync="userMsgBox">
      <el-form :model="InfoForm" label-width="150px" :rules="userInfoRole" ref="InfoForm">
        <el-form-item :label="$t('useMsg.phone')" prop="phone">
          <el-input size="small" v-model.number="InfoForm.phone" style="width:160px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('useMsg.nickName')" :error="nameError" prop="userName">
          <el-input size="small" v-model="InfoForm.nickName" style="width:160px;"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item :label="$t('useMsg.email')" prop="email">
          <el-input size="small" v-model="InfoForm.email" style="width:160px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm">{{$t('timeBtn.cancle')}}</el-button>
        <el-button size="small" type="primary" @click="submitForm('InfoForm')">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="修改公司名" :visible.sync="companyMsgBox">
      <el-form :model="InfoForm" label-width="150px" :rules="userInfoRole" ref="InfoForm">
        <el-form-item label="公司名" prop="phone" :error="errorCompanyName">
          <el-input size="small" v-model.trim="InfoForm.companyName" @keyup.native="InfoForm.companyName=InfoForm.companyName.replace(/\s+/g,'')" style="width:160px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm">{{$t('timeBtn.cancle')}}</el-button>
        <el-button size="small" type="primary" @click="doChangeCompanyName('InfoForm')">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/utils/utils';
import { deepClone } from '@/utils/functions';
import t from '@/utils/translate';

export default {
  data() {
    return {
      userMsgBox: false,
      companyMsgBox: false,
      errorCompanyName: '',
      userArr: {},
      InfoForm: {},
      nameError: '',
      userInfoRole: {
        phone: [
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: t('useMsg.warn.phoneCheck'),
            trigger: ['change', 'blur'],
          },
        ],
        userName: [],
        email: [
          {
            type: 'email',
            message: t('useMsg.warn.emailCheck'),
            trigger: ['change', 'blur'],
          },
        ],
      },
    };
  },
  methods: {
    openEdit() {
      this.userMsgBox = true;
      this.InfoForm = deepClone(this.userArr);
    },
    openCompanyEdit() {
      this.companyMsgBox = true;
      this.InfoForm = deepClone(this.userArr);
    },
    closeMsgBox(formName) {
      this.userMsgBox = false;
      this.companyMsgBox = false;
      this.InfoForm = {};
      this.$refs[formName].resetFields();
    },
    doChangeCompanyName() {
      if (!this.InfoForm.companyName) {
        this.errorCompanyName = '公司名不能为空';
        return;
      }
      this.errorCompanyName = '';
      const params = {
        id: this.InfoForm.companyId,
        name: this.InfoForm.companyName,
      };
      this.$api.companyName(params).then((res) => {
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.changeSuccess'), // "修改成功"
          });
          this.init();
          this.closeMsgBox('InfoForm');
        }
      });
    },
    resetForm() {
      this.userMsgBox = false;
      this.companyMsgBox = false;
      this.$refs.InfoForm.resetFields();
    },
    submitForm() {
      this.$refs.InfoForm.validate((valid) => {
        if (valid) {
          const userObj = {};
          console.log('this.InfoForm', this.InfoForm);
          if (this.InfoForm.phone !== this.userArr.phone) {
            userObj.phone = this.InfoForm.phone;
          }
          if (this.InfoForm.email !== this.userArr.email) {
            userObj.email = this.InfoForm.email;
          }
          userObj.nickName = this.InfoForm.nickName;
          // userObj.email = this.InfoForm.email;
          if (JSON.stringify(userObj) !== '{}') {
            this.$api.changeUserMsg(userObj).then((res) => {
              console.log(res);
              if (res.data && res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: t('successTips.changeSuccess'), // "修改成功"
                });
                this.init();
                this.closeMsgBox('InfoForm');
              }
            });
          }
        }
      });
    },
    init() {
      this.$api.getUserMsg().then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.userArr = res.data.data;
          this.$store.commit('SETuserData', res.data.data);
          utils.setStorage('loginData', JSON.stringify(res.data.data));
          this.userArr.accountType = utils.accountType(this.userArr.type);
          this.userArr.email = res.data.data.email || '';
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.userMsg {
  padding: 20px 20px 30px;
  border-radius: 5px;
}
.transition-box {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 89;
}
.center {
  background: #ffffff;
  padding: 10px 0 30px;
}
.sort-content {
  width: 200px;
  margin: 0 auto;
}
.tips {
  color: #484848;
  font-size: 14px;
  line-height: 24px;
}
.editorBtn {
  padding: 10px;
  background: #ffffff;
  text-align: right;
}
.gridInput {
  background-color: #f2f2f2;
  color: #484848;
  width: 200px;
  height: 32px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 32px;
  text-indent: 8px;
  cursor: not-allowed;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.box {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 600px;
  height: auto;
  padding-bottom: 5px;
  border-radius: 4px;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
  z-index: 98;
}
.box-head {
  overflow: hidden;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #cccccc;
}
.box-head h3 {
  float: left;
  margin-left: 11px;
  color: #606266;
  font-weight: 400;
  font-size: 16px;
}
.box-head i {
  float: right;
  display: block;
  font-size: 18px;
  margin-top: 11px;
  margin-right: 11px;
  cursor: pointer;
}
.formWarrp {
  padding-top: 30px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 30px;
}
</style>
