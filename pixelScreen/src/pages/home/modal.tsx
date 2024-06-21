import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { dpCodes } from '@config';
import { TYSdk, TYText, GlobalToast } from 'tuya-panel-kit';
import { modelConfig } from '@config/common';
import Res from '@res';
import i18n from '@i18n';
import styles from './styles';
import { decodePlayString, playListString2Map } from '../../utils';

const { playListCode, playListStateCode, playListUpCode, playListDownCode, playModeCode } = dpCodes;

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
    [playListStateCode]: playListState,
    [playListCode]: playList,
    [playModeCode]: playMode,
  } = useSelector(({ dpState }: any) => dpState);

  const [modeData, setModeData] = useState<ModelConfig[]>([]);
  const [playId, setPlayId] = useState(-1);
  const [loop, setLoop] = useState(0);
  const isClick = useRef(false);

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

  useEffect(() => {
    const playData = decodePlayString(playListState);
    setPlayId(playData.modeId);
    setLoop(playData.loop);
  }, [playListState]);

  useEffect(() => {
    if (isClick.current) {
      isClick.current = false;
      const string =
        playMode === 'Loop' ? i18n.getLang('loop_play') : i18n.getLang('continue_play');
      GlobalToast.show({
        text: string,
        onFinish: () => {
          GlobalToast.hide();
        },
      });
    }
  }, [playMode]);

  const goEdit = () => {
    navigation.navigate('modalEdit');
  };

  const playButtons = [
    {
      name: 'pre',
      icon: Res.pre,
      onPress: () => {
        TYSdk.device.putDeviceData({
          [playListUpCode]: true,
        });
      },
    },
    {
      name: 'next',
      icon: Res.next,
      onPress: () => {
        TYSdk.device.putDeviceData({
          [playListDownCode]: true,
        });
      },
    },
    {
      name: 'loop',
      icon: playMode === 'Loop' ? Res.loop : Res.loop1,
      onPress: () => {
        isClick.current = true;
        TYSdk.device.putDeviceData({
          [playModeCode]: playMode === 'Loop' ? 'Continuous' : 'Loop',
        });
      },
    },
    // {
    //   name: 'setting',
    //   icon: Res.setting,
    //   onPress: () => {
    //     navigation.navigate('modalEdit');
    //   },
    // },
  ];

  const goDetail = item => {
    navigation.push('modalDetail', { item });
  };

  return (
    <View style={styles.modeView}>
      {modeData.length ? (
        <View style={styles.modalListView}>
          <View style={styles.modalListTitle}>
            <TYText style={styles.text16BW}>{i18n.getLang('my_screen')}</TYText>
            <TouchableOpacity onPress={goEdit}>
              <Image source={Res.setting} style={[styles.addImg, { tintColor: '#C7C7CA' }]} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalList}>
            {modeData.map(item => {
              const isPLaying = playId === item.modeId;
              return (
                <TouchableOpacity
                  key={item.modeId}
                  onLongPress={() => {
                    goDetail(item);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={[styles.modalItemView, isPLaying && styles.modalItemViewBorder]}>
                    <Image source={item.icon} style={styles.modalItemImage} />
                  </View>
                </TouchableOpacity>
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
