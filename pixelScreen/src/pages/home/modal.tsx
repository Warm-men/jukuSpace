import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { dpCodes } from '@config';
import { TYText } from 'tuya-panel-kit';
import { modelConfig } from '@config/common';
import { cx } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import styles from './styles';
// import _deepClone from 'lodash/cloneDeep';
import { clockString2Object, playListString2Map } from '../../utils';

const { playListCode, clock1SwitchCode, clock2SwitchCode, alarm1SettingCode, alarm2SettingCode } =
  dpCodes;

interface ModelConfig {
  name?: string;
  icon?: any;
  modeId: number;
  dpValue: string;
  isActive?: boolean;
}
function Modal(props) {
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const {
    [clock1SwitchCode]: clock1Switch,
    [clock2SwitchCode]: clock2Switch,
    [playListCode]: playList,
    [alarm1SettingCode]: alarm1Setting,
    [alarm2SettingCode]: alarm2Setting,
  } = useSelector(({ dpState }: any) => dpState);

  const [modeData, setModeData] = useState<ModelConfig[]>([]);

  useEffect(() => {
    const data: ModelConfig[] = playListString2Map(playList);
    const newData: ModelConfig[] = [];
    data.forEach(item => {
      const _item = modelConfig.find(i => i.modeId === item.modeId);
      if (_item) {
        newData.push(_item);
      }
    });
    setModeData(newData);
  }, [playList]);

  const goEdit = () => {
    navigation.navigate('homeEditModal');
  };

  const playButtons = [
    { name: 'pre', icon: Res.pre, onPress: () => {} },
    {
      name: 'next',
      icon: Res.next,
      onPress: () => {},
    },
    {
      name: 'loop',
      icon: Res.loop,
      onPress: () => {},
    },
    {
      name: 'setting',
      icon: Res.setting,
      onPress: () => {
        navigation.navigate('modalEdit');
      },
    },
  ];

  return (
    <View style={styles.modeView}>
      {modeData.length ? (
        <View style={styles.modalListView}>
          {modeData.length < 10 ? (
            <View style={styles.modalListTitle}>
              <TYText style={styles.text16BW}>{i18n.getLang('my_screen')}</TYText>
              <TouchableOpacity onPress={goEdit}>
                <Image source={Res.add_plug} style={[styles.addImg, { tintColor: '#C7C7CA' }]} />
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.modalList}>
            {modeData.map(item => {
              return (
                <View key={item.modeId} style={styles.modalItemView}>
                  <Image source={item.icon} style={styles.modalItemImage} />
                </View>
              );
            })}
          </View>
          <View style={styles.buttonsView}>
            {playButtons.map(item => {
              return (
                <TouchableOpacity key={item.name} onPress={item.onPress}>
                  <Image source={item.icon} style={styles.buttonImg} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={goEdit}>
          <View style={styles.addView}>
            <Image source={Res.add_plug} style={styles.addImg} />
            <TYText style={styles.text16B}>{i18n.getLang('add_model')}</TYText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Modal;
