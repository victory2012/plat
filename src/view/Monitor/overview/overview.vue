<template>
  <div>
    <!-- :cardData="cardData" -->
    <edit-card></edit-card>
    <div class="warper">
      <el-row :gutter="10">
        <el-col :span="14">
          <div class="chart">
            <div class="warperItme">
              <pie-chart :loadingData="chatLoading"
                :cardData="cardData"></pie-chart>
              <div class="tables shadow">
                <el-table v-loading="loading"
                  :data="tableData"
                  style="width: 100%;">
                  <!-- 告警发生时间 -->
                  <el-table-column prop="createTime"
                    align="center"
                    :label="$t('alarmList.time')"
                    width="170">
                  </el-table-column>
                  <!-- 电池编号 -->
                  <el-table-column prop="hostCode"
                    align="center"
                    :label="$t('alarmList.batteryCode')">
                  </el-table-column>
                  <!-- 告警项目 -->
                  <el-table-column prop="items"
                    align="center"
                    width="120"
                    :label="$t('alarmList.alarmItem')">
                  </el-table-column>
                  <!-- 告警内容 -->
                  <el-table-column prop="content"
                    align="center"
                    :label="$t('alarmList.content')"
                    width="220">
                  </el-table-column>
                  <!-- 告警层级 -->
                  <el-table-column prop="hierarchy"
                    align="center"
                    :label="$t('alarmList.alarmHierarchy')"
                    width="110">
                  </el-table-column>
                  <!-- 告警级别 -->
                  <el-table-column prop="levels"
                    align="center"
                    :label="$t('alarmList.alarmLevel')">
                  </el-table-column>
                  <!-- <el-table-column prop="address" align="center" label="详情" width="120">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="handleClick(scope.row)" type="text">
                    查看
                  </el-button>
                </template>
              </el-table-column> -->
                </el-table>
                <p v-show="!isNoAlarmData"
                  class="more">
                  <a @click="ToMore">{{$t('alarmList.more')}}</a>
                  <i class="iconfont icon-more"></i>
                </p>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="list">
            <div v-if="!isUser"
              class="listItme shadow">
              <el-table v-loading="company"
                :data="custormTable">
                <el-table-column prop="company"
                  align="center"
                  :label="$t('alarmList.customer')"
                  width="200">
                </el-table-column>
                <!-- 电池数 -->
                <el-table-column prop="total"
                  align="center"
                  :label="$t('overview.subtotalField')">
                </el-table-column>
                <!-- 有效监控数 -->
                <el-table-column prop="activeTotal"
                  align="center"
                  :label="$t('overview.effectiveField')">
                </el-table-column>
                <!-- 告警电池数 -->
                <el-table-column prop="alarmedTotal"
                  align="center"
                  :label="$t('overview.abnormalField')">
                </el-table-column>
              </el-table>
              <div v-if="companyMoreBtn"
                class="showMore">
                <p @click="showCampanyMore"
                  class="">
                  <span>{{companyBtnText}}</span>
                  <i :class="{'routo': openMoreCompany}"
                    class="iconfont icon-down"></i>
                </p>
              </div>
            </div>
            <div class="listItme shadow"
              :style="{minHeight: minHeight + 'px'}">
              <el-table v-loading="provence"
                :data="provenceTable">
                <el-table-column prop="address"
                  align="center"
                  :label="$t('overview.provence')"
                  width="200">
                </el-table-column>
                <el-table-column prop="total"
                  align="center"
                  :label="$t('overview.subtotalField')">
                </el-table-column>
                <el-table-column prop="activeTotal"
                  align="center"
                  :label="$t('overview.effectiveField')">
                </el-table-column>
                <el-table-column prop="alarmedTotal"
                  align="center"
                  :label="$t('overview.abnormalField')">
                </el-table-column>
              </el-table>
              <!-- provenceMoreBtn -->
              <div v-if="provenceMoreBtn"
                class="showMore">
                <p @click="showProvenceMore">
                  <span>{{provenceBtnText}}</span>
                  <i :class="{'routo': openMoreProvence}"
                    class="iconfont icon-down"></i>
                </p>
              </div>
            </div>
            <div class="listItme shadow"
              :style="{minHeight: minHeight + 'px'}">
              <el-table v-loading="models"
                :data="modelTable">
                <el-table-column prop="models"
                  align="center"
                  :label="$t('overview.batteryModel')"
                  width="200">
                </el-table-column>
                <el-table-column prop="total"
                  align="center"
                  :label="$t('overview.subtotalField')">
                </el-table-column>
                <el-table-column prop="activeTotal"
                  align="center"
                  :label="$t('overview.effectiveField')">
                </el-table-column>
                <el-table-column prop="alarmedTotal"
                  align="center"
                  :label="$t('overview.abnormalField')">
                </el-table-column>
              </el-table>
              <div v-if="modelMoreBtn"
                class="showMore">
                <p @click="showModelMore">
                  <span>{{modelBtnText}}</span>
                  <i :class="{'routo': openMoreModel}"
                    class="iconfont icon-down"></i>
                </p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import utils from '@/utils/utils';
