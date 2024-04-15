import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText, TYSdk } from 'tuya-panel-kit';
import _deepClone from 'lodash/cloneDeep';
import { dpCodes } from '@config';
import { useSelector } from 'react-redux';
import { modelConfig } from '@config/common';
import ModalPop from '@components/modalRender';
import i18n from '@i18n';
import { playListString2Map, playListMap2String } from '@utils';

const { convertX: cx } = Utils.RatioUtils;
const { playListCode } = dpCodes;

interface ModelConfig {
  name?: string;
  icon?: any;
  modeId: number;
  dpValue: string;
  isActive?: boolean;
}

const PopUp = (props: any) => {
  const { isVisiblePop, onClose } = props;

  const { [playListCode]: playList } = useSelector(({ dpState }: any) => dpState);

  const [modeData, setModeData] = useState<ModelConfig[]>(modelConfig);

  const [selectedMode, setSelectedMode] = useState<ModelConfig[]>([]);

  useEffect(() => {
    const data: ModelConfig[] = playListString2Map(playList);
    const newData: ModelConfig[] = _deepClone(modelConfig);
    newData.forEach((item: ModelConfig) => {
      const _item = data.find((i: ModelConfig) => i.modeId === item.modeId);
      if (_item) {
        const updatedItem = { ...item, isActive: true };
        Object.assign(item, updatedItem);
      }
    });
    setModeData(newData);
  }, [playList, isVisiblePop]);

  useEffect(() => {
    const data: ModelConfig[] = playListString2Map(playList);
    const newData: ModelConfig[] = [];
    data.forEach(item => {
      const _item = modelConfig.find(i => i.modeId === item.modeId);
      if (_item) {
        newData.push(_item);
      }
    });
    setSelectedMode(newData);
  }, [playList]);

  const handleSelect = (item: any) => {
    const newData = _deepClone(modeData).map((i: ModelConfig) => {
      if (i.modeId === item.modeId) {
        return { ...i, isActive: !i.isActive };
      }
      return i;
    });
    setModeData(newData);

    const _selectedMode: ModelConfig[] = _deepClone(selectedMode);
    const _index = _selectedMode.findIndex((i: ModelConfig) => i.modeId === item.modeId);
    if (_index > -1) {
      _selectedMode.splice(_index, 1);
    } else {
      _selectedMode.push(item);
    }
    setSelectedMode(_selectedMode);
  };

  const handleConfirm = () => {
    const _data = playListMap2String(selectedMode);
    TYSdk.device.putDeviceData({
      [playListCode]: _data,
    });
    onClose();
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
          {modeData.map(item => {
            return (
              <View key={item.modeId} style={styles.effectItem}>
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
    borderRadius: cx(8),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(152),
    height: cx(77),
    borderRadius: cx(8),
  },
});
