<template>
  <div class="addWarrp">
    <div v-for="key in userData"
      class="addBox"
      :key="key.role"
      @click="adduser(key)">
      <img :src="key.default" />
      <!-- <img src="../../../static/img/add-admin.png"
        alt=""
        srcset=""> -->
      <p>{{key.text}}</p>
    </div>
    <el-dialog width="600px"
      :title="userText"
      :visible.sync="custom">
      <el-form :model="adminForm"
        :rules="customerRules"
        ref="adminForm">
        <el-row :gutter="40">
          <el-col :span="12">
            <!-- 用户名 -->
            <el-form-item :label="$t('useMsg.name')"
              prop="account">
              <el-input v-model.trim="adminForm.account"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 登陆密码 -->
            <el-form-item :label="$t('useMsg.loginPwd')"
              prop="password">
              <el-input v-model.trim="adminForm.password"
                type="password"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.phone')"
              prop="phone">
              <el-input v-model="adminForm.phone"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.email')"
              prop="email">
              <el-input v-model="adminForm.email"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <!-- 重置 -->
        <el-button @click="resetAdmin('adminForm')">{{$t('timeBtn.reset')}}</el-button>
        <!-- 确 认 -->
        <el-button :loading="addcustorm"
          @click="submitAdmin('adminForm')"
          type="primary">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px"
      :title="userText"
      :visible.sync="manfictor">
      <el-form :model="CreateCompanyForm"
        :rules="customerRules"
        ref="CompanyForm">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.name')"
              prop="account">
              <el-input v-model.trim="CreateCompanyForm.account"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.loginPwd')"
              prop="password">
              <el-input v-model.trim="CreateCompanyForm.password"
                type="password"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.phone')"
              prop="phone">
              <el-input v-model="CreateCompanyForm.phone"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.email')"
              prop="email">
              <el-input v-model="CreateCompanyForm.email"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.enterpriseName')"
              prop="companyName">
              <el-input v-model.trim="CreateCompanyForm.companyName"
                auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('useMsg.projetName')"
              prop="projetName">
              <el-select v-model="CreateCompanyForm.projetName"
                style="width: 260px"
                multiple
                placeholder="请选择">
                <el-option v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
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
        <el-button @click="resetCompany">{{$t('timeBtn.reset')}}</el-button>
        <el-button :loading="addadmin"
          @click="submitCompany('CompanyForm')"
          type="primary">{{$t('timeBtn.sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import t from '@/utils/translate';
import addData from './add-user-data';

export default {
  data() {
    return {
      userText: '',
      manfictor: false,
      custom: false,
      addcustorm: false,
      addadmin: false,
      userData: [],
      adminForm: {},
      CreateCompanyForm: {},
      options: [{
        value: 'monitor',
        label: '电池检测',
      }, {
        value: 'track',
        label: '电池定位追踪',
      }],
      customerRules: {
        account: [
          { required: true, message: t('useMsg.warn.userName'), trigger: 'change' },
          { min: 4, message: t('useMsg.warn.nameLimit'), trigger: 'change' },
        ],
        password: [
          { required: true, message: t('useMsg.warn.password'), trigger: 'change' },
          { min: 3, max: 10, message: t('password.passwordLimit'), trigger: 'change' },
        ],
        phone: [
          { required: true, message: t('useMsg.warn.phone'), trigger: 'change' },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: t('useMsg.warn.phoneCheck'),
            trigger: 'change',
          },
        ],
        companyName: [
          { required: true, message: t('useMsg.warn.enterprise'), trigger: 'change' },
        ],
        email: [
          { required: false, message: '', trigger: 'change' },
          { type: 'email', message: t('useMsg.warn.emailCheck'), trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    this.userLimit();
  },

  methods: {
    userLimit() {
      const loginData = sessionStorage.getItem('loginData');
      if (!loginData) {
        this.$router.push('/login');
        return;
      }
      const getLayerName = JSON.parse(loginData);
      // console.log(getLayerName);
      let UserLimet;
      if (
        getLayerName.layerName === '平台' &&
        (getLayerName.type === 1 || getLayerName.type === 3)
      ) {
        UserLimet = addData.getPlat();
      }
      if (getLayerName.layerName === '生产企业' && getLayerName.type === 2) {
        UserLimet = addData.getProduct();
      }
      if (getLayerName.layerName === '采购企业' && getLayerName.type === 2) {
        UserLimet = addData.getCreateUser();
      }
      this.userData = JSON.parse(JSON.stringify(UserLimet));
      this.userData.forEach((key) => {
        key.text = t(`${key.text}`);
      });
      console.log(this.userData);
    },
    adduser(key) {
      this.userText = key.text;
      this.addType = key.role;
      if (key.role > 2) {
        this.custom = true;
      } else {
        this.manfictor = true;
      }
    },
    resetAdmin(formName) {
      this.$refs[formName].resetFields();
      this.adminForm = {};
    },
    submitAdmin(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            account: this.adminForm.account,
            password: this.adminForm.password,
            phone: this.adminForm.phone,
            email: this.adminForm.email,
            isCreator: 0,
          };
          this.addcustorm = true;
          this.$api.createUser(params).then((res) => {
            console.log(res);
            this.addcustorm = false;
            if (res.data && res.data.code === 0) {
              this.$message({
                type: 'success',
                message: t('successTips.addSuccess'), // "创建成功"
              });
              this.$emit('hasCreated', { value: true });
              this.custom = false;
            }
          });
        }
      });
    },
    resetCompany() {
      console.log(this);
      this.$refs.CompanyForm.resetFields();
      // this.CreateCompanyForm = {};
    },
    submitCompany() {
      this.$refs.CompanyForm.validate((valid) => {
        if (valid) {
          const params = {
            account: this.CreateCompanyForm.account,
            password: this.CreateCompanyForm.password,
            phone: this.CreateCompanyForm.phone,
            email: this.CreateCompanyForm.email,
            companyName: this.CreateCompanyForm.companyName,
            isCreator: 1,
          };
          this.addadmin = true;
          if (this.addType === '1') {
            this.$api.createCompany(params).then((res) => {
              console.log(res);
              this.addadmin = false;
              if (res.data && res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: t('successTips.addSuccess'), // "创建成功"
                });
                this.$emit('hasCreated', { value: true });
                this.manfictor = false;
              }
            });
          }
          if (this.addType === '2') {
            params.isCreator = 0;
            this.$api.createPurchaser(params).then((res) => {
              console.log(res);
              this.addadmin = false;
              if (res.data && res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: t('successTips.addSuccess'), // "创建成功"
                });
                this.$emit('hasCreated', { value: true });
                this.manfictor = false;
              }
            });
          }
        }
      });
    },
  },
};

</script>
<style lang='scss' scoped>
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
</style>
