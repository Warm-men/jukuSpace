import React from 'react';
import { Slider } from 'tuya-panel-kit';
import { cx } from '@config/styles';

const SwitchView = (props: any) => {
  const {
    onSlidingComplete = () => {},
    onValueChange,
    value,
    max = 100,
    min = 0,
    width = cx(268),
  } = props;
  return (
    <Slider.Horizontal
      {...props}
      theme={{
        width,
        height: cx(4),
        trackRadius: cx(2),
        trackHeight: cx(4),
        thumbSize: cx(14),
        thumbRadius: cx(14),
        thumbTintColor: '#F6F6F6',
        minimumTrackTintColor: '#E5E5E5',
        maximumTrackTintColor: '#272632',
      }}
      maximumValue={max}
      minimumValue={min}
      value={value}
      onValueChange={v => onValueChange(Math.round(v))}
      onSlidingComplete={v => onSlidingComplete(Math.round(v))}
    />
  );
};

export default SwitchView;
