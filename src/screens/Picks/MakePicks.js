import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  StatusBar,
  ListView,
  FlatList,
  View
} from 'react-native';
import firebase from 'react-native-firebase';
import styles from '../Chat/styles.js';
import NavStyles from '../../constants/AppStyles';
const findDates = require('../../utils/Dates');
import RowStyles from '../../utils/styles';
import { GameDate, TeamIcon } from '../../utils/index';
import { w, h, totalSize } from '../../components/Dimensions';


export default class MakePicks extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Make Picks',
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
    this.gamesRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}`)
    this.state = {
      loading: true,
      games: [],
      newRoom: '',
      is_live: true
    }
  }

  componentDidMount() {
    this.listenForGames(this.gamesRef);
  }

  organizeGamesByDate(a, b) {   
    return new Date(a.GameTimeUTC) - new Date(b.GameTimeUTC);
  }

  listenForGames(gamesRef) {
    gamesRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      var gamesFB = [];
      dataSnapshot.forEach((child) => {
        var live_check = child.val().Live;
        if (typeof live_check === 'undefined' ){
          const gameTime = child.val().Schedule.GameTime;
          var gameTime_local = findDates.convertDayOfWeek(gameTime);
          var gameDate_local = findDates.convertTime(gameTime);
          
          gamesFB.push({
            Active: false,
            AwayAlias: child.val().AwayTeam.Alias,
            HomeAlias: child.val().HomeTeam.Alias,
            GameDate: gameDate_local,
            GameTime: gameTime_local,
            key: child.key
          }); 
        }
        
      });
      gamesFB = gamesFB.sort(this.organizeGamesByDate);
      this.setState({ games: gamesFB, loading: false });
    });
    
 
  }

  

  makePicks(game) {
    var away = game.AwayAlias
    var vs = ' vs '
    var home = game.HomeAlias
    var name = home.concat(vs, away)
    this.props.navigation.navigate('MakePicksGame', 
    {
        roomKey: game.key, 
        roomName: name, 
        homeTeam: game.HomeAlias,
        awayTeam: game.AwayAlias,
    });
  }

  renderRow(game) {
    return (
      <TouchableHighlight 
        style={styles.roomLi}
        underlayColor='#fff'
        onPress={() => this.makePicks(game)}
      >
        <View style={RowStyles.teamRow}>
            <TeamIcon name={game.AwayAlias}/>
            <GameDate time={game.GameTime} date={game.GameDate}/>
            <TeamIcon name={game.HomeAlias} />
        </View>   
      </TouchableHighlight>
    ); 
  }

  render() {
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