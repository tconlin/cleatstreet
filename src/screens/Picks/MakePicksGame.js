import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';

const findDates = require('../../utils/dates')
import { w, h, totalSize } from '../../components/Dimensions';

import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';




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
    this.roomKey = this.props.navigation.state.params.roomKey;
    this.is_live = this.props.navigation.state.params.is_live;
    this.gameRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/`)
    this.state = {
      loading: true,
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
  }

  

  addMessage(messages = {}) {
    this.gameRef.push({
      text: messageObj.text,
      createdAt: Date.now(),
      user: {
        id: this.state.user,
        name: this.state.user.displayName,
        email: this.state.user.email
      }
    })
  }


  
  
  renderRow(item) {
    return (
        <View style={RowStyles.teamRow}>
          <TeamIcon name={navigation.state.params.awayTeam}/>
          <Text>VS</Text>
          <TeamIcon name={navigation.state.params.homeTeam} />
        </View>
    )
  }


  render() {
    if(this.is_live) {
      content = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <Text>{this.AwayTotal}</Text>
        <GameDate time={this.Clock} date={this.QuarterText}/>
        <Text>{this.HomeTotal}</Text>
        <TeamIcon name={this.HomeTeam} />
      </View>; 
    }
    else {
      content = 
      <View style={styles.makePicksContainer}>
        Game is live. Pick making disabled.
      </View>;
        
    }

    
    return (
      <View style={styles.headerContainer}>
          <Text></Text>
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
    }
});