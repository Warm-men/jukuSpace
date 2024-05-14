import { commonApi } from '@tuya/tuya-panel-api';
import { TYSdk } from 'tuya-panel-kit';
import moment from 'moment';

export const getDayLog = async (dpId: string) => {
  // date: yyyyMMdd
  const date = moment().format('YYYYMMDD');
  const params = {
    devId: TYSdk.devInfo.devId,
    dpId,
    date,
    auto: 2,
    type: 'sum',
  };
  const res = await commonApi.statApi.getDpResultByHour(params);
  console.log('🚀 ~ file: api.ts:15 ~ getDayLog ~ params:', params, res);

  return res;
};

export const getWeekLog = async (dpId: string) => {
  const now = moment();
  const startDay = now.clone().subtract(6, 'days').format('YYYYMMDD');
  const endDay = now.format('YYYYMMDD');
  const params = {
    devId: TYSdk.devInfo.devId,
    dpId,
    startDay,
    endDay,
    type: 'sum',
  };
  const res = await commonApi.statApi.getDataWithSpecified(params);
  console.log('🚀 ~ file: api.ts:31 ~ getWeekLog ~ params:', params, res);

  return res;
};

export const getMonthLog = async (dpId: string) => {
  const now = moment();
  // 开始月为本月，结束月为下月
  const startMonth = now.format('YYYYMM');
  const endMonth = now.clone().add(1, 'months').format('YYYYMM');
  const params = {
    devId: TYSdk.devInfo.devId,
    dpId,
    startMonth,
    endMonth,
    type: 'sum',
  };
  const res = await commonApi.statApi.getMonthWithSpecified(params);
  console.log('🚀 ~ file: api.ts:48 ~ getMonthLog ~ params:', params, res);

  return res;
};

export const getYearLog = async (dpId: string) => {
  const params = {
    devId: TYSdk.devInfo.devId,
    dpId,
    type: 'sum',
  };
  const res = await commonApi.statApi.getDpResultByMonth(params);
  console.log('🚀 ~ file: api.ts:59 ~ getYearLog ~ params:', params, res);

  return res;
};

export const renderChart = (data: [], themeColor: string) => {
  console.log('传进来的data', data);
  return `
  chart.source(${JSON.stringify(data)}, ${JSON.stringify(getDefs(data))});
  chart.axis('time',  {
    labelOffset: 10,
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
      stroke: '#78787A'
    },
  })
  chart.axis('value', {
    labelOffset: 15,
    position:'left',
    tickLine:{
      length:1,
    },
  });
  chart.tooltip(false);
  ${renderGuide(data, themeColor)}
  chart.area().position('time*value').color('l(90) 0:#FCF6EF 1:#ffffff').style({fillOpacity:1});
  chart.line().position('time*value').color(${themeColor});
  chart.interaction('pan');
  chart.interaction('swipe', {
    speed: 15
  });
  chart.point()
    .position('time*value')
    .color(${themeColor})
    .size(3);
  chart.render();
  `;
};

export const renderGuide = (data, themeColor) => {
  let guideStr = '';
  data.forEach((item, index) => {
    if (item.tem) {
      guideStr += `chart.guide().html({
        position: [${index}, ${item.value}],
        html: '<span style="font-size:12px;color:${themeColor}">${item.value}</span>',
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
      tickCount: 7,
    },
    value,
  };
};
