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

export const modalCategoryIds1 = [11, 12, 13];
export const modalCategoryIds2 = [21, 31];
export const modalCategoryIds3 = [
  51, 52, 53, 54, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
];

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
    icon: Res.mode_13,
    modeId: 13,
    dpValue: '150000000000000000',
  },
  {
    icon: Res.mode_21,
    modeId: 21,
    dpValue: '160000000000000000',
  },
  {
    icon: Res.mode_31,
    modeId: 31,
    dpValue: '170000000000000000',
  },
  {
    icon: Res.mode_51,
    modeId: 51,
    dpValue: '180000000000000000',
  },
  {
    icon: Res.mode_52,
    modeId: 52,
    dpValue: '1f0000000000000000',
  },
  {
    icon: Res.mode_53,
    modeId: 53,
    dpValue: '200000000000000000',
  },
  {
    icon: Res.mode_54,
    modeId: 54,
    dpValue: '290000000000000000',
  },
  {
    icon: Res.mode_71,
    modeId: 71,
    dpValue: '2a0000000000000000',
  },
  {
    icon: Res.mode_72,
    modeId: 72,
    dpValue: '330000000000000000',
  },
  {
    icon: Res.mode_73,
    modeId: 73,
    dpValue: '340000000000000000',
  },
  {
    icon: Res.mode_74,
    modeId: 74,
    dpValue: '350000000000000000',
  },
  {
    icon: Res.mode_75,
    modeId: 75,
    dpValue: '360000000000000000',
  },
  {
    icon: Res.mode_76,
    modeId: 76,
    dpValue: '3d0000000000000000',
  },
  {
    icon: Res.mode_77,
    modeId: 77,
    dpValue: '3e0000000000000000',
  },
  {
    icon: Res.mode_78,
    modeId: 78,
    dpValue: '3f0000000000000000',
  },
  {
    icon: Res.mode_79,
    modeId: 79,
    dpValue: '400000000000000000',
  },
  {
    icon: Res.mode_80,
    modeId: 80,
    dpValue: '410000000000000000',
  },
  {
    icon: Res.mode_81,
    modeId: 81,
    dpValue: '420000000000000000',
  },
  {
    icon: Res.mode_82,
    modeId: 82,
    dpValue: '430000000000000000',
  },
  {
    icon: Res.mode_83,
    modeId: 83,
    dpValue: '430000000000000000',
  },
  {
    icon: Res.mode_84,
    modeId: 84,
    dpValue: '440000000000000000',
  },
  {
    icon: Res.mode_85,
    modeId: 85,
    dpValue: '450000000000000000',
  },
  {
    icon: Res.mode_86,
    modeId: 86,
    dpValue: '460000000000000000',
  },
  {
    icon: Res.mode_87,
    modeId: 87,
    dpValue: '470000000000000000',
  },
  {
    icon: Res.mode_88,
    modeId: 88,
    dpValue: '480000000000000000',
  },
  {
    icon: Res.mode_89,
    modeId: 89,
    dpValue: '490000000000000000',
  },
  {
    icon: Res.mode_90,
    modeId: 90,
    dpValue: '4a0000000000000000',
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

export type Music = {
  name?: string;
  icon?: any;
  id: number;
};

export const clockMusicList: Music[] = [
  {
    name: i18n.getLang('music_0'),
    icon: Res.mute,
    id: 0,
  },
  {
    name: i18n.getLang('music_1'),
    icon: Res.clock_1,
    id: 1,
  },
  {
    name: i18n.getLang('music_2'),
    icon: Res.clock_2,
    id: 2,
  },
  {
    name: i18n.getLang('music_3'),
    icon: Res.clock_3,
    id: 3,
  },
  {
    name: i18n.getLang('music_4'),
    icon: Res.clock_4,
    id: 4,
  },
  {
    name: i18n.getLang('music_5'),
    icon: Res.clock_5,
    id: 5,
  },
  {
    name: i18n.getLang('music_6'),
    icon: Res.clock_6,
    id: 6,
  },
  {
    name: i18n.getLang('music_7'),
    icon: Res.clock_7,
    id: 7,
  },
  {
    name: i18n.getLang('scene_music_4'),
    icon: Res.scene_music_4,
    id: 4,
  },
  {
    name: i18n.getLang('scene_music_5'),
    icon: Res.scene_music_5,
    id: 5,
  },
];

export const clockAnimationList: Music[] = [
  {
    name: i18n.getLang('clock_animation_0'),
    icon: Res.no_animation,
    id: 0,
  },
  {
    name: i18n.getLang('clock_animation_1'),
    icon: Res.mode_51,
    id: 1,
  },
  {
    name: i18n.getLang('clock_animation_2'),
    icon: Res.mode_79,
    id: 2,
  },
  {
    name: i18n.getLang('clock_animation_3'),
    icon: Res.mode_80,
    id: 3,
  },
  {
    name: i18n.getLang('clock_animation_4'),
    icon: Res.mode_81,
    id: 4,
  },
  {
    name: i18n.getLang('clock_animation_5'),
    icon: Res.mode_82,
    id: 5,
  },
  {
    name: i18n.getLang('clock_animation_6'),
    icon: Res.mode_90,
    id: 6,
  },
  {
    name: i18n.getLang('clock_animation_7'),
    icon: Res.mode_84,
    id: 7,
  },
  {
    name: i18n.getLang('clock_animation_8'),
    icon: Res.mode_53,
    id: 8,
  },
];

export const sceneAnimationList: Music[] = [
  {
    name: i18n.getLang('sleep_animate_0'),
    icon: Res.no_animation,
    id: 0,
  },
  {
    name: i18n.getLang('sleep_animate_1'),
    icon: Res.mode_54,
    id: 1,
  },
  {
    name: i18n.getLang('sleep_animate_2'),
    icon: Res.mode_78,
    id: 2,
  },
  {
    name: i18n.getLang('sleep_animate_3'),
    icon: Res.mode_86,
    id: 3,
  },
  {
    name: i18n.getLang('sleep_animate_4'),
    icon: Res.mode_87,
    id: 4,
  },
  {
    name: i18n.getLang('sleep_animate_5'),
    icon: Res.mode_88,
    id: 5,
  },
  {
    name: i18n.getLang('sleep_animate_6'),
    icon: Res.mode_89,
    id: 6,
  },
  {
    name: i18n.getLang('sleep_animate_7'),
    icon: Res.mode_90,
    id: 7,
  },
  {
    name: i18n.getLang('sleep_animate_8'),
    icon: Res.mode_52,
    id: 8,
  },
];

export const sceneMusicList: Music[] = [
  {
    name: i18n.getLang('scene_music_0'),
    icon: Res.mute,
    id: 0,
  },
  {
    name: i18n.getLang('scene_music_1'),
    icon: Res.scene_music_1,
    id: 1,
  },
  {
    name: i18n.getLang('scene_music_2'),
    icon: Res.scene_music_2,
    id: 2,
  },
  {
    name: i18n.getLang('scene_music_3'),
    icon: Res.scene_music_3,
    id: 3,
  },
  {
    name: i18n.getLang('scene_music_4'),
    icon: Res.scene_music_4,
    id: 4,
  },
  {
    name: i18n.getLang('scene_music_5'),
    icon: Res.scene_music_5,
    id: 5,
  },
  {
    name: i18n.getLang('scene_music_6'),
    icon: Res.scene_music_6,
    id: 6,
  },
  {
    name: i18n.getLang('scene_music_7'),
    icon: Res.scene_music_7,
    id: 7,
  },
  {
    name: i18n.getLang('scene_music_8'),
    icon: Res.scene_music_8,
    id: 8,
  },
  {
    name: i18n.getLang('scene_music_9'),
    icon: Res.scene_music_9,
    id: 9,
  },
  {
    name: i18n.getLang('scene_music_10'),
    icon: Res.scene_music_10,
    id: 10,
  },
  {
    name: i18n.getLang('scene_music_11'),
    icon: Res.scene_music_11,
    id: 11,
  },
];
