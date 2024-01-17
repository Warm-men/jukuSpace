import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import Res from '@res';
import i18n from '@i18n';
import _deepClone from 'lodash/cloneDeep';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const {
    visible,
    children,
    popupViewHeight = cx(530),
    outputRangeStart = 600,
    onClose,
    title = '',
    onConfirm,
    hasBottom = false,
  } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsVisiblePop(visible);
      setIsVisibleModal(visible);
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisiblePop ? 1 : 0,
      duration: 450,
      // useNativeDriver: true,
    }).start(() => {
      if (!isVisiblePop) {
        setIsVisibleModal(false);
      }
    });
  }, [isVisiblePop]);

  const renderTopView = () => {
    if (hasBottom) {
      return (
        <View style={[styles.popupTopView]}>
          <View />
          <TYText style={styles.title}>{title}</TYText>
          <TouchableOpacity
            onPress={() => {
              setIsVisiblePop(false);
              onClose();
            }}
          >
            <Image source={Res.close} style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[styles.popupTopView]}>
        <TouchableOpacity
          onPress={() => {
            setIsVisiblePop(false);
            onClose();
          }}
        >
          <Image source={Res.close} style={styles.buttonImage} />
        </TouchableOpacity>
        <TYText style={styles.title}>{title}</TYText>
        <TouchableOpacity
          onPress={() => {
            setIsVisiblePop(false);
            onConfirm();
          }}
        >
          <Image source={Res.done} style={styles.buttonImage} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={isVisibleModal} transparent={true}>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [outputRangeStart, 0],
                  }),
                },
              ],
            },
            styles.popupView,
            { height: popupViewHeight },
          ]}
        >
          {/* 动画视图内容 */}
          {renderTopView()}
          {children}
          {hasBottom ? (
            <TouchableOpacity
              style={styles.confirmView}
              onPress={() => {
                setIsVisiblePop(false);
                onConfirm();
              }}
            >
              <TYText align="center" style={styles.confirmText}>
                {i18n.getLang('confirm')}
              </TYText>
            </TouchableOpacity>
          ) : null}
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
    paddingBottom: cx(30),
  },
  popupTopView: {
    marginHorizontal: cx(20),
    marginVertical: cx(12),
    paddingVertical: cx(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonImage: {
    width: cx(24),
    height: cx(24),
  },
  title: {
    fontSize: cx(16),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  confirmView: {
    width: cx(343),
    height: cx(48),
    borderRadius: cx(24),
    backgroundColor: '#6051FA',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  confirmText: {
    fontSize: cx(16),
    color: '#fff',
  },
});
