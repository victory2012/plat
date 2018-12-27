const addPlat = [
  {
    default: './img/add-admin.png',
    text: 'useMsg.add.manufacturer', // '创建生产企业管理员',
    role: 1,
  },
];
/* eslint-disable */
let manfictor = [
  {
    default: './img/add-user.png',
    text: 'useMsg.add.customer', // '添加客户企业管理员',
    role: 2
  },
  {
    default: './img/add-admin.png',
    text: 'useMsg.add.cusNoraml', // '添加本企业用户',
    role: 3
  }
];

let createUser = [
  {
    default: './img/add-admin.png',
    text: 'useMsg.add.cusNoraml', // '添加本企业用户',
    role: 3
  }
];
export default {
  getPlat: () => addPlat,
  getProduct: () => manfictor,
  getCreateUser: () => createUser
};
