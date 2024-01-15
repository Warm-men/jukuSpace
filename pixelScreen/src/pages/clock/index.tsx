import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, TopBar, Picker, Slider } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import {
  planOpen2Object,
  planOpen2String,
  repeat2Text,
  getAmPmData,
  getHourData,
  getMinuteData,
} from '@utils';
import { cx, commonColor } from '@config/styles';
import { dpCodes } from '@config';
import CountdownPop from './timePopup';
import RepeatPopup from './repeatPopup';
import MusicPopup from './musicPopup';
import styles from './styles';

const { openPlanCode } = dpCodes;
function Setting() {
  const { [openPlanCode]: openPlan } = useSelector(({ dpState }: any) => dpState);

  const openPlanObject = planOpen2Object(openPlan);

  const { time, switchState } = openPlanObject;
  // const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const [isVisibleRepeatPop, setIsVisibleRepeatPop] = useState(false);
  const [isVisibleDurationPop, setIsVisibleDurationPop] = useState(false);
  const [isVisibleMusicPop, setIsVisibleMusicPop] = useState(false);
  const [hour, setHour] = useState(time.hour);
  const [minute, setMinute] = useState(time.minute);
  const [ampm, setAmpm] = useState('AM');
  const [musicVolume, setMusicVolume] = useState(0);

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

  const handleOnConfirmMusic = repeat => {
    setIsVisibleMusicPop(false);
    // const newPlan = { ...openPlanObject, repeat };
    // const newDpDate = planOpen2String(newPlan);
    // TYSdk.device.putDeviceData({
    //   [openPlanCode]: newDpDate,
    // });
  };

  const handleOnConfirmRepeat = repeat => {
    setIsVisibleRepeatPop(false);
    const newPlan = { ...openPlanObject, repeat };
    const newDpDate = planOpen2String(newPlan);
    TYSdk.device.putDeviceData({
      [openPlanCode]: newDpDate,
    });
  };

  const handleOnCloseDuration = () => {
    setIsVisibleDurationPop(false);
  };

  const handleOnConfirmDuration = duration => {
    setIsVisibleDurationPop(false);
    const newPlan = { ...openPlanObject, duration };
    const newDpDate = planOpen2String(newPlan);
    TYSdk.device.putDeviceData({
      [openPlanCode]: newDpDate,
    });
  };

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
    } else if (type === 'ampm') {
      setAmpm(value);
    } else {
      setMinute(value);
    }
    const newPlan = { ...openPlanObject, time: { ...openPlanObject.time, [type]: value } };
    const newDpDate = planOpen2String(newPlan);
    TYSdk.device.putDeviceData({
      [openPlanCode]: newDpDate,
    });
  };

  const getRepeatText = () => {
    const { repeat } = openPlanObject;
    return repeat2Text(repeat, switchState);
  };

  const getDurationText = () => {
    const { duration } = openPlanObject;
    return `${duration} ${i18n.getLang('minute')}`;
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
              <TouchableOpacity
                style={styles.backView}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Image source={Res.close_1} style={styles.backImage} />
              </TouchableOpacity>
            ),
          },
        ]}
        actions={[
          {
            children: (
              <TouchableOpacity style={styles.saveView} onPress={() => {}}>
                <TYText style={styles.saveText}>保存</TYText>
              </TouchableOpacity>
            ),
          },
        ]}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.pickerView}>
          <Picker
            style={styles.pickerStyle}
            theme={{
              fontColor: '#FFFFFF',
              fontSize: cx(22),
              dividerColor: 'transparent',
            }}
            selectedValue={ampm}
            onValueChange={value => {
              handleOnChange(value, 'ampm');
            }}
          >
            {getAmPmData().map(item => (
              <Picker.Item key={item.value} value={item.value} label={item.label} />
            ))}
          </Picker>
          <Picker
            style={styles.pickerStyle}
            theme={{
              fontColor: '#FFFFFF',
              fontSize: cx(22),
              dividerColor: 'transparent',
            }}
            selectedValue={hour}
            onValueChange={value => {
              handleOnChange(value, 'hour');
            }}
          >
            {getHourData().map(item => (
              <Picker.Item key={item.value} value={item.value} label={item.label} />
            ))}
          </Picker>
          <View style={styles.pickerMiddle}>
            <TYText style={styles.pickerText}>:</TYText>
          </View>
          <Picker
            style={styles.pickerStyle}
            theme={{
              fontColor: '#FFFFFF',
              fontSize: cx(22),
              dividerColor: 'transparent',
            }}
            selectedValue={minute}
            onValueChange={value => {
              handleOnChange(value, 'minute');
            }}
          >
            {getMinuteData().map(item => (
              <Picker.Item key={item.value} value={item.value} label={item.label} />
            ))}
          </Picker>
        </View>
        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('repeat')}
            </TYText>
            <TouchableOpacity activeOpacity={0.8} onPress={handleOpenRepeat}>
              <View style={styles.clickView}>
                <TYText size={cx(14)} color="#C5C5C5">
                  {getRepeatText()}
                </TYText>
                <Image style={styles.arrowImage} source={Res.arrow_right} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View style={styles.optionViewItem}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('duration')}
            </TYText>
            <TouchableOpacity activeOpacity={0.8} onPress={handleOpenDuration}>
              <View style={styles.clickView}>
                <TYText size={cx(14)} color="#C5C5C5">
                  {getDurationText()}
                </TYText>
                <Image style={styles.arrowImage} source={Res.arrow_right} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('clock_music')}
            </TYText>
            <TouchableOpacity activeOpacity={0.8} onPress={handleOpenMusic}>
              <View style={styles.clickView}>
                <TYText size={cx(14)} color="#C5C5C5">
                  {getRepeatText()}
                </TYText>
                <Image style={styles.arrowImage} source={Res.arrow_right} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View
            style={[styles.optionViewItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
          >
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('clock_volume')}
            </TYText>
            <View style={styles.sliderView}>
              <Slider.Horizontal
                theme={{
                  width: cx(268),
                  height: cx(4),
                  trackRadius: cx(2),
                  trackHeight: cx(4),
                  thumbSize: cx(14),
                  thumbRadius: cx(14),
                  thumbTintColor: '#F6F6F6',
                  minimumTrackTintColor: '#E5E5E5',
                  maximumTrackTintColor: '#272632',
                }}
                maximumValue={100}
                minimumValue={0}
                value={musicVolume}
                onSlidingComplete={v => setMusicVolume(Math.round(v))}
              />
              <TYText size={cx(14)} color="#C5C5C5">
                {musicVolume}
              </TYText>
            </View>
          </View>
        </View>
      </ScrollView>
      <CountdownPop
        onClose={handleOnCloseDuration}
        onConfirm={handleOnConfirmDuration}
        isVisiblePop={isVisibleDurationPop}
        value={openPlanObject.duration}
      />
      <RepeatPopup
        onClose={handleOnCloseRepeat}
        onConfirm={handleOnConfirmRepeat}
        isVisiblePop={isVisibleRepeatPop}
        value={openPlanObject.repeat}
      />

      <MusicPopup
        onClose={handleCloseMusic}
        onConfirm={handleOnConfirmMusic}
        isVisiblePop={isVisibleMusicPop}
        value="0"
      />
    </View>
  );
}

export default Setting;
