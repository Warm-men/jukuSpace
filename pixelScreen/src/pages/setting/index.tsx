import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { SwitchButton, TYText, TYSdk, TopBar, Utils } from 'tuya-panel-kit';
import Res from '@res';
import i18n from '@i18n';
import { commonStyles, cx, commonColor, width } from '@config/styles';
import { dpCodes } from '@config';
import { planOpen2Object, repeat2Text, planOpen2String } from '@utils';
import CountdownPop from './countdownPopup';

const { toFixed } = Utils.CoreUtils;
const { countdownCode, openPlanCode } = dpCodes;
function Setting() {
  const { [countdownCode]: countdown, [openPlanCode]: openPlan } = useSelector(
    ({ dpState }: any) => dpState
  );

  const openPlanObject = planOpen2Object(openPlan);
  console.log('🚀 ~ file: index.tsx:22 ~ Setting ~ openPlanObject:', openPlanObject);
  const { switchState: open } = openPlanObject;

  const navigation = useNavigation<StackNavigationProp<any, any>>();
  // const [open, setOpen] = useState(openPlanObject.switchState);
  const [isVisiblePop, setIsVisiblePop] = useState(false);

  const handleCountdown = () => {
    setIsVisiblePop(true);
  };

  const handleOnClose = () => {
    setIsVisiblePop(false);
  };

  const handleOnConfirm = (value: any) => {
    setIsVisiblePop(false);
    TYSdk.device.putDeviceData({
      [countdownCode]: value * 60,
    });
  };

  const handleUpdatePlanOpen = (value: boolean) => {
    const newPlan = { ...openPlanObject, switchState: value };
    const newDpDate = planOpen2String(newPlan);
    TYSdk.device.putDeviceData({
      [openPlanCode]: newDpDate,
    });
  };

  const getCountdownTime = () => {
    if (countdown === 0) return i18n.getLang('countdown_close');
    const minute = Math.floor(countdown / 60);
    return `${minute} ${i18n.getLang('minute')}`;
  };

  const getPlanTimeText = () => {
    const { time } = openPlanObject;
    return `${toFixed(time.hour, 2)}:${toFixed(time.minute, 2)}`;
  };

  const getRepeatText = () => {
    const { repeat, switchState } = openPlanObject;
    const repeatText = repeat2Text(repeat, switchState);
    return repeatText;
  };

  const size = { width: cx(40), height: cx(24), activeSize: cx(18) };
  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('setting_title')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => navigation.goBack()}
        actions={[
          {
            source: Res.device_info,
            contentStyle: {
              width: cx(24),
              height: cx(24),
              marginRight: cx(16),
            },
            color: commonColor.mainText,
            onPress: () => {
              TYSdk.native.showDeviceMenu();
            },
          },
        ]}
      />
      <ScrollView style={{ flex: 1 }}>
        {/* 定时开 */}
        <View style={styles.barView}>
          <View style={commonStyles.flexRowBetween}>
            <TYText color="#ABABAC" size={cx(14)}>
              {i18n.getLang('plan_open')}
            </TYText>
            <SwitchButton
              size={size}
              onValueChange={value => {
                handleUpdatePlanOpen(value);
              }}
              value={open}
              tintColor="#474748"
              onTintColor="#6B73E7"
              thumbTintColor="#78787A"
            />
          </View>
          <View style={[commonStyles.flexRowBetween, styles.marginT40, { alignItems: 'flex-end' }]}>
            <View style={styles.textView}>
              <TYText style={styles.text24}>{getPlanTimeText()}</TYText>
              <TYText style={[styles.text12, styles.marginL12]}>{getRepeatText()}</TYText>
            </View>
            <TouchableOpacity
              style={styles.clickView}
              activeOpacity={0.8}
              onPress={() => {
                navigation.push('plan');
              }}
            >
              <Image source={Res.arrow_right} style={styles.arrow} />
            </TouchableOpacity>
          </View>
        </View>
        {/* 倒计时关 */}
        <View style={styles.barView}>
          <View style={commonStyles.flexRowBetween}>
            <TYText color="#ABABAC" size={cx(14)}>
              {i18n.getLang('countdown')}
            </TYText>
            <SwitchButton
              size={size}
              onValueChange={value => {
                TYSdk.device.putDeviceData({
                  [countdownCode]: value ? 600 : 0,
                });
              }}
              value={!!countdown}
              tintColor="#474748"
              onTintColor="#6B73E7"
              thumbTintColor="#78787A"
            />
          </View>
          <View style={[commonStyles.flexRowBetween, styles.marginT40, { alignItems: 'flex-end' }]}>
            <View style={styles.textView}>
              <TYText style={styles.text24}>{getCountdownTime()}</TYText>
            </View>
            <TouchableOpacity
              style={styles.clickView}
              activeOpacity={0.8}
              onPress={handleCountdown}
            >
              <Image source={Res.arrow_right} style={styles.arrow} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CountdownPop
        onClose={handleOnClose}
        onConfirm={handleOnConfirm}
        isVisiblePop={isVisiblePop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barView: {
    width: width - cx(40),
    marginLeft: cx(20),
    marginTop: cx(20),
    borderRadius: cx(16),
    backgroundColor: '#222225',
    padding: cx(20),
  },
  clickView: {
    width: cx(28),
    height: cx(20),
    borderRadius: cx(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2E30',
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: width - cx(150),
  },
  marginT40: {
    marginTop: cx(40),
  },
  marginL12: {
    marginLeft: cx(12),
  },
  text24: {
    fontSize: cx(24),
    color: '#ABABAC',
  },
  text12: {
    fontSize: cx(12),
    color: '#ABABAC',
    marginBottom: cx(4),
    width: cx(160),
  },
  arrow: {
    width: cx(14),
    height: cx(14),
  },
});

export default Setting;
