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
              console.log(picks[indx_pk].Bet)
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
      Analyst: Analyst,
      Avatar: Analyst.avatar
    });
  }

  renderPicks(item) {
    return (
      <View style={styles.roomLi}>
        <TouchableHighlight 
          underlayColor="#fff"
          onPress={() => this.openAnalystBio(item.Analyst)}
        >
          <Image source={item.Analyst.Avatar} />
        </TouchableHighlight>
        <View style={RowStyles.chatTeamRow}>
          <Text> {item.Analyst.Name}</Text>
          <Text> {item.AwayTeam} vs {item.HomeTeam}</Text>
          <Text> {item.Bet}</Text>
          <Text> {item.Allocation}</Text>
        </View>
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
            
              <View style={styles.roomsContainer}>
                <View style={styles.roomsListContainer}>
                  <FlatList
                    data={this.state.picks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (this.renderPicks(item))}
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
  roomLi: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  picksEntry: {
    width: 100,
    height: 20
  },
  picksHeader: {

  },
  picksList: {

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
  Score: {
      width: 25,
      height: 25
  },
  BettingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 100,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    width: '100%'
    
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
    flex: 1
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    //backgroundColor: 'rgba(0, 0, 0, 0.9)',
    minHeight: 44,
  },
  inputPrimary: {
    //backgroundColor: '#f9f9f9',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
},
  sendContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    //backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  send: {
    width: 20,
    height: 20,
  },
  roomsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  roomsHeader: {
    color: '#fff',
    fontSize: 28,
    top: 20
  },
  roomsInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 2,
  },
  roomsInput: {
    flex: 1,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#1E90FF',
    borderColor: '#f9f9f9',
    borderWidth: 2,
    borderRadius: 4,
    margin: 10
  },
  roomsNewButton: {
    alignItems: 'center',
    marginRight: 20
  },
  roomsNewButtonText: {
    color: '#1E90FF',
    fontSize: 18
  },
  roomsListContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  roomLi: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  roomLiText: {
    color: '#1E90FF',
    fontSize: 22,
  },
})