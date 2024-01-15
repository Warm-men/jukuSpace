import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop: _isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(_isVisiblePop);
  const [value, setValue] = useState(_value);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsVisiblePop(_isVisiblePop);
  }, [_isVisiblePop]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisiblePop ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisiblePop]);

  const getPickerData = () => {
    const range = Utils.NumberUtils.range(1, 121, 1);
    const timerRange = range.map((item: number) => {
      return {
        label: `${item}`,
        value: item,
      };
    });
    return timerRange;
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisiblePop}>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
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
            <TYText style={styles.title}>{i18n.getLang('set_clock_music')}</TYText>
            <TouchableOpacity
              onPress={() => {
                setIsVisiblePop(false);
                onConfirm(value);
              }}
            >
              <Image source={Res.done} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: cx(28) }}>
            <View style={styles.musicBox}>
              {_times(10).map((item: number, index: number) => {
                const isActive = index === value;
                return (
                  <View key={item} style={styles.musicItem}>
                    <TouchableOpacity
                      inPress={() => {
                        setValue(index);
                      }}
                    >
                      <Image source={Res[`clock_${index}`]} style={styles.musicImage} />
                    </TouchableOpacity>
                    <TYText size={cx(14)} color="#F6F6F6" align="center">
                      {i18n.getLang(`music_${index}`)}
                    </TYText>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  popupView: {
    width: cx(375),
    height: cx(530),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2E2C3D',
    borderTopLeftRadius: cx(24),
    borderTopRightRadius: cx(24),
  },
  popupTopView: {
    marginHorizontal: cx(20),
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
  buttonImage: {
    width: cx(24),
    height: cx(24),
  },
  musicBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: cx(16),
  },
  musicItem: {
    width: cx(100),
    marginBottom: cx(22),
    borderRadius: cx(8),
  },
  musicImage: {
    width: cx(100),
    height: cx(100),
    borderRadius: cx(8),
    marginBottom: cx(8),
  },
});
