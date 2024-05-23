import { commonApi } from '@tuya/tuya-panel-api';
import { TYSdk } from 'tuya-panel-kit';
import moment from 'moment';

const toFixed = (num: number | string) => +Number(num).toFixed(1);

export const getDayLog = async (dpId: string) => {
  try {
    const date = moment().format('YYYYMMDD');
    const params = {
      devId: TYSdk.devInfo.devId,
      dpId,
      date,
      auto: 2,
      type: 'avg',
    };
    const res = await commonApi.statApi.getDpResultByHour(params);
    // 取key字符串的最后两位
    const list = Object.keys(res).map(key => ({
      time: key.slice(key.length - 2, key.length),
      value: res[key] === '#' ? 0 : toFixed(res[key]),
    }));

    return list;
  } catch (error) {
    return [];
  }
};

export const getWeekLog = async (dpId: string) => {
  try {
    const now = moment();
    const startDay = now.clone().subtract(6, 'days').format('YYYYMMDD');
    const endDay = now.format('YYYYMMDD');
    const params = {
      devId: TYSdk.devInfo.devId,
      dpId,
      startDay,
      endDay,
      type: 'avg',
    };
    const res = await commonApi.statApi.getDataWithSpecified(params);
    const { result } = res;
    const list = Object.keys(result).map(key => ({
      time: key.slice(key.length - 2, key.length),
      value: result[key] === '#' ? 0 : toFixed(result[key]),
    }));
    return list;
  } catch (error) {
    return [];
  }
};

export const getMonthLog = async (dpId: string) => {
  try {
    const now = moment();
    // 本月第一天
    const startDay = now.clone().startOf('month').format('YYYYMMDD');
    const endDay = now.format('YYYYMMDD');
    const params = {
      devId: TYSdk.devInfo.devId,
      dpId,
      startDay,
      endDay,
      type: 'avg',
    };
    const res = await commonApi.statApi.getDataWithSpecified(params);
    const { result } = res;
    const list = Object.keys(result).map(key => ({
      time: +key.slice(key.length - 2, key.length),
      value: result[key] === '#' ? 0 : toFixed(result[key]),
    }));
    const today = now.format('DD');
    // 判断今天的奇偶
    const isOdd = +today % 2 === 1;
    // 超过15条时，只取今天的奇数点
    return list.length > 18 ? list.filter((_, index) => index % 2 === (isOdd ? 0 : 1)) : list;
  } catch (error) {
    return [];
  }
};

export const getYearLog = async (dpId: string) => {
  try {
    const params = {
      devId: TYSdk.devInfo.devId,
      dpId,
      type: 'avg',
    };
    const res = await commonApi.statApi.getDpResultByMonth(params);
    const thisYear = moment().format('YYYY');
    const yearList = res.years[thisYear];
    const list = Object.keys(yearList).map(key => ({
      time: key,
      value: yearList[key] === '#' ? 0 : toFixed(yearList[key]),
    }));
    return list;
  } catch (error) {
    return [];
  }
};

export const renderChart = (data: []) => {
  console.log('传进来的data', data);
  return `
  chart.source(${JSON.stringify(data)}, ${JSON.stringify(getDefs(data))});
  chart.axis('time',  {
    labelOffset: 15,
    position:'bottom',
    tickLine:{
      length:1,
    },
    label: (text, index, total) => {
      const cfg = {
        textAlign: 'center'
      };
      return cfg;
    },
    line: {
      lineWidth: 2,
      stroke: '#1D1C1F'
    },
    grid: {
      stroke: '#1D1C1F',
      lineDash: [2]
    }
  })
  chart.axis('value', {
    labelOffset: 15,
    position:'left',
    tickLine:{
      length:1,
    },
    grid: {
      stroke: '#1D1C1F',
      lineDash: [2]
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    crosshairsStyle: {
      stroke: '#6051FA',
      lineWidth: 1,
      lineDash: [2]
    },
    background: {
      radius: 2,
      fill: '#6051FA',
      padding: [ 6, 10 ]
    },
    titleStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'top'
    },
    nameStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'middle'
    },
    valueStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'middle'
    },
    showItemMarker: false,
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = 'Temperature';
      items[0].value = items[1].value + '°C';
      return (ev.items = ev.items.splice(1));
    },
  });
  chart.area().position('time*value').color('l(90) 0:#1D1A3E 1:#0F0D15').style({fillOpacity:1});
  chart.line().position('time*value').color('#6051FA');
  chart.interaction('pan');
  chart.interaction('swipe', {
    speed: 15
  });
  chart.point()
    .position('time*value')
    .color('#6051FA')
    .size(3);
  chart.render();
  `;
};

export const renderGuide = data => {
  let guideStr = '';
  data.forEach((item, index) => {
    if (item.time) {
      guideStr += `chart.guide().html({
        position: [${index}, ${item.value}],
        html: '<span style="font-size:12px;color:#6051FA">${item.value}</span>',
        offsetY: 0,
        alignX: 'center',
      });`;
    }
  });
  return guideStr;
};

export const renderChart2 = (data: []) => {
  console.log('传进来的data', data);
  return `
  chart.source(${JSON.stringify(data)}, ${JSON.stringify(getDefs(data))});
  chart.axis('time',  {
    labelOffset: 15,
    position:'bottom',
    tickLine:{
      length:1,
    },
    label: (text, index, total) => {
      const cfg = {
        textAlign: 'center'
      };
      return cfg;
    },
    line: {
      lineWidth: 2,
      stroke: '#1D1C1F'
    },
    grid: {
      stroke: '#1D1C1F',
      lineDash: [2]
    }
  })
  chart.axis('value', {
    labelOffset: 15,
    position:'left',
    tickLine:{
      length:1,
    },
    grid: {
      stroke: '#1D1C1F',
      lineDash: [2]
    }
  });
  chart.tooltip({
    showCrosshairs: true,
    crosshairsStyle: {
      stroke: '#F4B900',
      lineWidth: 1,
      lineDash: [2]
    },
    background: {
      radius: 2,
      fill: '#F4B900',
      padding: [ 6, 10 ]
    },
    titleStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'top'
    },
    nameStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'middle'
    },
    valueStyle: {
      fontSize: 12,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'middle'
    },
    showItemMarker: false,
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = 'Humidity';
      items[0].value = items[1].value + '%';
      return (ev.items = ev.items.splice(1));
    },
  });
  chart.area().position('time*value').color('l(90) 0:#3B2E0D 1:#3B2E0D').style({fillOpacity:1});
  chart.line().position('time*value').color('#F4B900');
  chart.interaction('pan');
  chart.interaction('swipe', {
    speed: 15
  });
  chart.point()
    .position('time*value')
    .color('#F4B900')
    .size(3);
  chart.render();
  `;
};

export const renderGuide2 = data => {
  let guideStr = '';
  data.forEach((item, index) => {
    if (item.time) {
      guideStr += `chart.guide().html({
        position: [${index}, ${item.value}],
        html: '<span style="font-size:12px;color:#F4B900">${item.value}</span>',
        offsetY: 0,
        alignX: 'center',
      });`;
    }
  });
  return guideStr;
};

export const getDefs = data => {
  console.log('传进来的data', data);

  const value = {
    range: [0, 1],
    min: 0,
  };

  // const maxValue = getFeedLogMaxValue(data);
  // console.log('最大值', maxValue);
  // maxValue < 5 && Object.assign(value, { tickInterval: 1 }); // 最大值小于5会出现小数
  return {
    time: {
      range: [0, 1],
      tickCount: data.length,
    },
    value,
  };
};
