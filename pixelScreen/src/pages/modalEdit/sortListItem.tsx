import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SortableList from 'react-native-sortable-list';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, Swipeout } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import { cx, commonColor, width } from '@config/styles';
import modelConfig from 'config/common';
import { dpCodes } from '@config';
// const { openPlanCode } = dpCodes;
function Row(props) {
  const { active, data } = props;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const activeAnim = useRef(new Animated.Value(0));
  const activeAnimSlide = useRef(new Animated.Value(0));

  const style = useMemo(
    () => ({
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: activeAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
            // {
            //   translateX: activeAnimSlide.current.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: [0, -100],
            //   }),
            // },
          ],
          shadowRadius: activeAnim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [
            {
              scale: activeAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07],
              }),
            },
          ],
          elevation: activeAnim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    }),
    []
  );

  const style1 = useMemo(
    () => ({
      transform: [
        {
          translateX: activeAnimSlide.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -cx(120)],
          }),
        },
      ],
    }),
    []
  );
  useEffect(() => {
    Animated.timing(activeAnim.current, {
      duration: 300,
      easing: Easing.bounce,
      toValue: Number(active),
      useNativeDriver: true,
    }).start();
  }, [active]);

  useEffect(() => {
    Animated.timing(activeAnimSlide.current, {
      toValue: isDeleteOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDeleteOpen]);

  const onDelete = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  return (
    <Animated.View style={[styles.rowView, style]}>
      <Animated.View style={[styles.itemView, style1]}>
        <View style={styles.itemLeft}>
          <TouchableOpacity activeOpacity={0.85} onPress={onDelete}>
            <Image source={Res.delete_icon} style={styles.sortImage} />
          </TouchableOpacity>
          <Image source={data.icon} style={[styles.image]} />
        </View>

        <Image source={Res.sort} style={styles.sortImage} />
      </Animated.View>
      <View style={styles.operationView}>
        <TouchableOpacity activeOpacity={0.85} style={styles.deleteView} onPress={onDelete}>
          <TYText style={styles.deleteText}>删除</TYText>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.cancelView} onPress={onDelete}>
          <TYText style={styles.deleteText}>取消</TYText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: cx(100),
    flex: 1,
    width: cx(335),
    marginTop: cx(8),
    marginBottom: cx(12),
    borderRadius: cx(12),
    overflow: 'hidden',
  },
  itemView: {
    backgroundColor: '#21202C',
    height: cx(100),
    width: cx(335),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: cx(138),
    height: cx(69),
    marginRight: cx(12),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: cx(12),
  },
  sortImage: {
    width: cx(24),
    height: cx(24),
    marginRight: cx(12),
  },
  operationView: {
    position: 'absolute',
    right: 0,
    top: 1,
    height: cx(100),
    width: cx(120),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    borderTopRightRadius: cx(12),
    borderBottomRightRadius: cx(12),
  },
  deleteView: {
    height: cx(100),
    width: cx(60),
    backgroundColor: '#E64049',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelView: {
    height: cx(100),
    width: cx(60),
    backgroundColor: '#6051FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: cx(14),
    color: '#fff',
  },
});

export default Row;
