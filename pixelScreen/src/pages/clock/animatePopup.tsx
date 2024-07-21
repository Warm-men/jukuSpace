import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import i18n from '@i18n';
import ModalPop from '@components/modalRender';
import { clockAnimationList, Music } from '@config/common';

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
      popupViewHeight={cx(400)}
      title={i18n.getLang('set_clock_animate')}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: cx(28) }}>
        <View style={styles.musicBox}>
          {clockAnimationList.map((item: Music, index: number) => {
            const isActive = index === value;
            return (
              <View key={item.id} style={styles.musicItem}>
                <TouchableOpacity
                  onPress={() => {
                    setValue(item.id);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.imageView,
                    {
                      borderColor: isActive ? '#fff' : 'transparent',
                    },
                  ]}
                >
                  <Image source={item.icon} style={styles.musicImage} />
                </TouchableOpacity>
                <TYText size={cx(14)} color="#F6F6F6" align="center">
                  {item.name}
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
    paddingLeft: cx(20),
  },
  musicItem: {
    width: cx(104),
    marginBottom: cx(22),
    marginRight: cx(12),
  },
  imageView: {
    width: cx(104),
    height: cx(54),
    borderWidth: cx(2),
    borderRadius: cx(8),
    borderColor: 'transparent',
    marginBottom: cx(8),
  },
  musicImage: {
    borderRadius: cx(8),
    width: cx(100),
    height: cx(50),
  },
});
