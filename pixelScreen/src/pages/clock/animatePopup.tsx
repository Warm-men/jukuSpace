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
      popupViewHeight={cx(372)}
      title={i18n.getLang('set_clock_music')}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: cx(28) }}>
        <View style={styles.musicBox}>
          {_times(4).map((item: number, index: number) => {
            const isActive = index === value;
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
                  <Image source={Res[`clock_animate_${index}`]} style={styles.musicImage} />
                </TouchableOpacity>
                <TYText size={cx(14)} color="#F6F6F6" align="center">
                  {i18n.getLang(`music_${index}`)}
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
    borderRadius: cx(8),
    marginRight: cx(16),
  },
  imageView: {
    width: cx(162),
    height: cx(85),
    // borderRadius: cx(16),
    borderWidth: cx(4),
    borderColor: 'transparent',
    marginBottom: cx(8),
  },
  musicImage: {
    width: cx(154),
    height: cx(77),
  },
});
