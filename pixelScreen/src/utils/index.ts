/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/prefer-default-export */
import { Utils } from 'tuya-panel-kit';
import moment from 'moment';
import Res from '@res';
import { store } from '../models';
import Strings from '../i18n';

export const getFaultStrings = (faultCode: string, faultValue: number, onlyPrior = true) => {
  const { devInfo } = store.getState();
  if (!faultValue) return '';
  const { label } = devInfo.schema[faultCode];
  const labels: string[] = [];
  for (let i = 0; i < label!.length; i++) {
    const value = label![i];
    const isExist = Utils.NumberUtils.getBitValue(faultValue, i);
    if (isExist) {
      labels.push(Strings.getDpLang(faultCode, value));
      if (onlyPrior) break;
    }
  }
  return onlyPrior ? labels[0] : labels.join(', ');
};

export const repeat2Text = (repeat: number[], switchState: boolean) => {
  if (repeat.filter(item => item === 1).length === 7) {
    return Strings.getLang('everyday');
  }
  if (repeat.filter(item => item === 0).length === 7) {
    return switchState ? Strings.getLang('once') : Strings.getLang('none');
  }
  if (
    repeat.slice(0, 5).filter(item => item === 1).length === 5 &&
    repeat.filter(item => item === 1).length === 5
  ) {
    return Strings.getLang('workday');
  }
  if (
    repeat.slice(5, 7).filter(item => item === 1).length === 2 &&
    repeat.filter(item => item === 1).length === 2
  ) {
    return Strings.getLang('weekend');
  }
  return repeat
    .map((item, idx) => {
      if (item === 1) {
        return Strings.getLang(`day_${idx}`);
      }
      return '';
    })
    .filter(item => item)
    .join(' ');
};
export const toString10 = (value: number | string) => {
  return `${parseInt(`${value}`, 16)}`.padStart(2, '0');
};
export const toString16 = (value: number | string, padNumber = 2) => {
  const value16 = (+value).toString(16);
  return value16.padStart(
    padNumber !== 2 ? padNumber : value16.length % 2 === 0 ? value16.length : value16.length + 1,
    '0'
  );
};
// 定时开灯
// F FFFF FFFF FFFF FFFF FFFF FFFF
// F：定时开关；枚举：0-禁止定时开灯，1-启动定时开灯；
// FFFF：启动时间点（24小时制）；HH小时；数值：0-360；
// FFFF：启动时间点（24小时制）；MM分钟；数值：0-1000；
// FFFF：持续亮灯时长；MM分钟；数值：0-1000；
// FFFF：重复周期；Repeat（周一到周日是0X7F,周一到周五是0X5F）；数值：0-1000；
// FFFF：（无效，固定值=0）；
// 转成16进字符串下发
export const planOpen2String = (planOpen: any) => {
  try {
    const { repeat, switchState, time, duration } = planOpen;
    const repeatStr = toString16(parseInt(repeat.join(''), 2), 4);
    const hourStr = toString16(time.hour, 4);
    const minuteStr = toString16(time.minute, 4);
    const durationStr = toString16(duration, 4);
    const switchStateStr = switchState ? '1' : '0';
    return `${switchStateStr}${hourStr}${minuteStr}${durationStr}${repeatStr}0000`;
  } catch (error) {
    return `000000000000000000000`;
  }
};

export const planOpen2Object = (planOpen: string) => {
  if (!planOpen)
    return {
      switchState: false,
      time: { hour: 0, minute: 0 },
      duration: 0,
      repeat: [0, 0, 0, 0, 0, 0, 0],
    };
  try {
    const switchState = planOpen.slice(0, 1) === '1';
    const hour = parseInt(planOpen.slice(1, 5), 16);
    const minute = parseInt(planOpen.slice(5, 9), 16);
    const duration = parseInt(planOpen.slice(9, 13), 16);
    const repeat = parseInt(planOpen.slice(13, 17), 16)
      .toString(2)
      .padStart(7, '0')
      .split('')
      .map(item => +item);
    return { switchState, time: { hour, minute }, duration, repeat };
  } catch (error) {
    return {
      switchState: false,
      time: { hour: 0, minute: 0 },
      duration: 0,
      repeat: [0, 0, 0, 0, 0, 0, 0],
    };
  }
};

export interface SceneItem {
  id: number;
  img: string;
  size: number;
  effect: number;
  speed: number;
  brightness: number;
  hue: number;
  onFocus: boolean;
  show?: boolean;
}

