import { StyleSheet } from 'react-native';
import { Utils } from 'tuya-panel-kit';
import { commonColor } from '@config/styles';

export const { convertX: cx, convertY: cy } = Utils.RatioUtils;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowSp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentStyle: {
    paddingTop: cx(22),
    paddingHorizontal: cx(24),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productImg: {
    width: cx(80),
    height: cx(50),
  },
  productText: {
    fontSize: cx(20),
    color: commonColor.mainText,
    marginLeft: cx(12),
    width: cx(150),
  },
  settingView: {
    paddingVertical: cx(6),
    paddingHorizontal: cx(12),
    borderRadius: cx(14),
    backgroundColor: '#2E2C3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: cx(14),
    color: commonColor.mainText,
  },
  modeContainer: {
    marginTop: cx(20),
    borderRadius: cx(12),
    padding: cx(20),
    backgroundColor: '#21202C',
  },
  modeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: cx(18),
  },
  text17Bold: {
    fontSize: cx(17),
    color: commonColor.mainText,
    fontWeight: 'bold',
  },
  text14: {
    fontSize: cx(14),
    color: commonColor.mainText,
    opacity: 0.75,
  },
  addView: {
    width: cx(287),
    height: cx(70),
    borderRadius: cx(8),
    backgroundColor: '#2E2C3D',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addImg: {
    width: cx(16),
    height: cx(16),
    resizeMode: 'contain',
    marginRight: cx(8),
  },
  clockItem: {
    height: cx(54),
  },
  line: {
    width: cx(287),
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3B394A',
    marginVertical: cx(8),
  },
  modalItemView: {
    width: cx(138),
    height: cx(69),
    borderRadius: cx(8),
    marginBottom: cx(12),
  },
  modalItemImage: {
    width: cx(138),
    height: cx(69),
  },
  modalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  homeModalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeModalTop: {
    width: '100%',
    alignItems: 'center',
    marginTop: cx(200),
  },
  homeModalText: {
    marginTop: cx(12),
    color: '#fff',
    fontSize: cx(17),
    fontWeight: '600',
  },
  homeModalTime: {
    marginTop: cx(40),
    color: '#fff',
    fontSize: cx(60),
    fontWeight: '600',
    lineHeight: cx(60),
  },
  homeModalLater: {
    width: cx(204),
    height: cx(55),
    marginTop: cx(60),
    borderRadius: cx(27.5),
    backgroundColor: commonColor.mainColor,
  },
  snoozeView: {
    fontSize: cx(14),
    width: cx(200),
    lineHeight: cx(20),
    color: '#fff',
    marginTop: cx(20),
  },
  homeModalLaterIcon: {
    marginRight: cx(6),
    width: cx(16),
    height: cx(16),
  },
  homeModalLaterStop: {
    width: cx(134),
    height: cx(55),
    marginTop: cx(60),
    borderRadius: cx(27.5),
    backgroundColor: '#262528',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackText: {
    fontSize: cx(16),
    color: '#fff',
  },
});

export default styles;
