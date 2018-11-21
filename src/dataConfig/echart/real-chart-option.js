export default {
  title: {
    text: '',
    subtext: '',
    textStyle: {
      color: '#484848',
    },
    subtextStyle: {
      color: '#484848',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      animation: false,
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '20%',
    containLabel: true,
  },
  /* eslint-disable */
  dataZoom: [
    {
      // show: true,
      type: 'slider',
      start: 0,
      realtime: true,
      end: 100,
      fillerColor: 'rgba(167,183,204,0.4)',
      backgroundColor: 'rgba(0,0,0,0)'
    },
    {
      type: 'inside',
      start: 0,
      realtime: true,
      end: 100
    }
  ],
  xAxis: {
    type: 'time',
    // type: "category",
    boundaryGap: false,
    data: '',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      fontSize: 11,
      color: '#484848'
    },
    splitLine: {
      show: false
    }
  },
  animation: false,
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: ''
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: '',
      type: 'line',
      smooth: true,
      showSymbol: false, // 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示。
      // hoverAnimation: true, // 是否开启 hover 在拐点标志上的提示动画效果。
      lineStyle: {
        normal: {
          color: '#71bfdb'
        }
      },
      areaStyle: {
        normal: {
          color: 'rgba(36,145,252,0.25)'
        }
      },
      data: []
    }
  ]
};
