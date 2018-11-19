<template>
  <div class="header">
    <div class="slogen">
      <div class="collapse-btn"
        @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div>
      <div class="projectTit">后台管理系统</div>
    </div>
    <div class="msgs">
      <div>
        <el-dropdown size="small"
          placement="bottom"
          class="user-name"
          trigger="click"
          @command="handleCommand">
          <span class="el-dropdown-link">
            <span class="avatar">
              <i class="iconfont icon-user"></i>
              asdaskdjk
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userMsg">
              <i class="iconfont icon-user"></i>{{$t('userInfo.userMsg')}}
            </el-dropdown-item>
            <el-dropdown-item divided
              command="userPwd">
              <i class="el-icon-setting"></i>{{$t('userInfo.pasword')}}</el-dropdown-item>
            <el-dropdown-item divided
              command="loginout">
              <i class="iconfont icon-logout"></i>{{$t('userInfo.logOut')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {

    };
  },

  methods: {
    handleCommand() { },
    collapseChage() {
      this.$store.commit('toggleSideBar');
    },
  },

};

</script>
<style lang='scss' scoped>
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
    .avatar {
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
