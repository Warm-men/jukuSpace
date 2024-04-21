import i18n from '@i18n';
import Res from '../res';

interface ModelConfig {
  name: string;
  icon: any;
  modeId: number;
  dpValue: string;
  isActive?: boolean;
  extra?: {
    modeId?: number;
    background?: number;
    borderColor?: number;
    enterEffect?: number;
    stayEffect?: number;
    showEffect?: number;
    speed?: number;
    stayTime?: number;
    textColor?: number;
    brightness?: number;
  };
}

// Data[0]第1个列表序号要显示的模板编号，对应的模板参数；
// Data[1] 背景色：黑底，对比色，5纯色；
// Data[2] 边框：无，彩条1，彩条2，彩条3；
// Data[3]进场方式：无（直接出现），淡入，左移，右移，上移，下移；（1-6）
// Data[4]停留方式：直接显示，反白，闪烁
// Data[5]出场方式：无（直接消失），淡出，左移，右移，上移，下移；（1-6）
// Data[6]速度：1-10，根据显示内容来做进出场动作的速度计算；
// Data[7-8]停留时长：进场完成后，显示内容的停留时间，5秒-1800秒；
// Data[9]颜色：显示内容的颜色（6纯色+5种彩色带）；
// Data[10]整体亮度：亮度（1-10级）
export const modelConfig: ModelConfig[] = [
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_11,
    modeId: 11,
    dpValue: '0b00000000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_12,
    modeId: 12,
    dpValue: '0c00000000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_13,
    modeId: 13,
    dpValue: '0d00000000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_14,
    modeId: 14,
    dpValue: '0e00000000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_15,
    modeId: 15,
    dpValue: '0f00000000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_16,
    modeId: 16,
    dpValue: '100000000000000000',
  },
  {
    name: i18n.getLang('model_11'),
    icon: Res.mode_17,
    modeId: 17,
    dpValue: '110000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_21,
    modeId: 21,
    dpValue: '150000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_22,
    modeId: 22,
    dpValue: '160000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_23,
    modeId: 23,
    dpValue: '170000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_24,
    modeId: 24,
    dpValue: '180000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_25,
    modeId: 25,
    dpValue: '190000000000000000',
  },
  {
    name: i18n.getLang('model_21'),
    icon: Res.mode_26,
    modeId: 26,
    dpValue: '200000000000000000',
  },
  {
    name: i18n.getLang('model_41'),
    icon: Res.mode_41,
    modeId: 41,
    dpValue: '290000000000000000',
  },
  {
    name: i18n.getLang('model_41'),
    icon: Res.mode_42,
    modeId: 42,
    dpValue: '2a0000000000000000',
  },
  {
    name: i18n.getLang('model_41'),
    icon: Res.mode_43,
    modeId: 43,
    dpValue: '2b0000000000000000',
  },
  {
    name: i18n.getLang('model_41'),
    icon: Res.mode_44,
    modeId: 44,
    dpValue: '2c0000000000000000',
  },
  {
    name: i18n.getLang('model_61'),
    icon: Res.mode_61,
    modeId: 61,
    dpValue: '3d0000000000000000',
  },
  {
    name: i18n.getLang('model_61'),
    icon: Res.mode_62,
    modeId: 62,
    dpValue: '3e0000000000000000',
  },
  {
    name: i18n.getLang('model_81'),
    icon: Res.mode_81,
    modeId: 81,
    dpValue: '510000000000000000',
  },
  {
    name: i18n.getLang('model_81'),
    icon: Res.mode_82,
    modeId: 82,
    dpValue: '520000000000000000',
  },
  {
    name: i18n.getLang('model_81'),
    icon: Res.mode_83,
    modeId: 83,
    dpValue: '530000000000000000',
  },
  {
    name: i18n.getLang('model_81'),
    icon: Res.mode_84,
    modeId: 84,
    dpValue: '540000000000000000',
  },
];

export const gradientColors1 = [
  {
    color: '#FFFFFF',
    value: 0,
  },
  {
    color: '#FF4444',
    value: 1,
  },
  {
    color: '#FF9600',
    value: 2,
  },
  {
    color: '#FFDE43',
    value: 3,
  },
  {
    color: '#01DF70',
    value: 4,
  },
  {
    color: '#5EEFFA',
    value: 5,
  },
  {
    color: '#2193F9',
    value: 6,
  },
  {
    color: '#797AFF',
    value: 7,
  },
];

export const gradientColors2 = [
  {
    image: Res.gradient_color_0,
    value: 8,
  },
  {
    image: Res.gradient_color_1,
    value: 9,
  },
  {
    image: Res.gradient_color_2,
    value: 10,
  },
  {
    image: Res.gradient_color_3,
    value: 11,
  },
];
