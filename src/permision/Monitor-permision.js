export default {
  /* 采购企业管理员 */
  custormAdmin: () => {
    const permis = {
      runState: true,
      recovery: true,
      alarmDatas: true,
      historyData: true,
      personalInfo: true,
      sameAnalysis: false,
      alarm: true,
      addblack: true,
      allocation: false,
    };
    return permis;
  },
  /* 采购企业用户 */
  custormPer: () => {
    const custorm = {
      runState: true,
      recovery: false,
      alarmDatas: true,
      personalInfo: true,
      historyData: true,
      alarm: true,
      sameAnalysis: false,
      addblack: false,
      allocation: false,
    };
    return custorm;
  },
  /* 生产企业用户 */
  productPer: () => {
    const product = {
      AddBatteries: false,
      runState: true,
      recovery: false,
      personalInfo: true,
      alarmDatas: true,
      historyData: true,
      alarm: true,
      sameAnalysis: true,
      addblack: false,
      allocation: false,
    };
    return product;
  },
};
