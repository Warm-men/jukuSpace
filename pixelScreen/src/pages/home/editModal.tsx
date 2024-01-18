import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _deepClone from 'lodash/cloneDeep';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop, onClose, onConfirm, data } = props;

  const [currentData, setCurrentData] = useState<any>(data);

  const handleSelect = (item: any) => {
    const newData = _deepClone(currentData).map((i: any) => {
      if (i.model_id === item.model_id) {
        i.isActive = !i.isActive;
      }
      return i;
    });
    setCurrentData(newData);
  };

  const handleConfirm = () => {
    onConfirm(currentData);
  };

  return (
    <ModalPop
      visible={isVisiblePop}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={i18n.getLang('add_model_pop_title')}
      hasBottom={true}
    >
      <ScrollView
        style={styles.listView}
        contentContainerStyle={{ paddingLeft: cx(22), paddingBottom: cx(16) }}
      >
        <View style={styles.popupViewEffect}>
          {currentData.map((item, index) => {
            return (
              <View key={item.model_id} style={styles.effectItem}>
                <TouchableOpacity
                  style={[
                    styles.effectItemEffect,
                    { borderColor: item.isActive ? '#fff' : 'transparent' },
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
    borderRadius: cx(4),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(154),
    height: cx(78),
    resizeMode: 'contain',
  },
});
