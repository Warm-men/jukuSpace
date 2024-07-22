import { StyleSheet, Platform } from 'react-native';
import { Utils } from 'tuya-panel-kit';
import { commonColor } from '@config/styles';

export const { convertX: cx, convertY: cy } = Utils.RatioUtils;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clickView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clickTextTitle: {
    fontSize: cx(14),
    color: '#C5C5C5',
    width: cx(160),
  },
  clickText: {
    fontSize: cx(14),
    color: '#78787A',
    width: cx(100),
    textAlign: 'right',
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
    marginBottom: cx(16),
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
    marginRight: cx(52),
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
  thumbStyle: {
    width: cx(14),
    height: cx(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  MaximumTrack: {
    height: cx(4),
    width: cx(295),
    borderRadius: cx(2),
  },
  renderThumb: {
    width: cx(8),
    height: cx(8),
    borderRadius: cx(4),
  },
  selectColor: {
    width: cx(16),
    height: cx(16),
    marginRight: cx(2),
  },
  gradientView: {
    width: cx(70),
    height: cx(40),
    borderRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientImage: {
    width: cx(60),
    height: cx(30),
  },
});

export default styles;
