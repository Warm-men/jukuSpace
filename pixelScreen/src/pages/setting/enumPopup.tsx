import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Utils, TYText, TYSdk } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import Res from '@res';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, dpCode, title } = props;

  const { [dpCode]: dpValue } = useSelector(({ dpState }: any) => dpState);

  const [mode, setMode] = useState('');

  useEffect(() => {
    setMode(dpValue);
  }, [dpValue]);

  const handleConfirm = value => {
    TYSdk.device.putDeviceData({
      [dpCode]: value,
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
      onConfirm={false}
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
              onPress={() => {
                handleConfirm(item);
              }}
            >
              <View style={[styles.itemView]}>
                <TYText size={cx(16)} color={isActive ? '#6051FA' : '#78787A'}>
                  {i18n.getDpLang(dpCode, item)}
                </TYText>
                {isActive ? <Image source={Res.chooesed} style={styles.checkImage} /> : null}
              </View>
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
    width: cx(335),
    height: cx(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: cx(4),
  },
  checkImage: {
    width: cx(24),
    height: cx(24),
  },
});
