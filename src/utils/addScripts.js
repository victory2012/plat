export default function createScript() {
  const locationHost = window.location.host.toString();
  const prodUrl = locationHost.indexOf('myriadiot');
  const testUrl = locationHost.indexOf('96.8.239');
  let phaoUrl;
  if (prodUrl > 0) {
    phaoUrl = './static/js/paho-mqtt-min.js';
  } else if (testUrl > 0) {
    phaoUrl = './static/js/paho-mqtt-min.js';
  } else {
    phaoUrl = './static/js/paho-mqtt-min.js';
  }
  console.log('phaoUrl ==>>', phaoUrl);
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = phaoUrl;
  document.body.appendChild(s);
}
