import { StyleSheet, Platform } from 'react-native';
import { Utils } from 'tuya-panel-kit';
import { commonColor } from '@config/styles';

export const { convertX: cx, convertY: cy } = Utils.RatioUtils;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    paddingHorizontal: cx(0),
  }
  
});

export default styles;
