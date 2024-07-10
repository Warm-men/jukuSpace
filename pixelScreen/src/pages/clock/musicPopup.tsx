import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import i18n from '@i18n';
import ModalPop from '@components/modalRender';
import { clockMusicList, Music } from '@config/common';

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
      title={i18n.getLang('set_clock_music')}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: cx(28) }}>
        <View style={styles.musicBox}>
          {clockMusicList.map((item: Music, index: number) => {
            const isActive = item.id === value;
            return (
              <View key={index} style={styles.musicItem}>
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
    paddingLeft: cx(18),
  },
  musicItem: {
    width: cx(96),
    marginBottom: cx(22),
    marginRight: cx(21),
  },
  imageView: {
    width: cx(102),
    height: cx(102),
    borderRadius: cx(12),
    borderWidth: cx(4),
    borderColor: 'transparent',
    marginBottom: cx(10),
  },
  musicImage: {
    width: cx(94),
    height: cx(94),
  },
});
