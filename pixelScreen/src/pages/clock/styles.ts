import { StyleSheet, Platform } from 'react-native';
import { Utils } from 'tuya-panel-kit';
import { commonColor } from '@config/styles';

export const { convertX: cx, convertY: cy } = Utils.RatioUtils;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clickView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pickerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerMiddle: {
    height: 36,
    width: cx(248),
    backgroundColor: '#21202C',
    borderRadius: cx(8),
    position: 'absolute',
    left: cx(44),
    top: Platform.OS === 'android' ? 58 : 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    zIndex: -1,
  },
  pickerText: {
    marginLeft: cx(64),
    fontSize: cx(18),
    color: '#FFFFFF',
  },
  optionView: {
    marginHorizontal: cx(20),
    borderRadius: cx(16),
    backgroundColor: '#21202C',
    marginTop: cx(56),
  },
  optionViewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: cx(20),
  },
  arrowImage: {
    width: cx(14),
    height: cx(14),
    marginLeft: cx(6),
  },
  pickerStyle: {
    width: cx(50),
    height: cx(160),
    backgroundColor: 'transparent',
  },
  saveView: {
    width: cx(52),
    height: cx(26),
    borderRadius: cx(13),
    backgroundColor: '#6051FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: cx(14),
    color: commonColor.mainText,
  },
  backView: {
    width: cx(24),
    height: cx(24),
    marginLeft: cx(24),
  },
  backImage: {
    width: cx(24),
    height: cx(24),
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3A3A3C',
    marginHorizontal: cx(20),
  },
  sliderView: {
    width: cx(295),
    marginTop: cx(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;