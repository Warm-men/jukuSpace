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

const ViewBackgroundColor = 'rgba(255,255,255,0.2)';

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: cx(10),
    paddingBottom: cy(16),
  },
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBg: {
    resizeMode: 'stretch',
    width: cx(355),
    height: cx(168),
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallerImg: {
    width: cx(20),
    height: cx(16),
    resizeMode: 'stretch',
  },
  spaceBt: {
    justifyContent: 'space-between',
  },
  smallText: {
    fontSize: cx(12),
    color: '#fff',
  },
  blackText: {
    fontSize: cx(16),
    color: '#fff',
  },
  valueBlackText: {
    fontSize: cx(16),
    color: '#fff',
  },
  marginLText: {
    marginLeft: cx(10),
  },
  text: {
    fontSize: cx(14),
    color: '#fff',
  },
  text14: {
    fontSize: cx(14),
    color: '#fff',
  },
  mainOuterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: cx(26),
    paddingTop: cy(20),
    paddingBottom: cy(30),
    height: cx(168),
  },
  weatherIcon: {
    width: cx(90),
    height: cx(81),
    marginRight: cx(10),
  },
  marginBText: {
    marginBottom: cx(5),
  },
  weatherItem: {
    height: cx(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginHText: {
    marginLeft: cx(10),
    marginRight: cx(18),
  },
  itemBox: {
    borderRadius: cx(10),
    padding: cx(12),
    marginBottom: cx(10),
  },
  itemBg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  itemBgOut: {
    width: cx(354),
    height: cx(76),
    padding: cx(12),
    marginBottom: cx(10),
    backgroundColor: '#fff',
    borderRadius: cx(18),
    justifyContent: 'center',
  },
  pItemBox: {
    backgroundColor: ViewBackgroundColor,
    borderRadius: cx(2),
    paddingHorizontal: cx(12),
  },
  normalImg: {
    width: cx(20),
    height: cx(20),
  },
  pItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: cx(50),
  },
  nameBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: cx(50),
    backgroundColor: '#fff',
    paddingHorizontal: cx(20),
  },
  displayBoxIn: {
    width: cx(66),
    height: cx(30),
    borderRadius: cx(15),
    backgroundColor: '#0686E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayBoxOut: {
    width: cx(66),
    height: cx(30),
    borderRadius: cx(15),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0686E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsText: {
    color: 'rgba(0,0,0,0.3)',
    fontSize: cx(12),
    marginTop: cx(5),
  },
  valueTipsText: {
    color: '#fff',
    fontSize: cx(12),
  },
  displayActiveText: {
    color: '#fff',
    fontSize: cx(14),
  },
  displayInActiveText: {
    color: '#0686E6',
    fontSize: cx(14),
  },
  marginRText: {
    marginRight: cx(4),
  },
  marginVText: {
    marginVertical: cx(12),
  },
  bigText: {
    fontSize: cx(34),
    fontWeight: '500',
    color: '#fff',
  },
  lampIcon: {
    width: cx(30),
    height: cx(30),
    resizeMode: 'stretch',
  },
  switchIcon: {
    width: cx(40),
    height: cx(40),
    resizeMode: 'stretch',
  },
  lampSubBg: {
    width: cx(93),
    height: cx(140),
    paddingVertical: cx(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: cx(18),
  },
  margin2HText: {
    marginHorizontal: cx(20),
  },
  marginMBText: {
    marginBottom: cx(14),
  },
  snzButton: {
    paddingHorizontal: cx(6),
    height: cx(30),
    borderRadius: cx(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#0686e6',
  },
  inActiveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0686e6',
  },
  inActiveText: {
    color: '#0686e6',
    fontSize: cx(14),
  },
  activeText: {
    color: '#fff',
    fontSize: cx(14),
  },
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  thumbStyle: {
    width: cx(16),
    height: cx(16),
    borderRadius: cx(8),
    backgroundColor: '#0686E6',
  },
  trackStyle: {
    width: cx(280),
    height: cx(6),
  },
  sliderView: {
    backgroundColor: '#fff',
    borderRadius: cx(10),
    padding: cx(12),
    marginTop: cx(20),
  },
  nameText: { flex: 1, marginLeft: cx(20), justifyContent: 'flex-end' },
  sceneView: {
    marginTop: cx(30),
    marginHorizontal: cx(20),
    backgroundColor: ViewBackgroundColor,
    borderRadius: cx(16),
    paddingTop: cx(20),
    paddingBottom: cx(6),
  },
  item14Text: {
    fontSize: cx(14),
    color: '#FFF',
  },
  item12Text: {
    fontSize: cx(12),
    color: '#FFF',
  },
  item10Text: {
    fontSize: cx(10),
    color: '#FFF',
  },
  itemMarginLText: {
    marginLeft: cx(14),
  },
  itemIcon: {
    width: cx(13),
    height: cx(13),
    position: 'absolute',
    top: cx(12),
    left: cx(12),
  },
  itemIcon1: {
    width: cx(13),
    height: cx(13),
  },
  progressStyle: {
    width: cx(36),
    height: cx(36),
    transform: [{ rotate: '-90deg' }],
  },
  sceneProgressStyle: {
    width: cx(305),
    height: cx(305),
    transform: [{ rotate: '-90deg' }],
  },
  playView: {
    width: cx(42),
    height: cx(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneItemView: {
    height: cx(80),
    justifyContent: 'center',
    paddingHorizontal: cx(20),
    marginBottom: cx(0),
  },
  sceneItemViewImgs: {
    width: cx(48),
    height: cx(48),
  },
  homeTabView: {
    height: isIphoneX ? cx(80) : cx(60),
    alignItems: 'flex-start',
    paddingHorizontal: cx(50),
    backgroundColor: 'transparent',
  },
  homeTabViewText: {
    fontSize: cx(12),
    color: '#fff',
    marginTop: cx(2),
    marginBottom: cx(3),
  },
  homeTabViewImage: {
    width: cx(25),
    height: cx(24),
  },
  sliderWrap: {
    marginHorizontal: cx(20),
    marginTop: cx(20),
  },
  sliderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: cx(16),
  },
  sliderItem: {
    flexDirection: 'row',
  },
  sliderItemHeader: {
    backgroundColor: '#fff',
    borderTopLeftRadius: cx(8),
    borderBottomLeftRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: cx(40),
    height: cx(40),
  },
  lightText: {
    fontSize: cx(14),
    color: '#fff',
  },
  clockTabView: {
    width: cx(162),
    height: cx(127),
    borderRadius: cx(10),
    marginRight: cx(12),
    padding: cx(20),
    marginBottom: cx(12),
    backgroundColor: ViewBackgroundColor,
  },
  clockTabText1: {
    color: '#fff',
    fontSize: cx(17),
    fontWeight: '600',
  },
  clockTabText2: {
    color: '#fff',
    fontSize: cx(12),
    marginTop: cx(4),
  },
  clockName: {
    paddingHorizontal: cx(12),
    width: cx(335),
    height: cx(54),
    borderRadius: cx(10),
    backgroundColor: ViewBackgroundColor,
  },
  lightView: {
    marginLeft: cx(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lightImage: {
    width: cx(106),
    height: cx(106),
    borderRadius: cx(12),
    overflow: 'hidden',
  },
  lightViewItem: {
    marginRight: cx(5),
    marginBottom: cx(8),
  },
  listTitle: {
    fontSize: cx(14),
    color: '#fff',
    marginLeft: cx(20),
    marginTop: cx(24),
    marginBottom: cx(16),
  },
  snoozeTab: {
    marginVertical: cx(14),
    marginHorizontal: cx(20),
    width: cx(336),
    backgroundColor: ViewBackgroundColor,
    borderRadius: cx(10),
  },
  snoozeTop: {
    height: cx(56),
    paddingHorizontal: cx(20),
    borderBottomColor: 'rgba(255,255,255, 0.4)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  snoozeModeImage: {
    width: cx(16),
    height: cx(16),
    marginRight: cx(12),
  },
  snoozeModeItem: {
    marginLeft: cx(44),
    height: cx(56),
    borderBottomColor: 'rgba(255,255,255, 0.4)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: cx(25),
    flexDirection: 'row',
  },
  snoozeModeChoose: {
    width: cx(11.6),
    height: cx(9.5),
  },
  lightEdit: {
    position: 'absolute',
    bottom: cx(10),
    right: cx(8),
  },
  musicEdit: {
    position: 'absolute',
    bottom: cx(0),
    right: cx(0),
  },
  lightEditImage: {
    width: cx(28),
    height: cx(28),
  },
  musicEditImage: {
    height: cx(38),
    width: cx(106),
  },
  lightOffImage: {
    width: cx(22.5),
    height: cx(27.5),
  },
  homeModalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
    backgroundColor: '#0686E6',
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
    backgroundColor: '#444444',
  },
});

export default styles;
