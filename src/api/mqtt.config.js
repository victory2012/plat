// mqtt相关配置， 详情文档 在下方链接
// http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
const locationHost = window.location.host;
const domain = locationHost.indexOf('myriadiot');
const mqtt = {
  hostname: domain > 0 ? 'www.myriadiot.net' : '47.96.8.239',
  port: domain > 0 ? 443 : 8083,
  useSSL: domain > 0,
  clientId: `pc${new Date().getTime()}`,
  timeout: 30,
  keepAliveInterval: 100,
  cleanSession: false,
  reconnect: true, // 断开后 是否重连
};
console.log(mqtt);
export default function mqttFun() {
  return mqtt;
}
