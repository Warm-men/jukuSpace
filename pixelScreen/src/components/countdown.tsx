import React, { useState, useEffect } from 'react';
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

  const _hour = Math.floor(value / 60) || 0;
  const _min = Math.floor(value / 60) || 0;

  const [hour, setHour] = useState(_hour);
  const [min, setMin] = useState(_min);

  useEffect(() => {
    const time = hour * 60 + min;
    onValueChange(time);
  }, [hour, min]);

  const getHourData = () => {
    const range = Utils.NumberUtils.range(0, 2, 1);
    const timerRange = range.map((item: number) => {
      return {
        label: item > 9 ? `${item}` : `0${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  const getMinData = () => {
    const range = Utils.NumberUtils.range(0, 60, 1);
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
        selectedValue={hour}
        onValueChange={(value: number) => setHour(value)}
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
        selectedValue={min}
        onValueChange={(value: number) => setMin(value)}
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
