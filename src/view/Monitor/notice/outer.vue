<template>
  <div class="container">
    <div class="phoneAdd">
      <!-- <div class="item tips">手机号码:</div> -->
      <div class="item tips"></div>
      <div class="item input">
        <el-form :model="validateForm"
          :rules="rules"
          ref="validateForm"
          label-width="100px"
          class="demo-ruleForm">
          <!-- 手机号码 -->
          <el-form-item :label="$t('useMsg.phone')"
            prop="input">
            <el-input type="tel"
              size="small"
              v-model.number="validateForm.input"
              auto-complete="off"
              :placeholder="$t('user.phone')"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="item">
        <el-button @click="addPerson"
          size="small"
          type="primary">{{$t('notice.add')}}</el-button>
        <!-- 添加 -->
      </div>
    </div>
    <div class="more">{{$t('notice.outerMost')}}</div>
    <div>
      <ul>
        <li class="tabletr"
          v-for="key in dataArr"
          :key="key.id">
          <el-row type="flex"
            class="row-bg"
            justify="center">
            <el-col :span="6">
              <div class="grid">{{key.contactWay}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid">{{key.createTime}}</div>
            </el-col>
            <el-col :span="6">
              <div style="padding-left: 80px;">
                <el-button @click="cancelReceive(key)"
                  size="small"
                  type="primary">{{$t('timeBtn.del')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import t from '@/utils/translate';

export default {
  data() {
    return {
      input: '',
      dataArr: [],
      validateForm: {},
      rules: {
        input: [
          { required: true, message: t('user.phoneErr'), trigger: 'change' },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: t('user.phoneCheck'),
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    addPerson() {
      if (this.dataArr.length > 2) return;
      this.$refs.validateForm.validate((valid) => {
        if (valid) {
          const obj = {
            contactWay: this.validateForm.input,
            type: 0,
          };
          this.$api.addOuterUsers(obj).then((res) => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              this.$message({
                type: 'success',
                message: t('successTips.addSuccess'),
              });
              this.validateForm.input = '';
              this.getList();
            }
          });
        }
      });
    },
    /* 取消接收 */
    cancelReceive(key) {
      console.log(key);
      this.$api.cancelOuterUsers(key.id).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: t('successTips.delSuccess'),
          });
          this.getList();
        }
      });
    },
    getList() {
      const pageObj = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$api.outerUsers(pageObj).then((res) => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.dataArr = result.pageData;
          // result.pageData.forEach(key => {
          //   this.dataArr.push(key);
          // });
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 24px;
  background: #ffffff;
}
.phoneAdd {
  overflow: hidden;
  width: 60%;
  line-height: 32px;
  margin: 0 auto;
  margin-bottom: 50px;
  .item {
    float: left;
    &.tips {
      width: 28%;
      text-align: right;
      margin-right: 15px;
      font-size: 14px;
      color: #484848;
    }
    &.input {
      width: 60%;
      margin-right: 15px;
    }
  }
}
.more {
  font-size: 14px;
  color: #484848;
  padding-left: 106px;
  line-height: 50px;
}
.tabletr {
  line-height: 50px;
  border-bottom: 1px solid #f0f0f0;
  .grid {
    color: #484848;
  }
}
</style>
