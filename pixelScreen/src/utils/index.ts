/* eslint-disable import/prefer-default-export */
import { Utils } from 'tuya-panel-kit';
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
