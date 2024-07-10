import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import i18n from '@i18n';
import ModalPop from '@components/modalRender';
import PickerView from '@components/pickerView';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [value, setValue] = useState(_value);

  const getPickerData = () => {
    const range = Utils.NumberUtils.range(5, 35, 5);
    const timerRange = range.map((item: number) => {
      return {
        label: `${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  const handleConfirm = () => {
    onConfirm(value);
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={i18n.getLang('set_duration')}
      popupViewHeight={cx(270)}
      outputRangeStart={300}
    >
      <View style={styles.pickerView}>
        <View style={styles.pickerBg}>
          <TYText style={styles.pickerText}>{i18n.getLang('minute')}</TYText>
        </View>
        <PickerView value={value} onChange={setValue} data={getPickerData()} />
      </View>
    </ModalPop>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  pickerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBg: {
    position: 'absolute',
    top: 84,
    left: cx(100),
    height: 48,
    width: cx(180),
    backgroundColor: '#403D53',
    borderRadius: cx(8),
  },
  pickerText: {
    position: 'absolute',
    bottom: cx(12),
    right: cx(34),
    fontSize: cx(12),
    color: '#FFFFFF',
  },
});
