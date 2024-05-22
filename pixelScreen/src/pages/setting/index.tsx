import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TYText, TYSdk, TopBar } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import moment from 'moment';
import { timeSync2String, timeSync2Object, padStart2 } from '@utils';
import { cx, commonColor } from '@config/styles';
import { dpCodes } from '@config';
import SwitchView from '@components/switch';
import TimePopup from './timePopup';
import EnumPopup from './enumPopup';
import styles from './styles';

const {
  networkTimingCode,
  timeSyncCode,
  wetherOnOffCode,
  tempCFCode,
  timeModeCode,
  backlightEnumCode,
} = dpCodes;

function Setting() {
  const {
    [networkTimingCode]: networkTiming,
    [timeSyncCode]: timeSync,
    [wetherOnOffCode]: wetherOnOff,
    [tempCFCode]: tempCF,
    [timeModeCode]: timeMode,
    [backlightEnumCode]: backlightEnum,
  } = useSelector(({ dpState }: any) => dpState);

  const timeObject = timeSync
    ? timeSync2Object(timeSync)
    : { hour: moment(new Date()).hour(), minute: moment(new Date()).minute() };

  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const [isVisiblePop, setIsVisiblePop] = useState(false);
  const [showTemUnitPop, setShowTemUnitPop] = useState(false);
  const [showLightPop, setShowLightPop] = useState(false);
  const [showTimeUnitPop, setShowTimeUnitPop] = useState(false);

  const handleOpenSetTime = () => {
    setIsVisiblePop(true);
  };

  const handleOnCloseTimePop = () => {
    setIsVisiblePop(false);
  };

  const handleOnConfirmTime = (value: number | string[]) => {
    const [hour, minute, amPm] = value as string[];
    const _hour = amPm === 'PM' && timeMode === '12h' ? hour + 12 : hour;
    const _minute = minute;
    const _timeObject = { ...timeObject, hour: _hour, minute: _minute };
    const data = timeSync2String(_timeObject);
    TYSdk.device.putDeviceData({
      [timeSyncCode]: data,
    });
    setIsVisiblePop(false);
  };

  const getTimeText = () => {
    if (timeObject) {
      const apm = timeMode === '12h' ? (timeObject.hour >= 12 ? 'PM' : 'AM') : '';
      const hourText =
        timeObject.hour > 12 && timeMode === '12h' ? timeObject.hour - 12 : timeObject.hour;
      return `${padStart2(hourText)}:${padStart2(timeObject.minute)} ${apm}`;
    }
    return ``;
  };

  const Bars = [
    {
      title: i18n.getDpLang(tempCFCode),
      value: i18n.getDpLang(tempCFCode, tempCF),
      onPress: () => {
        setShowTemUnitPop(true);
      },
    },
    {
      title: i18n.getDpLang(timeModeCode),
      value: i18n.getDpLang(timeModeCode, timeMode),
      onPress: () => {
        setShowTimeUnitPop(true);
      },
    },
    {
      title: i18n.getDpLang(backlightEnumCode),
      value: i18n.getDpLang(backlightEnumCode, backlightEnum),
      onPress: () => {
        setShowLightPop(true);
      },
    },
  ];

  const setSyncTime = () => {
    TYSdk.device.putDeviceData({
      [networkTimingCode]: !networkTiming,
    });
  };

  const setSyncWeather = () => {
    TYSdk.device.putDeviceData({
      [wetherOnOffCode]: !wetherOnOff,
    });
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('setting')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: cx(24) }}>
        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText numberOfLines={1} style={styles.clickTextTitle}>
              {i18n.getLang('sync_time')}
            </TYText>
            <SwitchView value={networkTiming} onValueChange={setSyncTime} />
          </View>
          {!networkTiming && <View style={styles.line} />}
          {!networkTiming && (
            <View style={styles.optionViewItem}>
              <TYText numberOfLines={1} style={styles.clickTextTitle}>
                {i18n.getLang('device_time')}
              </TYText>
              <TouchableOpacity activeOpacity={0.8} onPress={handleOpenSetTime}>
                <View style={styles.clickView}>
                  <TYText numberOfLines={1} style={styles.clickText}>
                    {getTimeText()}
                  </TYText>
                  <Image style={styles.arrowImage} source={Res.arrow_right} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText numberOfLines={1} style={styles.clickTextTitle}>
              {i18n.getLang('sync_weather')}
            </TYText>
            <SwitchView value={wetherOnOff} onValueChange={setSyncWeather} />
          </View>
        </View>

        <View style={styles.optionView}>
          {Bars.map(item => (
            <View style={styles.optionViewItem} key={item.title}>
              <TYText numberOfLines={1} style={styles.clickTextTitle}>
                {item.title}
              </TYText>
              <TouchableOpacity style={styles.clickView} activeOpacity={0.8} onPress={item.onPress}>
                <TYText numberOfLines={1} style={styles.clickText}>
                  {item.value}
                </TYText>
                <Image style={styles.arrowImage} source={Res.arrow_right} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <TimePopup
        onClose={handleOnCloseTimePop}
        onConfirm={handleOnConfirmTime}
        isVisiblePop={isVisiblePop}
        value={{
          hour: timeObject
            ? timeObject.hour > 12 && timeMode === '12h'
              ? timeObject.hour - 12
              : timeObject.hour
            : 0,
          minute: timeObject ? timeObject.minute : 0,
          amPm: timeObject ? (timeObject.hour >= 12 && timeMode === '12h' ? 'PM' : 'AM') : 'AM',
        }}
        is24={timeMode === '24h'}
      />

      <EnumPopup
        onClose={() => setShowTemUnitPop(false)}
        onConfirm={() => setShowTemUnitPop(false)}
        isVisiblePop={showTemUnitPop}
        dpCode={tempCFCode}
        title={i18n.getDpLang(tempCFCode)}
      />

      <EnumPopup
        onClose={() => setShowTimeUnitPop(false)}
        onConfirm={() => setShowTimeUnitPop(false)}
        isVisiblePop={showTimeUnitPop}
        dpCode={timeModeCode}
        title={i18n.getDpLang(timeModeCode)}
      />

      <EnumPopup
        onClose={() => setShowLightPop(false)}
        onConfirm={() => setShowLightPop(false)}
        isVisiblePop={showLightPop}
        dpCode={backlightEnumCode}
        title={i18n.getDpLang(backlightEnumCode)}
      />
    </View>
  );
}

export default Setting;
