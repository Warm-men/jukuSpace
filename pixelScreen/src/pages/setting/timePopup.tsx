import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { Utils, Picker } from 'tuya-panel-kit';
import i18n from '@i18n';
import { getAmPmData, getHourData, getMinuteData } from '@utils';
import ModalPop from '@components/modalRender';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState('AM');

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
    } else if (type === 'ampm') {
      setAmpm(value);
    } else {
      setMinute(value);
    }
  };

  const handleConfirm = () => {
    onConfirm([hour, minute, ampm]);
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={i18n.getLang('set_time')}
      popupViewHeight={cx(270)}
      outputRangeStart={300}
    >
      <View style={styles.pickerView}>
        <Picker
          style={styles.pickerStyle}
          theme={{
            fontColor: '#FFFFFF',
            fontSize: cx(22),
            dividerColor: 'transparent',
          }}
          selectedValue={hour}
          onValueChange={value => {
            handleOnChange(value, 'hour');
          }}
        >
          {getHourData().map(item => (
            <Picker.Item key={item.value} value={item.value} label={item.label} />
          ))}
        </Picker>
        <View style={styles.pickerMiddle} />
        <Picker
          style={styles.pickerStyle}
          theme={{
            fontColor: '#FFFFFF',
            fontSize: cx(22),
            dividerColor: 'transparent',
          }}
          selectedValue={minute}
          onValueChange={value => {
            handleOnChange(value, 'minute');
          }}
        >
          {getMinuteData().map(item => (
            <Picker.Item key={item.value} value={item.value} label={item.label} />
          ))}
        </Picker>
        <Picker
          style={styles.pickerStyle}
          theme={{
            fontColor: '#FFFFFF',
            fontSize: cx(22),
            dividerColor: 'transparent',
          }}
          selectedValue={ampm}
          onValueChange={value => {
            handleOnChange(value, 'ampm');
          }}
        >
          {getAmPmData().map(item => (
            <Picker.Item key={item.value} value={item.value} label={item.label} />
          ))}
        </Picker>
      </View>
    </ModalPop>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  pickerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStyle: {
    width: cx(50),
    height: cx(160),
    backgroundColor: 'transparent',
  },
  pickerMiddle: {
    height: 38,
    width: cx(290),
    backgroundColor: '#403D53',
    borderRadius: cx(8),
    position: 'absolute',
    left: cx(32),
    top: Platform.OS === 'android' ? 58 : 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    zIndex: -1,
  },
});
