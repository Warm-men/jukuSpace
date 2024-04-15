import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, TYSdk, TYText } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import { commonStyles, cx, commonColor } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import SwitchView from '@components/switch';
import { dpCodes } from '@config';
import { modelConfig } from '@config/common';
import EditPopup from './editModal';
import Alarm from './alarm';
import styles from './styles';
import { clockString2Object, playListString2Map } from '../../utils';

interface ClockObject {
  hour: number;
  minute: number;
  repeat: number[];
  music: number;
  volume: number;
  effect: number;
  duration: number;
  shake: number;
  animation: number;
  animationId: number;
  snooze: number;
  snoozeDuration: number;
  snoozeClose: number;
}

const { playListCode, clock1SwitchCode, clock2SwitchCode, alarm1SettingCode, alarm2SettingCode } =
  dpCodes;
interface ModelConfig {
  name?: string;
  icon?: any;
  modeId: number;
  dpValue: string;
  isActive?: boolean;
}

function Home() {
  const { name } = useSelector(({ devInfo }: any) => devInfo);

  const {
    [clock1SwitchCode]: clock1Switch,
    [clock2SwitchCode]: clock2Switch,
    [playListCode]: playList,
    [alarm1SettingCode]: alarm1Setting,
    [alarm2SettingCode]: alarm2Setting,
  } = useSelector(({ dpState }: any) => dpState);

  const [isVisiblePop, setIsVisiblePop] = useState(false);
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

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const clockData = [
    {
      switch: clock1Switch,
      data: clockString2Object(alarm1Setting),
      onSwitchChange: value => {
        TYSdk.device.putDeviceData({
          [clock1SwitchCode]: value,
        });
      },
    },
    {
      switch: clock2Switch,
      data: clockString2Object(alarm2Setting),
      onSwitchChange: value => {
        TYSdk.device.putDeviceData({
          [clock2SwitchCode]: value,
        });
      },
    },
  ];

  const openPop = () => {
    setIsVisiblePop(true);
  };

  const goEditModal = () => {
    navigation.navigate('modalEdit');
  };

  const goSetting = () => {
    navigation.navigate('setting');
  };

  const goClockDetail = clockIndex => {
    navigation.navigate('clock', { clockIndex });
  };

  const getTime = (data: ClockObject) => {
    const { hour, minute } = data;
    const h = hour > 12 ? hour - 12 : hour;
    const _hour = h < 10 ? `0${h}` : `${h}`;
    const _minute = minute < 10 ? `0${minute}` : minute;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${_hour}:${_minute} ${ampm}`;
  };

  const renderClock = () => {
    return clockData.map((item, index) => {
      const time = getTime(item.data);
      return (
        <View key={index}>
          <TouchableOpacity
            onPress={() => {
              goClockDetail(index);
            }}
          >
            <View style={[styles.flexRowSp, styles.clockItem]}>
              <TYText style={styles.text14}>{time}</TYText>
              <SwitchView value={item.switch} onValueChange={item.onSwitchChange} />
            </View>
          </TouchableOpacity>
          {index === 0 && <View style={styles.line} />}
        </View>
      );
    });
  };

  return (
    <View style={commonStyles.flexOne}>
      <TopBar
        color={commonColor.mainText}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => TYSdk.native.back()}
        actions={[
          {
            name: 'pen',
            color: commonColor.mainText,
            onPress: () => {
              TYSdk.native.showDeviceMenu();
            },
          },
        ]}
      />
      <ScrollView style={styles.containerStyle} contentContainerStyle={styles.contentStyle}>
        <View style={styles.topView}>
          <View style={styles.flexRow}>
            <Image source={Res.mode_0} style={styles.productImg} resizeMode="center" />
            <TYText style={styles.productText} numberOfLines={1}>
              {name}
            </TYText>
          </View>
          <TouchableOpacity style={styles.settingView} onPress={goSetting}>
            <TYText style={styles.settingText}>{i18n.getLang('setting')}</TYText>
          </TouchableOpacity>
        </View>
        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('my_screen')}</TYText>
            {modeData.length ? (
              <TouchableOpacity onPress={goEditModal}>
                <TYText style={styles.text14}>{i18n.getLang('setting')}</TYText>
              </TouchableOpacity>
            ) : null}
          </View>
          {modeData.length ? (
            <View style={styles.modalList}>
              {modeData.map(item => {
                return (
                  <View key={item.modeId} style={styles.modalItemView}>
                    <Image source={item.icon} style={styles.modalItemImage} />
                  </View>
                );
              })}
              {modeData.length < 20 ? (
                <TouchableOpacity onPress={openPop}>
                  <View style={[styles.addView, { width: cx(138), height: cx(68) }]}>
                    <Image source={Res.add} style={styles.addImg} />
                    <TYText style={styles.text14}>{i18n.getLang('add_model')}</TYText>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <TouchableOpacity onPress={openPop}>
              <View style={styles.addView}>
                <Image source={Res.add} style={styles.addImg} />
                <TYText style={styles.text14}>{i18n.getLang('add_model')}</TYText>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('music_clock')}</TYText>
          </View>
          {renderClock()}
        </View>
      </ScrollView>
      {/* 编辑弹窗 */}
      <EditPopup
        isVisiblePop={isVisiblePop}
        onClose={() => {
          setIsVisiblePop(false);
        }}
      />
      <Alarm />
    </View>
  );
}

export default Home;
