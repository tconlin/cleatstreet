import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
import RowStyles from '../../utils/styles';
import { GameDate, TeamIcon } from '../../utils/index';
const TeamNames = require('../../utils/teamName');
const findDates = require('../../utils/dates');


export default class Betting extends Component {
  static navigationOptions = ({ navigation }) => ({
    //title: navigation.state.params.roomName,
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
    this.GameTime = this.props.navigation.state.params.GameTime;
    this.GameDate = this.props.navigation.state.params.GameDate;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    this.Clock = this.props.navigation.state.params.Clock;
    this.QuarterText = this.props.navigation.state.params.QuarterText;
    this.HomeTotal = this.props.navigation.state.params.HomeTotal;
    this.AwayTotal = this.props.navigation.state.params.AwayTotal;
    this.is_live = this.props.navigation.state.params.is_live;
    this.MoneyLineAway = this.props.navigation.state.params.MoneyLineAway;
    this.MoneyLineHome = this.props.navigation.state.params.MoneyLineHome;
    this.SpreadAway = this.props.navigation.state.params.SpreadAway;
    this.SpreadHome = this.props.navigation.state.params.SpreadHome;
    this.TotalAway = this.props.navigation.state.params.TotalAway;
    this.TotalHome = this.props.navigation.state.params.TotalHome;
    this.HomeName = TeamNames.convertAlias(this.HomeTeam);
    this.AwayName = TeamNames.convertAlias(this.AwayTeam);
    this.state = {
      loading: true,
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
    
  }

renderPicks(item) {
  return (
    <View style={styles.BettingContainer}>
      <View>
        <View style={styles.BettingTitle} >
          <Text style={styles.BettingHeader}></Text>
        </View>
      </View>
      <View>
        <View style={styles.BettingEntry} >
          <Text style={styles.BettingHeader}>Bet</Text>
        </View>
      </View>
      <View>
        <View style={styles.BettingEntry} >
          <Text style={styles.BettingHeader}>Allocation</Text>
        </View>
      </View>
    </View>
  );
}


  render() {
    if(this.is_live) {
      header = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <Text>{this.AwayTotal}</Text>
        <GameDate time={this.Clock} date={this.QuarterText}/>
        <Text>{this.HomeTotal}</Text>
        <TeamIcon name={this.HomeTeam} />
      </View>; 
    }
    else {
      header = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <GameDate time={this.GameTime} date={this.GameDate}/>
        <TeamIcon name={this.HomeTeam} />
      </View>;
        
    }
    return (
      <View style={styles.headerContainer}>
        <View style={styles.chatHeader}>
          {header}
        </View>
        <ScrollView>
        <View style={styles.container}>
        <View style={styles.Header}>
                <Text style={styles.HeaderText}>Odds</Text>
              </View>
            <View style={styles.BettingContainer}>
              
                <View>
                    <View style={styles.BettingTitle} >
                      <Text style={styles.BettingHeader}>Teams</Text>
                    </View>
                    <View style={styles.BettingTitle}>
                      <Text style={styles.BettingName}>{this.HomeName} </Text>
                    </View>
                    <View style={styles.BettingTitle}>
                      <Text style={styles.BettingName}>{this.AwayName} </Text>
                    </View>
                    
                </View>
                <View>
                  <View style={styles.BettingEntry} >
                    <Text style={styles.BettingHeader}>Spread</Text>
                  </View>
                  <View style={styles.BettingEntry}>
                    <Text style={styles.BettingNum}>{this.SpreadHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.SpreadAway}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.BettingEntry} >
                    <Text style={styles.BettingHeader}>Moneyline</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.MoneyLineHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.MoneyLineAway}</Text>
                  </View>
                
                </View>
                <View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingHeader}>O/U</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.TotalHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.TotalAway}</Text>
                  </View>
                    
                </View>
            </View>
        
          
          </View>
          <View style={styles.container2}>
          <View style={styles.Header}>
                <Text style={styles.HeaderText}>Our Picks</Text>
              </View>
            <View style={styles.BettingContainer}>
              
                <View>
                  <View style={styles.BettingTitle} >
                    <Text style={styles.BettingHeader}>Analyst</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.BettingTitle} >
                    <Text style={styles.BettingHeader}>Bet</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.BettingTitle} >
                    <Text style={styles.BettingHeader}>Allocation</Text>
                  </View>
                </View>
                </View>
               
            
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  PBPText1: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700',
    padding: 2.5,
    marginLeft: 5,
    marginRight: 5
  },
  PBPText2: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '600',
    padding: 10,
    marginLeft: 5,
    marginRight: 5
  },
  ContentContainer: {
    flex: 1,
    //justifyContent: 'space-between',
    //alignSelf: 'flex-end',
    //flexDirection: 'column',
    //flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 20,
    width: '100%'
  },
  Header: {
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 1.5,
    paddingLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 12.5,
  },
  HeaderText: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BettingTitle: {
    //width: 100,
    //height: 30,
    flexDirection: 'row', 
    //justifyContent: 'flex-end',
    textAlign: 'left',
    padding: 6
  },
  BettingEntry: {
    //width: 20,
    //height: 30
    padding: 6
  },
  BettingEntry2: {
    //width: 40,
    //height: 30
    padding: 6
  },
  BettingNum: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BettingName: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BettingRecord: {
    fontSize: 10,
    color: '#8a8a8a',
    fontWeight: '400'
  },
  BettingHeader: {
    fontSize: 10,
    color: '#8a8a8a',
    fontWeight: '400'
  },
  BettingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    //alignSelf: 'flex-end',
    flexDirection: 'row',
    //flexWrap: 'wrap',
    backgroundColor: '#fff',
    //position: 'absolute',
    //top: 90,
    //paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    //width: '100%'
  },
  
  chatHeader: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderBottomColor: '#b8b8b8',
    borderBottomWidth: 1,
    zIndex: 1,
    backgroundColor: '#ffffff'
  },
  headerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 90
  },
  container2: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 45
  }
});