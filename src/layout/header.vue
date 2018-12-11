<template>
  <div class="header">
    <div class="slogen">
      <div class="collapse-btn" @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div>
      <div class="projectTit">后台管理系统</div>
    </div>
    <div class="msgs">
      <i class="iconfont icon-user"></i>
      <el-dropdown size="small" placement="bottom" class="user-name" trigger="hover" @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="avatar">
            <!-- <i class="iconfont icon-user"></i> -->
            {{loginData.companyName}} - {{loginData.nickName}}
            <i class="el-icon-caret-bottom"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userMsg">
            <i class="iconfont icon-set"></i>{{$t('userInfo.userMsg')}}
          </el-dropdown-item>
          <el-dropdown-item divided command="userPwd">
            <i class="iconfont icon-seting"></i>{{$t('userInfo.pasword')}}</el-dropdown-item>
          <el-dropdown-item divided command="loginout">
            <i class="iconfont icon-SignOut"></i>{{$t('userInfo.logOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import utils from '@/utils/utils';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      loginData: 'getloginData',
    }),
  },
  methods: {
    handleCommand(command) {
      if (command === 'loginout') {
        this.$api.logOut().then((res) => {
          if (res.data && res.data.code === 0) {
            this.$store.commit('logOut');
            this.$router.push('/login');
            utils.removeStorageAll();
          }
        });
      }
      if (command === 'userMsg') {
        this.$router.push('/user/info');
      }
      if (command === 'userPwd') {
        this.$router.push('/user/password');
      }
      this.$store.commit('setProjectType', '');
    },
    collapseChage() {
      this.$store.commit('toggleSideBar');
    },
  },

};

</script>
<style lang='scss' scoped>
.iconfont {
  margin-right: 5px;
}
.user-name {
  height: 35px;
}
.header {
  height: 50px;
  background-color: #292d33;
  line-height: 50px;
  display: flex;
  font-size: 14px;
  .slogen {
    flex: 0 0 180px;
    color: #ffffff;
    display: flex;
    .collapse-btn {
      flex: 0 0 64px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
    }
    .projectTit {
      flex: 1;
    }
  }
  .msgs {
    flex: 1;
    text-align: right;
    color: #ffffff;
    margin-right: 30px;
    .avatar {
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
