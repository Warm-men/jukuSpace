import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText, TYSdk } from 'tuya-panel-kit';
import _deepClone from 'lodash/cloneDeep';
import { dpCodes } from '@config';
// import { useSelector } from 'react-redux';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import Res from '@res';
// import { playListString2Map, playListMap2String } from '@utils';

const { convertX: cx } = Utils.RatioUtils;
// const { playListCode } = dpCodes;

interface Music {
  name?: string;
  icon?: any;
  id: number;
}

const musicList: Music[] = [
  {
    name: i18n.getLang('animate_0'),
    icon: Res.sleep_09,
    id: 0,
  },
  {
    name: i18n.getLang('animate_1'),
    icon: Res.sleep_10,
    id: 1,
  },
  {
    name: i18n.getLang('animate_2'),
    icon: Res.sleep_11,
    id: 2,
  },
  {
    name: i18n.getLang('animate_3'),
    icon: Res.sleep_12,
    id: 3,
  },
];

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, value } = props;

  // const { [playListCode]: playList } = useSelector(({ dpState }: any) => dpState);

  // const [modeData, setModeData] = useState<ModelConfig[]>(modelConfig);

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
      title={i18n.getLang('add_model_pop_title')}
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
    borderRadius: cx(8),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(98),
    height: cx(98),
    // borderRadius: cx(8),
  },
});
