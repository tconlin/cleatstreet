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
  View
} from 'react-native';
import firebase from 'react-native-firebase';
import styles from '../Chat/styles.js';
import NavStyles from '../../constants/AppStyles'
const findDates = require('../../utils/dates')
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';


export default class GameRooms extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Channels',
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
    this.roomsRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}`)
    this.state = {
      loading: true,
      rooms: [],
      newRoom: ''
    }
  }

  componentDidMount() {
    this.listenForRooms(this.roomsRef);
  }

  listenForRooms(roomsRef) {
    
    roomsRef.on('value', (dataSnapshot) => {
      this.setState({ loading: false });
      var roomsFB = [];
      dataSnapshot.forEach((child) => {
        console.log(child.key)
        firebase.database()
        .ref(`NFL/${this.year}/${this.type}/${this.week}/${child.key}/Live`).on("value", snapshot => {
          this.setState({ loading: false });
          if (snapshot.exists()){
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
            
            roomsFB.push({
              Active: true,
              PBP: child.val().PBP,
              AwayAlias: child.val().AwayTeam.Alias,
              AwayWins: child.val().AwayTeam.Wins,
              AwayLosses: child.val().AwayTeam.Losses,
              AwayTies: child.val().AwayTeam.Ties,
              HomeAlias: child.val().HomeTeam.Alias,
              HomeWins: child.val().HomeTeam.Wins,
              HomeLosses: child.val().HomeTeam.Losses,
              HomeTies: child.val().HomeTeam.Ties,
              Quarter1Home: child.val().Live.Quarter1.Home,
              Quarter2Home: child.val().Live.Quarter2.Home,
              Quarter3Home: child.val().Live.Quarter3.Home,
              Quarter4Home: child.val().Live.Quarter4.Home,
              HomeTotal: child.val().Live.Total.HomeTotal,
              Quarter1Away: child.val().Live.Quarter1.Away,
              Quarter2Away: child.val().Live.Quarter2.Away,
              Quarter3Away: child.val().Live.Quarter3.Away,
              Quarter4Away: child.val().Live.Quarter4.Away,
              AwayTotal: child.val().Live.Total.AwayTotal,
              Clock: child.val().Live.Clock,
              QuarterText: quarter_text,
              MoneyLineAway: child.val().Odds.MoneyLineAway,
              MoneyLineHome: child.val().Odds.MoneyLineHome,
              SpreadAway: child.val().Odds.SpreadAway,
              SpreadHome: child.val().Odds.SpreadHome,
              TotalHome: child.val().Odds.TotalHome,
              TotalAway: child.val().Odds.TotalAway,
              key: child.key
            });
          }
          else {
            const gameTime = child.val().Schedule.GameTime;
            var gameTime_local = findDates.convertDayOfWeek(gameTime);
            var gameDate_local = findDates.convertTime(gameTime);
            
            roomsFB.push({
              Active: false,
              AwayAlias: child.val().AwayTeam.Alias,
              AwayWins: child.val().AwayTeam.Wins,
              AwayLosses: child.val().AwayTeam.Losses,
              AwayTies: child.val().AwayTeam.Ties,
              HomeAlias: child.val().HomeTeam.Alias,
              HomeWins: child.val().HomeTeam.Wins,
              HomeLosses: child.val().HomeTeam.Losses,
              HomeTies: child.val().HomeTeam.Ties,
              GameDate: gameDate_local,
              GameTime: gameTime_local,
              MoneyLineAway: child.val().Odds.MoneyLineAway,
              MoneyLineHome: child.val().Odds.MoneyLineHome,
              SpreadAway: child.val().Odds.SpreadAway,
              SpreadHome: child.val().Odds.SpreadHome,
              TotalHome: child.val().Odds.TotalHome,
              TotalAway: child.val().Odds.TotalAway,
              key: child.key
            });
          }
          console.log(roomsFB)  
          this.setState({ rooms: roomsFB });
        });
        //console.log(roomsFB)  
        
    });
    
  });
  this.setState({loading: false})
  }


  openMessages(room) {
    console.log(room.Active)
    var away = room.AwayAlias
    var vs = ' vs '
    var home = room.HomeAlias
    var name = home.concat(vs, away)
    if (room.Active) {
      console.log(room.Clock)
      this.props.navigation.navigate('HomeNav', 
      {
        MoneyLineAway: room.MoneyLineAway,
        MoneyLineHome: room.MoneyLineHome,
        SpreadAway: room.SpreadAway,
        SpreadHome: room.SpreadHome,
        TotalHome: room.TotalHome,
        TotalAway: room.TotalAway,
        PBP: room.PBP,
        is_live: true,
        roomKey: room.key, 
        roomName: name, 
        homeTeam: room.HomeAlias,
        awayTeam: room.AwayAlias,
        Clock: room.Clock,
        QuarterText: room.QuarterText,
        AwayWins: room.AwayWins,
        AwayLosses: room.AwayLosses,
        AwayTies: room.AwayTies,
        HomeWins: room.HomeWins,
        HomeLosses: room.HomeLosses,
        HomeTies: room.HomeTies,
        Quarter1Home: room.Quarter1Home,
        Quarter2Home: room.Quarter2Home,
        Quarter3Home: room.Quarter3Home,
        Quarter4Home: room.Quarter4Home,
        HomeTotal: room.HomeTotal,
        Quarter1Away: room.Quarter1Away,
        Quarter2Away: room.Quarter2Away,
        Quarter3Away: room.Quarter3Away,
        Quarter4Away: room.Quarter4Away,
        AwayTotal: room.AwayTotal,
        
      });
    }
    else {
      this.props.navigation.navigate('HomeNav', 
      {
        is_live: false,
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
        MoneyLineAway: room.MoneyLineAway,
        MoneyLineHome: room.MoneyLineHome,
        SpreadAway: room.SpreadAway,
        SpreadHome: room.SpreadHome,
        TotalHome: room.TotalHome,
        TotalAway: room.TotalAway,

      });
    }
  }

  renderRow(item) {
    return (
      <TouchableHighlight 
        style={styles.roomLi}
        underlayColor="#fff"
        onPress={() => this.openMessages(item)}
      >
        {item.Active ? 
          <View style={RowStyles.chatTeamRow}>
            <TeamIcon name={item.AwayAlias}/>
            <Text>{item.AwayTotal}</Text>
            <GameDate time={item.Clock} date={item.QuarterText}/>
            <Text>{item.HomeTotal}</Text>
            <TeamIcon name={item.HomeAlias} />
          </View>
          :
          <View style={RowStyles.chatTeamRow}>
            <TeamIcon name={item.AwayAlias}/>
            <GameDate time={item.GameTime} date={item.GameDate}/>
            <TeamIcon name={item.HomeAlias} />
          </View>  
        }
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
              data={this.state.rooms}
              renderItem={({item}) => (this.renderRow(item))}
            />
          </View>
        </View>
      );
    }
  }
}

