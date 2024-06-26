import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import Res from '@res';

const { convertX: cx } = Utils.RatioUtils;

interface AnimateItem {
  name?: string;
  icon?: any;
  id: number;
}

const animateList: AnimateItem[] = [
  {
    name: i18n.getLang('sleep_animate_0'),
    icon: Res.no_animation,
    id: 0,
  },
  {
    name: i18n.getLang('sleep_animate_1'),
    icon: Res.sleep_animate_0,
    id: 1,
  },
  {
    name: i18n.getLang('sleep_animate_2'),
    icon: Res.sleep_animate_1,
    id: 2,
  },
  {
    name: i18n.getLang('sleep_animate_3'),
    icon: Res.sleep_animate_2,
    id: 3,
  },
  {
    name: i18n.getLang('sleep_animate_4'),
    icon: Res.sleep_animate_3,
    id: 4,
  },
];

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;
  const [selectedAnimate, setSelectedAnimate] = useState<number>(value);

  const handleSelect = (item: AnimateItem) => {
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
      popupViewHeight={cx(380)}
      onConfirm={handleConfirm}
      title={i18n.getLang('scene_animate')}
    >
      <ScrollView
        style={styles.listView}
        contentContainerStyle={{ paddingLeft: cx(22), paddingBottom: cx(16) }}
      >
        <View style={styles.popupViewEffect}>
          {animateList.map(item => {
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
    width: cx(154),
    marginRight: cx(18),
    marginTop: cx(12),
  },
  effectItemEffect: {
    borderWidth: cx(3),
    borderColor: 'transparent',
    borderRadius: cx(12),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(152),
    height: cx(77),
    borderRadius: cx(12),
  },
});
