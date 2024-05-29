/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { commonColor, cx } from '@config/styles';
import Res from '@res';
import { dpCodes } from '@config';
import i18n from '@i18n';
import { sceneDataDefault } from '@config/common';
import { getSleepLeftTime, sleepStr2Object, sleep2String, getSoundOrLightString } from '@utils';

import { TYText, TopBar, Progress, TYSdk } from 'tuya-panel-kit';
import _ from 'lodash';
import Countdown from '@components/countdown';
import SliderView from '../../components/sliderView';
import AnimateModal from './animateModal';
import MusicModal from './musicModal';

const { sleepAidStatusCode, switchFaSleepCode, sleepSettingCode, volumeSetCode } = dpCodes;

interface SceneData {
  mode: number;
  music: number;
  musicEffect: number; // （0x0--正常，0x01-渐强，0x2--渐弱）默认02-渐弱；
  musicVolume: number; // 1-10范围
  time: number; // 伴睡时长 10 ～120
  enableAnimation: number; // 0-关闭，1-开启
  animation: number; // 动画序号
  manualClose: number; // 0-自动关闭，1-手动关闭
}
function Scene() {
  const {
    [sleepAidStatusCode]: sleepAidStatus,
    [switchFaSleepCode]: switchFaSleep, // 伴睡开关
    [sleepSettingCode]: sleepSetting,
    [volumeSetCode]: volumeSet,
  } = useSelector(({ dpState }: any) => dpState);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [sceneData, setSceneData] = useState<SceneData>(sceneDataDefault);
  const [isWorking, setIsWorking] = useState<boolean>(switchFaSleep);
  const [showAnimate, setShowAnimate] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  useEffect(() => {
    setIsWorking(switchFaSleep);
  }, [switchFaSleep]);

  useEffect(() => {
    if (sleepSetting) {
      const _sceneItem = sleepStr2Object(sleepSetting) || sceneDataDefault;
      setSceneData(_sceneItem);
    }
  }, [sleepSetting, switchFaSleep, sleepAidStatus]);

  const getLeftTime = () => {
    if (!switchFaSleep) return 0; // 改场景未开启;
    const time = getSleepLeftTime(sleepAidStatus);
    return +time;
  };

  const updateSceneState = (id: string, value: number | string | boolean) => {
    const _sceneData = {
      ...sceneData,
      [id]: value,
    };
    setSceneData(_sceneData);
    const dpData = sleep2String(_sceneData);
    TYSdk.device.putDeviceData({ [sleepSettingCode]: dpData });
  };

  const toggleWorking = () => {
    const newItem = _.cloneDeep(sceneData);
    const sleepDpStr = sleep2String(newItem);
    const data = {};
    if (!_.isEqual(sleepSetting, sleepDpStr)) {
      data[sleepSettingCode] = sleepDpStr;
    }
    if (!_.isEmpty(data)) {
      TYSdk.device.putDeviceData(data);
    }
    setIsWorking(!isWorking);
    TYSdk.device.putDeviceData({ [switchFaSleepCode]: !isWorking });
  };

  const toggleCountdown = () => {
    updateSceneState('manualClose', !sceneData.manualClose);
  };

  const renderSceneCountDown = () => {
    const { manualClose, time } = sceneData;
    const leftTime = getLeftTime();
    const progressPresent = Math.round((+leftTime / +time) * 100);
    const isCountdown = isWorking && !manualClose; // dp + 场景倒计时开启 + 这个场景开启
    const progressValue = isCountdown ? progressPresent : 0; // 需要倒计时传值；其他情况传0；
    return (
      <View style={[styles.center, styles.countDownView]}>
        <Progress.Space
          strokeWidth={cx(2)}
          scaleNumber={120}
          backColor="rgba(255,255,255,0.2)"
          foreColor="#fff"
          style={styles.sceneProgressStyle}
          value={progressValue}
          startDegree={0}
          andDegree={360}
          disabled={true}
        />
      </View>
    );
  };

  const renderPickerOrManualClose = () => {
    if (!sceneData.manualClose) {
      return (
        <Countdown
          value={sceneData.time}
          onValueChange={(value: number) => {
            updateSceneState('time', value);
          }}
        />
      );
    }
    return (
      <View style={[styles.center, styles.flex1]}>
        <Image source={Res.auto_close_off} style={styles.autoClose} />
        <TYText style={styles.autoCloseText} align="center" numberOfLines={2}>
          {i18n.getLang('auto_close_off')}
        </TYText>
      </View>
    );
  };

  const getSmallImages = () => {
    const { animation, music } = sceneData || {};
    if (!sceneData || (sceneData.animation === undefined && sceneData.music === undefined))
      return [null, null];
    if (animation === undefined) {
      return [Res[`sleep_animate_${music}`], null];
    }
    if (music === undefined) {
      return [null, Res[`scene_music_${animation}`]];
    }
    return [Res[`sleep_animate_${animation}`], Res[`scene_music_${music}`]];
  };

  const renderSceneWorking = () => {
    const sceneImages = getSmallImages().filter(i => !!i);
    const soundOrLight = getSoundOrLightString(sceneData.animation, sceneData.music);
    const { manualClose } = sceneData;
    const leftTime = getLeftTime();
    const hint = !manualClose ? `${leftTime}${i18n.getLang('min')}` : i18n.getLang('manual_close');
    if (sceneImages.length > 1) {
      return (
        <View style={styles.renderReadingView}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={sceneImages[0]} style={styles.lightImage} />
              <TYText style={styles.lightName}>{soundOrLight[0]}</TYText>
            </View>
            <Image source={Res.sound_and_light} style={styles.soundAndLight} />
            <View style={{ alignItems: 'center' }}>
              <Image source={sceneImages[1]} style={styles.lightImage} />
              <TYText style={styles.lightName}>{soundOrLight[1]}</TYText>
            </View>
          </View>
          <TYText style={styles.endText}>{hint}</TYText>
        </View>
      );
    }
    if (sceneImages.length === 1) {
      return (
        <View style={styles.renderReadingView}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={sceneImages[0]} style={styles.lightImage} />
              <TYText style={styles.lightName}>{soundOrLight[0]}</TYText>
            </View>
          </View>
          <TYText style={styles.endText}>{hint}</TYText>
        </View>
      );
    }
  };

  const countdownImage = sceneData.manualClose ? Res.auto_close_off : Res.auto_close_on;

  const updateVolume = (value: number) => {
    if (isWorking) {
      TYSdk.device.putDeviceData({ [volumeSetCode]: value * 10 });
    } else {
      updateSceneState('musicVolume', value);
    }
  };

  return (
    <View style={styles.flex1}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('asleep')}
        titleStyle={{ color: commonColor.mainText, fontSize: cx(18) }}
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
      />
      <ScrollView style={[styles.flex1]}>
        {renderSceneCountDown()}
        <View style={styles.countDownCenter}>
          {isWorking ? renderSceneWorking() : renderPickerOrManualClose()}
        </View>
        <View style={styles.startViewWrapView}>
          <TouchableOpacity
            style={styles.startViewWrap}
            activeOpacity={0.8}
            onPress={toggleWorking}
          >
            <View style={styles.startView}>
              <Image source={isWorking ? Res.stopScene : Res.start} style={styles.startImage} />
              <TYText style={styles.startText}>
                {isWorking ? i18n.getLang('stop') : i18n.getLang('start')}
              </TYText>
            </View>
          </TouchableOpacity>
        </View>
        {!isWorking ? (
          <View style={styles.effectView}>
            <TouchableOpacity activeOpacity={0.8} onPress={toggleCountdown}>
              <View style={styles.effectViewWrap}>
                <Image source={countdownImage} style={styles.effectIcon} />
                <TYText style={styles.effectViewText}>{i18n.getLang('countdown')}</TYText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowAnimate(true);
              }}
            >
              <View style={styles.effectViewWrap}>
                <Image source={Res.xing} style={styles.effectIcon} />
                <TYText style={styles.effectViewText}>
                  {i18n.getLang(`sleep_animate_${sceneData.animation}`)}
                </TYText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowMusic(true);
              }}
            >
              <View style={styles.effectViewWrap}>
                <Image source={Res.music_icon} style={styles.effectIcon} />
                <TYText style={styles.effectViewText}>
                  {i18n.getLang(`scene_music_${sceneData.music}`)}
                </TYText>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {isWorking ? (
          <View style={{ marginTop: cx(34), marginBottom: cx(50) }}>
            <View>
              <View style={[styles.row, styles.spaceBt]}>
                <TYText style={styles.sliderText}>{i18n.getLang('volume_setting')}</TYText>
                <TYText style={styles.sliderText1}>{volumeSet / 10}</TYText>
              </View>
              <SliderView
                value={volumeSet / 10}
                style={styles.sliderView}
                img={Res.volume}
                min={1}
                max={10}
                step={1}
                onComplete={(value: number) => {
                  // updateSceneState('musicVolume', value);
                  updateVolume(value);
                }}
                showValue={false}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
      <AnimateModal
        isVisiblePop={showAnimate}
        onConfirm={(value: number) => {
          updateSceneState('animation', value);
          setShowAnimate(false);
        }}
        onClose={() => {
          setShowAnimate(false);
        }}
        value={sceneData.animation}
      />
      <MusicModal
        isVisiblePop={showMusic}
        onConfirm={(value: number) => {
          updateSceneState('music', value);
          setShowMusic(false);
        }}
        onClose={() => {
          setShowMusic(false);
        }}
        value={sceneData.music}
      />
    </View>
  );
}

