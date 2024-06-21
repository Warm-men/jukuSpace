import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Utils, TabBar } from 'tuya-panel-kit';
import i18n from '@i18n';
import F2Chart from '@components/f2-chart';
import { getDayLog, getWeekLog, getMonthLog, getYearLog, renderChart, renderChart2 } from './api';

const { convertX: cx } = Utils.RatioUtils;

interface MainProps {
  dpId: string;
  tab: string | number;
}

const dpIds = ['106', '102'];

const themeColor = {
  [dpIds[0]]: '#6051FA',
  [dpIds[1]]: '#F4B900',
};

const WorkRecord: React.FC<MainProps> = (props: MainProps) => {
  const { dpId, tab } = props;
  const [tabRadio, setTabRadio] = useState('0');

  const [chartDayList, setChartDayList] = useState<any[]>([]);
  const [chartWeekList, setChartWeekList] = useState<any[]>([]);
  const [chartMonthList, setChartMonthList] = useState<any[]>([]);
  const [chartYearList, setChartYearList] = useState<any[]>([]);

  useEffect(() => {
    updateData();
  }, [tabRadio, tab]);

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
    try {
      const actions = [getDayLog, getWeekLog, getMonthLog, getYearLog];
      const res = (await actions[Number(tabRadio)](dpId)) as any[];
      if (!res || !res.length) return;
      const setAction = [setChartDayList, setChartWeekList, setChartMonthList, setChartYearList];
      setAction[tabRadio](res);
    } catch (error) {}
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
        {tabRadio === '0' && (
          <F2Chart
            width={cx(360)}
            height={cx(359)}
            data={chartDayList}
            renderer={dpId === dpIds[0] ? renderChart : renderChart2}
          />
        )}
        {tabRadio === '1' && (
          <F2Chart
            width={cx(360)}
            height={cx(359)}
            data={chartWeekList}
            renderer={dpId === dpIds[0] ? renderChart : renderChart2}
          />
        )}
        {tabRadio === '2' && (
          <F2Chart
            width={cx(360)}
            height={cx(359)}
            data={chartMonthList}
            renderer={dpId === dpIds[0] ? renderChart : renderChart2}
          />
        )}
        {tabRadio === '3' && (
          <F2Chart
            width={cx(360)}
            height={cx(330)}
            data={chartYearList}
            renderer={dpId === dpIds[0] ? renderChart : renderChart2}
          />
        )}
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
