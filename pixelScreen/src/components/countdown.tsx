import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Utils, TYText, Picker } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;

interface MainProps {
  onValueChange: (value: number) => void;
  value: number;
}

const PopUp = (props: MainProps) => {
  const { onValueChange, value } = props;

  const hour = Math.floor(value / 60) || 0;

  const onValueChangeHour = (_value: number) => {
    const m = value % 60;
    const _time = _value * 60 + m;
    onValueChange(_time);
  };

  const onValueChangeMinute = (_value: number) => {
    const m = _value % 60;
    const h = Math.floor(value / 60);
    const _time = h * 60 + m;
    onValueChange(_time);
  };

  const getHourData = () => {
    const range = Utils.NumberUtils.range(0, 3, 1);
    const timerRange = range.map((item: number) => {
      return {
        label: `0${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  const getMinData = () => {
    const range0 = Utils.NumberUtils.range(5, 60, 5);
    const range1 = Utils.NumberUtils.range(0, 60, 5);
    if (hour === 2) {
      return [
        {
          label: `00`,
          value: 0,
        },
      ];
    }
    const range = hour === 0 ? range0 : range1;
    const timerRange = range.map((item: number) => {
      return {
        label: item > 9 ? `${item}` : `0${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  return (
    <View style={styles.pickerView}>
      <Picker
        style={{
          width: 68,
          height: 225,
          backgroundColor: 'transparent',
        }}
        theme={{
          fontColor: '#FFFFFF',
          fontSize: cx(40),
          dividerColor: 'transparent',
        }}
        selectedValue={Math.floor(value / 60)}
        onValueChange={onValueChangeHour}
      >
        {getHourData().map(item => (
          <Picker.Item key={item.value} value={item.value} label={item.label} />
        ))}
      </Picker>
      <View style={styles.pickerBg}>
        <TYText style={styles.pickerText}>{i18n.getLang('hour')}</TYText>
      </View>
      <Picker
        style={{
          width: 68,
          height: 225,
          backgroundColor: 'transparent',
        }}
        theme={{
          fontColor: '#FFFFFF',
          fontSize: cx(40),
          dividerColor: 'transparent',
        }}
        selectedValue={value % 60}
        onValueChange={onValueChangeMinute}
      >
        {getMinData().map(item => (
          <Picker.Item key={item.value} value={item.value} label={item.label} />
        ))}
      </Picker>
      <View style={styles.pickerBg}>
        <TYText style={styles.pickerText}>{i18n.getLang('minute')}</TYText>
      </View>
    </View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  pickerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pickerBg: {
    height: 36,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  pickerText: {
    fontSize: cx(12),
    color: '#FFFFFF',
  },
});
