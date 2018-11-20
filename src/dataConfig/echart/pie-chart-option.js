export default {
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {d}%',
  },
  legend: {
    // orient: "vertical",
    // x: "left",
    bottom: 10,
    left: 'center',
    data: [],
  },
  series: [
    {
      type: 'pie',
      radius: ['30%', '50%'],
      center: ['50%', '40%'],
      data: [],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        normal: {
          show: true,
          textStyle: {
            fontWeight: 300,
            fontSize: 16, // 文字的字体大小
          },
          formatter: '{c}',
        },
      },
    },
  ],
};
