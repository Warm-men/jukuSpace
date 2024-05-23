import { StyleSheet } from 'react-native';
import { Utils } from 'tuya-panel-kit';

export const { convertX: cx, convertY: cy } = Utils.RatioUtils;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    paddingHorizontal: cx(0),
  },
  tabsStyle: {
    borderBottomColor: '#2C2C2F',
    borderBottomWidth: 1,
  },
});

export default styles;
