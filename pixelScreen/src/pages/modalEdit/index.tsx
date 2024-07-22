import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SortableList from 'react-native-sortable-list';
import { StackNavigationProp } from '@react-navigation/stack';
import { TYText, TYSdk, TopBar } from 'tuya-panel-kit';
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
  extra: Extra;
}

interface Extra {
  modeId?: number;
  background?: number;
  borderColor?: number;
  enterEffect?: number;
  stayEffect?: number;
  showEffect?: number;
  speed?: number;
  stayTime?: number;
  textColor?: number;
  brightness?: number;
}

const { playListCode } = dpCodes;
function ModalEdit() {
  const { [playListCode]: playList } = useSelector(({ dpState }: any) => dpState);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [repeatTime, setRepeatTime] = useState(150);
  const [modeData, setModeData] = useState<ModelConfig[]>([]);
  const [orderList, setOrderList] = useState<string[]>([]);
  const [gradientColorType, setGradientColorType] = useState(0);
  const [screenBrightness, setScreenBrightness] = useState(0);
  const [extra, setExtra] = useState<Extra>({}); // 保存额外数据
  const [showDelete, setShowDelete] = useState<boolean>(false); // 显示删除

  useEffect(() => {
    const data: ModelConfig[] = playListString2Map(playList);
    const newData: ModelConfig[] = [];
    data.forEach(item => {
      const _item = modelConfig.find(i => i.modeId === item.modeId);
      if (_item) {
        newData.push({ ...item, ..._item });
      }
    });
    const _orderList = newData.map((item, index) => `${index}`);
    setOrderList(_orderList);
    setModeData(newData);
    const _extra = newData.find(item => item.extra)?.extra; // 目前版本模版的参数是统一配置的，但是参数分配到每组dp片段中，所以只取第一个即可
    if (_extra) {
      setExtra(_extra);
      const _gradientColorType = _extra.textColor ? _extra.textColor : 0;
      const _screenBrightness = _extra.brightness ? _extra.brightness : 0;
      const _repeatTime = _extra.stayTime ? _extra.stayTime : 150;
      setGradientColorType(_gradientColorType);
      setScreenBrightness(_screenBrightness);
      setRepeatTime(_repeatTime);
    }
  }, [playList]);

  const save = () => {
    const newList: ModelConfig[] = [];
    orderList.forEach((index: string) => {
      const _item = modeData[+index];
      newList.push(_item);
    });
    const validList = newList.filter(item => !item.isDeleted);
    const _extra = {
      ...extra,
      stayTime: repeatTime,
      textColor: gradientColorType,
      brightness: screenBrightness,
    };
    const _modeData = validList.map(item => {
      return { ...item, extra: { ..._extra, modeId: item.modeId } };
    });
    const _data = playListMap2String(_modeData);
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

  const onClickItem = item => {
    navigation.push('modalDetail', { item });
  };

  const renderRow = ({ data, active }) => {
    return (
      <SortListItem
        data={data}
        active={active}
        onDeleteItem={onDeleteItem}
        onClickItem={onClickItem}
        showDelete={showDelete}
      />
    );
  };

  const add = () => {
    navigation.navigate('modalList');
  };

  const renderFooter = () => {
    return null;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TYText size={cx(16)} color="rgba(255, 255, 255, 0.75)">
          {i18n.getLang('screen_sort')}
        </TYText>
        <View style={styles.rowSp}>
          <TouchableOpacity onPress={add} activeOpacity={0.85} style={styles.addMode}>
            <TYText size={cx(16)} color="#797AFF">
              {i18n.getLang('add')}
            </TYText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDelete(!showDelete)} activeOpacity={0.85}>
            <TYText size={cx(16)} color="rgba(255, 255, 255, 0.75)">
              {showDelete ? i18n.getLang('choose') : i18n.getLang('delete')}
            </TYText>
          </TouchableOpacity>
        </View>
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
            style: {
              marginLeft: cx(24),
            },
          },
        ]}
        actions={[
          {
            children: (
              <TouchableOpacity style={styles.saveView} onPress={save}>
                <TYText style={styles.saveText}>{i18n.getLang('save')}</TYText>
              </TouchableOpacity>
            ),
            style: {
              marginRight: cx(24),
            },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addMode: {
    marginRight: cx(12),
  },
});

export default ModalEdit;
