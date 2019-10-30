import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  ListView,
  FlatList,
  View,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';
import styles from '../Chat/styles.js';
import NavStyles from '../../constants/AppStyles'
const findDates = require('../../utils/Dates')
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';
import navLogo from '../../images/icons/CS-logo-white.png';

export default class GameRooms extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
    headerTitle: (
      <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
          <Image
              source={navLogo}
              style={{width:110, height:30}}
          />
      </View>
  ),
});


  constructor(props) {
    super(props);
    var nfl_week = findDates.findNFLWeek_2019()
    this.type = nfl_week[0];
    this.week = nfl_week[1];
    this.year = nfl_week[2];
    this.gamesRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}`)
    this.state = {
      loading: true,
      games: [],
      newRoom: ''
    }
  }

  componentDidMount() {
    this.listenForGames(this.gamesRef);
  }


  organizeGamesByDate(a, b) {   
    return new Date(a.GameTimeUTC) - new Date(b.GameTimeUTC);
  }
  organizeGamesByActivity(a, b) {
    let comparison = 0;
    if (a.Active !== true && b.Active === true) {
      comparison = 1;
    } else if (a.Active === true && b.Active !== true) {
      comparison = -1;
    }
    console.log(comparison)
    return comparison;
  }

  listenForGames(gamesRef) {
    
    gamesRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      var gamesFB = [];
      dataSnapshot.forEach((child) => {
        var live_check = child.val().Live;
        var odds_check = child.val().Odds;
        if (typeof live_check !== 'undefined' ){
          const quarter = child.val().Live.Quarter;

          if (quarter == 1) {
            var quarter_text = '1st Quarter'
          }
          else if (quarter == 2) {
            var quarter_text = '2nd Quarter'
          }
          else if (quarter == 3) {
            var quarter_text = '3rd Quarter'
          }
          else if (quarter == 4) {
            var quarter_text = '4th Quarter'
          }
          var clock = child.val().Live.Clock;
          

          if (quarter_text === '4th Quarter' && clock === ':00') {
            gamesFB.push({
              Active: false,
              Final: true,
              AwayAlias: child.val().AwayTeam.Alias,
              HomeAlias: child.val().HomeTeam.Alias,
              
              key: child.key,
              GameTimeUTC: child.val().Schedule.GameTime,
              
              
              AwayWins: child.val().AwayTeam.Wins,
              AwayLosses: child.val().AwayTeam.Losses,
              AwayTies: child.val().AwayTeam.Ties,
              HomeWins: child.val().HomeTeam.Wins,
              HomeLosses: child.val().HomeTeam.Losses,
              HomeTies: child.val().HomeTeam.Ties,
              HomeTotal: child.val().Live.Total.HomeTotal,
              AwayTotal: child.val().Live.Total.AwayTotal,
              Clock: child.val().Live.Clock,
              QuarterText: quarter_text,
            });
          }
          else {
            gamesFB.push({
              Active: true,
              Final: false,
              AwayAlias: child.val().AwayTeam.Alias,
              HomeAlias: child.val().HomeTeam.Alias,
              
              key: child.key,
              GameTimeUTC: child.val().Schedule.GameTime,

              
              AwayWins: child.val().AwayTeam.Wins,
              AwayLosses: child.val().AwayTeam.Losses,
              AwayTies: child.val().AwayTeam.Ties,
              HomeWins: child.val().HomeTeam.Wins,
              HomeLosses: child.val().HomeTeam.Losses,
              HomeTies: child.val().HomeTeam.Ties,
              HomeTotal: child.val().Live.Total.HomeTotal,
              AwayTotal: child.val().Live.Total.AwayTotal,
              Clock: child.val().Live.Clock,
              QuarterText: quarter_text,
            });
          }
          
        }
        else if (typeof odds_check !== 'undefined' ) { 
          const gameTime = child.val().Schedule.GameTime;
          var gameTime_local = findDates.convertDayOfWeek(gameTime);
          var gameDate_local = findDates.convertTime(gameTime);
          
          gamesFB.push({
            Active: false,
            Final: false,
            AwayAlias: child.val().AwayTeam.Alias,
            HomeAlias: child.val().HomeTeam.Alias,
            AwayWins: child.val().AwayTeam.Wins,
            AwayLosses: child.val().AwayTeam.Losses,
            AwayTies: child.val().AwayTeam.Ties,
            HomeWins: child.val().HomeTeam.Wins,
            HomeLosses: child.val().HomeTeam.Losses,
            HomeTies: child.val().HomeTeam.Ties,
            GameTimeUTC: child.val().Schedule.GameTime,
            GameDate: gameDate_local,
            GameTime: gameTime_local,
            key: child.key,
          });
        }
        else {
          const gameTime = child.val().Schedule.GameTime;
          var gameTime_local = findDates.convertDayOfWeek(gameTime);
          var gameDate_local = findDates.convertTime(gameTime);
          
          gamesFB.push({
            Active: false,
            Final: false,
            AwayAlias: child.val().AwayTeam.Alias,
            HomeAlias: child.val().HomeTeam.Alias,
            AwayWins: child.val().AwayTeam.Wins,
            AwayLosses: child.val().AwayTeam.Losses,
            AwayTies: child.val().AwayTeam.Ties,
            HomeWins: child.val().HomeTeam.Wins,
            HomeLosses: child.val().HomeTeam.Losses,
            HomeTies: child.val().HomeTeam.Ties,

            GameDate: gameDate_local,
            GameTime: gameTime_local,
            GameTimeUTC: child.val().Schedule.GameTime,
            key: child.key,
            
          });
        } 
      });
      gamesFB = gamesFB.sort(this.organizeGamesByDate);
      gamesFB = gamesFB.sort(this.organizeGamesByActivity);
      this.setState({ games: gamesFB, loading: false });
    });
  
  }


  openMessages(room) {
    var away = room.AwayAlias
    var vs = ' vs '
    var home = room.HomeAlias
    var name = home.concat(vs, away)
    if (room.Active) {
      this.props.navigation.navigate('HomeNav', 
      {
        is_live: room.Active,
        is_final: room.Final,
        roomKey: room.key, 
        roomName: name, 
        homeTeam: room.HomeAlias,
        awayTeam: room.AwayAlias,
        AwayWins: room.AwayWins,
        AwayLosses: room.AwayLosses,
        AwayTies: room.AwayTies,
        HomeWins: room.HomeWins,
        HomeLosses: room.HomeLosses,
        HomeTies: room.HomeTies,
      });
    }
    else {
      this.props.navigation.navigate('HomeNav', 
      {
        is_live: room.Active,
        is_final: room.Final,
        roomKey: room.key, 
        roomName: name, 
        homeTeam: room.HomeAlias,
        awayTeam: room.AwayAlias,
        GameDate: room.GameDate,
        GameTime: room.GameTime,
        AwayWins: room.AwayWins,
        AwayLosses: room.AwayLosses,
        AwayTies: room.AwayTies,
        HomeWins: room.HomeWins,
        HomeLosses: room.HomeLosses,
        HomeTies: room.HomeTies,
      });
    }
  }

  renderRow(item) {

    if(item.Active === false && item.Final === true) {
      timer = <View style={RowStyles.chatTeamRow}>
      <TeamIcon name={item.AwayAlias}/>
      <Text>{item.AwayTotal}</Text>
      <Text style={{fontSize: 11, fontWeight: '800'}}>FINAL</Text>
      <Text>{item.HomeTotal}</Text>
      <TeamIcon name={item.HomeAlias} />
      </View>;
    }
    else if (item.Active === false && item.Final === false) {
      timer = <View style={RowStyles.chatTeamRow}>
      <TeamIcon name={item.AwayAlias}/>
      <GameDate time={item.GameTime} date={item.GameDate}/>
      <TeamIcon name={item.HomeAlias} />
      </View>;
    }
    else if (item.Active === true && item.Final === false) {
      timer = <View style={RowStyles.chatTeamRow}>
      <TeamIcon name={item.AwayAlias}/>
      <Text>{item.AwayTotal}</Text>
      <GameDate time={item.Clock} date={item.QuarterText}/>
      <Text>{item.HomeTotal}</Text>
      <TeamIcon name={item.HomeAlias} />
      </View>;
    }

    return (
      <TouchableHighlight 
        style={styles.roomLi}
        underlayColor="#fff"
        onPress={() => this.openMessages(item)}
      >
        {timer}
      </TouchableHighlight>
    ); 
  }
  


  render() {
    if(this.state.loading) {
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }
    
    else {
      return (
        <View style={styles.roomsContainer}>
          <View style={styles.roomsListContainer}>
            <FlatList
              data={this.state.games}
              renderItem={({item}) => (this.renderRow(item))}
            />
          </View>
        </View>
      );
    }
  }
}

