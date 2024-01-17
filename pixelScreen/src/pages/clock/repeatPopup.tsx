import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import i18n from '@i18n';
import ModalPop from '@components/modalRender';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;
  const [repeat, setRepeat] = useState(value);

  const handleConfirm = () => {
    onConfirm(repeat);
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={i18n.getLang('set_repeat')}
      popupViewHeight={cx(170)}
      outputRangeStart={300}
    >
      <View style={styles.repeatView}>
        {_times(7).map((item: number, index: number) => {
          const isActive = repeat[index] === 1;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.repeatItem, { backgroundColor: isActive ? '#6B73E7' : '#474748' }]}
              onPress={() => {
                const newData = _deepClone(repeat);
                newData[index] = newData[index] === 1 ? 0 : 1;
                setRepeat(newData);
              }}
            >
              <TYText size={cx(12)} color={isActive ? '#fff' : '#78787A'}>
                {i18n.getLang(`day_${index}`)}
              </TYText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ModalPop>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  repeatView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: cx(16),
    marginHorizontal: cx(16),
  },
  repeatItem: {
    width: cx(36),
    height: cx(36),
    borderRadius: cx(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
