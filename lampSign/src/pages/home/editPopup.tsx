import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Utils, TYText, Slider } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;
const { hsv2rgb } = Utils.ColorUtils.color;
// 灯效参数显示配置
// [颜色、速度、亮度]
// 1-彩虹    （速度，亮度）
// 2-火焰     （速度，亮度）
// 3-音乐      （速度，亮度）
// 4-呼吸       （颜色，速度）
// 5-纯色         （颜色，亮度，
// 6-节日   （颜色，速度，亮度）
// 7-追逐     （速度，亮度，颜色）
// 8-闪烁       （速度，颜色）
// 9-过渡        （速度，亮度）
const EFFECT_HSV_CONFIG = [
  [false, true, true],
  [false, true, true],
  [false, true, true],
  [true, true, false],
  [true, false, true],
  [true, true, true],
  [false, true, true],
  [true, true, false],
  [false, true, true],
];

const PopUp = (props: any) => {
  const { isVisiblePop: _isVisiblePop, onValueChange, data, onClose, onConfirm, extraKey } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(_isVisiblePop);
  const [brightness, setBrightness] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [hue, setHue] = useState(50);
  const [effect, setEffect] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsVisiblePop(_isVisiblePop);
  }, [_isVisiblePop]);

  const updateData = (key: string, value: any) => {
    const newData = _deepClone(data).map((item: any) => {
      if (item.onFocus) {
        item[key] = value;
      }
      return item;
    });
    onValueChange(newData);
  };

  useEffect(() => {
    const onFocusData = _deepClone(data).filter((item: any) => item.onFocus);
    if (onFocusData.length === 0) return;
    // 初始化元素的灯效、速度、亮度、色调，提取选中第一个元素
    if (onFocusData.length === 1) {
      setEffect(onFocusData[0].effect);
      setSpeed(onFocusData[0].speed);
      setBrightness(onFocusData[0].brightness);
      setHue(onFocusData[0].hue);
      return;
    }
    const newData = _deepClone(data).map((item: any) => {
      if (item.onFocus) {
        item.effect = effect;
        item.speed = speed;
        item.brightness = brightness;
        item.hue = hue;
      }
      return item;
    });
    onValueChange(newData);
  }, [extraKey]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisiblePop ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisiblePop]);

  const getThumbColor = () => {
    const [r, g, b] = hsv2rgb(hue, 100, 100, 1);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const theme = {
    width: cx(343),
    height: cx(4),
    trackRadius: cx(2),
    trackHeight: cx(4),
    thumbSize: cx(14),
    thumbRadius: cx(14),
  };
  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [500, 0],
              }),
            },
          ],
        },
        styles.popupView,
      ]}
    >
      {/* 动画视图内容 */}
      <View style={[styles.popupTopView]}>
        <TouchableOpacity
          onPress={() => {
            setIsVisiblePop(false);
            onClose();
          }}
        >
          <Image source={Res.close} style={styles.buttonImage} />
        </TouchableOpacity>
        <TYText style={styles.title}>{i18n.getLang('edit_light')}</TYText>
        <TouchableOpacity
          onPress={() => {
            setIsVisiblePop(false);
            onConfirm();
          }}
        >
          <Image source={Res.done} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.popupViewEffect}>
        <TYText style={styles.text1}>{i18n.getLang('light_effect')}</TYText>
        <ScrollView
          horizontal={true}
          style={styles.listView}
          showsHorizontalScrollIndicator={false}
        >
          {_times(9, String).map((item, index) => {
            const isActive = effect === index;
            return (
              <View key={index} style={styles.effectItem}>
                <TouchableOpacity
                  style={[
                    styles.effectItemEffect,
                    { borderColor: isActive ? '#fff' : 'transparent' },
                  ]}
                  activeOpacity={0.65}
                  onPress={() => {
                    setEffect(index);
                    updateData('effect', index);
                  }}
                >
                  <ImageBackground source={Res[`effect_${index}`]} style={[styles.effectItemBg]}>
                    <Image source={Res.effect} style={styles.effectFake} />
                  </ImageBackground>
                </TouchableOpacity>
                <TYText align="center" style={styles.text1}>
                  {i18n.getLang(`light_effect_${index}`)}
                </TYText>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View>
        {EFFECT_HSV_CONFIG[effect][0] && (
          <View style={[styles.sliderView]}>
            <View style={styles.sliderTitle}>
              <TYText style={styles.text1}>{i18n.getLang('color')}</TYText>
            </View>
            <Slider.Horizontal
              theme={theme}
              value={hue}
              minimumValue={0}
              maximumValue={360}
              onlyMaximumTrack={true}
              thumbStyle={styles.thumbStyle}
              renderMaximumTrack={() => (
                <Image source={Res.hue_slider} resizeMode="stretch" style={styles.MaximumTrack} />
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
                updateData('hue', Math.round(v));
              }}
            />
          </View>
        )}
        {EFFECT_HSV_CONFIG[effect][1] && (
          <View style={styles.sliderView}>
            <View style={styles.sliderTitle}>
              <TYText style={styles.text1}>{i18n.getLang('speed')}</TYText>
              <TYText style={styles.text1}>{`${speed}%`}</TYText>
            </View>
            <Slider.Horizontal
              theme={{
                ...theme,
                thumbTintColor: '#FFF',
                minimumTrackTintColor: '#ABABAC',
                maximumTrackTintColor: '#2E2E30',
              }}
              maximumValue={100}
              minimumValue={0}
              value={speed}
              onValueChange={v => setSpeed(Math.round(v))}
              onSlidingComplete={v => {
                setSpeed(Math.round(v));
                updateData('speed', Math.round(v));
              }}
            />
          </View>
        )}
        {EFFECT_HSV_CONFIG[effect][2] && (
          <View style={styles.sliderView}>
            <View style={styles.sliderTitle}>
              <TYText style={styles.text1}>{i18n.getLang('brightness')}</TYText>
              <TYText style={styles.text1}>{`${brightness}%`}</TYText>
            </View>
            <Slider.Horizontal
              theme={{
                ...theme,
                thumbTintColor: '#FFF',
                minimumTrackTintColor: '#ABABAC',
                maximumTrackTintColor: '#2E2E30',
              }}
              maximumValue={100}
              minimumValue={0}
              style={{ marginBottom: cx(16) }}
              value={brightness}
              onValueChange={v => setBrightness(Math.round(v))}
              onSlidingComplete={v => {
                setBrightness(Math.round(v));
                updateData('brightness', Math.round(v));
              }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  popupView: {
    width: cx(375),
    height: cx(430),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopLeftRadius: cx(24),
    borderTopRightRadius: cx(24),
  },
  popupTopView: {
    marginHorizontal: cx(16),
    marginVertical: cx(12),
    paddingVertical: cx(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: cx(16),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  text1: {
    fontSize: cx(12),
    color: '#ABABAC',
    lineHeight: cx(24),
  },
  popupViewEffect: {
    paddingHorizontal: cx(16),
  },
  buttonImage: {
    width: cx(24),
    height: cx(24),
  },
  listView: {
    marginBottom: cx(16),
  },
  effectItem: {
    width: cx(60),
    marginRight: cx(8),
    marginTop: cx(12),
  },
  effectItemEffect: {
    borderWidth: cx(2),
    borderColor: 'transparent',
    borderRadius: cx(4),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectItemBg: {
    width: cx(58),
    height: cx(58),
    borderRadius: cx(4),
    overflow: 'hidden',
  },
  effectFake: {
    width: cx(58),
    height: cx(58),
  },
  sliderView: {
    paddingHorizontal: cx(16),
    marginBottom: cx(14),
  },
  sliderTitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  thumbStyle: {
    width: cx(14),
    height: cx(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  MaximumTrack: {
    height: cx(4),
    width: cx(343),
    borderRadius: cx(2),
  },
  renderThumb: {
    width: cx(8),
    height: cx(8),
    borderRadius: cx(4),
  },
});
