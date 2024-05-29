import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _deepClone from 'lodash/cloneDeep';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import Res from '@res';

const { convertX: cx } = Utils.RatioUtils;

interface Music {
  name?: string;
  icon?: any;
  id: number;
}

const musicList: Music[] = [
  {
    name: i18n.getLang('scene_music_0'),
    icon: Res.scene_music_0,
    id: 0,
  },
  {
    name: i18n.getLang('scene_music_1'),
    icon: Res.scene_music_1,
    id: 1,
  },
  {
    name: i18n.getLang('scene_music_2'),
    icon: Res.scene_music_2,
    id: 2,
  },
  {
    name: i18n.getLang('scene_music_3'),
    icon: Res.scene_music_3,
    id: 3,
  },
  {
    name: i18n.getLang('scene_music_4'),
    icon: Res.scene_music_4,
    id: 4,
  },
  {
    name: i18n.getLang('scene_music_5'),
    icon: Res.scene_music_5,
    id: 5,
  },
];

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;

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
      popupViewHeight={cx(420)}
      onConfirm={handleConfirm}
      title={i18n.getLang('scene_music')}
    >
      <ScrollView
        style={styles.listView}
        contentContainerStyle={{ paddingLeft: cx(22), paddingBottom: cx(16) }}
      >
        <View style={styles.popupViewEffect}>
          {musicList.map(item => {
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
    width: cx(100),
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
    width: cx(98),
    height: cx(98),
  },
});