import t from '@/utils/translate';
import editCard from './card';
import pieChart from './dashboard';

export default {
  data() {
    return {
      minHeight: '',
      isUser: false,
      isNoAlarmData: true,
      cardData: {},
      // chatLoading: true,
      loading: false,
      models: false,
      company: false,
      provence: false,
      modelMoreBtn: false,
      companyMoreBtn: false,
      provenceMoreBtn: false,
      openMoreCompany: false,
      companyBtnText: t('toggleTip.open'),
      openMoreProvence: false,
      provenceBtnText: t('toggleTip.open'),
      openMoreModel: false,
      modelBtnText: t('toggleTip.open'),
      tableData: [],
      canInterval: false,
      custormTable: [],
      provenceTable: [],
      modelTable: [],
      sortCustormTable: [],
      sortProvenceTable: [],
      sortModelTable: [],
      allCustormTable: [],
      allProvenceTable: [],
      allModelTable: [],
      pageSize: 5,
      stripNum: 3,
      Timer: '',
    };
  },
  computed: {
    ...mapState({
      chatLoading: 'monitor/cardLoading',
      userData: 'userData',
    }),
  },
  components: {
    editCard,
    pieChart,
  },

  mounted() {
    this.getCardData();
    this.getModelData();
    this.getProvenceData();
    if (
      (this.userData.type === 3 && this.userData.layerName === '平台') ||
      (this.userData.type === 2 && this.userData.layerName === '生产企业') ||
      this.userData.type === 1
    ) {
      this.getCampanyData();
    } else {
      this.isUser = true;
      this.minHeight = '352';
    }
  },

  methods: {
    ...mapActions({
      getCardData: 'monitor/carData',
    }),
    /* 展开 收起-- 客户数 */
    showCampanyMore() {
      if (!this.openMoreCompany) {
        this.companyBtnText = t('toggleTip.close');
        this.custormTable = this.allCustormTable;
      } else {
        this.companyBtnText = t('toggleTip.open');
        this.custormTable = this.sortCustormTable;
      }
      this.openMoreCompany = !this.openMoreCompany;
    },
    /* 展开 收起-- 型号 */
    showModelMore() {
      if (!this.openMoreModel) {
        this.modelBtnText = t('toggleTip.close');
        this.modelTable = this.allModelTable;
      } else {
        this.modelBtnText = t('toggleTip.open');
        this.modelTable = this.sortModelTable;
      }
      this.openMoreModel = !this.openMoreModel;
    },
    /* 展开 收起-- 省份 */
    showProvenceMore() {
      if (!this.openMoreProvence) {
        this.provenceBtnText = t('toggleTip.close');
        this.provenceTable = this.allProvenceTable;
      } else {
        this.provenceBtnText = t('toggleTip.open');
        this.provenceTable = this.sortProvenceTable;
      }
      this.openMoreProvence = !this.openMoreProvence;
    },
    /* 获取客户数据 */
    getCampanyData() {
      this.company = true;
      this.$api.overviewCompany().then((res) => {
        console.log('获取客户数据', res);
        this.company = false;
        if (res.data && res.data.code === 0) {
          const companys = res.data.data;
          if (!companys || companys.length === 0) return;
          if (companys.length > this.stripNum) {
            this.companyMoreBtn = true;
          }
          companys.forEach((item, index) => {
            const resultKey = Object.keys(item)[0];
            item.company = resultKey;
            item.total = item[resultKey].total;
            item.alarmedTotal = item[resultKey].alarmedTotal;
            item.activeTotal = item[resultKey].activeTotal;
            if (index < this.stripNum) {
              this.sortCustormTable.push(item);
            }
            this.allCustormTable.push(item);
          });
          this.custormTable = this.sortCustormTable;
        }
      });
    },

    /* 型号数据 */
    getModelData() {
      this.models = true;
      this.$api.overviewModel().then((res) => {
        console.log('型号', res);
        this.models = false;
        if (res.data && res.data.code === 0) {
          const model = res.data.data;
          if (!model || model.length === 0) return;
          if (model.length > this.stripNum) {
            this.modelMoreBtn = true;
          }
          model.forEach((key, index) => {
            const resultKey = Object.keys(key)[0];
            key.models = resultKey;
            key.total = key[resultKey].total;
            key.alarmedTotal = key[resultKey].alarmedTotal;
            key.activeTotal = key[resultKey].activeTotal;
            if (index < this.stripNum) {
              this.sortModelTable.push(key);
            }
            this.allModelTable.push(key);
          });
          this.modelTable = this.sortModelTable;
        }
      });
    },

    /* 省份数据 */
    getProvenceData() {
      this.provence = true;
      this.$api.overviewProvence().then((res) => {
        console.log('省份数据', res);
        this.provence = false;
        if (res.data && res.data.code === 0) {
          const peovence = res.data.data;
          if (!peovence || peovence.length === 0) return;
          if (peovence.length > this.stripNum) {
            this.provenceMoreBtn = true;
          }
          peovence.forEach((item, index) => {
            console.log('item', item);
            const resultKey = Object.keys(item)[0];
            item.address = resultKey;
            item.total = item[resultKey].total;
            item.alarmedTotal = item[resultKey].alarmedTotal;
            item.activeTotal = item[resultKey].activeTotal;
            if (index < this.stripNum) {
              this.sortProvenceTable.push(item);
            }
            this.allProvenceTable.push(item);
          });
          this.provenceTable = this.sortProvenceTable;
        }
      });
    },
    /* 告警数据 */
    getListData() {
      this.loading = true;
      const pageObj = {
        pageSize: this.pageSize,
        pageNum: 1,
      };
      this.$api.alarmData(pageObj).then((res) => {
        // console.log(res);
        this.loading = false;
        this.canInterval = true;
        if (res.data && res.data.code === 0) {
          const result = res.data.data;
          this.tableData = [];
          if (result.pageData.length > 0) {
            this.isNoAlarmData = false;
            result.pageData.forEach((key) => {
              // key.alarmtime = utils.fomats(key.time);
              key.levels = utils.level(key.level);
              key.hierarchy = key.hierarchy === 'Group' ? t('group.allGroup') : t('group.single');// "整组" : "单体";
              key.items = utils.item(key.item);
              if (key.item === 'Fluid') {
                key.thresholdValue = '-';
                key.actualValue = t('realTime.abnormal'); // "异常";
              }
              this.tableData.push(key);
            });
          } else {
            this.isNoAlarmData = true;
          }
        }
      });
    },
    ToMore() {
      this.$router.push('/battery/alarm');
    },
  },

};

</script>
<style lang='scss' scoped>
.warper {
  padding: 0 10px;
}
.chart {
  flex: 1;
  margin-right: 15px;
}
.list {
  // flex: 0 0 500px;
  // display: flex;
  // align-content: space-between;
  // flex-wrap: wrap;
  .listItme {
    // flex: 0 0 500px;
    min-height: 228px;
    box-sizing: border-box;
    margin-bottom: 13px;
    padding: 10px;
    padding-top: 0;
    background: #ffffff;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.showMore {
  text-align: center;
  font-size: 13px;
  color: #409eff;
  margin-top: 5px;
  cursor: pointer;
  i {
    vertical-align: middle;
    font-size: 12px;
    display: inline-block;
  }
}
.routo {
  transform: rotate(180deg);
}
.shadow {
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
}
.tables {
  padding: 15px;
  margin-top: 20px;
  height: 358px;
  background: #ffffff;
}
.more {
  text-align: right;
  margin-top: 15px;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  i {
    vertical-align: middle;
  }
}
</style>
