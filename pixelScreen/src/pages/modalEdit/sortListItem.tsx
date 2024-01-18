import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { TYText, Dialog } from 'tuya-panel-kit';
import Res from '@res';
import i18n from '@i18n';
import { cx } from '@config/styles';

function Row(props) {
  const { active, data, onDeleteItem } = props;

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

  const rowStyle = useMemo(
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
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    Dialog.confirm({
      title: i18n.getLang('make_sure_delete'),
      subTitle: '',
      cancelText: i18n.getLang('cancel'),
      confirmText: i18n.getLang('sure'),
      onConfirm: (_, { close }) => {
        setIsDeleteOpen(false);
        onDeleteItem(data);
        close();
      },
      onCancel: () => {
        setIsDeleteOpen(false);
        Dialog.close();
      },
    });
  };

  const onCancel = () => {
    setIsDeleteOpen(false);
  };

  return (
    <Animated.View style={[styles.rowView, style]}>
      <Animated.View style={[styles.itemView, rowStyle]}>
        <View style={styles.itemLeft}>
          <TouchableOpacity activeOpacity={0.85} onPress={onDelete}>
            <Image source={Res.delete_icon} style={styles.sortImage} />
          </TouchableOpacity>
          <Image source={data.icon} style={[styles.image]} />
        </View>

        <Image source={Res.sort} style={styles.sortImage} />
      </Animated.View>
      <View style={styles.operationView}>
        <TouchableOpacity activeOpacity={0.85} style={styles.deleteView} onPress={handleDelete}>
          <TYText style={styles.deleteText}>{i18n.getLang('delete')}</TYText>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.cancelView} onPress={onCancel}>
          <TYText style={styles.deleteText}>{i18n.getLang('cancel')}</TYText>
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
    backgroundColor: '#403D53',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: cx(14),
    color: '#fff',
  },
});

export default Row;
