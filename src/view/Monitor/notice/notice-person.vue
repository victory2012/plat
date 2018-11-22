<template>
  <div class="container">
    <div class="topTab">
      <div @click="goToAddUser"
        class="items">
        <img src="../../../../static/img/notice_user.png"
          alt="">
        <p>{{$t('notice.viewUser')}}</p>
        <!-- 查看已添加用户 -->
      </div>
    </div>
    <!-- （最多添加128人） -->
    <p class="tips">{{$t('notice.atMost')}}</p>
    <el-table v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :highlight-current-row="true">
      <!-- 用户名 -->
      <el-table-column prop="account"
        align="center"
        :label="$t('useMsg.name')">
      </el-table-column>
      <!-- 账户身份 -->
      <el-table-column prop="role"
        align="center"
        :label="$t('useMsg.accountRole')">
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column prop="createTime"
        align="center"
        :label="$t('device.createTime')">
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="state"
        align="center"
        :label="$t('notice.status')">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center"
        :label="$t('batteryList.handle')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === null"
            @click.native.prevent="addClick(scope.row)"
            type="text"
            size="small">{{$t('notice.add')}}</el-button>
          <!-- 添加 -->
          <el-button v-else
            @click.native.prevent="cancleClick(scope.row)"
            type="text"
            size="small">{{$t('timeBtn.del')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import utils from '@/utils/utils';
import t from '@/utils/translate';

export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      tableData: [],
    };
  },
  methods: {
    goToAddUser() {
      this.$router.push('/set/user');
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    /* 添加 */
    addClick(row) {
      this.$api.addNotice(row.id).then((res) => {
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.addSuccess'),
          });
          this.getUserList();
        }
      });
    },
    /* 取消添加 */
    cancleClick(row) {
      if (row.status === null) return;
      this.$api.cancelNotice(row.status).then((res) => {
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.delSuccess'),
          });
          this.getUserList();
        }
      });
    },
    getUserList() {
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      this.$api.noticeUsersList(pageObj).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          this.tableData = [];
          result.pageData.forEach((key) => {
            key.role = utils.accountType(key.type);
            key.state = key.status === null ? t('notice.noAdd') : t('notice.hasAdd');
            this.tableData.push(key);
          });
        }
      });
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 24px;
  background: #ffffff;
}
.topTab {
  text-align: right;
  overflow: hidden;
  .items {
    float: right;
    font-size: 14px;
    color: #484848;
    width: 150px;
    text-align: center;
    cursor: pointer;
    img {
      margin-bottom: 8px;
    }
  }
}
.page {
  padding-top: 20px;
  text-align: right;
}
.tips {
  font-size: 14px;
  color: #484848;
}
</style>
