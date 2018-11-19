/* eslint-disable */
import axios from 'axios';
import { Message } from 'element-ui';
import t from '@/utils/translate';
import router from '@/router';

const baseURL = process.env.API_HOST;
const timeout = 30000; // 超时时间
axios.interceptors.request.use(
  config => {
    // 这里的config包含每次请求的内容
    let token = sessionStorage.getItem('token');
    if (token) {
      config.headers.token = `${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  // console.log(response);
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400)
  ) {
    return response;
  } else {
    // 异常状态下，把错误信息返回去
    Message.error(`${t('internetErr')}`);
    return {
      status: 500,
      msg: `${t('internetErr')}`
    };
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  let status = res.data;
  if (status && status.code && status.code !== 0) {
    switchCode(status);
    // Message.error(switchCode(status));
  }
  return res;
}

function switchCode(status) {
  switch (Number(status.code)) {
    case 1: {
      setTimeout(() => {
        router.push('/login');
        sessionStorage.clear();
      }, 1000);
      return Message.warning(`${t('responseCode.sessionOut')}`);
    }
    case 10: {
      return Message.warning(`${t('responseCode.parameterErr')}`);
    }
    case 20: {
      return Message.warning(`${t('responseCode.permissions')}`);
    }
    case 30: {
      return Message.warning(`${t('responseCode.dataExists')}`);
    }
    case 40:
      return Message.warning(`${t('responseCode.sendCode')}`);

    case 41:
      return Message.warning(`${t('responseCode.smscodeErr')}`);

    case 101001:
      return Message.warning(`${t('responseCode.accountExists')}`);

    case 101002:
      return Message.warning(`${t('responseCode.phoneExists')}`);

    case 101003:
      return Message.warning(`${t('responseCode.emailExists')}`);

    case 104001:
      return Message.warning(`${t('responseCode.accountOrPwdErr')}`);

    case 104002: {
      return Message.warning(`${t('responseCode.userNotExist')}`);
    }
    case 201001: {
      return Message.warning(`${t('responseCode.companyExists')}`);
    }
    case 202002: {
      return Message.warning(`${t('responseCode.hasInvalidHost')}`);
    }
    case 204001:
      return Message.warning(
        `${status.data}-${t('responseCode.notFindCompany')}`
      );
    case 301001:
      return Message.warning(`${t('responseCode.deviceExists')}`);
    case 301002: {
      return Message.warning(
        `${status.data}-${t('responseCode.notFindDevice')}`
      );
    }
    case 301101:
      return Message.warning(
        `${status.data}-${t('responseCode.gpsDeviceExists')}`
      );
    case 301201:
      return Message.warning(
        `${status.data}-${t('responseCode.MonitorDeviceExists')}`
      );
    case 302001:
      return Message.warning(`${t('responseCode.deviceRunning')}`);
    case 303001:
      return Message.warning(`${status.data}-${t('responseCode.deviceBind')}`);
    case 401001:
      return Message.warning(`${t('responseCode.hasHost')}`);
    case 403002:
      return Message.warning(`${t('responseCode.hostBind')}`);
    case 401201:
      return Message.warning(`${t('responseCode.batteryGroupExists')}`);
    case 401211:
      return Message.warning(`${t('responseCode.batteryModelExists')}`);
    case 401212:
      return Message.warning(`${t('responseCode.batteryModelNotFind')}`);
    case 401213:
      return Message.warning(`${t('responseCode.batterySpecExists')}`);
    case 401214:
      return Message.warning(`${t('responseCode.batterySpecNotFind')}`);
    case 401215:
      return Message.warning(`${t('responseCode.batterySingleModelExists')}`);
    case 401216:
      return Message.warning(`${t('responseCode.batterySingleModelNotFind')}`);
    case 501211:
      return Message.warning(`${t('responseCode.innerNoticeExists')}`);
    case 501221:
      return Message.warning(`${t('responseCode.InnerNoticeUserExists')}`);
    case 501222:
      return Message.warning(`${t('responseCode.InnerNoticeOverrun')}`);
    case 501231:
      return Message.warning(`${t('responseCode.outerNoticeUserExists')}`);
    case 501232:
      return Message.warning(`${t('responseCode.outerNoticeOverrun')}`);
    case -1:
      return Message.warning(`${t('connectErr')}`);
    default:
      break;
  }
}
// 请求方式的配置
export default {
  post(url, data) {
    //  post
    return axios({
      method: 'post',
      baseURL: baseURL,
      url,
      data: JSON.stringify(data),
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  },
  get(url, params) {
    // get
    return axios({
      method: 'get',
      baseURL: baseURL,
      url,
      params, // get 请求时带的参数
      timeout: timeout
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  },
  put(url, params) {
    return axios
      .put(`${baseURL}/${url}`, params, {
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  },
  delete(url, params) {
    // delete
    return axios({
      method: 'delete',
      baseURL: baseURL,
      url,
      params, // delete 请求时带的参数
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      });
  }
};
