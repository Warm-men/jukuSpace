import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, TYSdk, TYText, GlobalToast } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import _deepClone from 'lodash/cloneDeep';
import { commonStyles, cx, commonColor, height, width, isIphoneX } from '@config/styles';
import Res from '@res';
import i18n from '@i18n';
import { LetterElement, NumberElement, SymbolElement, PhraseElement } from '@config/elementSource';
import { dpCodes } from '@config';
import { sceneData2String, sceneString2Data } from '@utils';
import EditPopup from './editPopup';

const MAX_ELEMENT_NUM = 18;

const ElementType = [
  {
    name: i18n.getLang('element_type_1'),
  },
  {
    name: i18n.getLang('element_type_2'),
  },
  {
    name: i18n.getLang('element_type_3'),
  },
  {
    name: i18n.getLang('element_type_4'),
  },
];

const { powerCode, sceneDataCode } = dpCodes;
function Home() {
  const { [powerCode]: power, [sceneDataCode]: sceneData } = useSelector(
    ({ dpState }: any) => dpState
  );

  const [elementType, setElementType] = useState(0);
  const [selectedList, setSelectedList] = useState([]);
  const [selectedListCopy, setSelectedListCopy] = useState([]); // 用于编辑时的备份
  const currentSceneString = useRef(null);
  const scrollViewRef = useRef(null);

  const isVisiblePop = selectedListCopy.filter(i => !!i.onFocus).length > 0;

  useEffect(() => {
    // 如果用户编辑场景中，就不再使用该值更新场景列表
    if (isVisiblePop) return;
    const data = sceneString2Data(sceneData);
    setSelectedList(data);
    setSelectedListCopy(data);
    currentSceneString.current = sceneData;
  }, [sceneData]);

  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const ListData = [LetterElement, NumberElement, SymbolElement, PhraseElement];

  const handleOnClickElement = (item, index) => {
    const newList = _deepClone(selectedList);
    const newListCopy = _deepClone(selectedListCopy);
    const isOnFocus = newList[index].onFocus;
    if (isOnFocus) {
      newList[index] = { ...item, onFocus: false };
      newListCopy[index] = { ...item, onFocus: false };
    } else {
      newList[index] = { ...item, onFocus: true };
      newListCopy[index] = { ...item, onFocus: true };
    }
    setSelectedList(newList);
    setSelectedListCopy(newListCopy);
  };

  const handleDeleteElement = (item, index) => {
    const newList = _deepClone(selectedList);
    const newListCopy = _deepClone(selectedListCopy);
    newList[index].show = false;
    newListCopy[index].show = false;
    newList[index].onFocus = false;
    newListCopy[index].onFocus = false;
    // 判断list中是否所有item都show === false
    const isAllHide = newList.every(i => !i.onFocus);
    // 如果所有item都隐藏了，就把第一个item显示出来
    if (isAllHide) {
      newList[0].onFocus = true;
      newListCopy[0].onFocus = true;
    }
    setSelectedList(newList);
    setSelectedListCopy(newListCopy);
  };

  const putDpData = (data: any) => {
    const dpData = sceneData2String(data);
    TYSdk.device.putDeviceData({
      [sceneDataCode]: dpData,
    });
  };

  // 更新正在编辑的元素状态
  const onChangePop = data => {
    setSelectedListCopy(data);
    // 预览编辑效果
    putDpData(data);
  };

  const onClosePop = () => {
    const newList = _deepClone(selectedList);
    const newData = newList.map(item => {
      item.onFocus = false;
      item.show = true;
      return item;
    });
    setSelectedList(newData);
    setSelectedListCopy(newData);
    if (currentSceneString.current) {
      TYSdk.device.putDeviceData({
        [sceneDataCode]: currentSceneString.current,
      });
    }
  };

  // 将编辑后的数据同步到selectedList
  const onConfirmPop = () => {
    const newList = _deepClone(selectedListCopy);
    putDpData(newList);
    const newData = newList.map(item => {
      return { ...item, onFocus: false };
    });
    setSelectedList(newData);
    setSelectedListCopy(newData);
  };

  const handleAddElement = (item: any) => {
    const list = [...selectedList, { ...item, show: true }];
    setSelectedList(list);
    setSelectedListCopy(list);
    putDpData(list);
  };

  const onTapElementType = (index: number) => {
    setElementType(index);
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <View style={commonStyles.flexOne}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('setting_light')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => TYSdk.native.back()}
        actions={[
          {
            source: Res.power,
            contentStyle: {
              width: cx(24),
              height: cx(24),
              marginRight: cx(16),
              tintColor: power ? '#6B73E7' : commonColor.mainText,
            },
            color: commonColor.mainText,
            onPress: () => {
              TYSdk.device.putDeviceData({
                [powerCode]: !power,
              });
            },
          },
          {
            style: { marginRight: cx(24) },
            source: Res.setting,
            contentStyle: styles.contentStyle,
            color: commonColor.mainText,
            onPress: () => {
              navigation.navigate('setting');
            },
          },
        ]}
      />
      <ScrollView
        style={commonStyles.flexOne}
        contentContainerStyle={{ paddingBottom: isVisiblePop ? cx(300) : cx(100) }}
      >
        {selectedList.length === 0 ? (
          <View
            style={[
              commonStyles.flexOne,
              commonStyles.flexCenter,
              { height: height - cx(150), width },
            ]}
          >
            <TYText color={commonColor.subText} size={cx(14)}>
              {i18n.getLang('empty_light')}
            </TYText>
          </View>
        ) : null}
        {/* 选中待编辑的元素 */}
        {selectedList.length > 0 ? (
          <View style={styles.selectedListView}>
            {selectedList.map((item, index) => {
              if (!item.show) return null;
              const isPhrase = item.size === 2;
              const isActive = item.onFocus;
              let _item = item;
              if (item.onFocus !== undefined) {
                _item = selectedListCopy[index];
              }
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  key={index}
                  onPress={() => {
                    handleOnClickElement(item, index);
                  }}
                  style={[
                    styles.elementItem1,
                    {
                      width: isPhrase ? cx(160) : cx(76),
                      borderColor: isActive ? '#78787A' : '#2E2E30',
                    },
                  ]}
                >
                  <View>
                    <ImageBackground
                      source={Res[`effect_${_item.effect}`]}
                      style={[styles.elementItemBG1, { width: isPhrase ? cx(160) : cx(76) }]}
                    >
                      <Image
                        source={item.img}
                        style={[styles.elementItemBG1, { width: isPhrase ? cx(160) : cx(76) }]}
                      />
                    </ImageBackground>
                    {isActive && (
                      <TouchableOpacity
                        style={[styles.deleteView]}
                        activeOpacity={0.65}
                        onPress={() => {
                          handleDeleteElement(item, index);
                        }}
                      >
                        <Image source={Res.delete_element} style={styles.delete} />
                      </TouchableOpacity>
                    )}
                    {isActive && (
                      <View style={[styles.elementItem2, { width: isPhrase ? cx(160) : cx(76) }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.bottomView}>
        <View style={styles.elementTitle}>
          {/* 元素类型 */}
          {ElementType.map((item, index) => {
            const isActive = index === elementType;
            return (
              <TouchableOpacity
                onPress={() => onTapElementType(index)}
                key={item.name}
                style={styles.elementView}
                activeOpacity={0.85}
              >
                <TYText
                  size={cx(14)}
                  style={{
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#6B73E7' : commonColor.white,
                  }}
                >
                  {item.name}
                </TYText>
                {isActive && <View style={styles.onSelected} />}
              </TouchableOpacity>
            );
          })}
        </View>
        <View>
          {/* 元素列表 */}
          <ScrollView
            nestedScrollEnabled={false}
            horizontal={true}
            contentContainerStyle={{ paddingLeft: cx(16) }}
            style={styles.listView}
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {ListData[elementType].map((item, index) => {
              const isPhrase = item.size === 2;
              const _width = !isPhrase ? cx(58) : cx(58 * 2 + 8);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.elementItem, { width: _width }]}
                  onPress={() => {
                    if (selectedList.length >= MAX_ELEMENT_NUM) {
                      GlobalToast.show({
                        text: i18n.getLang('max_element_num'),
                        showIcon: false,
                        onFinish: () => {
                          GlobalToast.hide();
                        },
                      });
                      return;
                    }
                    handleAddElement(item);
                  }}
                >
                  <ImageBackground
                    source={Res.effect_4}
                    style={[styles.elementItemBG, { width: _width }]}
                  >
                    <Image source={item.img} style={[styles.elementItemImg, { width: _width }]} />
                  </ImageBackground>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
      {/* 元素编辑弹窗 */}
      <EditPopup
        isVisiblePop={isVisiblePop}
        data={selectedListCopy}
        onValueChange={onChangePop}
        onClose={onClosePop}
        onConfirm={onConfirmPop}
        extraKey={selectedListCopy.filter(i => !!i.onFocus).length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    borderTopRightRadius: cx(16),
    borderTopLeftRadius: cx(16),
    backgroundColor: '#000000',
    paddingBottom: isIphoneX ? cx(32) : cx(12),
  },
  elementTitle: {
    marginVertical: cx(16),
    flexDirection: 'row',
  },
  onSelected: {
    position: 'absolute',
    height: cx(4),
    width: cx(16),
    backgroundColor: '#6B73E7',
    borderRadius: cx(2),
    bottom: cx(0),
    left: cx(37.4),
  },
  elementView: {
    flex: 1,
    height: cx(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementItem2: {
    width: cx(76),
    height: cx(76),
    position: 'absolute',
    backgroundColor: 'rgba(120, 120, 122, 0.2)',
  },
  elementItem1: {
    width: cx(76),
    height: cx(76),
    borderRadius: cx(4),
    marginRight: cx(8),
    overflow: 'hidden',
    borderWidth: cx(2),
    borderColor: '#2E2E30',
    marginBottom: cx(8),
  },
  elementItem: {
    width: cx(58),
    height: cx(58),
    backgroundColor: '#17171A',
    borderRadius: cx(4),
    marginRight: cx(8),
    overflow: 'hidden',
  },
  listView: {
    marginBottom: cx(16),
  },
  elementItemBG: {
    width: cx(58),
    height: cx(58),
  },
  elementItemImg: {
    width: cx(58),
    height: cx(58),
  },
  elementItemBG1: {
    width: cx(76),
    height: cx(76),
  },
  selectedListView: {
    paddingTop: cx(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  deleteView: {
    position: 'absolute',
    right: cx(0),
    top: cx(-1),
    zIndex: 999,
  },
  delete: {
    width: cx(20),
    height: cx(20),
  },
  contentStyle: {
    width: cx(24),
    height: cx(24),
    // marginRight: cx(48),
  },
});

export default Home;
