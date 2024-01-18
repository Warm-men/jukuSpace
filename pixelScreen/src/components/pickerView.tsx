import React from 'react';
import { Picker } from 'tuya-panel-kit';
import { cx } from '@config/styles';

const PickerView = (props: any) => {
  const { value, onChange, data } = props;
  if (!data || data.length === 0) return null;
  const theme = {
    fontColor: '#FFFFFF',
    fontSize: cx(22),
    dividerColor: 'transparent',
  };
  return (
    <Picker
      style={{
        width: cx(50),
        height: cx(160),
        backgroundColor: 'transparent',
      }}
      theme={theme}
      selectedValue={value}
      onValueChange={onChange}
    >
      {data.map(item => (
        <Picker.Item key={item.value} value={item.value} label={item.label} />
      ))}
    </Picker>
  );
};

export default PickerView;
