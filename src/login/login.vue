<template>
  <div class="login">
    <div class="img">
      <img src="../assets/img/login-bg.svg"
        alt="">
    </div>
    <div class="item">
      <div class="form">
        <el-tabs v-model="activeName"
          :stretch="true">
          <el-tab-pane :label="$t('loginMsg.labelAccPass')"
            name="accPwd">
            <el-form label-position="top"
              :rules="LoginRules"
              ref="LoginForm"
              label-width="80px"
              :model="LoginForm">
              <el-form-item :label="$t('loginMsg.accountPlace')"
                prop="account">
                <el-input v-model="LoginForm.account"></el-input>
              </el-form-item>
              <el-form-item :label="$t('loginMsg.passwordPlace')"
                prop="password">
                <!-- @keyup.enter.native="accountLogin('LoginForm')" -->
                <el-input type="password"
                  v-model="LoginForm.password"
                  @keyup.enter.native="accountLogin('LoginForm')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading="getloginLoading"
                  type="primary"
                  class="accpwsBtn"
                  @click="accountLogin('LoginForm')"
                  round>{{$t('loginMsg.loginBtn')}}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('loginMsg.labelSmsCode')"
            name="SMScode">
            <el-form label-position="top"
              :rules="phoneRules"
              ref="smsPhone"
              label-width="80px"
              :model="smsForm">
              <el-form-item :label="$t('loginMsg.phone')"
                prop="phone">
                <el-input v-model="smsForm.phone"></el-input>
              </el-form-item>
              <el-form-item :label="$t('loginMsg.smsCode')"
                class="smsCode"
                prop="smsCode">
                <el-input v-model="smsForm.smsCode"
                  @keyup.enter.native="getSmsCode"></el-input>
                <el-button class="getSms"
                  @click="getSmsCode"
                  :disabled="hasGetSms"
                  type="primary"
                  plain>{{smsMsg}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :loading="getloginLoading"
                  type="primary"
                  class="accpwsBtn"
                  @click="checkSmsCode"
                  round>{{$t('loginMsg.loginBtn')}}</el-button>
                <!-- <button @click.stop.prevent="checkSmsCode" class="accpwsBtn">登录</button> -->
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </div>
      <div class="changeLangue">
        <el-dropdown trigger="click"
          placement="bottom"
          @command="handleCommand">
          <span class="el-dropdown-link cursor">
            {{localLanguge}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="$i18n.locale === 'zh'"
              command="zh">中文</el-dropdown-item>
            <el-dropdown-item divided
              command="en"
              :disabled="$i18n.locale === 'en'">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import t from '@/utils/translate';

export default {
  data() {
    return {
      localLanguge: '',
      hasGetSms: false,
      smsMsg: t('loginMsg.getSmsCode'),
      activeName: 'accPwd',
      smsForm: {
        phone: '',
        smsCode: '',
      },
      // doLogin: false,
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
          },
        ],
        password: [
          {
            required: true,
            message: t('loginMsg.errorMsg.password'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['getloginLoading']),
  },
  created() {
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
    accountLogin(LoginForm) {
      this.$refs[LoginForm].validate((valid) => {
        if (valid) {
          this.$store.commit('setLoginLoading', true);
          const person = {
            account: this.LoginForm.account,
            password: this.LoginForm.password,
          };
          // this.$store.dispatch('Login', person);
          this.$api.login(person).then((res) => {
            console.log(res);
            this.doLogin = false;
            if (res.data && res.data.code === 0) {
              const userData = res.data.data;
              sessionStorage.setItem('token', res.headers.token);
              sessionStorage.setItem('loginData', JSON.stringify(userData));
              this.$store.commit('setUserData', userData);
              this.$api.permissions(res.data.data.id).then((opts) => {
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
        }
      });
    },
    getSmsCode() {
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
    checkSmsCode() {
      this.$refs.smsPhone.validate((valid) => {
        if (valid) {
          this.doLogin = true;
          const phoneObj = {
            phone: this.smsForm.phone,
            code: this.smsForm.smsCode,
          };
          this.$api.SMSVertify(phoneObj).then((res) => {
            console.log(res);
            this.doLogin = false;
            if (res.data && res.data.code === 0) {
              this.$store.commit('setTokenStorage', res.headers.token);
              this.$store.commit('setStorage', JSON.stringify(res.data.data));
              this.$api.permissions(res.data.data.id).then((opts) => {
                if (opts.data && opts.data.code === 0) {
                  this.$store.commit(
                    'setUserRole',
                    JSON.stringify(opts.data.data),
                  );
                  this.$router.push('/overview');
                }
              });
            }
          });
        }
      });
    },
    handleCommand(cammand) {
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
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('loginMsg.errorMsg.password'),
            trigger: 'blur',
          },
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
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.login {
  height: 100%;
  padding: 120px;
  min-width: 1314px;
  min-height: 586px;
  overflow: hidden;
  overflow-x: auto;
  box-sizing: border-box;
  .img {
    float: left;
    // flex: 1;
    width: 65%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 70%;
      min-width: 600px;
    }
  }
  .item {
    position: relative;
    float: left;
    // flex: 0 0 400px;
    width: 35%;
    min-width: 375px;
    height: 100%;
    min-height: 586px;
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
</style>
