import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SortableList from 'react-native-sortable-list';
import { StackNavigationProp } from '@react-navigation/stack';
import _deepClone from 'lodash/cloneDeep';
import { Notification, TYText, TYSdk, TopBar } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import { cx, commonColor, width } from '@config/styles';
import { modelConfig } from '@config/common';
import { dpCodes } from '@config';
import { playListString2Map, playListMap2String } from '@utils';
import SortListItem from './sortListItem';

interface ModelConfig {
  name?: string;
  icon?: any;
  modeId: number;
  dpValue: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

const { playListCode } = dpCodes;
function ModalEdit() {
  const { [playListCode]: playList } = useSelector(({ dpState }: any) => dpState);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [repeatTime, setRepeatTime] = useState(150);
  const [modeData, setModeData] = useState<ModelConfig[]>([]);
  const [orderList, setOrderList] = useState<string[]>([]);

  const textRef = useRef(null);

  useEffect(() => {
    const data: ModelConfig[] = playListString2Map(playList);
    const newData: ModelConfig[] = [];
    data.forEach(item => {
      const _item = modelConfig.find(i => i.modeId === item.modeId);
      if (_item) {
        newData.push(_item);
      }
    });
    const _orderList = newData.map((item, index) => `${index}`);
    setOrderList(_orderList);
    setModeData(newData);
  }, [playList]);

  const save = () => {
    const newList: ModelConfig[] = [];
    orderList.forEach((index: string) => {
      const _item = modeData[+index];
      newList.push(_item);
    });
    const validList = newList.filter(item => !item.isDeleted);
    const _data = playListMap2String(validList);

    TYSdk.device.putDeviceData({
      [playListCode]: _data,
    });
    navigation.goBack();
  };

  const onChangeOrder = (newOrderList: string[]) => {
    setOrderList(newOrderList);
  };

  const onDeleteItem = item => {
    const newData = modeData.map(i => {
      if (i.modeId === item.modeId) {
        return { ...i, isDeleted: true };
      }
      return i;
    });
    const _modeData: ModelConfig[] = [];
    orderList.forEach((index: string) => {
      const _item = newData[+index];
      _modeData.push(_item);
    });
    // 表单更新了，序号创新初始化
    const _newOrderList = _modeData.map((item, index) => `${index}`);
    setOrderList(_newOrderList);
    setModeData(_modeData);
  };

  const repeatTimeData = [30, 60, 120, 240, 300];

  const isCustomer = !repeatTimeData.includes(repeatTime) && repeatTime !== 0;

  const getDataObject = () => {
    const dataObject = {};
    // 遍历modeData，返回对象型数据
    const needRenderData = modeData.filter(item => !item.isDeleted);
    needRenderData.forEach((item, index) => {
      dataObject[index] = item;
    });
    return dataObject;
  };

  const renderRow = ({ data, active }) => {
    return <SortListItem data={data} active={active} onDeleteItem={onDeleteItem} />;
  };

  const onChangeText = text => {
    if (+text > 600) {
      Notification.show({
        message: i18n.getLang('screen_repeat_time_max_tip'),
        onClose: () => {
          Notification.hide();
        },
        theme: {
          warningIcon: 'black',
        },
      });
      setTimeout(() => {
        Notification.hide();
      }, 2000);
      return;
    }
    setRepeatTime(+text);
  };

  const onBlur = () => {
    if (repeatTime > 600) {
      setRepeatTime(600);
    }
  };

  const onSetRepeat = item => {
    textRef?.current?.blur();
    textRef?.current?.clear();
    setRepeatTime(item);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        <TYText size={cx(16)} color="rgba(255, 255, 255, 0.75)">
          {i18n.getLang('screen_repeat_time')}
        </TYText>
        <View style={styles.timeView}>
          {repeatTimeData.map((item, index) => {
            const isActive = item === repeatTime;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.85}
                style={[styles.timeItem, { borderColor: isActive ? '#fff' : '#21202C' }]}
                onPress={() => {
                  onSetRepeat(item);
                }}
              >
                <TYText size={cx(14)} color={isActive ? '#fff' : '#747476'}>
                  {item}
                </TYText>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.timeItem, { borderColor: isCustomer ? '#fff' : '#21202C' }]}
          >
            <TextInput
              value={isCustomer ? `${repeatTime}` : ''}
              keyboardType="numeric"
              placeholder={i18n.getLang('custom')}
              placeholderTextColor="#747476"
              onChangeText={onChangeText}
              onBlur={onBlur}
              style={styles.textInput}
              ref={textRef}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TYText size={cx(16)} color="rgba(255, 255, 255, 0.75)">
          {i18n.getLang('screen_sort')}
        </TYText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('setting')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        leftActions={[
          {
            children: (
              <TouchableOpacity style={styles.backView} onPress={navigation.goBack}>
                <Image source={Res.close_1} style={styles.backImage} />
              </TouchableOpacity>
            ),
          },
        ]}
        actions={[
          {
            children: (
              <TouchableOpacity style={styles.saveView} onPress={save}>
                <TYText style={styles.saveText}>{i18n.getLang('save')}</TYText>
              </TouchableOpacity>
            ),
          },
        ]}
      />
      <SortableList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={getDataObject()}
        renderRow={renderRow}
        onChangeOrder={onChangeOrder}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backView: {
    marginLeft: cx(24),
    width: cx(24),
    height: cx(24),
  },
  backImage: {
    width: cx(24),
    height: cx(24),
  },
  saveView: {
    width: cx(52),
    height: cx(26),
    backgroundColor: commonColor.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: cx(12),
    marginRight: cx(52),
  },
  saveText: {
    fontSize: cx(14),
    color: commonColor.mainText,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    width,
    paddingHorizontal: cx(20),
  },
  headerView: {
    marginTop: cx(20),
    marginBottom: cx(8),
  },
  footerView: {
    marginTop: cx(24),
  },
  timeView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: cx(16),
  },
  timeItem: {
    width: cx(101),
    height: cx(48),
    backgroundColor: '#21202C',
    borderRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: cx(16),
    borderWidth: cx(2),
    borderColor: '#21202C',
  },
  textInput: {
    fontSize: cx(14),
    color: '#fff',
  },
});

export default ModalEdit;
