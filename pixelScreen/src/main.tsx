import React from 'react';
import { createNavigator, GlobalTheme, NavigationRoute, TransitionPresets } from 'tuya-panel-kit';
import { StatusBar } from 'react-native';
import composeLayout from './composeLayout';
import { store } from './models';
import Home from './pages/home';
import HomeEditModal from './pages/home/editModal';
import Setting from './pages/setting';
import Clock from './pages/clock';
import Scene from './pages/scene';
import DpChart from './pages/dpChart';
import ModalEdit from './pages/modalEdit';
import ModalDetail from './pages/modalDetail';

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
    component: Home,
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
  },
  {
    name: 'scene',
    component: Scene,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'dpChart',
    component: DpChart,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'homeEditModal',
    component: HomeEditModal,
    options: {
      ...commonStyles,
    },
  },
  {
    name: 'modalDetail',
    component: ModalDetail,
    options: {
      ...commonStyles,
    },
  },
];

interface Props {
  theme: GlobalTheme;
}

const Navigator = createNavigator<Props>({
  router,
  screenOptions: {},
});

export default composeLayout(store, Navigator);
