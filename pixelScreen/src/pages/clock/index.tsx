import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, TopBar } from 'tuya-panel-kit';
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
import PickerView from '@components/pickerView';
import SliderHorizontal from '@components/sliderHorizontal';
import DurationTimePopup from './durationTimePopup';
import RepeatPopup from './repeatPopup';
import MusicPopup from './musicPopup';
import styles from './styles';

const { openPlanCode } = dpCodes;

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

  const goBack = () => {
    navigation.goBack();
  };

  const save = () => {};

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
            value={ampm}
            onChange={value => {
              handleOnChange(value, 'ampm');
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
            text={getRepeatText()}
          />
          <View style={styles.line} />
          <View
            style={[styles.optionViewItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
          >
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('clock_volume')}
            </TYText>
            <View style={styles.sliderView}>
              <SliderHorizontal value={musicVolume} onValueChange={setMusicVolume} />
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
