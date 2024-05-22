import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { TYText, TYSdk, GlobalToast } from 'tuya-panel-kit';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { commonColor, cx } from '@config/styles';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import Res from '@res';
import i18n from '@i18n';
import { dpCodes } from '@config';
import { getSleepLeftTime, sleepStr2Object, sleep2String, getSleepSmallImages } from '@utils';
import { sceneDataDefault } from '@config/common';
import PlayButton from './PlayButton';

const { sleepAidStatusCode, switchFaSleepCode, sleepSettingCode } = dpCodes;

function Scene() {
  const {
    [sleepAidStatusCode]: sleepAidStatus,
    [switchFaSleepCode]: switchFaSleep,
    [sleepSettingCode]: sleepSetting,
  } = useSelector(({ dpState }: any) => dpState);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [sceneItem, setSceneItem] = useState<any>(sceneDataDefault);

  useEffect(() => {
    if (sleepSetting) {
      const _sceneItem = sleepStr2Object(sleepSetting) || sceneDataDefault;
      setSceneItem(_sceneItem);
    }
  }, [sleepSetting, switchFaSleep, sleepAidStatus]);

  const toggleWorking = () => {
    if (!sceneItem.manualClose && sceneItem.time === 0) {
      return GlobalToast.show({
        text: i18n.getLang('set_time_hint'),
        showIcon: false,
        contentStyle: {},
        onFinish: () => {
          console.log('Toast结束');
          GlobalToast.hide();
        },
      });
    }
    const sleepDpStr = sleep2String(sceneItem);
    const data = {};
    if (!_isEqual(sleepSetting, sleepDpStr)) {
      data[sleepSettingCode] = sleepDpStr;
    }
    data[switchFaSleepCode] = !switchFaSleep;
    TYSdk.device.putDeviceData(data);
  };

  const getHint = () => {
    if (!sceneItem.autoClose) return i18n.getLang('manual_close'); // 已开启，自动关闭未开启，需要手动关闭

    const leftTime = getSleepLeftTime(sleepAidStatus);

    if (!switchFaSleep || leftTime <= 0) return `${sceneItem.time}${i18n.getLang('min')}`;
    // 已开启，倒计时自动结束
    return `${leftTime}${i18n.getLang('min')}`;
  };

  const getLeftTime = () => {
    if (!switchFaSleep) return 0; // 改场景未开启;
    const time = getSleepLeftTime(sleepAidStatus);
    return +time;
  };

  const onPressItem = () => {
    navigation.navigate('scene');
  };
  const textColor = switchFaSleep ? commonColor.mainColor : '#fff';

  const getSmallImages = () => {
    const { animation, music } = sceneItem || {};
    if (!sceneItem || (sceneItem.animation === undefined && sceneItem.music === undefined))
      return [null, null];
    if (animation === undefined) {
      return [Res[`sleep_animate_${music}`], null];
    }
    if (music === undefined) {
      return [null, Res[`clock_${animation}`]];
    }
    return [Res[`sleep_animate_${animation}`], Res[`clock_${music}`]];
  };

  const renderImages = () => {
    const images = getSmallImages();

    return images.map((item: any, index: number) => {
      const is2 = index > 0;
      if (item === null)
        return (
          <View
            key={item}
            style={[
              styles.sceneItemViewImg,
              {
                marginLeft: is2 ? -cx(18) : 0,
                zIndex: is2 ? -1 : 1,
                marginBottom: is2 ? cx(14) : 0,
              },
            ]}
          />
        );
      return (
        <Image
          source={item}
          key={item}
          style={[
            styles.sceneItemViewImg,
            {
              marginLeft: is2 ? -cx(18) : 0,
              zIndex: is2 ? -1 : 1,
              marginBottom: is2 ? cx(14) : 0,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.sceneView}>
      <View style={{ marginBottom: cx(12) }}>
        <TYText style={[styles.blackText, styles.margin2HText, styles.marginBText]}>
          {i18n.getLang('scene')}
        </TYText>
      </View>
      <TouchableOpacity
        onPress={onPressItem}
        activeOpacity={0.85}
        style={[
          styles.sceneItemView,
          {
            backgroundColor: switchFaSleep ? 'rgba(96, 81, 250, 0.15)' : 'transparent',
            borderLeftWidth: cx(4),
            borderLeftColor: switchFaSleep ? commonColor.mainColor : 'transparent',
          },
        ]}
      >
        <View style={[styles.row, styles.spaceBt, { width: '100%' }]}>
          <View style={styles.row}>
            {renderImages()}
            <View style={[styles.itemMarginLText, { width: cx(150) }]}>
              <TYText style={[styles.item14Text, { color: textColor }]}>
                {i18n.getLang('asleep')}
              </TYText>
              <TYText
                style={[styles.item12Text, { color: textColor, width: cx(150) }]}
                numberOfLines={2}
              >
                {getHint()}
              </TYText>
            </View>
          </View>
          <PlayButton
            onPress={toggleWorking}
            value={getLeftTime()}
            autoClose={!sceneItem.manualClose}
            max={sceneItem.time || 120}
            // value={0}
            // autoClose={true}
            status={switchFaSleep}
            // max={120}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Scene;

const styles = StyleSheet.create({
  sceneView: {
    marginTop: cx(16),
    backgroundColor: '#21202C',
    borderRadius: cx(16),
    paddingTop: cx(20),
    paddingBottom: cx(6),
  },
  blackText: {
    fontSize: cx(16),
    color: '#fff',
  },
  margin2HText: {
    marginHorizontal: cx(20),
  },
  marginBText: {
    marginBottom: cx(5),
  },
  sceneItemView: {
    height: cx(80),
    justifyContent: 'center',
    paddingHorizontal: cx(20),
    marginBottom: cx(0),
  },
  sceneItemViewImg: {
    width: cx(50),
    height: cx(50),
    borderRadius: cx(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBt: {
    justifyContent: 'space-between',
  },
  itemMarginLText: {
    marginLeft: cx(14),
  },
  item14Text: {
    fontSize: cx(14),
    color: '#FFF',
    marginBottom: cx(4),
  },
  item12Text: {
    fontSize: cx(12),
    color: '#FFF',
  },
});
