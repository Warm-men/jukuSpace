import React from 'react';
import { SwitchButton } from 'tuya-panel-kit';
import { cx, commonColor } from '@config/styles';

const SwitchView = (props: any) => {
  const { onValueChange, value } = props;
  return (
    <SwitchButton
      onTintColor={commonColor.mainColor}
      tintColor="#2E2C3D"
      thumbTintColor="#5A5774"
      onThumbTintColor="#fff"
      size={{ width: cx(42), height: cx(28) }}
      thumbStyle={{ width: cx(18), height: cx(18), borderRadius: cx(9) }}
      value={value}
      onValueChange={onValueChange}
    />
  );
};

export default SwitchView;
