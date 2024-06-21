import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TopBar, Tabs } from 'tuya-panel-kit';
import i18n from '@i18n';
import { cx, commonColor } from '@config/styles';
import styles from './styles';
import WorkRecord from './workRecord';

function DpChart() {
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const tabPaneArr = [
    { value: 'temperature', label: i18n.getLang('temperature') },
    { value: 'humidity', label: i18n.getLang('humidity') },
  ];
  const [tab, setTab] = useState('temperature');

  const dpIds = ['106', '102'];

  const themeColor = {
    temperature: '#6051FA',
    humidity: '#F4B900',
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: cx(24), paddingHorizontal: cx(8) }}
      >
        <Tabs
          activeKey={tab}
          dataSource={tabPaneArr}
          swipeable={true}
          onChange={tab => setTab(tab.value)}
          style={styles.tabsStyle}
          maxItem={2}
          background="#0D0C10"
          activeColor={themeColor[tab]}
        >
          <Tabs.TabPanel>
            <WorkRecord dpId={dpIds[0]} tab={tab} />
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <WorkRecord dpId={dpIds[1]} tab={tab} />
          </Tabs.TabPanel>
        </Tabs>
      </ScrollView>
    </View>
  );
}

export default DpChart;
