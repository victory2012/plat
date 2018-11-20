const data = {
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
    trigger: 'item',
    formatter: '{b}: {d}%',
  },
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'], // 仪表位置
      radius: '90%', // 仪表大小
      startAngle: 200, // 开始角度
      endAngle: -20, // 结束角度
      data: [],
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          color: [[0.2, '#ff4500'], [0.8, '#48b'], [1, '#228b22']],
          width: 10,
        },
      },
      axisTick: {
        splitNumber: 10,
        length: 12,
        lineStyle: {
          color: 'auto',
        },
      },
      splitLine: {
        show: true,
        length: 30,
        lineStyle: {
          color: 'auto',
        },
      },
      pointer: {
        width: 8,
      },
      title: {
        show: true,
        offsetCenter: [0, '-40%'],
        textStyle: {
          fontWeight: 'bolder',
        },
      },
      detail: {
        formatter: '{value}%',
        textStyle: {
          color: 'auto',
          fontWeight: 'bolder',
        },
      },
    },
  ],
};

export default () => data;