export default Scene;

const styles = StyleSheet.create({
  backView: {
    marginLeft: cx(24),
    width: cx(24),
    height: cx(24),
  },
  backImage: {
    width: cx(24),
    height: cx(24),
  },
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDownView: {
    width: cx(375),
    height: cx(305),
    marginTop: cx(36),
  },
  sceneProgressStyle: {
    width: cx(305),
    height: cx(305),
    transform: [{ rotate: '-90deg' }],
  },
  countDownCenter: {
    marginTop: -cx(330),
    marginHorizontal: cx(18),
    flex: 1,
    height: cx(320),
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBt: {
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightImage: {
    width: cx(68),
    height: cx(68),
    marginBottom: cx(10),
  },
  lightName: {
    fontSize: cx(12),
    color: '#fff',
  },
  soundAndLight: {
    width: cx(60),
    height: cx(29),
    marginHorizontal: cx(20),
    marginTop: cx(23),
  },
  endText: {
    marginTop: cx(36),
    fontSize: cx(16),
    color: '#fff',
  },
  renderReadingView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: cx(50),
  },
  startViewWrapView: {
    marginTop: cx(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startViewWrap: {
    width: cx(118),
    height: cx(48),
  },
  startView: {
    flexDirection: 'row',
    width: cx(118),
    height: cx(48),
    borderRadius: cx(24),
    backgroundColor: 'rgba(255,255,255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontSize: cx(16),
    color: '#fff',
  },
  startImage: {
    marginRight: cx(10),
    tintColor: '#fff',
  },
  effectView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: cx(20),
    marginTop: cx(90),
  },
  effectIcon: {
    width: cx(30),
    height: cx(30),
    marginBottom: cx(8),
  },
  effectViewWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: cx(100),
  },
  effectViewText: {
    fontSize: cx(12),
    color: '#fff',
  },
  sliderView: {
    borderRadius: cx(10),
    paddingHorizontal: cx(20),
    marginBottom: cx(15),
  },
  sliderText: {
    fontSize: cx(12),
    color: '#fff',
    marginLeft: cx(20),
    marginBottom: cx(15),
  },
  sliderText1: {
    fontSize: cx(12),
    color: '#fff',
    marginRight: cx(20),
    marginBottom: cx(15),
  },
  autoClose: {
    width: cx(56),
    height: cx(80),
    resizeMode: 'stretch',
    marginBottom: cx(18),
  },
  autoCloseText: {
    fontSize: cx(16),
    color: '#fff',
    lineHeight: cx(20),
    width: cx(160),
  },
});
