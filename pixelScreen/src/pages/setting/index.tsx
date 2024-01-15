import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, TopBar, Picker, Slider, SwitchButton } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import { planOpen2Object, } from '@utils';
import { cx, commonColor, commonStyles } from '@config/styles';
import { dpCodes } from '@config';
import TimePopup from './timePopup';
import styles from './styles';

const { hsv2rgb } = Utils.ColorUtils.color;
const { openPlanCode } = dpCodes;
function Setting() {
  const { [openPlanCode]: openPlan } = useSelector(({ dpState }: any) => dpState);

  const openPlanObject = planOpen2Object(openPlan);

  const { time, switchState } = openPlanObject;
  // const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const [isVisiblePop, setIsVisiblePop] = useState(false);
  const [screenBrightness, setScreenBrightness] = useState(0);
  const [syncTime, setSyncTime] = useState(false);
  const [syncWeather, setSyncWeather] = useState(false);
  const [timeColorType, setTimeColorType] = useState('0');
  const [gradientColorType, setGradientColorType] = useState('0');

  const [hue, setHue] = useState(50);

  const brightnessRef = useRef(null);

  const handleOpenSetTime = () => {
    setIsVisiblePop(true);
  };

  const handleOnCloseTimePop = () => {
    setIsVisiblePop(false);
  };

  const handleOnConfirmTime = (value: number) => {};

  const getThumbColor = () => {
    const [r, g, b] = hsv2rgb(hue, 100, 100, 1);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const theme = {
    width: cx(295),
    height: cx(4),
    trackRadius: cx(2),
    trackHeight: cx(4),
    thumbSize: cx(14),
    thumbRadius: cx(14),
  };

  const gradientColors = [
    {
      image: Res.gradient_color_0,
      value: '0',
    },
    {
      image: Res.gradient_color_1,
      value: '1',
    },
    {
      image: Res.gradient_color_2,
      value: '2',
    },
    {
      image: Res.gradient_color_3,
      value: '3',
    },
  ];

  const getTimeText = () => {
    return `10:25`;
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('setting')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: cx(24) }}>
        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('sync_time')}
            </TYText>
            <SwitchButton
              onTintColor={commonColor.mainColor}
              tintColor="#2E2C3D"
              thumbTintColor="#5A5774"
              onThumbTintColor="#fff"
              size={{ width: cx(42), height: cx(28) }}
              thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
              value={syncTime}
              onValueChange={value => {
                setSyncTime(value);
              }}
            />
          </View>
          {!syncTime && <View style={styles.line} />}
          {!syncTime && (
            <View style={styles.optionViewItem}>
              <TYText size={cx(14)} color="#C5C5C5">
                {i18n.getLang('sync_time')}
              </TYText>
              <TouchableOpacity activeOpacity={0.8} onPress={handleOpenSetTime}>
                <View style={styles.clickView}>
                  <TYText size={cx(14)} color="#78787A">
                    {getTimeText()}
                  </TYText>
                  <Image style={styles.arrowImage} source={Res.arrow_right} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.optionView}>
          <View style={styles.optionViewItem}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('sync_weather')}
            </TYText>
            <SwitchButton
              onTintColor={commonColor.mainColor}
              tintColor="#2E2C3D"
              thumbTintColor="#5A5774"
              onThumbTintColor="#fff"
              size={{ width: cx(42), height: cx(28) }}
              thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
              value={syncWeather}
              onValueChange={value => {
                setSyncWeather(value);
              }}
            />
          </View>
        </View>

        <View style={styles.optionView}>
          <View
            style={[styles.optionViewItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
          >
            <View style={[commonStyles.flexRowBetween, { width: cx(295), height: cx(34) }]}>
              <TYText size={cx(14)} color="#C5C5C5">
                {i18n.getLang('time_text_color')}
              </TYText>
              <View style={[commonStyles.flexRowBetween, { width: cx(120) }]}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setTimeColorType('1');
                  }}
                >
                  <View style={[commonStyles.flexRowCenter, { width: cx(50) }]}>
                    <Image
                      source={timeColorType === '1' ? Res.time_color_focus : Res.time_color_blur}
                      style={styles.selectColor}
                    />
                    <TYText size={cx(14)} color={timeColorType === '1' ? '#fff' : '#78787A'}>
                      {i18n.getLang('pure_color')}
                    </TYText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setTimeColorType('2');
                  }}
                >
                  <View style={[commonStyles.flexRowCenter, { width: cx(50) }]}>
                    <Image
                      source={timeColorType === '2' ? Res.time_color_focus : Res.time_color_blur}
                      style={styles.selectColor}
                    />
                    <TYText size={cx(14)} color={timeColorType === '2' ? '#fff' : '#78787A'}>
                      {i18n.getLang('gradient_color')}
                    </TYText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {timeColorType === '1' && (
              <Slider.Horizontal
                theme={theme}
                value={hue}
                minimumValue={0}
                maximumValue={360}
                onlyMaximumTrack={true}
                thumbStyle={styles.thumbStyle}
                renderMaximumTrack={() => (
                  <Image
                    source={Res.color_slider_bg}
                    resizeMode="stretch"
                    style={styles.MaximumTrack}
                  />
                )}
                renderThumb={() => (
                  <View
                    style={[
                      styles.renderThumb,
                      {
                        backgroundColor: getThumbColor(),
                      },
                    ]}
                  />
                )}
                onValueChange={v => setHue(Math.round(v))}
                onSlidingComplete={v => {
                  setHue(Math.round(v));
                }}
              />
            )}

            {timeColorType === '2' && (
              <View style={[commonStyles.flexRowBetween, { width: cx(295) }]}>
                {gradientColors.map(item => {
                  const isActive = item.value === gradientColorType;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      key={item.value}
                      onPress={() => {
                        setGradientColorType(item.value);
                      }}
                      style={[
                        styles.gradientView,
                        {
                          borderWidth: isActive ? cx(2) : 0,
                          borderColor: isActive ? '#fff' : '#21202C',
                        },
                      ]}
                    >
                      <Image source={item.image} style={styles.gradientImage} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <View style={styles.optionView}>
          <View
            style={[styles.optionViewItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
          >
            <View style={[commonStyles.flexRowBetween, { width: cx(295), height: cx(34) }]}>
              <TYText size={cx(14)} color="#C5C5C5">
                {i18n.getLang('screen_brightness')}
              </TYText>
              <TYText size={cx(14)} color="#78787A" ref={brightnessRef}>
                {screenBrightness}
              </TYText>
            </View>

            <Slider.Horizontal
              theme={{
                width: cx(295),
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
              value={screenBrightness}
              onValueChange={(v: number) => {
                brightnessRef &&
                  brightnessRef.current &&
                  brightnessRef.current?.setText(Math.round(v));
              }}
              onSlidingComplete={v => setScreenBrightness(Math.round(v))}
            />
          </View>
        </View>
      </ScrollView>
      <TimePopup
        onClose={handleOnCloseTimePop}
        onConfirm={handleOnConfirmTime}
        isVisiblePop={isVisiblePop}
        value={openPlanObject.duration}
      />
    </View>
  );
}

export default Setting;
