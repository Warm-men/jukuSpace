import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Utils, TYText } from 'tuya-panel-kit';
import _deepClone from 'lodash/cloneDeep';
import Res from '@res';
import i18n from '@i18n';

const { convertX: cx } = Utils.RatioUtils;

const PopUp = (props: any) => {
  const { isVisiblePop: _isVisiblePop, onClose, onConfirm, data } = props;
  const [isVisiblePop, setIsVisiblePop] = useState(_isVisiblePop);
  const [isVisibleModal, setIsVisibleModal] = useState(_isVisiblePop);

  const [currentData, setCurrentData] = useState<any>(data);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (_isVisiblePop) {
      setIsVisiblePop(_isVisiblePop);
      setIsVisibleModal(_isVisiblePop);
      setCurrentData(data);
    }
  }, [_isVisiblePop]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisiblePop ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisiblePop]);

  const handleClose = (_, isConfirm = false) => {
    setIsVisiblePop(false);

    setTimeout(() => {
      onClose();
      setIsVisibleModal(false);
    }, 300);
    if (isConfirm) {
      onConfirm(currentData);
    }
  };

  const handleSelect = (item: any) => {
    const newData = _deepClone(currentData).map((i: any) => {
      if (i.model_id === item.model_id) {
        i.isActive = !i.isActive;
      }
      return i;
    });
    setCurrentData(newData);
  };

  const handleConfirm = () => {
    handleClose(null, true);
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
            <View />
            <TYText style={styles.title}>{i18n.getLang('add_model_pop_title')}</TYText>
            <TouchableOpacity onPress={handleClose}>
              <Image source={Res.close} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.listView}
            contentContainerStyle={{ paddingLeft: cx(22), paddingBottom: cx(16) }}
          >
            <View style={styles.popupViewEffect}>
              {currentData.map((item, index) => {
                return (
                  <View key={item.model_id} style={styles.effectItem}>
                    <TouchableOpacity
                      style={[
                        styles.effectItemEffect,
                        { borderColor: item.isActive ? '#fff' : 'transparent' },
                      ]}
                      activeOpacity={0.65}
                      onPress={() => {
                        handleSelect(item);
                      }}
                    >
                      <Image source={item.icon} style={styles.effectImage} />
                    </TouchableOpacity>
                    <TYText align="center" style={styles.text1}>
                      {item.name}
                    </TYText>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.confirmView} onPress={handleConfirm}>
            <TYText align="center" style={styles.confirmText}>
              {i18n.getLang('confirm')}
            </TYText>
          </TouchableOpacity>
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
    fontSize: cx(14),
    color: '#C5C5C5',
    lineHeight: cx(24),
  },
  popupViewEffect: {
    width: cx(375),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  buttonImage: {
    width: cx(24),
    height: cx(24),
  },
  listView: {
    width: cx(372),
    marginBottom: cx(16),
    // height: cx(300),
  },
  effectItem: {
    width: cx(154),
    marginRight: cx(18),
    marginTop: cx(12),
  },
  effectItemEffect: {
    borderWidth: cx(3),
    borderColor: 'transparent',
    borderRadius: cx(4),
    marginBottom: cx(4),
    overflow: 'hidden',
  },
  effectImage: {
    width: cx(154),
    height: cx(78),
    resizeMode: 'contain',
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
