import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Image
} from 'react-native';
import { w, h, totalSize } from '../../components/Dimensions';

import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
const findDates = require('../../utils/dates')
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';



export default class Picks extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Picks',
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
      currentUserAnalyst: false,
      picks: []
    }
  }
  
  
  componentDidMount() {

    var currentUserPhoto = firebase.auth().currentUser.photoURL;
    console.log(currentUserPhoto);


    var currentUserEmail = firebase.auth().currentUser.email
    var domain = currentUserEmail.replace(/.*@/, "");
  
    if (domain === 'cleat-street.com') {
      this.setState({ currentUserAnalyst: true });
    }
    this.getPicks(this.roomsRef);
  }


  getPicks(roomsRef) {
    roomsRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      var picksFB = [];
      dataSnapshot.forEach((child) => {
        var exist_check = child.val().Picks;
        var homeTeam = child.val().HomeTeam.Alias;
        var awayTeam = child.val().AwayTeam.Alias;
        if (typeof exist_check !== 'undefined' ){
          var picks = child.val().Picks;
          for (var indx_pk in picks) {
            if (picks.hasOwnProperty(indx_pk)) {
              picksFB.push({
                HomeTeam: homeTeam,
                AwayTeam: awayTeam,
                Bet: picks[indx_pk].Bet,
                Allocation: picks[indx_pk].Allocation,
                Analyst: {
                  Id: picks[indx_pk].Analyst.Id,
                  Name: picks[indx_pk].Analyst.Name,
                  Avatar: picks[indx_pk].Analyst.Avatar
                }
              })
            }
          }
        }
      });
      this.setState({ picks: picksFB, loading: false }); 
    });
  }

  openAnalystBio(Analyst) {
    this.props.navigation.navigate('AnalystBio', 
    {
      AnalystId: Analyst.Id,
      AnalystName: Analyst.Name,
      Avatar: Analyst.avatar
    });
  }



  renderAnalyst(item, index) {
    return ( 
      <View style={[{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff' }, styles.rowContainer2]}>
        <Image style={styles.avatarImage} source={item.Analyst.Avatar} />
        <TouchableHighlight
          
          underlayColor="#fff"
          onPress={() => this.openAnalystBio(item.Analyst)}
        >
          
          <Text style={styles.BettingEntry}>{item.Analyst.Name}</Text>
        </TouchableHighlight>
        </View>
    );
  }

  renderGame(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingEntry}>{item.AwayTeam} vs {item.HomeTeam}</Text>
      </View>
    ); 
  }


  renderBet(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingEntry}>{item.Bet}</Text>
      </View>
    ); 
  }
  renderAllocation(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingEntry}>{item.Allocation}</Text>
      </View>
    ); 
  }

  render() {
    if(this.state.currentUserAnalyst) {
      AnalystButton = 
      <TouchableOpacity 
        style={styles.button}
        onPress={() => this.props.navigation.navigate('MakePicks')}
      >
        <Text style={styles.buttonText}>Make Your Picks</Text>
      </TouchableOpacity>; 
    }
    else {
      AnalystButton = <View></View>;
    }

    if(this.state.loading) {
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <View style={styles.RowStyle}>
            <View style={styles.ColumnItem1}>
              <View style={styles.rowContainer}>
                <Text style={styles.BettingHeader}>Analyst</Text>
              </View>
              
              <FlatList
                data={this.state.picks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (this.renderAnalyst(item, index))}
              />
            </View>
            <View style={styles.ColumnItem2}>
              <View style={styles.rowContainer}>
                <Text style={styles.BettingHeader}>Game</Text>
              </View>
              <FlatList
                data={this.state.picks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (this.renderGame(item, index))}
              />
            </View>
              <View style={styles.ColumnItem3}>
                <View style={styles.rowContainer}>
                  <Text style={styles.BettingHeader}>Bet</Text>
                </View>
                <FlatList
                  data={this.state.picks}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (this.renderBet(item, index))}
                />
              </View>
              <View style={styles.ColumnItem3}>
                <View style={styles.rowContainer}>
                  <Text style={styles.BettingHeader}>Allocation</Text>
                </View>
                <FlatList
                  data={this.state.picks}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (this.renderAllocation(item, index))}
                />
              </View>
            </View>
          <View style={styles.buttonContainer}>
            {AnalystButton}
          </View>
        </View>
    
      );
  
    }
  }
}


const styles = StyleSheet.create({
  RowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
        
  },
  ColumnItem1: {
    width: '35%',
  },
  ColumnItem2: {
    width: '25%',
  },
  ColumnItem3: {
    width: '20%',
  },
  rowContainer2: {
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 1.5,
    flex: 1,
    flexDirection: 'row'
  },
  rowContainer: {
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 1.5,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    height: 50
  },
  button: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#377855',
    borderRadius: w(1),
    marginTop: h(8),
    borderColor: '#377855',
    borderWidth: 1
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    paddingVertical: h(1),
    fontSize: totalSize(2.1),
  },
  
  container: {
    flex: 1,
  },
  BettingEntry: {
    fontSize: 11,
    color: '#000',
    fontWeight: '500',
    paddingBottom: 12,
    paddingTop: 12,
    textAlign: 'center'
  },
  BettingHeader: {
    fontSize: 11,
    color: '#8a8a8a',
    fontWeight: '400',
    padding: 8,
    textAlign: 'center'
  },
  BettingContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    flexWrap:'wrap',
    
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#adadad',
    margin: 10,
    resizeMode: 'contain'
  },
})