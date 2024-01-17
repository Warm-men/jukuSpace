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
import Alarm from './alarm';
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
    // console.log('data', data);
    setIsVisiblePop(false);
    setModalData(data);
  };

  const hasModel = modalData.some(item => item.isActive);

  const clockData = [
    {
      time: '7:00 AM',
      switch: clockSwitch1,
    },
    {
      time: '7:01 PM',
      switch: clockSwitch2,
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

  const goClockDetail = () => {
    navigation.navigate('clock');
  };

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
        <View key={item.time}>
          <TouchableOpacity onPress={goClockDetail}>
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
            {hasModel ? (
              <TouchableOpacity onPress={goEditModal}>
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
              <TouchableOpacity onPress={openPop}>
                <View style={[styles.addView, { width: cx(138), height: cx(68) }]}>
                  <Image source={Res.add} style={styles.addImg} />
                  <TYText style={styles.text14}>{i18n.getLang('add_model')}</TYText>
                </View>
              </TouchableOpacity>
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
        onConfirm={onConfirmModal}
        data={modalData}
      />
      <Alarm />
    </View>
  );
}

export default Home;
