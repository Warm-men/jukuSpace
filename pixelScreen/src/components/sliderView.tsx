import React, { PureComponent } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { TYText, Utils, Slider } from 'tuya-panel-kit';

const { convertX: cx } = Utils.RatioUtils;
const screenWidth = Dimensions.get('window').width;

interface IProps {
  onValueChange?: (key: number) => void;
  onComplete: (key: number) => void;
  img: number;
  max: number;
  min: number;
  step: number;
  style: object;
  value: number;
  text?: number;
  disabled?: boolean;
  showValue?: boolean;
}
export default class SliderView extends PureComponent<IProps> {
  render() {
    const {
      img,
      min,
      max,
      step,
      style,
      disabled,
      showValue = true,
      value,
      onValueChange,
      onComplete,
      text,
    } = this.props;
    return (
      <View style={[styles.sliderView, style]}>
        <Image source={img} resizeMode="contain" style={{ tintColor: '#fff' }} />
        <Slider
          style={[styles.slider, disabled && { opacity: 0.5 }]}
          value={value}
          disabled={disabled}
          minimumValue={min}
          thumbSize={16}
          trackHeight={5}
          maximumValue={max}
          thumbTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.2)"
          minimumTrackTintColor="#fff"
          stepValue={step}
          onValueChange={(v: number) => onValueChange && onValueChange(v)}
          onSlidingComplete={(v: number) => onComplete && onComplete(v)}
        />
        {showValue ? <TYText style={styles.brightText}>{text || value || 0}%</TYText> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  slider: {
    width: cx(300),
    marginLeft: cx(16),
  },

  brightText: {
    fontSize: cx(12),
    color: '#333',
    width: cx(40),
    textAlign: 'center',
  },
});
