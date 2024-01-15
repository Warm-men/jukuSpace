import React from 'react';
import { createNavigator, GlobalTheme, NavigationRoute, TransitionPresets } from 'tuya-panel-kit';
import { StatusBar } from 'react-native';
import composeLayout from './composeLayout';
import { store } from './models';
import Home from './pages/home';
import Setting from './pages/setting';
import Clock from './pages/clock';
import ModalEdit from './pages/modalEdit';

console.disableYellowBox = true;

const commonStyles = {
  renderStatusBar: () => <StatusBar barStyle="default" />,
  background: {
    '0%': '#0D0C10',
    '100%': '#0D0C10',
  },
  gestureEnabled: true,
  hideTopbar: true,
};

const router: NavigationRoute[] = [
  {
    name: 'main',
    component: ModalEdit,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'setting',
    component: Setting,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'clock',
    component: Clock,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'modalEdit',
    component: ModalEdit,
    options: {
      ...commonStyles,
    },
  }
];

interface Props {
  theme: GlobalTheme;
}

const Navigator = createNavigator<Props>({
  router,
  screenOptions: {},
});

export default composeLayout(store, Navigator);
