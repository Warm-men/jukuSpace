import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Image } from 'react-native';
import { TYText } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import { cx, commonColor } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import modelConfig from 'config/common';
import styles from './styles';
import { string2ClockState, repeat2Text } from '../../utils';

// const { powerCode, sceneDataCode } = dpCodes;
function Alarm() {
  const { clock_status_data } = useSelector(({ dpState }: any) => dpState);

  const [isClockOpen, setIsClockOpen] = useState(false);
  const [clockStatus, setClockStatus] = useState(0);

  useEffect(() => {
    const { isClockOpen: _isClockOpen, status } = getClockData();
    setIsClockOpen(_isClockOpen);
    setClockStatus(status);
  }, [clock_status_data]);

  const getClockData = () => {
    return {
      isClockOpen: true,
      data: [],
      status: true,
    };
    const alarmData = string2ClockState(clock_status_data);
    const isClock1Open = [0, 1].includes(alarmData.alarm1);
    const isClock2Open = [0, 1].includes(alarmData.alarm2);
    const _isClockOpen = isClock1Open || isClock2Open;
    if (!isClockOpen) return { isClockOpen: false, data: {}, status: 2 };
    return {
      isClockOpen: _isClockOpen,
      data: [],
      status: isClock1Open ? alarmData.alarm1 : alarmData.alarm2,
    };
  };

  return (
    <Modal animationType="fade" transparent={true} style={{ flex: 1 }} visible={false}>
      <View style={styles.homeModalWrapper}>
        <View style={styles.homeModalTop}>
          <TYText style={styles.homeModalText}>
            {`${repeat2Text([0, 0, 1, 0, 1, 0, 0], true)} ${i18n.getLang('clock')}`}
          </TYText>
          <TYText style={styles.homeModalTime}>timeStr</TYText>
          {clockStatus !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                // this.props.updateDp({ snooze: true }); // 稍后提醒
              }}
            >
              <View style={[styles.row, styles.center, styles.homeModalLater]}>
                <Image source={Res.clock_icon} style={styles.homeModalLaterIcon} />
                <TYText style={styles.blackText}>{i18n.getLang('remind_later')}</TYText>
              </View>
            </TouchableOpacity>
          ) : (
            <TYText style={styles.snoozeView} align="center">
              {i18n.getLang('snooze_hint')}
            </TYText>
          )}
        </View>
        <View style={styles.center}>
          <TouchableOpacity
            onPress={() => {
              // this.props.updateDp({ alarm_stop: true }); // 停止响铃
            }}
          >
            <View
              style={[
                styles.row,
                styles.center,
                styles.homeModalLaterStop,
                { backgroundColor: clockStatus !== 0 ? '#262528' : commonColor.mainColor },
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
