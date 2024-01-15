import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, Image, Modal, Platform } from 'react-native';
import { Utils, TYText, Picker } from 'tuya-panel-kit';
import Res from '@res';
import i18n from '@i18n';
import { getAmPmData, getHourData, getMinuteData } from '@utils';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop: _isVisiblePop, onClose, onConfirm, value: _value } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(_isVisiblePop);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState('AM');

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

  const handleOnChange = (value: any, type: string) => {
    if (type === 'hour') {
      setHour(value);
    } else if (type === 'ampm') {
      setAmpm(value);
    } else {
      setMinute(value);
    }
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
            <TYText style={styles.title}>{i18n.getLang('set_time')}</TYText>
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
            <Picker
              style={styles.pickerStyle}
              theme={{
                fontColor: '#FFFFFF',
                fontSize: cx(22),
                dividerColor: 'transparent',
              }}
              selectedValue={hour}
              onValueChange={value => {
                handleOnChange(value, 'hour');
              }}
            >
              {getHourData().map(item => (
                <Picker.Item key={item.value} value={item.value} label={item.label} />
              ))}
            </Picker>
            <View style={styles.pickerMiddle} />
            <Picker
              style={styles.pickerStyle}
              theme={{
                fontColor: '#FFFFFF',
                fontSize: cx(22),
                dividerColor: 'transparent',
              }}
              selectedValue={minute}
              onValueChange={value => {
                handleOnChange(value, 'minute');
              }}
            >
              {getMinuteData().map(item => (
                <Picker.Item key={item.value} value={item.value} label={item.label} />
              ))}
            </Picker>
            <Picker
              style={styles.pickerStyle}
              theme={{
                fontColor: '#FFFFFF',
                fontSize: cx(22),
                dividerColor: 'transparent',
              }}
              selectedValue={ampm}
              onValueChange={value => {
                handleOnChange(value, 'ampm');
              }}
            >
              {getAmPmData().map(item => (
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStyle: {
    width: cx(50),
    height: cx(160),
    backgroundColor: 'transparent',
  },
  pickerMiddle: {
    height: 38,
    width: cx(290),
    backgroundColor: '#403D53',
    borderRadius: cx(8),
    position: 'absolute',
    left: cx(32),
    top: Platform.OS === 'android' ? 58 : 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: cx(10),
    zIndex: -1,
  },
});
