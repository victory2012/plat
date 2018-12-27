<template>
  <div class="login">
    <div class="img">
      <img src="../assets/img/login-bg.svg" alt="">
    </div>
    <div class="item">
      <div class="form">
        <el-tabs v-model="activeName" :stretch="true">
          <el-tab-pane :label="$t('loginMsg.labelAccPass')" name="accPwd">
            <el-form label-position="top" :rules="LoginRules" ref="LoginForm" label-width="80px" :model="LoginForm">
              <el-form-item :label="$t('loginMsg.accountPlace')" prop="account">
                <el-input v-model="LoginForm.account"></el-input>
              </el-form-item>
              <el-form-item :label="$t('loginMsg.passwordPlace')" prop="password">
                <el-input type="password" v-model="LoginForm.password" @keyup.enter.native="accountLogin('LoginForm')"></el-input>
              </el-form-item>
              <template>
                <!-- 记住账户密码 -->
                <el-checkbox v-model="checked">{{$t('loginMsg.RememberPassword')}}</el-checkbox>
              </template>
              <el-form-item>
                <el-button :loading="getloginLoading" type="primary" class="accpwsBtn" @click="accountLogin('LoginForm')" round>{{$t('loginMsg.loginBtn')}}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('loginMsg.labelSmsCode')" name="SMScode">
            <el-form label-position="top" :rules="phoneRules" ref="smsPhone" label-width="80px" :model="smsForm">
              <el-form-item :label="$t('loginMsg.phone')" prop="phone">
                <el-input v-model="smsForm.phone"></el-input>
              </el-form-item>
              <el-form-item :label="$t('loginMsg.smsCode')" class="smsCode" prop="smsCode">
                <el-input v-model="smsForm.smsCode" @keyup.enter.native="getSmsCode"></el-input>
                <el-button class="getSms" @click="getSmsCode" :disabled="hasGetSms" type="primary" plain>{{smsMsg}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :loading="getloginLoading" type="primary" class="accpwsBtn" @click="checkSmsCode" round>{{$t('loginMsg.loginBtn')}}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="changeLangue">
        <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
          <span class="el-dropdown-link cursor">
            {{localLanguge}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
            <el-dropdown-item divided command="en" :disabled="$i18n.locale === 'en'">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import * as qiniu from 'qiniu';
import t from '@/utils/translate';

export default {
  data () {
    return {
      checked: true,
      getloginLoading: false,
      localLanguge: '',
      hasGetSms: false,
      smsMsg: t('loginMsg.getSmsCode'),
      activeName: 'accPwd',
      smsForm: {
        phone: '',
        smsCode: '',
      },
      accountRules: {

      },
      phoneRules: {
        phone: [
          {
            required: true,
            message: t('loginMsg.errorMsg.phoneNub'),
            trigger: 'change',
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: t('loginMsg.errorMsg.checkPhone'),
            trigger: 'change',
          },
        ],
        smsCode: [
          {
            required: true,
            message: t('loginMsg.errorMsg.smsCodeErr'),
            trigger: 'blur',
          },
        ],
      },
      LoginForm: {},
      LoginRules: {
        account: [
          {
            required: true,
            message: t('loginMsg.errorMsg.account'),
            trigger: 'blur',
          }, {
            min: 4,
            max: 20,
            message: '用户名长度为4~20',
            trigger: 'blur'
          }, {
            pattern: /^[a-zA-Z0-9]\\w{3,19}$/,
            message: '用户名格式有误',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: t('loginMsg.errorMsg.password'),
            trigger: 'blur',
          }, {
            min: 6,
            max: 20,
            message: '密码长度为6~20',
            trigger: 'blur'
          }, {
            pattern: /^[a-zA-Z0-9][a-zA-Z0-9!@#$%^&*]{5,19}$/,
            message: '密码格式有误',
            trigger: 'change'
          }
        ],
      },
    };
  },
  created () {
    console.log('qiniu ===>>> ', qiniu);
    const locallanguage = localStorage.getItem('locale');
    if (locallanguage) {
      this.localLanguge = locallanguage === 'zh' ? '中文' : 'English';
    } else {
      let currentLang = navigator.language; // 判断除IE外其他浏览器使用语言
      if (!currentLang) {
        // 判断浏览器使用语言
        currentLang = navigator.browserLanguage;
      }
      if (currentLang === 'zh-CN') {
        this.localLanguge = '中文';
        localStorage.setItem('locale', 'zh');
        this.$i18n.locale = 'zh';
      } else {
        this.localLanguge = 'English';
        localStorage.setItem('locale', 'en');
        this.$i18n.locale = 'en';
      }
    }
  },
  methods: {
    accountLogin (LoginForm) {
      this.$refs[LoginForm].validate((valid) => {
        if (valid) {
          this.getloginLoading = true;
          const person = {
            account: this.LoginForm.account,
            password: this.LoginForm.password,
          };
          // this.$store.dispatch('Login', person);
          this.$api.login(person).then((res) => {
            console.log(res);
            this.getloginLoading = false;
            if (res.data && res.data.code === 0) {
              const userData = res.data.data;
              sessionStorage.setItem('token', res.headers.token);
              sessionStorage.setItem('loginData', JSON.stringify(userData));
              this.$store.commit('setUserData', userData);
              this.getPermission(userData);
              if (this.checked) {
                var storage = { "account": person.account, "password": person.password };
                var userInfo = JSON.stringify(storage);
                localStorage.setItem("user", userInfo);
              }
            }
          });
        }
      });
    },
    getSmsCode () {
      this.$refs.smsPhone.validateField('phone', (opts) => {
        console.log(opts);
        if (opts === '' || opts === undefined || opts === null) {
          let conut = 60;
          this.$api.SMScode({ phone: this.smsForm.phone }).then((res) => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              this.hasGetSms = true;
              const Timer = setInterval(() => {
                conut--;
                this.smsMsg = `${conut}s`;
                if (conut < 1) {
                  this.smsMsg = t('loginMsg.getSmsCode');
                  this.hasGetSms = false;
                  clearInterval(Timer);
                }
              }, 1000);
              this.$message({
                type: 'success',
                message: this.$t('loginMsg.smsSuccess'),
              });
            }
          });
        }
      });
    },
    getPermission (data) {
      /* 根据公司ID 获取公司权限 */
      this.$api.getCompanyRole(data.companyId).then((companyRole) => {
        console.log('company role', companyRole);
        if (companyRole.data && companyRole.data.code === 0) {
          /* 获取个人的权限 */
          this.$api.permissions(data.id).then((opts) => {
            if (opts.data && opts.data.code === 0) {
              const permission = opts.data.data;
              sessionStorage.setItem('setUserRole', permission);
              this.$store.commit(
                'setUserPremission',
                permission,
              );
              this.$router.push('/main');
            }
          });
        }
      });
    },
    checkSmsCode () {
      this.$refs.smsPhone.validate((valid) => {
        if (valid) {
          this.getloginLoading = true;
          const phoneObj = {
            phone: this.smsForm.phone,
            code: this.smsForm.smsCode,
          };
          this.$api.SMSVertify(phoneObj).then((res) => {
            console.log(res);
            this.getloginLoading = false;
            if (res.data && res.data.code === 0) {
              const userData = res.data.data;
              sessionStorage.setItem('token', res.headers.token);
              sessionStorage.setItem('loginData', JSON.stringify(userData));
              this.$store.commit('setUserData', userData);
              this.getPermission(userData);
            }
          });
        }
      });
    },
    handleCommand (cammand) {
      if (cammand === 'zh') {
        this.localLanguge = '中文';
        this.$i18n.locale = 'zh';
        localStorage.setItem('locale', 'zh');
      }
      if (cammand === 'en') {
        this.localLanguge = 'English';
        this.$i18n.locale = 'en';
        localStorage.setItem('locale', 'en');
      }
      this.smsMsg = t('loginMsg.getSmsCode');
      this.LoginRules = {
        account: [
          {
            required: true,
            message: this.$t('loginMsg.errorMsg.account'),
            trigger: 'blur',
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('loginMsg.errorMsg.password'),
            trigger: 'blur',
          }
        ],
      };
      this.phoneRules = {
        phone: [
          {
            required: true,
            message: this.$t('loginMsg.errorMsg.phoneNub'),
            trigger: 'change',
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t('loginMsg.errorMsg.checkPhone'),
            trigger: 'change',
          },
        ],
        smsCode: [
          {
            required: true,
            message: this.$t('loginMsg.errorMsg.smsCodeErr'),
            trigger: 'blur',
          },
        ],
      };
    },
  },
  created () {
    if (localStorage.getItem('user')) {
      var userInfo = JSON.parse(localStorage.getItem('user'))
      this.LoginForm.account = userInfo.account
      this.LoginForm.password = userInfo.password
    }
  }
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.login {
  height: 100%;
  padding: 10%;
  display: flex;
  // min-width: 1314px;
  // min-height: 586px;
  // overflow: hidden;
  // overflow-x: auto;
  box-sizing: border-box;
  .img {
    // float: left;
    flex: 0 0 65%;
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
      // min-width: 600px;
    }
  }
  .item {
    position: relative;
    // float: left;
    flex: 1;
    // width: 35%;
    min-width: 375px;
    height: 100%;
    min-height: 540px;
    background: rgba(113, 191, 219, 0.2);
    border-radius: 10px;
    .form {
      font-size: 14px;
      min-width: 310px;
      max-width: 390px;
      width: 80%;
      margin: 120px auto;
      .smsCode {
        .el-input {
          width: 50%;
        }
        .getSms {
          float: right;
        }
      }
    }
    .changeLangue {
      position: absolute;
      top: 30px;
      right: 40px;
    }
  }
  .el-tab-pane {
    padding-top: 60px;
  }
  .accpwsBtn {
    margin-top: 20px;
    font-size: 14px;
    width: 156px;
    height: 45px;
    border-radius: 10px;
    text-align: center;
    touch-action: manipulation;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    background: #71bfdb;
  }
}
@media screen and (min-width: 1420px) {
  .login {
    padding: 120px;
    .img {
      img {
        width: 70%;
      }
    }
  }
}
@media screen and (max-width: 1420px) {
  .img {
    img {
      width: 580px;
    }
  }
  .login .el-tab-pane {
    padding-top: 30px;
  }
  .login .item .form {
    margin: 100px auto;
  }
}
</style>
