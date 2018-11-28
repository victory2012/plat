<template>
  <div class="wrap">
    <div class="title">
      <!-- 未分配电池 -->
      <div class="tit-Tips">{{$t('stock.unassigned')}}</div>
      <!-- 客户企业电池 -->
      <div class="tit-Tips">{{$t('stock.custormBat')}}</div>
    </div>
    <div class="transferWrap">
      <div class="item stock">
        <div class="header">
          <el-checkbox v-model="stockChecked"
            @change="stockAll">{{$t('stock.selectAll')}}</el-checkbox>
        </div>
        <ul class="listArr">
          <li class="listItme"
            v-for="key in inventoryArr"
            :key="key.id">
            <el-checkbox v-model="key.checked">{{key.code}}</el-checkbox>
          </li>
          <li v-show="noInventory"
            class="nodata">{{InventoryText}}</li>
        </ul>
      </div>
      <div class="item btns">
        <div class="btnWarp">
          <!-- 分配 -->
          <el-button :loading="distributeLoading"
            class="btn"
            @click="distribute"
            size="mini"
            type="primary">{{$t('stock.distribution')}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          <!-- 回收 -->
          <el-button :loading="recoverLoading"
            class="btn"
            @click="recover"
            size="mini"
            type="primary"><i class="el-icon-arrow-left el-icon--left"></i>{{$t('stock.recovery')}}</el-button>
        </div>
      </div>
      <div class="item company">
        <div class="header">
          <el-checkbox v-model="companyChecked"
            @change="selectAll">{{$t('stock.selectAll')}}</el-checkbox>
          <el-select size="mini"
            v-model="manufacter"
            @change="getCompanyPair"
            class="manufacter">
            <el-option v-for="item in companyArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <ul class="listArr">
          <li class="listItme"
            v-for="key in companyPairArr"
            :key="key.id">
            <el-checkbox v-model="key.checked">{{key.code}}</el-checkbox>
          </li>
          <li v-show="noCompanyPair"
            class="nodata">{{companyPairText}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import t from '@/utils/translate';

export default {
  data() {
    return {
      stockChecked: false,
      companyChecked: false,
      companyArr: [], // 生产企业公司名称
      inventoryArr: [],
      companyPairArr: [],
      manufacter: '',
      noInventory: true,
      noCompanyPair: true,
      distributeLoading: false,
      recoverLoading: false,
      InventoryText: t('stock.load'), // "加载中..."
      companyPairText: t('stock.load'), // "加载中..."
    };
  },
  mounted() {
    this.getCompany();
    this.getInventoryPair();
  },
  methods: {
    /* 获取客户企业 */
    getCompany() {
      this.companyPairText = t('stock.load'); // "加载中...";
      this.noCompanyPair = true;
      this.$api.purchaseNames2().then((res) => {
        console.log('companyArr', res);
        if (res.data && res.data.code === 0) {
          this.companyArr = res.data.data;
          if (this.companyArr.length > 0) {
            this.manufacter = res.data.data[0].id;
            this.getCompanyPair();
          } else {
            this.companyPairText = t('stock.noData'); // "暂无数据";
            this.noCompanyPair = true;
          }
        } else {
          this.companyPairText = t('stock.noData'); // "暂无数据";
          this.noCompanyPair = true;
        }
      });
    },

    getCompanyPair() {
      this.$api.companyPair(this.manufacter).then((res) => {
        console.log('companyArr', res.data);
        this.companyPairArr = [];
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          if (result.length > 0) {
            this.noCompanyPair = false;
            this.companyPairText = '';
            result.forEach((key) => {
              key.checked = false;
              this.companyPairArr.push(key);
            });
          } else {
            this.companyPairText = t('stock.noData'); // "暂无数据";
            this.noCompanyPair = true;
          }
        } else {
          this.companyPairText = t('stock.noData'); // "暂无数据";
          this.noCompanyPair = true;
        }
      });
    },

    getInventoryPair() {
      this.InventoryText = t('stock.load'); // "加载中...";
      this.noInventory = true;
      this.$api.inventoryPair().then((res) => {
        console.log('inventoryPair', res.data);
        this.inventoryArr = [];
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          if (result.length > 0) {
            this.noInventory = false;
            this.InventoryText = '';
            result.forEach((key) => {
              key.checked = false;
              this.inventoryArr.push(key);
            });
          } else {
            this.noInventory = true;
            this.InventoryText = t('stock.noData'); // "暂无数据";
          }
        } else {
          this.noInventory = true;
          this.InventoryText = t('stock.noData'); // "暂无数据";
        }
      });
    },
    selectAll() {
      if (this.companyPairArr.length > 0) {
        this.companyPairArr.forEach((key) => {
          if (this.companyChecked) {
            key.checked = true;
          } else {
            key.checked = false;
          }
        });
      }
    },
    stockAll() {
      if (this.inventoryArr.length > 0) {
        this.inventoryArr.forEach((key) => {
          if (this.stockChecked) {
            key.checked = true;
          } else {
            key.checked = false;
          }
        });
      }
    },
    /* 回收 */
    recover() {
      const listarr = [];
      this.companyPairArr.forEach((key) => {
        if (key.checked) {
          listarr.push(key.id);
        }
      });
      if (listarr.length === 0) {
        return;
      }
      this.recoverLoading = true;
      this.$api.recoverBattery({ idList: listarr }).then((res) => {
        console.log(res);
        this.recoverLoading = false;
        if (res.data && res.data.code === 0) {
          this.$message({
            message: t('successTips.recoverySuc'),
            type: 'success',
          });
          this.stockChecked = false;
          this.companyChecked = false;
          this.getCompanyPair();
          this.getInventoryPair();
        }
      });
    },
    /* 分配 */
    distribute() {
      if (!this.manufacter) {
        return;
      }
      let companyName;
      this.companyArr.forEach((key) => {
        if (key.id === this.manufacter) {
          companyName = key.name;
        }
      });
      const data = {
        idList: [],
        companyId: this.manufacter,
        companyName,
      };
      this.inventoryArr.forEach((key) => {
        if (key.checked) {
          data.idList.push(key.id);
        }
      });
      if (data.idList.length === 0) {
        return;
      }
      this.distributeLoading = true;
      this.$api.distributeBattery(data).then((res) => {
        console.log(res);
        this.distributeLoading = false;
        if (res.data && res.data.code === 0) {
          this.$message({
            message: t('successTips.distributionSuc'),
            type: 'success',
          });
          this.stockChecked = false;
          this.companyChecked = false;
          this.getCompanyPair();
          this.getInventoryPair();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  background: #ffffff;
  padding: 20px;
  width: 780px;
  margin-top: 60px;
  margin-left: 100px;
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .tit-Tips {
      flex: 0 0 43%;
      font-size: 14px;
      text-align: center;
    }
  }
  .transferWrap {
    display: flex;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    padding: 5px;
    .item {
      flex: 1;
      border: 1px solid #ebeef5;
      border-radius: 5px;
      .header {
        padding-left: 15px;
        background: #f5f7fa;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ebeef5;
        .manufacter {
          width: 150px;
          margin-left: 30px;
        }
      }
      .listArr {
        padding: 15px 0;
        min-height: 600px;
        max-height: 700px;
        overflow-y: auto;
        .listItme {
          font-size: 14px;
          padding-left: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          box-sizing: border-box;
          height: 30px;
          line-height: 30px;
          margin: 5px 0;
        }
      }
      &.btns {
        margin: 0 15px;
        flex: 0 0 120px;
        padding-top: 40px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        .btnWarp {
          text-align: center;
          .btn {
            margin: 0;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
.nodata {
  text-align: center;
  color: #909399;
  font-size: 14px;
}
// .transferWrap {
//   width: 80%;
//   margin: 100px auto;
//   display: flex;
//   .transfer {
//     flex: 1;
//     display: flex;
//     text-align: center;
//     .el-transfer__buttons {
//       flex: 0 0 50px;
//       .el-transfer__button {
//         margin-left: 0;
//       }
//     }
//     .el-transfer-panel {
//       flex: 1;
//       text-align: left;
//       .el-transfer-panel__item {
//         display: block;
//         margin-left: 0;
//       }
//     }
//   }
// }
</style>

