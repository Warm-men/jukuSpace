import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Utils, TYText, Picker } from 'tuya-panel-kit';
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
                    outputRange: [300, 0],
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
            <TYText style={styles.title}>{i18n.getLang('set_duration')}</TYText>
            <TouchableOpacity
              onPress={() => {
                setIsVisiblePop(false);
                onConfirm(value);
              }}
            >
              <Image source={Res.done} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.pickerView}>
            <View style={styles.pickerBg}>
              <TYText style={styles.pickerText}>{i18n.getLang('minute')}</TYText>
            </View>
            <Picker
              style={{
                width: 100,
                height: 225,
                backgroundColor: 'transparent',
              }}
              theme={{
                fontColor: '#FFFFFF',
                fontSize: cx(24),
                dividerColor: 'transparent',
              }}
              selectedValue={value}
              onValueChange={value => setValue(value)}
            >
              {getPickerData().map(item => (
                <Picker.Item key={item.value} value={item.value} label={item.label} />
              ))}
            </Picker>
          </View>
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
    height: cx(270),
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
    borderBottomColor: '#3A3A3C',
    borderBottomWidth: cx(1),
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
  pickerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBg: {
    position: 'absolute',
    top: 84,
    left: cx(100),
    height: 48,
    width: cx(180),
    backgroundColor: '#403D53',
    borderRadius: cx(8),
  },
  pickerText: {
    position: 'absolute',
    bottom: cx(12),
    right: cx(34),
    fontSize: cx(12),
    color: '#FFFFFF',
  },
});
