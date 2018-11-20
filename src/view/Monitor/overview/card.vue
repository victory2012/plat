<template>
  <div class="cardWarrp">
    <div class="card ">
      <div class="pan-item">
        <div class="img">
          <i class="iconfont icon-all"></i>
        </div>
        <div class="account">
          <div class="datas">
            <!-- 电池总数 -->
            <p class="title">{{$t('overview.total')}}</p>
            <p class="info">{{carData.total || 0}}</p>
          </div>
        </div>
      </div>

    </div>
    <div class="card">
      <div class="pan-item">
        <div class="img">
          <i class="iconfont icon-Newlyadded"></i>
        </div>
        <div class="account">
          <div class="datas">
            <!-- 本月新增电池数 -->
            <p class="title">{{$t('overview.newAdd')}}</p>
            <p class="info">{{carData.currentMonthTotal || 0}}</p>
          </div>
        </div>
      </div>

    </div>
    <div class="card">
      <div class="pan-item">
        <div class="img">
          <i class="iconfont icon-tmp-ok"></i>
        </div>
        <div class="account">
          <div class="datas">
            <!-- 有效监控数 -->
            <p class="title">{{$t('overview.valid')}}</p>
            <p class="info">{{carData.activeTotal || 0}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card ">
      <div class="pan-item">
        <div class="img">
          <i class="iconfont icon-Normal"></i>
        </div>
        <div class="account">
          <div class="datas">
            <!-- 告警电池数 -->
            <p class="title">{{$t('overview.alarmed')}}</p>
            <p class="info">{{carData.alarmedTotal || 0}}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapGetters } from "vuex";

export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters({
      carData: 'monitor/GETCARDDATA'
    })
  }
};
</script>
<style lang="scss" scoped>
.cardWarrp {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  .card {
    box-sizing: border-box;
    flex: 1;
    // text-align: center;
    padding: 0 10px;
    height: 108px;
    margin-bottom: 20px;

    .pan-item {
      display: flex;
      background: #ffffff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-radius: 3px;
      height: 108px;
      .img {
        flex: 1;
        height: 100%;
        font-size: 14px;
        i {
          padding: 15px;
          font-size: 44px;
          display: inline-block;
          margin: 15px;
          color: #ffffff;
          border-radius: 5px;
          &.icon-all {
            background: #34bfa3;
          }
          &.icon-Newlyadded {
            background: #36a3f7;
          }
          &.icon-tmp-ok {
            background: #67c23a;
          }
          &.icon-Normal {
            background: #f4516c;
          }
        }
      }
      .account {
        flex: 1;
        font-size: 14px;
        height: 100%;
        box-sizing: border-box;
        padding-right: 20px;
        text-align: center;
        // overflow: hidden;
        .datas {
          float: right;
          // overflow: hidden;
          width: 115px;
        }
        .title {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
          font-weight: bold;
          margin-top: 26px;
          width: 115px;
        }
        .info {
          width: 115px;
          font-size: 18px;
          font-weight: bold;
          color: #666;
          float: right;
        }
      }
    }
  }
}
@media only screen and (max-width: 1300px) {
  .cardWarrp {
    flex-wrap: wrap;
    .card {
      flex: 0 0 50%;
    }
  }
}
</style>
