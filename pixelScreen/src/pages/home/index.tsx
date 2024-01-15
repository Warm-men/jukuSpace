import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
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

const { powerCode, sceneDataCode } = dpCodes;
function Home() {
  const { name } = useSelector(({ devInfo }: any) => devInfo);
  const [clockSwitch1, setClockSwitch1] = useState(false);
  const [clockSwitch2, setClockSwitch2] = useState(true);
  const [isVisiblePop, setIsVisiblePop] = useState(false);
  const [modalData, setModalData] = useState<any[]>(modelConfig);

  useEffect(() => {}, []);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const onConfirmModal = (data: any) => {
    console.log('data', data);
    setModalData(data);
  };

  const hasModel = modalData.some(item => item.isActive);

  return (
    <View style={commonStyles.flexOne}>
      <TopBar
        color={commonColor.mainText}
        // title={i18n.getLang('setting_light')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => TYSdk.native.back()}
        // actions={[
        //   {
        //     source: Res.power,
        //     contentStyle: {
        //       width: cx(24),
        //       height: cx(24),
        //       marginRight: cx(16),
        //       tintColor: power ? '#6B73E7' : commonColor.mainText,
        //     },
        //     color: commonColor.mainText,
        //     onPress: () => {
        //       TYSdk.device.putDeviceData({
        //         [powerCode]: !power,
        //       });
        //     },
        //   },
        //   {
        //     style: { marginRight: cx(24) },
        //     source: Res.setting,
        //     contentStyle: styles.contentStyle,
        //     color: commonColor.mainText,
        //     onPress: () => {
        //       navigation.navigate('setting');
        //     },
        //   },
        // ]}
      />
      <ScrollView style={styles.containerStyle} contentContainerStyle={styles.contentStyle}>
        <View style={styles.topView}>
          <View style={styles.flexRow}>
            <Image source={Res.mode_0} style={styles.productImg} />
            <TYText style={styles.productText}>{name}</TYText>
          </View>
          <TouchableOpacity
            style={styles.settingView}
            onPress={() => {
              navigation.navigate('clock');
            }}
          >
            <TYText style={styles.settingText}>{i18n.getLang('setting')}</TYText>
          </TouchableOpacity>
        </View>
        <View style={styles.modeContainer}>
          <View style={styles.modeTop}>
            <TYText style={styles.text17Bold}>{i18n.getLang('my_screen')}</TYText>
            <TYText style={styles.text14}>{i18n.getLang('setting')}</TYText>
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('clock');
            }}
          >
            <View style={[styles.flexRowSp, styles.clockItem]}>
              <TYText style={styles.text14}>7:00 AM</TYText>
              <SwitchButton
                onTintColor="#6051FA"
                tintColor="#2E2C3D"
                thumbTintColor="#5A5774"
                onThumbTintColor="#fff"
                size={{ width: cx(42), height: cx(28) }}
                thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
                value={clockSwitch1}
                onValueChange={value => {
                  setClockSwitch1(value);
                }}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.line} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('plan');
            }}
          >
            <View style={[styles.flexRowSp, styles.clockItem]}>
              <TYText style={styles.text14}>7:00 AM</TYText>
              <SwitchButton
                onTintColor="#6051FA"
                tintColor="#2E2C3D"
                thumbTintColor="#5A5774"
                onThumbTintColor="#fff"
                size={{ width: cx(42), height: cx(28) }}
                thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
                value={clockSwitch2}
                onValueChange={value => {
                  setClockSwitch2(value);
                }}
              />
            </View>
          </TouchableOpacity>
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
    </View>
  );
}

export default Home;
