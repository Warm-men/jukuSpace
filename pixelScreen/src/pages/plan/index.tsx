import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, TopBar, Picker } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import { planOpen2Object, planOpen2String, repeat2Text } from '@utils';
import { cx, commonColor } from '@config/styles';
import { dpCodes } from '@config';
import CountdownPop from './timePopup';
import RepeatPopup from './repeatPopup';

const { openPlanCode } = dpCodes;
function Setting() {
  const { [openPlanCode]: openPlan } = useSelector(({ dpState }: any) => dpState);

  const openPlanObject = planOpen2Object(openPlan);
  console.log('🚀 ~ file: index.tsx:20 ~ Setting ~ openPlanObject:', openPlanObject);
  const { time, switchState } = openPlanObject;
  // const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const [isVisibleRepeatPop, setIsVisibleRepeatPop] = useState(false);
  const [isVisibleDurationPop, setIsVisibleDurationPop] = useState(false);
  const [hour, setHour] = useState(time.hour);
  const [minute, setMinute] = useState(time.minute);

  const handleOpenRepeat = () => {
    setIsVisibleRepeatPop(true);
  };

  const handleOpenDuration = () => {
    setIsVisibleDurationPop(true);
  };

  const handleOnCloseRepeat = () => {
    setIsVisibleRepeatPop(false);
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

  const getHourData = () => {
    const range = Utils.NumberUtils.range(0, 24, 1);
    const timerRange = range.map((item: number) => {
      return {
        label: `${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  const getMinuteData = () => {
    const range = Utils.NumberUtils.range(0, 60, 1);
    const timerRange = range.map((item: number) => {
      return {
        label: `${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
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
        title={i18n.getLang('plan_title')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.pickerView}>
          <Picker
            style={{
              width: cx(50),
              height: cx(160),
              backgroundColor: 'transparent',
            }}
            theme={{
              fontColor: '#FFFFFF',
              fontSize: cx(24),
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
            style={{
              width: cx(50),
              height: cx(160),
              backgroundColor: 'transparent',
            }}
            theme={{
              fontColor: '#FFFFFF',
              fontSize: cx(24),
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clickView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: cx(230),
  },
  pickerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerMiddle: {
    height: 36,
    width: cx(160),
    backgroundColor: '#222225',
    borderRadius: cx(8),
    position: 'absolute',
    left: cx(98),
    top: Platform.OS === 'android' ? 58 : 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    zIndex: -1,
  },
  pickerText: {
    fontSize: cx(18),
    color: '#FFFFFF',
  },
  optionView: {
    marginHorizontal: cx(20),
    borderRadius: cx(16),
    backgroundColor: '#222225',
    marginTop: cx(56),
  },
  optionViewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: cx(20),
  },
  arrowImage: {
    width: cx(14),
    height: cx(14),
    marginLeft: cx(6),
  },
});

export default Setting;