/**
 * //APP将字母拖到面板，并对每个字母或几个字母（max=18）进行灯效编辑后下发，作为APP下发的灯效参数，字母灯进入APP灯效模式，按照APP下发的参数点亮每个字符
 * TT （FF FF F FFF FF FF）括号内为每个字母的参数，多个字母循环一起组包一次下发。

 * TT：面板上已经拖放的总字母数量；scene_id；数值：0-255；最多18个字母灯

  *FF：第一个字母的编码—字母编码见另外表格；transition_interval；数值：0-100；
  *FF：第一个字母的灯效编号—灯效编号见dp85；duration；0-100；
  *F：第一个字母是否选中状态—有可能无效，change_mode，枚举；0-未选中，1-选中；
  *FFF：第一个字母的灯效颜色；H；数值：0-360；
  *FF：第一个字母的亮度；B；数值：0-100；
  *FF：第一个字母的速度；T；数值：0-100；
 * @param sceneData 
 */
export const sceneData2String = (sceneList: [SceneItem]) => {
  try {
    const totalLength = sceneList.filter(i => i.show).length;
    const totalStr = toString16(totalLength, 2);
    const sceneListStr = sceneList
      .map((item: SceneItem) => {
        if (!item || !item.show) return '';
        const { id, effect, speed, brightness, hue, onFocus } = item;
        const letterIdStr = toString16(id, 2);
        const effectStr = toString16(effect, 2);
        const changeMode = onFocus ? '1' : '0';
        const hueStr = toString16(hue, 3);
        console.log('🚀 ~ file: index.ts:156 ~ .map ~ hueStr:', hueStr);
        const speedStr = toString16(speed, 2);
        const brightnessStr = toString16(brightness, 2);

        return `${letterIdStr}${effectStr}${changeMode}${hueStr}${brightnessStr}${speedStr}`;
      })
      .join('');
    return `${totalStr}${sceneListStr}`;
  } catch (error) {
    return '';
  }
};

// id = 1~ 26 为字母，图片引用为Res[A~Z]
// id = 27~ 32 为符号，图片引用为Res[`symbol_${index}`]
// id = 33~ 42 为数字，图片引用为Res[`number_${index}`]
// id = 50~ 58 为词组，Res[`phrase_${index}`]
// 根据id获取图片
const getElementImg = (id: number) => {
  if (id >= 1 && id <= 26) return Res[`${String.fromCharCode(64 + id)}`];
  if (id >= 27 && id <= 32) return Res[`symbol_${id - 26}`];
  if (id >= 33 && id <= 42) return Res[`number_${id - 32}`];
  if (id >= 43 && id <= 49) return Res[`phrase_${id - 43}`];
  return '';
};

const getElementSize = (id: number) => {
  if (id >= 1 && id <= 26) return 1;
  if (id >= 27 && id <= 32) return 1;
  if (id >= 33 && id <= 42) return 1;
  if (id >= 43 && id <= 49) return 2;
  return 1;
};

/**
 * //APP将字母拖到面板，并对每个字母或几个字母（max=18）进行灯效编辑后下发，作为APP下发的灯效参数，字母灯进入APP灯效模式，按照APP下发的参数点亮每个字符
 * TT （FF FF F FFF FF FF）括号内为每个字母的参数，多个字母循环一起组包一次下发。

 * TT：面板上已经拖放的总字母数量；scene_id；数值：0-255；最多18个字母灯

  *FF：第一个字母的编码—字母编码见另外表格；transition_interval；数值：0-100；
  *FF：第一个字母的灯效编号—灯效编号见dp85；duration；0-100；
  *F：第一个字母是否选中状态—有可能无效，change_mode，枚举；0-未选中，1-选中；
  *FFF：第一个字母的灯效颜色；H；数值：0-360；
  *FF：第一个字母的亮度；B；数值：0-100；
  *FF：第一个字母的速度；T；数值：0-100；
 * @param sceneData 
 */
export const sceneString2Data = (sceneData: string) => {
  try {
    if (!sceneData) return [];
    const totalLength = parseInt(sceneData.slice(0, 2), 16);
    const sceneList = [];
    for (let i = 0; i < totalLength; i++) {
      const start = i * 12 + 2;
      const letterId = parseInt(sceneData.slice(start, start + 2), 16);
      const effect = parseInt(sceneData.slice(start + 2, start + 4), 16);
      const hue = parseInt(sceneData.slice(start + 5, start + 8), 16);
      const brightness = parseInt(sceneData.slice(start + 8, start + 10), 16);
      const speed = parseInt(sceneData.slice(start + 10, start + 12), 16);
      const img = getElementImg(letterId);
      const size = getElementSize(letterId);
      sceneList.push({
        id: letterId,
        effect,
        hue,
        brightness,
        speed,
        img,
        onFocus: false,
        size,
        show: true,
      });
    }
    return sceneList;
  } catch (error) {
    return [];
  }
};
export const getAmPmData = () => {
  return [
    {
      label: 'AM',
      value: 'AM',
    },
    {
      label: 'PM',
      value: 'PM',
    },
  ];
};

