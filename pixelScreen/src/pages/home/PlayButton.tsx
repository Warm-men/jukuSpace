import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Progress } from 'tuya-panel-kit';
import { cx } from '@config/styles';
// import _deepClone from 'lodash/cloneDeep';
import Res from '@res';

function PlayButton(props) {
  const { onPress, value, autoClose, status, max } = props;
  if (autoClose && status) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.playView}>
        <View>
          <Progress
            foreColor={{
              '0%': '#1381FB',
              '100%': '#1381FB',
            }}
            style={styles.progressStyle}
            needMaxCircle={true}
            startColor="#1381FB"
            thumbRadius={0}
            scaleHeight={cx(2)}
            value={value}
            min={0}
            max={max}
            startDegree={0}
            andDegree={360}
            disabled={true}
          />
          <Image source={Res.stopScence} style={styles.itemIcon} />
        </View>
      </TouchableOpacity>
    );
  }
  const icon = status ? Res.stopScence : Res.start;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.playView}>
      <Image source={icon} style={styles.itemIcon1} />
    </TouchableOpacity>
  );
}

export default PlayButton;

const styles = StyleSheet.create({
  playView: {
    width: cx(42),
    height: cx(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStyle: {
    width: cx(36),
    height: cx(36),
    transform: [{ rotate: '-90deg' }],
  },
  itemIcon: {
    width: cx(13),
    height: cx(13),
    position: 'absolute',
    top: cx(12),
    left: cx(12),
  },
  itemIcon1: {
    width: cx(13),
    height: cx(13),
  },
});
