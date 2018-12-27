<template>
  <div class="passwordWarp">
    <div class="sort-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="$t('password.new')" prop="password">
          <el-input size="small" v-model="ruleForm.password" type="password" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm('ruleForm')">{{$t('password.changeBtn')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import t from '@/utils/translate';

export default {
  name: 'Password',
  data() {
    return {
      ruleForm: {},
      rules: {
        password: [
          { required: true, message: t('password.error'), trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: t('password.passwordLimit'),
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userObj = {
            password: this.ruleForm.password,
          };
          this.$api.changeUserMsg(userObj).then((res) => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              this.$message({
                type: 'success',
                message: t('password.success'),
              });
              this.ruleForm = {};
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.passwordWarp {
  padding: 20px;
}
.sort-content {
  font-size: 14px;
  margin: 0 auto;
  color: #484848;
  background: #ffffff;
  padding: 50px 0 20px 30px;
  border-radius: 5px;
  .tips {
    padding: 0 0 5px;
  }
  .gridInput {
    padding-bottom: 20px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 40px;
  }
}
</style>
