import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, TYSdk, TYText, Utils } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import { commonStyles, cx, commonColor } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import SwitchView from '@components/switch';
import { dpCodes } from '@config';
import { clockAnimationList, clockMusicList } from '@config/common';
import Clock from './clock';
import styles from './styles';
import { clockString2Object, repeat2Text } from '../../utils';
import Scene from './scene';
import Modal from './modal';

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

const {
  tempDataCode,
  tempCFCode,
  humDataCode,
  clock1SwitchCode,
  clock2SwitchCode,
  alarm1SettingCode,
  alarm2SettingCode,
  timeModeCode,
} = dpCodes;

function Home() {
  const { name } = useSelector(({ devInfo }: any) => devInfo);

  const {
    [clock1SwitchCode]: clock1Switch,
    [clock2SwitchCode]: clock2Switch,
    [tempDataCode]: tempData,
    [humDataCode]: humData,
    [tempCFCode]: tempCF,
    [alarm1SettingCode]: alarm1Setting,
    [alarm2SettingCode]: alarm2Setting,
    [timeModeCode]: timeMode,
  } = useSelector(({ dpState }: any) => dpState);

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

  const goSetting = () => {
    navigation.navigate('setting');
  };

  const goChart = () => {
    navigation.navigate('dpChart');
  };

  const goClockDetail = clockIndex => {
    navigation.navigate('clock', { clockIndex });
  };

  const getTime = (data: ClockObject) => {
    const { hour, minute } = data;
    const is24 = timeMode === '24h';
    const h = is24 ? hour : hour > 12 ? hour - 12 : hour;
    const _hour = h < 10 ? `0${h}` : `${h}`;
    const _minute = minute < 10 ? `0${minute}` : minute;
    const ampm = is24 ? '' : hour < 12 ? 'AM' : 'PM';
    return `${_hour}:${_minute} ${ampm}`;
  };

  const getSleepSmallImages = data => {
    const { animationId, music } = data || {};
    if (!data || (data.animationId === undefined && data.music === undefined)) return [null, null];
    const animationImg =
      clockAnimationList.find(item => item.id === animationId)?.icon || Res.no_animation;
    const musicImg = clockMusicList.find(item => item.id === music)?.icon || Res.mute;
    return [animationImg, musicImg];
  };

  const renderImages = data => {
    const images = getSleepSmallImages(data);
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

  const renderClock = () => {
    return clockData.map((item, index) => {
      const time = getTime(item.data);
      const loop = item.data.repeat ? repeat2Text(item.data.repeat, true) : '';
      return (
        <View key={index}>
          <TouchableOpacity
            onPress={() => {
              goClockDetail(index);
            }}
          >
            <View style={[styles.flexRowSp, styles.clockItem]}>
              <View style={styles.flexRow}>
                {renderImages(item.data)}
                <View style={styles.clockItemText}>
                  <TYText style={styles.text14w}>{time}</TYText>
                  <TYText style={styles.text12w} numberOfLines={1}>
                    {loop}
                  </TYText>
                </View>
              </View>
              <SwitchView value={item.switch} onValueChange={item.onSwitchChange} />
            </View>
          </TouchableOpacity>
          {index === 0 && <View style={styles.line} />}
        </View>
      );
    });
  };

  const getTemperature = () => {
    const isC = tempCF === 'c';
    const fTem = Utils.TemperatureUtils.c2f(tempData / 10);
    return isC ? tempData / 10 : fTem;
  };

  return (
    <View style={commonStyles.flexOne}>
      <TopBar
        color={commonColor.mainText}
        title={name}
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
        <Modal />
        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('music_clock')}</TYText>
          </View>
          {renderClock()}
        </View>
        <Scene />

        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('temp_hum')}</TYText>
          </View>
          <View style={styles.tempHumView}>
            <View style={styles.tempHumLeft}>
              <View style={styles.tempHumLeft}>
                <TYText style={styles.text24BW}>{getTemperature()}</TYText>
                <TYText style={[styles.text12, { marginTop: cx(4), marginLeft: cx(4) }]}>
                  {i18n.getDpLang(tempCFCode, tempCF)}
                </TYText>
              </View>
              <View style={styles.temHumLine} />
              <View style={styles.tempHumLeft}>
                <TYText style={styles.text24BW}>{humData}</TYText>
                <TYText style={[styles.text12, { marginTop: cx(4), marginLeft: cx(4) }]}>%</TYText>
              </View>
            </View>

            <TouchableOpacity onPress={goChart} activeOpacity={0.85}>
              <Image source={Res.chart} style={styles.temHumImage} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={goSetting} activeOpacity={0.85}>
          <View style={styles.settingViewBottom}>
            <TYText style={styles.text17Bold}>{i18n.getLang('setting')}</TYText>
            <Image source={Res.arrow_right_bar} style={styles.settingViewBottomImage} />
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Clock />
    </View>
  );
}

export default Home;
