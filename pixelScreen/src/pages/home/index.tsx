import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, TYSdk, TYText, GlobalToast, SwitchButton } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import { commonStyles, cx, commonColor, height, width, isIphoneX } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import { dpCodes } from '@config';
import modelConfig from 'config/common';
import EditPopup from './editPopup';
import styles from './styles';
import { string2ClockState, repeat2Text } from '../../utils';

// const { powerCode, sceneDataCode } = dpCodes;
function Home() {
  const { name } = useSelector(({ devInfo }: any) => devInfo);

  const { clock_status_data } = useSelector(({ dpState }: any) => dpState);

  const [clockSwitch1, setClockSwitch1] = useState(false);
  const [clockSwitch2, setClockSwitch2] = useState(true);
  const [isVisiblePop, setIsVisiblePop] = useState(false);
  const [modalData, setModalData] = useState<any[]>(modelConfig);

  const [isClockOpen, setIsClockOpen] = useState(false);
  const [clockStatus, setClockStatus] = useState(0);
  useEffect(() => {
    const { isClockOpen: _isClockOpen, status } = getClockData();
    setIsClockOpen(_isClockOpen);
    setClockStatus(status);
  }, [clock_status_data]);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const onConfirmModal = (data: any) => {
    console.log('data', data);
    setModalData(data);
  };

  const hasModel = modalData.some(item => item.isActive);

  const clockData = [
    {
      time: '7:00 AM',
      switch: clockSwitch1,
    },
    {
      time: '7:00 AM',
      switch: clockSwitch2,
    },
  ];

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

  const renderClock = () => {
    return clockData.map((item, index) => {
      return (
        <>
          <TouchableOpacity
            key={item.time}
            onPress={() => {
              navigation.navigate('clock');
            }}
          >
            <View style={[styles.flexRowSp, styles.clockItem]}>
              <TYText style={styles.text14}>{item.time}</TYText>
              <SwitchButton
                onTintColor="#6051FA"
                tintColor="#2E2C3D"
                thumbTintColor="#5A5774"
                onThumbTintColor="#fff"
                size={{ width: cx(42), height: cx(28) }}
                thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
                value={item.switch}
                onValueChange={value => {
                  if (index === 0) {
                    setClockSwitch1(value);
                  } else {
                    setClockSwitch2(value);
                  }
                }}
              />
            </View>
          </TouchableOpacity>
          {index === 0 && <View style={styles.line} />}
        </>
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
            <TYText style={styles.productText}>{name}</TYText>
          </View>
          <TouchableOpacity
            style={styles.settingView}
            onPress={() => {
              navigation.navigate('setting');
            }}
          >
            <TYText style={styles.settingText}>{i18n.getLang('setting')}</TYText>
          </TouchableOpacity>
        </View>
        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('my_screen')}</TYText>
            {hasModel ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('modalEdit');
                }}
              >
                <TYText style={styles.text14}>{i18n.getLang('setting')}</TYText>
              </TouchableOpacity>
            ) : null}
          </View>
          {hasModel ? (
            <View style={styles.modalList}>
              {modalData.map(item => {
                if (!item.isActive) return null;
                return (
                  <View key={item.model_id} style={styles.modalItemView}>
                    <Image source={item.icon} style={styles.modalItemImage} />
                  </View>
                );
              })}
              <TouchableOpacity
                onPress={() => {
                  setIsVisiblePop(true);
                }}
              >
                <View style={[styles.addView, { width: cx(138), height: cx(68) }]}>
                  <Image source={Res.add} style={styles.addImg} />
                  <TYText style={styles.text14}>{i18n.getLang('add_model')}</TYText>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsVisiblePop(true);
              }}
            >
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
        onConfirm={onConfirmModal}
        data={modalData}
      />

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
    </View>
  );
}

export default Home;
