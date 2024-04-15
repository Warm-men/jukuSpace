import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TYText, TYSdk, TopBar, GlobalToast } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import {
  repeat2Text,
  getAmPmData,
  getHourData,
  getMinuteData,
  clockString2Object,
  clockObject2String,
} from '@utils';
import { cx, commonColor } from '@config/styles';
import { dpCodes } from '@config';
import PickerView from '@components/pickerView';
import SliderHorizontal from '@components/sliderHorizontal';
import DurationTimePopup from './durationTimePopup';
import RepeatPopup from './repeatPopup';
import MusicPopup from './musicPopup';
import styles from './styles';

const { alarm1SettingCode, alarm2SettingCode } = dpCodes;

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

function RowItem(props) {
  const { title, onPress, text } = props;
  return (
    <View style={styles.optionViewItem}>
      <TYText size={cx(14)} color="#C5C5C5">
        {title}
      </TYText>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.clickView}>
          <TYText size={cx(14)} color="#C5C5C5">
            {text}
          </TYText>
          <Image style={styles.arrowImage} source={Res.arrow_right} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function Clock() {
  const { [alarm1SettingCode]: alarm1Setting, [alarm2SettingCode]: alarm2Setting } = useSelector(
    ({ dpState }: any) => dpState
  );

  // 在路由中获取参数
  const route = useRoute();
  const clockIndex = (route.params as { clockIndex?: number })?.clockIndex ?? 0;

  const clockData = {
    0: clockString2Object(alarm1Setting),
    1: clockString2Object(alarm2Setting),
  };

  const clockCode = {
    0: alarm1SettingCode,
    1: alarm2SettingCode,
  };

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const getAmPm = () => {
    const data = clockData[clockIndex];
    const { hour } = data;
    return hour < 12 ? 'AM' : 'PM';
  };

  const getHour = () => {
    const data = clockData[clockIndex];
    const { hour } = data;
    return hour > 12 ? hour - 12 : hour;
  };

  const [clockDataState, setClockDataState] = useState<ClockObject>(clockData[clockIndex]);

  const [isVisibleRepeatPop, setIsVisibleRepeatPop] = useState(false);
  const [isVisibleDurationPop, setIsVisibleDurationPop] = useState(false);
  const [isVisibleMusicPop, setIsVisibleMusicPop] = useState(false);
  const [hour, setHour] = useState(getHour());
  const [minute, setMinute] = useState(clockData[clockIndex]?.minute ?? 0);
  const [amPm, setAmPm] = useState(getAmPm());
  const [musicVolume, setMusicVolume] = useState(clockData[clockIndex]?.volume ?? 10);

  const handleOpenRepeat = () => {
    setIsVisibleRepeatPop(true);
  };

  const handleOpenDuration = () => {
    setIsVisibleDurationPop(true);
  };

  const handleOnCloseRepeat = () => {
    setIsVisibleRepeatPop(false);
  };

  const handleOpenMusic = () => {
    setIsVisibleMusicPop(true);
  };

  const handleCloseMusic = () => {
    setIsVisibleMusicPop(false);
  };

  const handleOnConfirmMusic = music => {
    setIsVisibleMusicPop(false);
    updateClockDataState('music', music);
  };

  const handleOnConfirmRepeat = repeat => {
    setIsVisibleRepeatPop(false);
    updateClockDataState('repeat', repeat);
  };

  const handleOnCloseDuration = () => {
    setIsVisibleDurationPop(false);
  };

  const updateClockDataState = (key: string, value: any) => {
    const _clockDataState = { ...clockDataState, [key]: value };
    setClockDataState(_clockDataState);
  };

  const handleOnConfirmDuration = duration => {
    setIsVisibleDurationPop(false);
    updateClockDataState('duration', duration);
  };

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
      const _hour = amPm === 'AM' ? value : value + 12;
      updateClockDataState('hour', _hour);
    } else if (type === 'amPm') {
      setAmPm(value);
      const _hour = value === 'AM' ? hour : hour + 12;
      updateClockDataState('hour', _hour);
    } else {
      setMinute(value);
      updateClockDataState('minute', value);
    }
  };

  const onChangeVolume = (value: number) => {
    setMusicVolume(value);
    updateClockDataState('volume', value);
  };

  const getRepeatText = () => {
    const { repeat } = clockDataState;
    return repeat2Text(repeat, true);
  };

  const getMusic = () => {
    const { music } = clockDataState;
    return i18n.getLang(`music_${music}`);
  };

  const getDurationText = () => {
    const { duration } = clockDataState;
    return `${duration} ${i18n.getLang('minute')}`;
  };

  const goBack = () => {
    navigation.goBack();
  };

  const save = () => {
    const dpData = clockObject2String(clockDataState);
    TYSdk.device.putDeviceData({
      [clockCode[clockIndex]]: dpData,
    });
    GlobalToast.show({
      text: i18n.getLang('done'),
      showIcon: false,
    });
    goBack();
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('edit_clock')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        leftActions={[
          {
            children: (
              <TouchableOpacity style={styles.backView} onPress={goBack}>
                <Image source={Res.close_1} style={styles.backImage} />
              </TouchableOpacity>
            ),
          },
        ]}
        actions={[
          {
            children: (
              <TouchableOpacity style={styles.saveView} onPress={save}>
                <TYText style={styles.saveText}>{i18n.getLang('save')}</TYText>
              </TouchableOpacity>
            ),
          },
        ]}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.pickerView}>
          <PickerView
            value={amPm}
            onChange={value => {
              handleOnChange(value, 'amPm');
            }}
            data={getAmPmData()}
          />
          <PickerView
            value={hour}
            onChange={value => {
              handleOnChange(value, 'hour');
            }}
            data={getHourData()}
          />
          <View style={styles.pickerMiddle}>
            <TYText style={styles.pickerText}>:</TYText>
          </View>
          <PickerView
            value={minute}
            onChange={value => {
              handleOnChange(value, 'minute');
            }}
            data={getMinuteData()}
          />
        </View>

        <View style={styles.optionView}>
          <RowItem
            title={i18n.getLang('repeat_time')}
            onPress={handleOpenRepeat}
            text={getRepeatText()}
          />
          <View style={styles.line} />
          <RowItem
            title={i18n.getLang('duration')}
            onPress={handleOpenDuration}
            text={getDurationText()}
          />
        </View>

        <View style={styles.optionView}>
          <RowItem
            title={i18n.getLang('clock_music')}
            onPress={handleOpenMusic}
            text={getMusic()}
          />
          <View style={styles.line} />
          <View
            style={[styles.optionViewItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
          >
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('clock_volume')}
            </TYText>
            <View style={styles.sliderView}>
              <SliderHorizontal value={musicVolume} onValueChange={onChangeVolume} />
              <TYText size={cx(14)} color="#C5C5C5">
                {musicVolume}
              </TYText>
            </View>
          </View>
        </View>
      </ScrollView>
      <DurationTimePopup
        onClose={handleOnCloseDuration}
        onConfirm={handleOnConfirmDuration}
        isVisiblePop={isVisibleDurationPop}
        value={clockDataState.duration}
      />
      <RepeatPopup
        onClose={handleOnCloseRepeat}
        onConfirm={handleOnConfirmRepeat}
        isVisiblePop={isVisibleRepeatPop}
        value={clockDataState.repeat}
      />

      <MusicPopup
        onClose={handleCloseMusic}
        onConfirm={handleOnConfirmMusic}
        isVisiblePop={isVisibleMusicPop}
        value={clockDataState.music}
      />
    </View>
  );
}

export default Clock;
