import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';
import ModalPop from '@components/modalRender';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [value, setValue] = useState(_value);

  const handleConfirm = () => {
    onConfirm(value);
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={() => {
        onClose();
        setValue(_value);
      }}
      onConfirm={handleConfirm}
      popupViewHeight={cx(380)}
      title={i18n.getLang('set_clock_animate')}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: cx(28) }}>
        <View style={styles.musicBox}>
          {_times(5).map((item: number, index: number) => {
            const isActive = index === value;
            const img = index === 0 ? Res.no_animation : Res[`clock_animate_${index - 1}`];
            return (
              <View key={item} style={styles.musicItem}>
                <TouchableOpacity
                  onPress={() => {
                    setValue(index);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.imageView,
                    {
                      borderColor: isActive ? '#fff' : 'transparent',
                    },
                  ]}
                >
                  <Image source={img} style={styles.musicImage} />
                </TouchableOpacity>
                <TYText size={cx(14)} color="#F6F6F6" align="center">
                  {i18n.getLang(`clock_animation_${index}`)}
                </TYText>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ModalPop>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  musicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: cx(16),
  },
  musicItem: {
    width: cx(162),
    marginBottom: cx(22),
    marginRight: cx(16),
  },
  imageView: {
    width: cx(162),
    height: cx(85),
    borderWidth: cx(4),
    borderRadius: cx(12),
    borderColor: 'transparent',
    marginBottom: cx(8),
  },
  musicImage: {
    borderRadius: cx(12),
    width: cx(154),
    height: cx(77),
  },
});
