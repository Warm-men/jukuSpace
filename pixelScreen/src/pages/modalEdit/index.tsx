import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SortableList from 'react-native-sortable-list';
import { StackNavigationProp } from '@react-navigation/stack';
import { Utils, TYText, TYSdk, TopBar } from 'tuya-panel-kit';
import { useSelector } from 'react-redux';
import Res from '@res';
import i18n from '@i18n';
import { cx, commonColor, width } from '@config/styles';
import modelConfig from 'config/common';
import { dpCodes } from '@config';
import SortListItem from './sortListItem';
// const { openPlanCode } = dpCodes;
function ModalEdit() {
  // const { [openPlanCode]: openPlan } = useSelector(({ dpState }: any) => dpState);

  // const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  const [repeatTime, setRepeatTime] = useState(0);

  const scrollRef = useRef(null);

  const getDataObject = () => {
    const dataObject = {};
    // 遍历modelConfig，返回对象型数据
    modelConfig.forEach((item, index) => {
      dataObject[index] = item;
    });
    return dataObject;
  };

  const renderRow = useCallback(({ data, active }) => {
    return <SortListItem data={data} active={active} />;
  }, []);

  const onChangeOrder = i => {
    console.log('onChangeOrder', i);
  };

  const onPressRow = () => {
    console.log('🚀 ~ onPressRow ~ scrollRef:', scrollRef);
  };

  const onReleaseRow = () => {
    console.log('🚀 ~ onReleaseRow ~ scrollRef:', scrollRef);
  };

  const repeatTimeData = [30, 60, 120, 240, 300, 600];

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
                  setRepeatTime(item);
                }}
              >
                <TYText size={cx(14)} color={isActive ? '#fff' : '#747476'}>
                  {item}
                </TYText>
              </TouchableOpacity>
            );
          })}
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
        onBack={() => navigation.goBack()}
        leftActions={[
          {
            children: (
              <TouchableOpacity style={styles.backView} onPress={() => {}}>
                <Image source={Res.close_1} style={styles.backImage} />
              </TouchableOpacity>
            ),
          },
        ]}
        actions={[
          {
            children: (
              <TouchableOpacity style={styles.saveView} onPress={() => {}}>
                <TYText style={styles.saveText}>保存</TYText>
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
        onPressRow={onPressRow}
        onReleaseRow={onReleaseRow}
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
    backgroundColor: '#6051FA',
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
});

export default ModalEdit;
