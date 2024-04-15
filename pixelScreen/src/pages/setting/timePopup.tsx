import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Utils } from 'tuya-panel-kit';
import i18n from '@i18n';
import { getAmPmData, getHourData, getMinuteData } from '@utils';
import ModalPop from '@components/modalRender';
import PickerView from '@components/pickerView';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [hour, setHour] = useState(_value.hour || 0);
  const [minute, setMinute] = useState(_value.minute || 0);
  const [amPm, setAmPm] = useState(_value.amPm || 'AM');

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
    } else if (type === 'amPm') {
      setAmPm(value);
    } else {
      setMinute(value);
    }
  };

  const handleConfirm = () => {
    onConfirm([hour, minute, amPm]);
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
        <PickerView
          value={hour}
          onChange={value => {
            handleOnChange(value, 'hour');
          }}
          data={getHourData()}
        />
        <View style={styles.pickerMiddle} />
        <PickerView
          value={minute}
          onChange={value => {
            handleOnChange(value, 'minute');
          }}
          data={getMinuteData()}
        />
        <PickerView
          value={amPm}
          onChange={value => {
            handleOnChange(value, 'amPm');
          }}
          data={getAmPmData()}
        />
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
