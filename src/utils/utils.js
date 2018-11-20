import t from '@/utils/translate';

const daysInMonth = [
  [0],
  [31],
  [28],
  [31],
  [30],
  [31],
  [30],
  [31],
  [31],
  [30],
  [31],
  [30],
  [31],
];

// console.log('i18n in utils', i18n);
export default {
  accountType: (type) => {
    const str = type.toString();
    switch (str) {
      case '1':
        return t('platform');
      case '2':
        return t('administrator');
      case '3':
        return t('adminIden');
      default:
        return '';
    }
  },
  fomats: (str) => {
    const yy = str.substring(0, 4);
    const mm = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);
    const seconds = str.substring(12, 14);
    return `${yy}-${mm}-${day} ${hour}:${minute}:${seconds}`;
  },
  /* 时间格式化 */
  dateFomat: (str) => {
    const timeDate = new Date(str);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    let hours = timeDate.getHours();
    let minute = timeDate.getMinutes();
    let second = timeDate.getSeconds();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    hours = hours < 10 ? `0${hours}` : hours;
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    return `${year}/${mounth}/${day} ${hours}:${minute}:${second}`;
  },
  /* 硬件的格林威治时间 转北京时间 并格式化 */
  UTCTime: (str) => {
    const yy = str.substring(0, 4);
    const mm = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);
    const seconds = str.substring(12, 14);
    const utc = `${yy}/${mm}/${day} ${hour}:${minute}:${seconds} UTC`;
    const msec = new Date(utc).getTime();
    return this.a.dateFomat(msec);
  },
  Days: (str) => {
    // parseInt的第二个参数有四种：2、8、10、16，分别对应二进制、八进制、十进制、十六进制；默认是：十进制；
    const days = parseInt(str / 86400000, 10);
    const hours = parseInt((str % 86400000) / 3600000, 10);
    const minutes = parseInt((str % 3600000) / 60000, 10);
    const seconds = str % 60;
    let result;
    if (!days) {
      result = `${hours}${t('time.hour')} ${minutes}${t(
        'time.mins',
      )} ${seconds}${t('time.sec')}`;
      if (!hours) {
        result = `${minutes}${t('time.mins')} ${seconds}${t('time.sec')}`;
        if (!minutes) {
          result = `${seconds}${t('time.sec')}`;
        }
      }
    } else {
      result = `${days}${t('time.day')} ${hours}${t('time.hour')} ${minutes}${t(
        'time.mins',
      )} ${seconds}${t('time.sec')}`;
    }
    return result;
  },
  setStorage: (key, data) => {
    sessionStorage.setItem(key, data);
  },
  getStorage: key => sessionStorage.getItem(key),
  removeStorage: (key) => {
    sessionStorage.removeItem(key);
  },
  removeStorageAll: () => {
    sessionStorage.clear();
  },
  setToken: (token) => {
    sessionStorage.setItem('token', token);
  },
  /* 时间格式化 */
  dateFomats: (str) => {
    const timeDate = new Date(str);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    let hours = timeDate.getHours();
    let minute = timeDate.getMinutes();
    let second = timeDate.getSeconds();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    hours = hours < 10 ? `0${hours}` : hours;
    minute = minute < 10 ? `0${second}` : second;
    second = second < 10 ? `0${second}` : second;
    return `${year}/${mounth}/${day} ${hours}:${minute}:${second}`;
  },
  getNowTime: () => {
    const now = new Date().getTime();
    const nowTime = this.a.dateFomat(now);
    return this.a.toUTCTime(nowTime);
  },
  getFourHours: () => {
    const now = new Date().getTime();
    const yestoday = now - 14400000;
    const yesTime = this.a.dateFomat(yestoday);
    return this.a.toUTCTime(yesTime);
  },
  getWeek: () => {
    const now = new Date().getTime();
    const yestoday = new Date(now - 604800000);
    return yestoday;
  },
  getMouth: () => {
    const date = new Date();
    let strYear = date.getFullYear();
    let strDay = date.getDate();
    let strMonth = date.getMonth() + 1;
    if (strYear % 4 === 0 && strYear % 100 !== 0) {
      daysInMonth[2] = 29;
    }
    if (strMonth - 1 === 0) {
      strYear -= 1;
      strMonth = 12;
    } else {
      strMonth -= 1;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
      strMonth = `0${strMonth}`;
    }
    if (strDay < 10) {
      strDay = `0${strDay}`;
    }
    return `${strYear}-${strMonth}-${strDay}`;
  },
  getThreeMounth: () => {
    const date = new Date();
    let strYear = date.getFullYear();
    let strDay = date.getDate();
    let strMonth = date.getMonth() + 1;
    if (strYear % 4 === 0 && strYear % 100 !== 0) {
      daysInMonth[2] = 29;
    }

    if (strMonth - 3 === 0) {
      strYear -= 1;
      strMonth = 12;
    } else if (strMonth - 3 === -1) {
      strYear -= 1;
      strMonth = 11;
    } else if (strMonth - 3 === -2) {
      strYear -= 1;
      strMonth = 10;
    } else {
      strMonth -= 3;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
      strMonth = `0${strMonth}`;
    }
    if (strDay < 10) {
      strDay = `0${strDay}`;
    }
    return `${strYear}-${strMonth}-${strDay}`;
  },
  getSixMounth: () => {
    const date = new Date();
    let strYear = date.getFullYear();
    let strDay = date.getDate();
    let strMonth = date.getMonth() + 1;
    if (strYear % 4 === 0 && strYear % 100 !== 0) {
      daysInMonth[2] = 29;
    }
    if (strMonth - 6 === 0) {
      strYear -= 1;
      strMonth = 12;
    } else if (strMonth - 6 === -1) {
      strYear -= 1;
      strMonth = 11;
    } else if (strMonth - 6 === -2) {
      strYear -= 1;
      strMonth = 10;
    } else if (strMonth - 6 === -3) {
      strYear -= 1;
      strMonth = 9;
    } else if (strMonth - 6 === -4) {
      strYear -= 1;
      strMonth = 8;
    } else if (strMonth - 6 === -5) {
      strYear -= 1;
      strMonth = 7;
    } else {
      strMonth -= 6;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
      strMonth = `0${strMonth}`;
    }
    if (strDay < 10) {
      strDay = `0${strDay}`;
    }
    return `${strYear}-${strMonth}-${strDay}`;
  },
  getYear: () => {
    const date = new Date();
    const strYear = date.getFullYear() - 1;
    let strDay = date.getDate();
    let strMonth = date.getMonth() + 1;
    if (strMonth < 10) {
      strMonth = `0${strMonth}`;
    }
    if (strDay < 10) {
      strDay = `0${strDay}`;
    }
    return `${strYear}-${strMonth}-${strDay}`;
  },
  checkDate: (data) => {
    const res = data.toString();
    if (
      res.indexOf('年') > 0 ||
      res.indexOf('月') > 0 ||
      res.indexOf('日') > 0 ||
      res.length < 7 ||
      res.length > 11
    ) {
      return false;
    }
    return true;
  },
  yyyymmdd: (str) => {
    const timeDate = new Date(str);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    return `${year}-${mounth}-${day}`;
  },
  hhmmss: (str) => {
    const timeDate = new Date(str);
    let hours = timeDate.getHours();
    let minute = timeDate.getMinutes();
    let second = timeDate.getSeconds();
    hours = hours < 10 ? `0${hours}` : hours;
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    return `${hours}:${minute}:${second}`;
  },
  level: (num) => {
    const Num = Number(num);
    switch (Num) {
      case 1:
        return t('group.high');
      case 2:
        return t('group.mid');
      case 3:
        return t('group.low');
      default:
        break;
    }
  },
  item: (str) => {
    switch (str) {
      case 'Voltage':
        return t('realTime.voltage');
      case 'Current':
        return t('realTime.current'); // "电流";
      case 'Temperature':
        return t('realTime.temperature'); // "温度";
      case 'Fluid':
        return t('realTime.fluid'); // "液位";
      default:
        break;
    }
  },
  year2year: (start, end) => {
    const startdate = new Date(start);
    const enddate = new Date(end);

    const startyear = startdate.getFullYear() - 1;
    let startMonth = startdate.getMonth() + 1;
    let startday = startdate.getDate();
    let startHours = startdate.getHours();
    let startMinute = startdate.getMinutes();
    let startSecond = startdate.getSeconds();
    startMonth = startMonth < 10 ? `0${startMonth}` : startMonth;
    startday = startday < 10 ? `0${startday}` : startday;
    startHours = startHours < 10 ? `0${startHours}` : startHours;
    startMinute = startMinute < 10 ? `0${startMinute}` : startMinute;
    startSecond = startSecond < 10 ? `0${startSecond}` : startSecond;

    const endyear = enddate.getFullYear() - 1;
    let endMonth = enddate.getMonth() + 1;
    let endday = enddate.getDate();

    let endHours = startdate.getHours();
    let endMinute = startdate.getMinutes();
    let endSecond = startdate.getSeconds();
    endMonth = endMonth < 10 ? `0${endMonth}` : endMonth;
    endday = endday < 10 ? `0${endday}` : endday;
    endHours = endHours < 10 ? `0${endHours}` : endHours;
    endMinute = endMinute < 10 ? `0${endMinute}` : endMinute;
    endSecond = endSecond < 10 ? `0${endSecond}` : endSecond;

    const resultStart = `${startyear}/${startMonth}/${startday} ${startHours}:${startMinute}:${startSecond}`;
    const resultEnd = `${endyear}/${endMonth}/${endday} ${endHours}:${endMinute}:${endSecond}`;
    return {
      startTime: this.a.toUTCTime(resultStart),
      endTime: this.a.toUTCTime(resultEnd),
    };
  },
  m2m: (start, end) => {
    // let startdate = new Date(start);
    // let enddate = new Date(end).getTime();
    // let startTime = startdate.getTime();
    const different = end - start;
    const prev = start - different - 86400000;
    const period = start;
    return {
      startTime: this.a.toUTCTime(prev),
      endTime: this.a.toUTCTime(period),
    };
  },
  sortTime: (str) => {
    const timeDate = new Date(str);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    return `${year}${mounth}${day}`;
  },
  sortTime2: (str) => {
    const timeDate = new Date(str);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    return `${year}-${mounth}-${day}`;
  },
  zoomTime: (start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const days = endTime - startTime;
    return days;
  },
  RexTime: (str) => {
    const start = str.replace(/-/g, '');
    const starts = start.replace(/:/g, '');
    const startss = starts.replace(/ /g, '');
    return startss;
  },
  /* 北京时间 转格林威治时间 */
  toUTCTime: (data) => {
    const res = new Date(data).toISOString();
    const res1 = res.replace(/-/g, '');
    const res2 = res1.replace(/T/g, '');
    const res3 = res2.replace(/:/g, '');
    // console.log(res1);
    return res3.substr(0, 14);
  },
  /* 格林威治时间转北京时间 毫秒数 */
  TimeSconds: (str) => {
    const yy = str.substring(0, 4);
    const mm = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);
    const seconds = str.substring(12, 14);
    const utc = `${yy}/${mm}/${day} ${hour}:${minute}:${seconds} UTC`;
    const msec = new Date(utc).getTime();
    return msec;
  },
  DifferTime: (time1, time2) => {
    const startTime = new Date(time1).getTime();
    const endTime = new Date(time2).getTime();
    return endTime - startTime;
  },
  endTime: (date) => {
    const endTime = new Date(date);
    const hours = endTime.getHours();
    const year = endTime.getFullYear();
    let mounth = endTime.getMonth() + 1;
    let day = endTime.getDate();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    let result;
    if (hours > 0) {
      result = `${year}/${mounth}/${day} 23:59:59`;
    } else {
      const times = `${year}/${mounth}/${day} 00:00:00`;
      result = new Date(times).getTime() + 86400000;
    }
    return result;
  },
  startTime: (date) => {
    const endTime = new Date(date);
    const year = endTime.getFullYear();
    let mounth = endTime.getMonth() + 1;
    let day = endTime.getDate();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    const times = `${year}/${mounth}/${day} 00:00:00`;
    const result = new Date(times).getTime();
    return result;
  },
  creatTimeEnd: (date) => {
    const endTime = new Date(date).getTime() + 86400000;
    const timeDate = new Date(endTime);
    const year = timeDate.getFullYear();
    let mounth = timeDate.getMonth() + 1;
    let day = timeDate.getDate();
    let hours = timeDate.getHours();
    let minute = timeDate.getMinutes();
    let second = timeDate.getSeconds();
    mounth = mounth < 10 ? `0${mounth}` : mounth;
    day = day < 10 ? `0${day}` : day;
    hours = hours < 10 ? `0${hours}` : hours;
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    return `${year}-${mounth}-${day} ${hours}:${minute}:${second}`;
  },
};
