import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import _deepClone from 'lodash/cloneDeep';
import { Notification, TYText, TYSdk, TopBar } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import SliderHorizontal from '@components/sliderHorizontal';
import i18n from '@i18n';
import { cx, commonColor, width, commonStyles } from '@config/styles';
import { modelConfig, gradientColors1, gradientColors2 } from '@config/common';
import { dpCodes } from '@config';
import { playListString2Map, playListMap2String } from '@utils';

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
  const route = useRoute();

  const [repeatTime, setRepeatTime] = useState(150);
  const [modeData, setModeData] = useState<ModelConfig[]>([]);
  const [orderList, setOrderList] = useState<string[]>([]);
  const [timeColorType, setTimeColorType] = useState('0');
  const [gradientColorType, setGradientColorType] = useState(0);
  const [screenBrightness, setScreenBrightness] = useState(0);
  const [extra, setExtra] = useState<Extra>({}); // 保存额外数据
  const [showDelete, setShowDelete] = useState<boolean>(false); // 显示删除

  const brightnessRef = useRef(null);
  const textRef = useRef(null);

  // 从路由参数中获取模版数据
  const modalItem = route?.params?.item;
  console.log('🚀 ~ file: index.tsx:59 ~ ModalEdit ~ modalItem:', modalItem);

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
      const _timeColorType =
        _extra.textColor !== undefined ? (+_extra.textColor < 8 ? '1' : '2') : '0';
      const _gradientColorType = _extra.textColor ? _extra.textColor : 0;
      const _screenBrightness = _extra.brightness ? _extra.brightness : 0;
      const _repeatTime = _extra.stayTime ? _extra.stayTime : 150;

      setTimeColorType(_timeColorType);
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

  const repeatTimeData = [30, 60, 120];

  const isCustomer = !repeatTimeData.includes(repeatTime) && repeatTime !== 0;

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

  const colorOptions = [
    {
      value: '1',
      name: i18n.getLang('pure_color'),
      onClick: () => {
        setTimeColorType('1');
      },
      isActive: timeColorType === '1',
    },
    {
      value: '2',
      name: i18n.getLang('gradient_color'),
      onClick: () => {
        setTimeColorType('2');
      },
      isActive: timeColorType === '2',
    },
  ];

  const onDelete = () => {};

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        <View style={[styles.optionViewItem]}>
          <View style={[commonStyles.flexRowBetween, styles.optionViewWidth]}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('time_text_color')}
            </TYText>
            <View style={[commonStyles.flexRowBetween, { width: cx(120) }]}>
              {colorOptions.map(item => {
                return (
                  <TouchableOpacity key={item.value} activeOpacity={0.85} onPress={item.onClick}>
                    <View style={[commonStyles.flexRowCenter]}>
                      <Image
                        source={item.isActive ? Res.time_color_focus : Res.time_color_blur}
                        style={styles.selectColor}
                      />
                      <TYText size={cx(14)} color={item.isActive ? '#fff' : '#78787A'}>
                        {item.name}
                      </TYText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {timeColorType === '1' && (
            <View style={[commonStyles.flexRowBetween, styles.colorView]}>
              {gradientColors1.map(item => {
                const isActive = item.value === gradientColorType;
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    key={item.value}
                    onPress={() => {
                      setGradientColorType(item.value);
                    }}
                    style={[
                      styles.gradientView,
                      {
                        borderWidth: isActive ? cx(2) : 0,
                        borderColor: isActive ? '#fff' : '#21202C',
                      },
                    ]}
                  >
                    <View style={[{ backgroundColor: item.color }, styles.gradientImage]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {timeColorType === '2' && (
            <View style={[commonStyles.flexRowBetween, styles.optionViewWidth]}>
              {gradientColors2.map(item => {
                const isActive = item.value === gradientColorType;
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    key={item.value}
                    onPress={() => {
                      setGradientColorType(item.value);
                    }}
                    style={[
                      styles.gradientView,
                      {
                        borderWidth: isActive ? cx(2) : 0,
                        borderColor: isActive ? '#fff' : '#21202C',
                      },
                    ]}
                  >
                    <Image source={item.image} style={styles.gradientImage} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
        <View style={[styles.optionViewItem]}>
          <View style={[commonStyles.flexRowBetween, styles.optionViewWidth]}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('screen_brightness')}
            </TYText>
            <TYText size={cx(14)} color="#78787A" ref={brightnessRef}>
              {screenBrightness}
            </TYText>
          </View>
          <SliderHorizontal
            width={cx(295)}
            value={screenBrightness}
            onValueChange={(v: number) => {
              brightnessRef &&
                brightnessRef.current &&
                brightnessRef.current?.setText(Math.round(v));
            }}
            onSlidingComplete={setScreenBrightness}
          />
        </View>

        <View style={[styles.optionViewItem]}>
          <View style={[commonStyles.flexRowBetween, styles.optionViewWidth]}>
            <TYText size={cx(14)} color="#C5C5C5">
              {i18n.getLang('screen_repeat_time')}
            </TYText>
          </View>
          <View style={styles.timeView}>
            {repeatTimeData.map(item => {
              const isActive = item === repeatTime;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.85}
                  style={[styles.timeItem, { borderColor: isActive ? '#fff' : '#2E2C3D' }]}
                  onPress={() => {
                    onSetRepeat(item);
                  }}
                >
                  <TYText size={cx(14)} color={isActive ? '#fff' : '#6D6C78'}>
                    {item}
                  </TYText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={onDelete}>
          <View style={[styles.optionViewItem, { alignItems: 'center' }]}>
            <TYText size={cx(14)} color="#E64049">
              {i18n.getLang('delete')}
            </TYText>
          </View>
        </TouchableOpacity>

        {/* <View style={styles.repeatView}>
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
        </View> */}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <Image source={modalItem?.icon} style={styles.modeImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={modalItem?.name || i18n.getLang('setting')}
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
      <ScrollView style={styles.list} contentContainerStyle={styles.contentContainer}>
        {renderHeader()}
        {renderFooter()}
      </ScrollView>
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
    marginVertical: cx(24),
    alignItems: 'center',
  },
  footerView: {
    // marginTop: cx(24),
  },
  repeatView: {
    marginBottom: cx(24),
  },
  timeView: {
    flexDirection: 'row',
    width: cx(295),
    justifyContent: 'space-between',
    marginTop: cx(10),
  },
  timeItem: {
    width: cx(89),
    height: cx(48),
    backgroundColor: '#2E2C3D',
    borderRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: cx(2),
    borderColor: '#21202C',
  },
  textInput: {
    fontSize: cx(14),
    color: '#fff',
  },
  optionViewWidth: {
    width: cx(295),
    height: cx(42),
  },
  optionViewItem: {
    borderRadius: cx(16),
    backgroundColor: '#21202C',
    marginBottom: cx(16),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: cx(20),
  },
  selectColor: {
    width: cx(16),
    height: cx(16),
    marginRight: cx(2),
  },
  gradientView: {
    width: cx(70),
    height: cx(40),
    borderRadius: cx(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientImage: {
    width: cx(60),
    height: cx(30),
    borderRadius: cx(4),
  },
  colorView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeImage: {
    width: cx(152),
    height: cx(76),
  },
});

export default ModalEdit;
