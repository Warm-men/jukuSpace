import i18n from '@i18n';
import Res from '../res';

interface ModelConfig {
  name?: string;
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

export const modalCategoryIds1 = [11, 12];
export const modalCategoryIds2 = [21, 22, 23, 24];
export const modalCategoryIds3 = [31, 32];
export const modalCategoryIds4 = [41, 42];
export const modalCategoryIds5 = [51, 52, 53, 54];
export const modalCategoryIds6 = [61, 62, 63, 64, 65];

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

// const defaultData = {
//   modeId: 0,
//   background: 1,
//   borderColor: 1,
//   enterEffect: 1,
//   stayEffect: 1,
//   showEffect: 1,
//   speed: 5,
//   stayTime: 300,
//   textColor: 0,
//   brightness: 50,
// };
export const modelConfig: ModelConfig[] = [
  {
    icon: Res.mode_11,
    modeId: 11,
    dpValue: '0b00000000000001050030',
  },
  {
    icon: Res.mode_12,
    modeId: 12,
    dpValue: '0c00000000000000000000',
  },
  {
    icon: Res.mode_21,
    modeId: 21,
    dpValue: '150000000000000000',
  },
  {
    icon: Res.mode_22,
    modeId: 22,
    dpValue: '160000000000000000',
  },
  {
    icon: Res.mode_23,
    modeId: 23,
    dpValue: '170000000000000000',
  },
  {
    icon: Res.mode_24,
    modeId: 24,
    dpValue: '180000000000000000',
  },
  {
    icon: Res.mode_31,
    modeId: 31,
    dpValue: '1f0000000000000000',
  },
  {
    icon: Res.mode_32,
    modeId: 32,
    dpValue: '200000000000000000',
  },
  {
    icon: Res.mode_41,
    modeId: 41,
    dpValue: '290000000000000000',
  },
  {
    icon: Res.mode_42,
    modeId: 42,
    dpValue: '2a0000000000000000',
  },
  {
    icon: Res.mode_51,
    modeId: 51,
    dpValue: '330000000000000000',
  },
  {
    icon: Res.mode_52,
    modeId: 52,
    dpValue: '340000000000000000',
  },
  {
    icon: Res.mode_53,
    modeId: 53,
    dpValue: '350000000000000000',
  },
  {
    icon: Res.mode_54,
    modeId: 54,
    dpValue: '360000000000000000',
  },
  {
    icon: Res.mode_61,
    modeId: 61,
    dpValue: '3d0000000000000000',
  },
  {
    icon: Res.mode_62,
    modeId: 62,
    dpValue: '3e0000000000000000',
  },
  {
    icon: Res.mode_63,
    modeId: 63,
    dpValue: '3f0000000000000000',
  },
  {
    icon: Res.mode_64,
    modeId: 64,
    dpValue: '400000000000000000',
  },
  {
    icon: Res.mode_65,
    modeId: 65,
    dpValue: '410000000000000000',
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

export const sceneDataDefault = {
  mode: 1,
  music: 0,
  musicEffect: 0, // （0x0--正常，0x01-渐强，0x2--渐弱）默认02-渐弱；
  musicVolume: 5, // 1-10范围
  time: 5, // 伴睡时长 10 ～120
  enableAnimation: 1, // 0-关闭，1-开启
  animation: 0, // 动画序号
  manualClose: 0, // 0-自动关闭，1-手动关闭
};
