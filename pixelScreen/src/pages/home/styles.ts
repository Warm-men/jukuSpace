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
    paddingHorizontal: cx(20),
    paddingBottom: cx(24),
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
    marginTop: cx(16),
    borderRadius: cx(12),
    padding: cx(20),
    backgroundColor: '#21202C',
  },
  settingViewBottom: {
    marginTop: cx(16),
    borderRadius: cx(12),
    backgroundColor: '#21202C',
    paddingHorizontal: cx(20),
    height: cx(62),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingViewBottomImage: {
    width: cx(24),
    height: cx(24),
  },
  modeView: {
    marginTop: cx(20),
    borderRadius: cx(12),
    backgroundColor: '#21202C',
  },
  modeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: cx(18),
  },
  buttonsView: {
    position: 'absolute',
    bottom: cx(0),
    height: cx(65),
    width: cx(334),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#232137',
    paddingHorizontal: cx(36),
  },
  buttonImg: {
    width: cx(28),
    height: cx(29),
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
  text14w: {
    fontSize: cx(14),
    color: '#fff',
    marginBottom: cx(4),
  },
  text12w: {
    fontSize: cx(12),
    color: '#fff',
    opacity: 0.75,
    width: cx(120),
  },
  text16B: {
    fontSize: cx(16),
    color: commonColor.mainColor,
    fontWeight: 'bold',
  },
  text16BW: {
    fontSize: cx(16),
    color: commonColor.mainText,
    fontWeight: 'bold',
  },
  text24BW: {
    fontSize: cx(24),
    color: commonColor.mainText,
    fontWeight: 'bold',
  },
  text12: {
    fontSize: cx(12),
    color: commonColor.mainText,
  },
  tempHumView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempHumLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  temHumLine: {
    width: cx(1),
    height: cx(20),
    backgroundColor: '#D8D8D8',
    opacity: 0.5,
    marginHorizontal: cx(12),
    marginTop: cx(4),
  },
  temHumImage: {
    width: cx(32),
    height: cx(32),
  },
  addView: {
    width: cx(335),
    height: cx(54),
    borderRadius: cx(12),
    backgroundColor: '#21202C',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addImg: {
    width: cx(24),
    height: cx(24),
    resizeMode: 'contain',
    marginRight: cx(4),
  },
  clockItem: {
    height: cx(54),
  },
  clockItemText: {
    marginLeft: cx(16),
  },
  line: {
    width: cx(287),
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3B394A',
    marginVertical: cx(8),
    marginBottom: cx(16),
  },
  modalItemView: {
    borderRadius: cx(8),
    marginBottom: cx(12),
  },
  modalItemViewBorder: {
    borderColor: '#fff',
    borderWidth: cx(3),
  },
  modalItemImage: {
    width: cx(88),
    height: cx(44),
    borderRadius: cx(8),
  },
  modalListView: {
    backgroundColor: '#21202C',
    padding: cx(20),
    borderRadius: cx(12),
    paddingBottom: cx(70),
    overflow: 'hidden',
  },
  modalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  modalListTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: cx(17),
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
  homeModalTime1: {
    color: '#fff',
    fontSize: cx(16),
    fontWeight: '600',
    marginLeft: cx(4),
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
  sceneItemViewImg: {
    width: cx(50),
    height: cx(50),
    borderRadius: cx(8),
  },
});

export default styles;
