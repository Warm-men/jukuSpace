import { StyleSheet } from 'react-native';
import { Utils } from 'tuya-panel-kit';

export const {
  convertX: cx,
  convertY: cy,
  width,
  height,
  isIos,
  isIphoneX,
  topBarHeight,
} = Utils.RatioUtils;

const commonStyles = {
  flexOne: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shadow: {
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1, // 关键, 设置值跟shadowRadius一致
    backgroundColor: '#fff',
  },
};

const commonColor = {
  mainColor: '#6051FA',
  mainText: '#fff',
  subText: '#C5C5C5',
  green: '#44B74A',
  red: '#FA5F5F',
  brown: '#DFA663',
  white: '#fff',
  background: '#17171A',
};

export { commonStyles, commonColor };
