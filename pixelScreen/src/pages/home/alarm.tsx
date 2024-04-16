import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Image } from 'react-native';
import { TYText, TYSdk } from 'tuya-panel-kit';
import { commonColor, cx } from '@config/styles';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';
import { dpCodes } from '@config';
import styles from './styles';
import { clockString2Object } from '../../utils';

const { clockStatusCode, alarmStopCode, alarm1SettingCode, alarm2SettingCode, snoozeCode } =
  dpCodes;

function Alarm() {
  const {
    [clockStatusCode]: clockStatusData,
    [alarm1SettingCode]: alarm1Setting,
    [alarm2SettingCode]: alarm2Setting,
  } = useSelector(({ dpState }: any) => dpState);

  const getStatus = () => {
    // Data[0]表示闹钟1状态00-02；00-响闹 01-贪睡 02-停闹
    // Data[1]表示闹钟2状态00-02；00-响闹 01-贪睡 02-停闹
    const clock1String = clockStatusData.slice(0, 2);
    const clock2String = clockStatusData.slice(2, 4);
    const openStatus = ['00', '01'];
    return openStatus.includes(clock1String) || openStatus.includes(clock2String);
  };

  const isSnoozeFun = () => {
    // Data[0]表示闹钟1状态00-02；00-响闹 01-贪睡 02-停闹
    // Data[1]表示闹钟2状态00-02；00-响闹 01-贪睡 02-停闹
    const clock1String = clockStatusData.slice(0, 2);
    const clock2String = clockStatusData.slice(2, 4);
    return clock1String === '01' || clock2String === '01';
  };

  const getClockIndex = (): number => {
    // Data[0]表示闹钟1状态00-02；00-响闹 01-贪睡 02-停闹
    // Data[1]表示闹钟2状态00-02；00-响闹 01-贪睡 02-停闹
    const clock1String = clockStatusData.slice(0, 2);
    const clock2String = clockStatusData.slice(2, 4);
    if (clock1String === '00') {
      return 1;
    }
    if (clock2String === '00') {
      return 2;
    }
    return 1;
  };

  const clockData = {
    1: clockString2Object(alarm1Setting),
    2: clockString2Object(alarm2Setting),
  };

  const [isClockOpen, setIsClockOpen] = useState(false);
  const [isSnooze, setIsSnooze] = useState(false);

  useEffect(() => {
    setIsClockOpen(getStatus());
    setIsSnooze(isSnoozeFun());
  }, [clockStatusData]);

  const remindLater = () => {
    // setIsClockOpen(false);
    TYSdk.device.putDeviceData({
      [snoozeCode]: true,
    });
  };

  const stop = () => {
    // setIsClockOpen(false);
    TYSdk.device.putDeviceData({
      [alarmStopCode]: true,
    });
  };

  const getTime = () => {
    const data = clockData[getClockIndex()];
    const { hour, minute } = data;
    const h = hour > 12 ? hour - 12 : hour;
    const _hour = h < 10 ? `0${h}` : `${h}`;
    const _minute = minute < 10 ? `0${minute}` : minute;
    return `${_hour}:${_minute}`;
  };

  const getAmPm = () => {
    const data = clockData[getClockIndex()];
    const { hour } = data;
    return hour < 12 ? 'AM' : 'PM';
  };

  return (
    <Modal animationType="fade" transparent={true} style={{ flex: 1 }} visible={isClockOpen}>
      <View style={styles.homeModalWrapper}>
        <View style={styles.homeModalTop}>
          <TYText style={styles.homeModalText}>{i18n.getLang(`clock${getClockIndex()}`)}</TYText>
          <TYText style={styles.homeModalTime}>
            {getTime()}
            <TYText style={styles.homeModalTime1}>{getAmPm()}</TYText>
          </TYText>
          {isSnooze ? (
            <TYText style={styles.snoozeView} align="center">
              {i18n.getLang('snooze_hint')}
            </TYText>
          ) : (
            <TouchableOpacity onPress={remindLater}>
              <View style={[styles.row, styles.center, styles.homeModalLater]}>
                <Image source={Res.clock_icon} style={styles.homeModalLaterIcon} />
                <TYText style={styles.blackText}>{i18n.getLang('remind_later')}</TYText>
              </View>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity onPress={remindLater}>
            <View style={[styles.row, styles.center, styles.homeModalLater]}>
              <Image source={Res.clock_icon} style={styles.homeModalLaterIcon} />
              <TYText style={styles.blackText}>{i18n.getLang('remind_later')}</TYText>
            </View>
          </TouchableOpacity> */}
        </View>
        <View style={styles.center}>
          <TouchableOpacity onPress={stop}>
            <View
              style={[
                styles.row,
                styles.center,
                styles.homeModalLaterStop,
                { backgroundColor: isSnooze ? commonColor.mainColor : '#262528' },
              ]}
            >
              <TYText style={styles.blackText}>{i18n.getLang('alarm_stop')}</TYText>
            </View>
          </TouchableOpacity>
          <TYText
            style={[styles.blackText, { marginTop: cx(12), marginBottom: cx(95) }]}
            align="center"
            numberOfLines={2}
          >
            {i18n.getLang('stop_in_device')}
          </TYText>
        </View>
      </View>
    </Modal>
  );
}

export default Alarm;
