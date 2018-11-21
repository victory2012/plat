export default {
  title: {
    text: '',
  },

  legend: {
    // orient: "vertical",
    // x: "left",
    bottom: 5,
    left: 'left',
    data: ['本期', '上期'],
  },
  tooltip: {},
  xAxis: [
    {
      type: 'category',
      data: [],
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 11,
        color: '#484848',
      },
      splitLine: {
        show: false,
      },
      // data: ["充电次数", "充电时间", "平均充电时间", "4月"]
    },
  ],
  // 声明一个 Y 轴，数值轴。
  yAxis: {
    axisLabel: {
      formatter: '',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  /* eslint-disable */
  series: [
    {
      name: '本期',
      type: 'bar',
      // data: [10, 65, 15, 20],
      data: [],
      barWidth: 30,
      itemStyle: {
        normal: {
          color: '#65D7FA'
        }
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#65D7FA'
          }
        }
      }
    },
    {
      name: '上期',
      type: 'bar',
      // data: [30, 45, 15, 60],
      data: [],
      barWidth: 30,
      itemStyle: {
        normal: {
          color: '#6B769E'
        }
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#6B769E'
          }
        }
      }
    }
  ]
};