export const getHourData = () => {
  const range = Utils.NumberUtils.range(1, 13, 1);
  const timerRange = range.map((item: number) => {
    return {
      label: `${item}`,
      value: item,
    };
  });
  return timerRange;
};

export const getMinuteData = () => {
  const range = Utils.NumberUtils.range(0, 60, 1);
  const timerRange = range.map((item: number) => {
    return {
      label: `${item}`,
      value: item,
    };
  });
  return timerRange;
};

export const string2ClockState = (str: string) => {
  if (str.length !== 8)
    return {
      alarm1: '',
      alarm2: '',
    };
  return {
    alarm1: +str.slice(0, 2), //  0-闹钟1响闹状态，1-闹钟1贪睡状态， 2-闹钟1停闹状态
    alarm2: +str.slice(2, 4), //  0-闹钟2响闹状态，1-闹钟2贪睡状态， 2-闹钟2停闹状态
  };
};

// Data[0]为年份, 0x14表示2020年；
// Data[1]为月份,1-12；
// Data[2]为日期,1-31；
// Data[3]为时钟,0-23；
// Data[4]为分钟,0-59；
// Data[5]为秒钟,0-59；
// Data[6]为星期,1-7；
// 默认值为2024年3月1日12:00 星期五
// 设备端1分钟上报一次；
// 输出格式 { year: 24, month: 3, day: 1, hour: 12, minute: 0, second: 0, week: 5 }
export const timeSync2Object = (timeSync: string) => {
  if (!timeSync || timeSync.length !== 14) return null;
  return {
    year: parseInt(timeSync.slice(0, 2), 16),
    month: parseInt(timeSync.slice(2, 4), 16),
    day: parseInt(timeSync.slice(4, 6), 16),
    hour: parseInt(timeSync.slice(6, 8), 16),
    minute: parseInt(timeSync.slice(8, 10), 16),
    second: parseInt(timeSync.slice(10, 12), 16),
    week: parseInt(timeSync.slice(12, 14), 16),
  };
};

export const timeSync2String = (timeSync: any) => {
  if (!timeSync) return '';
  const year = timeSync.year ? toString16(timeSync.year, 2) : '00';
  const month = timeSync.month ? toString16(timeSync.month, 2) : '00';
  const day = timeSync.day ? toString16(timeSync.day, 2) : '00';
  const hour = timeSync.hour ? toString16(timeSync.hour, 2) : '00';
  const minute = timeSync.minute ? toString16(timeSync.minute, 2) : '00';
  const second = timeSync.second ? toString16(timeSync.second, 2) : '00';
  const week = timeSync.week ? toString16(timeSync.week, 2) : '00';
  return `${year}${month}${day}${hour}${minute}${second}${week}`;
};

export const padStart2 = (value: number | string) => {
  return `${value}`.padStart(2, '0');
};

// Data[0]第1个列表序号要显示的模板编号，对应的模板参数；
// Data[1] 背景色：黑底，对比色，5纯色；
// Data[2] 边框：无，彩条1，彩条2，彩条3；
// Data[3]进场方式：无（直接出现），淡入，左移，右移，上移，下移；（1-6）
// Data[4]停留方式：直接显示，反白，闪烁
// Data[5]出场方式：无（直接消失），淡出，左移，右移，上移，下移；（1-6）
// Data[6]速度：1-10，根据显示内容来做进出场动作的速度计算；
// Data[7]停留时长：进场完成后，显示内容的停留时间，5秒-1800秒；
// Data[8]颜色：显示内容的颜色（6纯色+5种彩色带）；

// Data[9]第2个列表序号要显示的模板编号，对应的模板参数;
// Data[10] Data[11] Data[12]Data[13]Data[14]Data[15]Data[16]；
// 同上循环，直到显示列表完全展示完，显示列表最大20条（9*20=180字节，可以一包传输完）。
export const playListMap2String = (playList: { modeId: number; dpValue: string }[]) => {
  const playListStr = playList.reduce((prev, item) => {
    return prev + item.dpValue;
  }, '');
  return playListStr;
};

