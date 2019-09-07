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
import NavStyles from '../../constants/AppStyles'
const findDates = require('../../utils/dates')
import RowStyles from '../../utils/styles';
import { GameDate, TeamIcon } from '../../utils/index';
import styles from './styles.js';



export default class Rooms extends Component {
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

  organizeGamesByActivity(a, b) {
    const activityA = a.Active;
    const activityB = b.Active;

    let comparison = 0;
    if (activityA === true && activityB === false) {
      comparison = -1;
    } else if (activityA === false && activityB === true) {
      comparison = 1;
    }

    return comparison;
  }

  listenForRooms(roomsRef) {
    roomsRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      var roomsFB = [];
      dataSnapshot.forEach((child) => {
        var live_check = child.val().Live;
        if (typeof live_check !== 'undefined' ){
          const quarter = child.val().Live.Quarter

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
            AwayAlias: child.val().AwayTeam.Alias,
            HomeAlias: child.val().HomeTeam.Alias,
            QuarterText: quarter_text,
            HomeTotal: child.val().Live.Total.HomeTotal,
            AwayTotal: child.val().Live.Total.AwayTotal,
            Clock: child.val().Live.Clock,
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
            HomeAlias: child.val().HomeTeam.Alias,
            GameDate: gameDate_local,
            GameTime: gameTime_local,
            key: child.key
          }); 
        }
        
      });  
      roomsFB = roomsFB.sort(this.organizeGamesByActivity)
      this.setState({ rooms: roomsFB, loading: false })
    });
    
 
  }

  

  openMessages(room) {
    var away = room.AwayAlias
    var vs = ' vs '
    var home = room.HomeAlias
    var name = home.concat(vs, away)
    if (room.Active) {
      this.props.navigation.navigate('Chat', 
      {
        is_live: room.Active,
        roomKey: room.key, 
        roomName: name, 
        homeTeam: room.HomeAlias,
        awayTeam: room.AwayAlias,
        Clock: room.Clock,
        QuarterText: room.QuarterText,
        HomeTotal: room.HomeTotal,
        AwayTotal: room.AwayTotal,

      });
    }
    else {
      this.props.navigation.navigate('Chat', 
      {
        is_live: room.Active,
        roomKey: room.key, 
        roomName: name, 
        homeTeam: room.HomeAlias,
        awayTeam: room.AwayAlias,
        GameDate: room.GameDate,
        GameTime: room.GameTime

      });
    }
  }

  renderRow(item) {
    return (
      <TouchableHighlight 
        style={styles.roomLi}
        underlayColor='#fff'
        onPress={() => this.openMessages(item)}
      >
        {item.Active ? 
          <View style={RowStyles.teamRow}>
            <TeamIcon name={item.AwayAlias}/>
            <Text>{item.AwayTotal}</Text>
            <Text>VS</Text>
            <Text>{item.HomeTotal}</Text>
            <TeamIcon name={item.HomeAlias} />
          </View>
          :
          <View style={RowStyles.teamRow}>
            <TeamIcon name={item.AwayAlias}/>
            <Text>VS</Text>
            <TeamIcon name={item.HomeAlias} />
          </View>  
        }
      </TouchableHighlight>
    ); 
  }

  render() {
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

