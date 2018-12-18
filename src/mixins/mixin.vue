
<script>
import permissionFun from '@/permision/monitor-valated';
import mqttConfig from '@/api/mqtt.config';
/* eslint-disable */
import Paho from 'Paho';
import t from '@/utils/translate';

export default {
  name: 'mixins',
  data () {
    return {
      AdminRoles: permissionFun(), // 权限
      pageSizeArr: [10, 20, 30, 50],
      pageSize: 10,
      currentPage: 1,
      loading: true,
      total: 0,
      mqttClient: {},
      tableData: [], // 列表展示的数组
      weekOption: [
        {
          value: 'week',
          label: t('history.week'),
        },
        {
          value: 'mounth',
          label: t('history.mounth'),
        },
        {
          value: 'threemonth',
          label: t('history.threemonth'),
        },
        {
          value: 'sixmounth',
          label: t('history.sixmounth'),
        },
        {
          value: 'year',
          label: t('history.year'),
        },
        {
          value: 'all',
          label: t('history.all'),
        },
      ],
    };
  },

  mounted () { },

  methods: {
    connectMqtt () {
      const config = mqttConfig();
      this.mqttClient = new Paho.MQTT.Client(
        config.hostname,
        config.port,
        config.clientId,
      );
      this.mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: config.reconnect,
        keepAliveInterval: config.keepAliveInterval,
        useSSL: config.useSSL,
        timeout: config.timeout,
      });
      this.mqttClient.onFailure = (res) => {
        console.log(res);
      };
      this.mqttClient.onConnectionLost = (responseObject) => {
        console.log('mqtt-closed:', responseObject);
      };
      this.mqttClient.onMessageArrived = (message) => {
        console.log("message:", message);
        let payload = message.payloadString;
        if (payload) {
          let payloadType = payload.toString().split("]");
          if (payloadType[1]) {
            this.queryData = false;
            this.CCID = payloadType[1];
            let payloadJSON = `${payloadType[0]}]`;
            this.receiveData(payloadJSON);
          } else {
            this.receiveData(payload);
          }
        }
      };
    },
    onConnect () {
      console.log('mqtt is connected');
    },
  },

};

</script>
