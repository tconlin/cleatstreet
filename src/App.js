import React from 'react'
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Require cycle']);


export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
  }
  
  render() {
    return (
      <AppNavigator />
    )
  }
}