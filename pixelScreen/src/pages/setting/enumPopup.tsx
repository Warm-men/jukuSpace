import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Utils, TYText, TYSdk } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, dpCode, title } = props;

  const { [dpCode]: dpValue } = useSelector(({ dpState }: any) => dpState);

  const [mode, setMode] = useState('');

  useEffect(() => {
    setMode(dpValue);
  }, [dpValue]);

  const handleConfirm = () => {
    TYSdk.device.putDeviceData({
      [dpCode]: mode,
    });
    onClose();
  };

  const dpSchema = TYSdk.device.getDpSchema(dpCode);

  if (!dpSchema) {
    return null;
  }

  const dpRange = dpSchema.range;

  if (!dpRange) {
    return null;
  }

  const height = dpRange.length * 49 + 130;

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={() => {
        onClose();
      }}
      onConfirm={handleConfirm}
      title={title}
      popupViewHeight={cx(height)}
      outputRangeStart={300}
    >
      <View style={styles.containerView}>
        {dpRange.map((item: string) => {
          const isActive = mode === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.itemView, { backgroundColor: isActive ? '#403D53' : 'transparent' }]}
              onPress={() => {
                setMode(item);
              }}
            >
              <TYText size={cx(16)} color={isActive ? '#fff' : '#78787A'}>
                {i18n.getDpLang(dpCode, item)}
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
  containerView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: cx(16),
    marginHorizontal: cx(16),
  },
  itemView: {
    width: cx(194),
    height: cx(50),
    borderRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#403D53',
  },
});
