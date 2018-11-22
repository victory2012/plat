<template>
  <div class="container">
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
          <!-- 取消 已添加的接收人-->
          <el-button @click.native.prevent="cancleClick(scope.row)"
            type="text"
            size="small">
            {{$t('timeBtn.del')}}
          </el-button>
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.personList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.personList();
    },
    /* 取消添加 */
    cancleClick(row) {
      console.log(row);
      this.$api.cancelNotice(row.id).then((res) => {
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.delSuccess'),
          });
          this.personList();
        }
      });
    },
    personList() {
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      this.$api.noticeList(pageObj).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.total = result.total;
          this.tableData = [];
          result.pageData.forEach((key) => {
            key.role = utils.accountType(key.type);
            key.state = t('notice.hasAdd'); // "已添加";
            this.tableData.push(key);
          });
        }
      });
    },
  },
  mounted() {
    this.personList();
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 24px;
  background: #ffffff;
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
