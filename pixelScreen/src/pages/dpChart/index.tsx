import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, Tab } from 'tuya-panel-kit';
import i18n from '@i18n';
import { cx, commonColor } from '@config/styles';
import styles from './styles';
import WorkRecord from './workRecord';

function DpChart() {
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const tabPaneArr = [i18n.getLang('temperature'), i18n.getLang('humidity')];
  const [tab, setTab] = useState(tabPaneArr[0]);

  const dpIds = ['106', '102'];

  const tabPanes = tabPaneArr.map((item, index) => (
    <Tab.TabPane key={item} tab={item}>
      <View>
        <WorkRecord dpId={dpIds[index]} />
      </View>
    </Tab.TabPane>
  ));

  const themeColor = {
    [tabPaneArr[0]]: '#6051FA',
    [tabPaneArr[1]]: '#F4B900',
  };

  return (
    <View style={styles.container}>
      <TopBar
        color={commonColor.mainText}
        title={i18n.getLang('chart')}
        titleStyle={{ color: commonColor.mainText }}
        background="transparent"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: cx(24) }}>
        <View style={styles.tabView}>
          <Tab
            activeKey={tab}
            animated={true}
            onChange={value => setTab(`${value}`)}
            tabBarBackgroundColor="transparent"
            tabBarStyle={{
              borderBottomColor: '#78787A',
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginLeft: cx(20),
              width: cx(335),
            }}
            tabTextStyle={{ fontSize: cx(16), color: '#2C2C2F' }}
            tabStyle={{
              height: cx(40),
            }}
            tabActiveTextStyle={{
              color: themeColor[tab],
            }}
            tabBarUnderlineStyle={{
              backgroundColor: themeColor[tab],
              height: cx(3),
              width: cx(24),
              marginLeft: cx(72),
              borderRadius: cx(1.5),
            }}
          >
            {tabPanes}
          </Tab>
        </View>
      </ScrollView>
    </View>
  );
}

export default DpChart;
