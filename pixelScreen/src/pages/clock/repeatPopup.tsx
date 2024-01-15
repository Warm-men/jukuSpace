import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _times from 'lodash/times';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop: _isVisiblePop, onClose, onConfirm, value } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(_isVisiblePop);
  const [repeat, setRepeat] = useState(value);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsVisiblePop(_isVisiblePop);
  }, [_isVisiblePop]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisiblePop ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisiblePop]);

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
          <TYText style={styles.title}>{i18n.getLang('set_repeat')}</TYText>
          <TouchableOpacity
            onPress={() => {
              setIsVisiblePop(false);
              onConfirm(repeat);
            }}
          >
            <Image source={Res.done} style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.repeatView}>
          {_times(7).map((item: number, index: number) => {
            const isActive = repeat[index] === 1;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.repeatItem, { backgroundColor: isActive ? '#6B73E7' : '#474748' }]}
                onPress={() => {
                  const newData = _deepClone(repeat);
                  newData[index] = newData[index] === 1 ? 0 : 1;
                  setRepeat(newData);
                }}
              >
                <TYText size={cx(12)} color={isActive ? '#fff' : '#78787A'}>
                  {i18n.getLang(`day_${index}`)}
                </TYText>
              </TouchableOpacity>
            );
          })}
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
    height: cx(170),
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
  repeatView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: cx(16),
    marginHorizontal: cx(16),
  },
  repeatItem: {
    width: cx(36),
    height: cx(36),
    borderRadius: cx(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
