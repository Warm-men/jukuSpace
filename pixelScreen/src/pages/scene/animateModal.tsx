import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import { sceneAnimationList, Music } from '@config/common';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;
  const [selectedAnimate, setSelectedAnimate] = useState<number>(value);

  useEffect(() => {
    setSelectedAnimate(value);
  }, [value]);

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
      popupViewHeight={cx(400)}
      onConfirm={handleConfirm}
      title={i18n.getLang('scene_animate')}
    >
      <ScrollView
        style={styles.listView}
        contentContainerStyle={{ paddingLeft: cx(20), paddingBottom: cx(16) }}
      >
        <View style={styles.popupViewEffect}>
          {sceneAnimationList.map((item: Music) => {
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
    marginBottom: cx(16),
  },
  effectItem: {
    width: cx(104),
    marginRight: cx(12),
    marginTop: cx(12),
  },
  effectItemEffect: {
    borderWidth: cx(2),
    borderColor: 'transparent',
    borderRadius: cx(8),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(100),
    height: cx(50),
    borderRadius: cx(8),
  },
});