// 将playListString转成playListMap, 每个item的dpValue长度为18，每个data的长度是2
export const playListString2Map = (playListStr: string) => {
  // 判断是否是18的倍数
  if (playListStr.length % 18 !== 0) return [];
  const playList: { modeId: number; dpValue: string }[] = [];
  for (let i = 0; i < playListStr.length; i += 18) {
    const dpValue = playListStr.slice(i, i + 18);
    const modeId = dpValue.slice(0, 2);
    playList.push({
      modeId: parseInt(modeId, 16),
      dpValue,
    });
  }
  return playList;
};

const clockDefault = {
  hour: moment().hour(),
  minute: moment().minute(),
  repeat: [1, 1, 1, 1, 1, 1, 1],
  music: 1,
  volume: 50,
  effect: 1,
  duration: 30,
  shake: 0,
  animation: 0,
  animationId: 0,
  snooze: 1,
  snoozeDuration: 9,
  snoozeClose: 0,
};

// Data[0] HH；
// Data[1] MM；
// Data[2] 重复周期（0-单次，0b01111111 周一-周日 16进制传输 0x7F，默认每天)；
// Data[3] 闹钟音乐（1-8首）；
// Data[4] 闹钟音量（1-10级）；
// Data[5] 闹钟音效（0x0--正常，0x01-渐强，0x2--渐弱，默认01-渐强）
// Data[6] 持续响闹时间长度（15-30分钟，默认30分钟）；
// Data[7] 响闹时是否支持震动；
// Data[8] 响闹时是否支持响闹动画；
// Data[9] 响闹动画模板号；
// Data[10] 响闹时是否支持贪睡（默认支持）；
// Data[11] 贪睡间隔时间长度（5-30分钟，默认9分钟）；
// Data[12] 贪睡执行的关闭内容（关闭音乐；关闭动画；关闭动画+音乐）；
// 示例：'0a0a7f0101011e010101010901'
// 解析返回：{ hour: 10, minute: 10, repeat: [1, 1, 1, 1, 1, 1, 1], music: 1, volume: 1, effect: 1, duration: 30, shake: 1, animation: 1, animationId: 1, snooze: 1, snoozeDuration: 9, snoozeClose: 1 }
export const clockString2Object = (clockStr: string) => {
  if (clockStr.length !== 26) return clockDefault;
  return {
    hour: parseInt(clockStr.slice(0, 2), 16),
    minute: parseInt(clockStr.slice(2, 4), 16),
    repeat: parseInt(clockStr.slice(4, 6), 16)
      .toString(2)
      .padStart(7, '0')
      .split('')
      .map(item => +item),
    music: parseInt(clockStr.slice(6, 8), 16),
    volume: parseInt(clockStr.slice(8, 10), 16),
    effect: parseInt(clockStr.slice(10, 12), 16),
    duration: parseInt(clockStr.slice(12, 14), 16),
    shake: parseInt(clockStr.slice(14, 16), 16),
    animation: parseInt(clockStr.slice(16, 18), 16),
    animationId: parseInt(clockStr.slice(18, 20), 16),
    snooze: parseInt(clockStr.slice(20, 22), 16),
    snoozeDuration: parseInt(clockStr.slice(22, 24), 16),
    snoozeClose: parseInt(clockStr.slice(24, 26), 16),
  };
};

interface ClockObject {
  hour: number;
  minute: number;
  repeat: number[];
  music: number;
  volume: number;
  effect: number;
  duration: number;
  shake: number;
  animation: number;
  animationId: number;
  snooze: number;
  snoozeDuration: number;
  snoozeClose: number;
}

export const clockObject2String = (clock: ClockObject) => {
  if (!clock) return '';
  // 转16进字符
  const hour = toString16(clock.hour, 2);
  const minute = toString16(clock.minute, 2);
  const repeat = parseInt(clock.repeat.join(''), 2);
  const repeatStr = toString16(repeat, 2);
  const music = toString16(clock.music, 2);
  const volume = toString16(clock.volume, 2);
  const effect = toString16(clock.effect, 2);
  const duration = toString16(clock.duration, 2);
  const shake = toString16(clock.shake, 2);
  const animation = toString16(clock.animation, 2);
  const animationId = toString16(clock.animationId, 2);
  const snooze = toString16(clock.snooze, 2);
  const snoozeDuration = toString16(clock.snoozeDuration, 2);
  const snoozeClose = toString16(clock.snoozeClose, 2);
  return `${hour}${minute}${repeatStr}${music}${volume}${effect}${duration}${shake}${animation}${animationId}${snooze}${snoozeDuration}${snoozeClose}`;
};
