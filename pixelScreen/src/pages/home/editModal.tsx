import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Utils, TYText, TYSdk, TopBar } from 'tuya-panel-kit';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import _deepClone from 'lodash/cloneDeep';
import { dpCodes } from '@config';
import { useSelector } from 'react-redux';
import { commonColor } from '@config/styles';
import {
  modelConfig,
  modalCategoryIds1,
  modalCategoryIds2,
  modalCategoryIds3,
  modalCategoryIds4,
  modalCategoryIds5,
} from '@config/common';
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

const EditModal = (props: any) => {
  const navigation = useNavigation<StackNavigationProp<any, any>>();

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
  }, [playList]);

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
  };

  const splitArrayByCategory = (arr: ModelConfig[]) => {
    // 按照类别分组，将modeData分成不同的数组
    const data = _deepClone(arr);
    const category1 = data.filter(item => modalCategoryIds1.includes(item.modeId));
    const category2 = data.filter(item => modalCategoryIds2.includes(item.modeId));
    const category3 = data.filter(item => modalCategoryIds3.includes(item.modeId));
    const category4 = data.filter(item => modalCategoryIds4.includes(item.modeId));
    const category5 = data.filter(item => modalCategoryIds5.includes(item.modeId));
    return [category1, category2, category3, category4, category5];
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('add_screen')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.listView} contentContainerStyle={styles.contentContainerStyle}>
        {splitArrayByCategory(modeData).map(item => {
          return (
            <View key={item[0].modeId}>
              <TYText style={styles.title}>{i18n.getLang('modal_0')}</TYText>
              <View style={styles.popupViewEffect}>
                {item.map(modal => {
                  return (
                    <View key={modal.modeId} style={styles.effectItem}>
                      <TouchableOpacity
                        style={[
                          styles.effectItemEffect,
                          { borderColor: modal.isActive ? '#fff' : 'transparent' },
                        ]}
                        activeOpacity={0.65}
                        onPress={() => {
                          handleSelect(modal);
                        }}
                      >
                        <Image source={modal.icon} style={styles.effectImage} />
                      </TouchableOpacity>
                      {/* <TYText align="center" style={styles.text1}>
                    {item.name}
                  </TYText> */}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.saveView}>
        <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85} style={styles.saveClick}>
          <TYText style={styles.saveText}>{i18n.getLang('save')}</TYText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  title: {
    fontSize: cx(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: cx(12),
    marginBottom: cx(14),
  },
  contentContainerStyle: {
    paddingTop: cx(16),
    paddingBottom: cx(100),
    paddingLeft: cx(20),
  },
  popupViewEffect: {
    width: cx(375),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  listView: {
    width: cx(372),
  },
  effectItem: {
    width: cx(154),
    marginRight: cx(18),
    marginBottom: cx(20),
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
    borderWidth: cx(2),
    borderColor: '#21202C',
  },
  saveView: {
    width: cx(375),
    height: cx(98),
    backgroundColor: '#21202C',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  saveClick: {
    marginTop: cx(16),
    width: cx(343),
    height: cx(42),
    borderRadius: cx(21),
    backgroundColor: '#6051FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: cx(16),
    color: '#FFFFFF',
  },
});
