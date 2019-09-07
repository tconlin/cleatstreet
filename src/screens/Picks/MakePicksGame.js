import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';

const findDates = require('../../utils/dates')
import { w, h, totalSize } from '../../components/Dimensions';

import SettingsInputField from '../../components/SettingsInputField';
import Save from '../Settings/Save';
import { Avatar } from 'react-native-gifted-chat';


export default class MakePicksGame extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.roomName,
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });

  constructor(props) {
    super(props);
    var nfl_week = findDates.findNFLWeek_2019()
    this.type = nfl_week[0];
    this.week = nfl_week[1];
    this.year = nfl_week[2];
    this.gameKey = this.props.navigation.state.params.roomKey;
    this.analyst = firebase.auth().currentUser.uid;
    this.pickRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.gameKey}/Picks/${this.analyst}`)
    this.state = {
      isMakingPick: false,
      loading: true,
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
  }

  addPick = () => {
    Keyboard.dismiss();
    const bet = this.bet.getInputValue();
    const allocation = this.allocation.getInputValue();
    this.setState({ isCreatingAccount: true });
    if (bet === null || bet === '' || allocation === null || bet === '') {
      this.setState({ isMakingPick: false });
      Alert.alert('Pick info must not be empty');
    }
    else {
      this.pickRef.set({
        Bet: bet,
        Allocation: allocation,
        CreatedAt: Date.now(),
        Analyst: {
          Id: this.state.user.uid,
          Name: this.state.user.displayName,
          Avatar: this.state.user.photoURL
        }
      })
      this.setState({ isMakingPick: false });
      this.bet.input.clear();
      this.allocation.input.clear();
      Alert.alert('Pick was successfully made.');
      this.props.navigation.goBack();
    }
  }


  render() {    
    return (
      <View style={styles.headerContainer}>
          <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="Bet"
                style={styles.input}
                ref={ref => this.bet = ref}
              />
              
            </View>
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="Allocation"
                style={styles.input}
                ref={ref => this.allocation = ref}
              />
              <Save isCreating={this.state.isMakingPick} click={this.addPick}/>
            </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
    makePicksContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    inputContainer: {
        minHeight: 44,
    },
    inputPrimary: {
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: 24,
        alignItems: 'center',
    },
    itemContainer: {
      paddingVertical: w(5),
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#ccc',
      width: '100%',
    },
    input: {
      fontSize: 16,
      fontWeight: '300'
    },
});