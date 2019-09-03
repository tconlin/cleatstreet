import React from 'react';
import { 
  createAppContainer, 
  createSwitchNavigator, 
  reateStackNavigator
} from 'react-navigation';

import LoadingScreen from '../FirebaseLogin/screens/Loading/index';
import FirebaseLoginScreen from '../FirebaseLogin/flogin';
import MainTabNavigator from './MainTabNavigator';


const App = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    FirebaseLogin: FirebaseLoginScreen,
    Main: MainTabNavigator
  },
  {
    initialRouteName: 'Loading'
  }
)

const AppContainer = createAppContainer(App)

export default AppContainer