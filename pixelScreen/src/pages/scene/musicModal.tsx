import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import { sceneMusicList, Music } from '@config/common';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;

  useEffect(() => {
    setSelectedAnimate(value);
  }, [value]);

  const [selectedAnimate, setSelectedAnimate] = useState<number>(value);

  const handleSelect = (item: Music) => {
    setSelectedAnimate(item.id);
  };

  const handleConfirm = () => {
    onConfirm(selectedAnimate);
    onClose();
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={() => {
        onClose();
        setSelectedAnimate(value);
      }}
      popupViewHeight={cx(534)}
      onConfirm={handleConfirm}
      title={i18n.getLang('scene_music')}
    >
      <ScrollView
        style={styles.listView}
        contentContainerStyle={{ paddingLeft: cx(22), paddingBottom: cx(16) }}
      >
        <View style={styles.popupViewEffect}>
          {sceneMusicList.map(item => {
            return (
              <View key={item.id} style={styles.effectItem}>
                <TouchableOpacity
                  style={[
                    styles.effectItemEffect,
                    { borderColor: item.id === selectedAnimate ? '#fff' : 'transparent' },
                  ]}
                  activeOpacity={0.65}
                  onPress={() => {
                    handleSelect(item);
                  }}
                >
                  <Image source={item.icon} style={styles.effectImage} />
                </TouchableOpacity>
                <TYText align="center" style={styles.text1}>
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
  text1: {
    fontSize: cx(14),
    color: '#C5C5C5',
    lineHeight: cx(24),
  },
  popupViewEffect: {
    width: cx(375),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  listView: {
    width: cx(372),
    marginBottom: cx(18),
  },
  effectItem: {
    width: cx(96),
    marginRight: cx(21),
    marginTop: cx(12),
  },
  effectItemEffect: {
    borderWidth: cx(3),
    borderColor: 'transparent',
    borderRadius: cx(12),
    marginBottom: cx(10),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(94),
    height: cx(94),
  },
});
