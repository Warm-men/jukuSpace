import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Utils, TabBar } from 'tuya-panel-kit';
import i18n from '@i18n';
import F2Chart from '@components/f2-chart';
import { getDayLog, getWeekLog, getMonthLog, getYearLog, renderChart } from './api';

const { convertX: cx } = Utils.RatioUtils;

interface MainProps {
  dpId: string;
}

const dpIds = ['111', '222'];

const themeColor = {
  [dpIds[0]]: '#6051FA',
  [dpIds[1]]: '#F4B900',
};

const WorkRecord: React.FC = (props: MainProps) => {
  const { dpId } = props;
  const [tabRadio, setTabRadio] = useState('0');

  const [chartList, setChartList] = useState([]);

  useEffect(() => {
    updateData();
  }, [tabRadio]);

  const TabsText = [
    i18n.getLang('day'),
    i18n.getLang('week'),
    i18n.getLang('month'),
    i18n.getLang('year'),
  ];

  const tabRadios = TabsText.map((v, index) => {
    return {
      key: `${index}`,
      title: TabsText[index],
      tabStyle: { alignItems: 'center', justifyContent: 'center' },
      textStyle: { fontSize: 16 },
    };
  });

  const updateData = async () => {
    const actions = [getDayLog, getWeekLog, getMonthLog, getYearLog];
    const res = await actions[Number(tabRadio)](dpId);
    if (!res || !res?.dps.length) return;
    const list = res.dps;
    setChartList(list);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabView}>
        <TabBar
          type="radio"
          tabs={tabRadios}
          activeKey={tabRadio}
          onChange={value => setTabRadio(value)}
          style={{
            height: cx(28),
            width: cx(275),
            backgroundColor: 'transparent',
          }}
          activeColor="transparent"
          tabActiveTextStyle={{
            color: themeColor[dpId],
            width: cx(60),
            height: cx(28),
            lineHeight: cx(28),
            borderRadius: cx(14),
            borderColor: themeColor[dpId],
            borderWidth: 1,
          }}
        />
      </View>

      <View style={styles.listView}>
        <F2Chart
          width={cx(335)}
          height={cx(263)}
          data={chartList}
          renderer={data => renderChart(data, themeColor[dpId])}
        />
      </View>
    </View>
  );
};

export default WorkRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    marginTop: cx(44),
    paddingHorizontal: cx(30),
  },
  listView: {
    marginTop: cx(50),
  },
});
