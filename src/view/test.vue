<template>
  <div>
    <el-input v-model="listVideoQuery.orgLogo" @change="orgLogoChange"></el-input>
    <el-col :span="10" class="mt10">
      <el-upload class="upload-demo" :file-list="fileList2" :action="domain" :before-upload="beforeAvatarUpload" :data="form" :on-remove="handleRemoveQrgLogo" :on-success="handleAvatarSuccess" list-type="picture" :limit="1" multiple>
        <el-button size="small" type="primary" @click="upPicName='orgLogo'">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-col>
  </div>
</template>

<script>

export default {
  name: 'edit',
  data() {
    return {
      listVideoQuery: {},
      upPicName: '', // 上传图片名字
      fileList2: [],
      form: {}, // 上传到七牛的token
      domain: 'http://upload.qiniu.com', // 七牛云的上传地址
      qiniuaddr: 'pd6rnk9ck.bkt.clouddn.com', // 这是七牛云空间的外链默认域名
    };
  },
  methods: {
    orgLogoChange() { },
    handleRemoveQrgLogo() { },
    // 上传图片规格
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        return this.$message.error('上传文件只能是  JPG或PNG 格式!');
      }
      if (!isLt2M) {
        return this.$message.error('上传图片大小不能超过 5MB!');
      }
      // return this.$api.qiniuToken().then((res) => {
      //   this.form = {
      //     token: res.data,
      //   };
      // });
      this.$api.qiniuToken().then((res) => {
        console.log(res);
        // this.form = {
        //   token: res.data,
        // };
      });
    },
    // 图片改变及上传
    bannerPicChange(value) {
      this.fileList2 = [];
      this.fileList2.push({
        name: value,
        url: value,
      });
    },
    handleBannerPicRemove(file, fileList) {
      console.log('fileList', fileList);
      this.fileList1 = [];
      this.listVideoQuery.orgLogo = '';
    },
    handleAvatarSuccess(response) {
      console.log('response', response);
      if (this.upPicName === 'orgLogo') {
        this.fileList1 = [];
        this.fileList1.push({
          name: `http://${this.qiniuaddr}/${response.key}`,
          url: `http://${this.qiniuaddr}/${response.key}`,
        });
        this.listVideoQuery.orgLogo = `http://${this.qiniuaddr}/${response.key}`;
      }
      this.$message({
        type: 'success',
        message: '上传成功!',
        duration: 2000,
      });
    },
  },
};

</script>
<style lang='scss' scoped>
</style>
