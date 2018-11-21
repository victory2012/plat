<template>
  <div>
    <el-table :data="tableData"
      style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"
        align="center"
        :label="$t('alarmList.serial')"
        width="50">
      </el-table-column>
      <!-- 告警发生时间 -->
      <el-table-column prop="createTime"
        align="center"
        :label="$t('alarmList.time')">
      </el-table-column>
      <!-- 告警项目 -->
      <el-table-column prop="items"
        align="center"
        :label="$t('alarmList.alarmItem')">
      </el-table-column>
      <!-- 告警阈值 -->
      <el-table-column prop="thresholdValue"
        align="center"
        :label="$t('alarmList.thride')">
      </el-table-column>
      <!-- 实际值 -->
      <el-table-column prop="actualValue"
        align="center"
        :label="$t('alarmList.realDate')">
      </el-table-column>
      <!-- 电池组编号 -->
      <el-table-column prop="hostCode"
        align="center"
        :label="$t('alarmList.batteryCode')">
      </el-table-column>
      <!-- 告警内容 -->
      <el-table-column prop="content"
        align="center"
        :label="$t('alarmList.content')">
      </el-table-column>
      <!-- 告警层级 -->
      <el-table-column prop="hierarchy"
        align="center"
        :label="$t('alarmList.alarmHierarchy')">
      </el-table-column>
      <!-- 告警级别 -->
      <el-table-column prop="levels"
        align="center"
        :label="$t('alarmList.alarmLevel')">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    alarmData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      tableData: this.alarmData,
    };
  },
  watch: {
    alarmData: {
      handler(vals) {
        this.tableData = vals;
      },
      deep: true,
    },
  },
  mounted() { },
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
