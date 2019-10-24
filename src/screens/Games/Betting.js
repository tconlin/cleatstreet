import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
import RowStyles from '../../utils/styles';
import { GameDate, TeamIcon } from '../../utils/index';
const TeamNames = require('../../utils/TeamName');
const findDates = require('../../utils/Dates');


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
    this.picksRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/Picks`);
    this.roomsRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}`);
    this.is_live = this.props.navigation.state.params.is_live;
    this.is_final = this.props.navigation.state.params.is_final;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    this.HomeName = TeamNames.convertAlias(this.HomeTeam);
    this.AwayName = TeamNames.convertAlias(this.AwayTeam);
    this.GameTime = this.props.navigation.state.params.GameTime;
    this.GameDate = this.props.navigation.state.params.GameDate;
    
    
    /*this.Clock = this.props.navigation.state.params.Clock;
    this.QuarterText = this.props.navigation.state.params.QuarterText;
    this.HomeTotal = this.props.navigation.state.params.HomeTotal;
    this.AwayTotal = this.props.navigation.state.params.AwayTotal;
    
    this.MoneyLineAway = this.props.navigation.state.params.MoneyLineAway;
    this.MoneyLineHome = this.props.navigation.state.params.MoneyLineHome;
    this.SpreadAway = this.props.navigation.state.params.SpreadAway;
    this.SpreadHome = this.props.navigation.state.params.SpreadHome;
    this.TotalAway = this.props.navigation.state.params.TotalAway;
    this.TotalHome = this.props.navigation.state.params.TotalHome;*/
    
    
    
    
    this.state = {
      loading: true,
      user: '',
      picks: [],
      MoneyLineAway: '',
      MoneyLineHome: '',
      SpreadAway: '',
      SpreadHome: '',
      TotalAway: '',
      TotalHome: '',
      Clock: '',
      Quarter: '',
      HomeTotal: '',
      AwayTotal: '',

    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
    this.getPicks(this.picksRef);
    this.getLiveData(this.roomsRef);
  }

  getPicks(picksRef) {
    this.setState({ loading: true });
    picksRef.on('value', (dataSnapshot) => {
      var picksFB = [];
      dataSnapshot.forEach((child) => {
        picksFB.push({
          Bet: child.val().Bet,
          Allocation: child.val().Allocation,
          Analyst: {
            Id: child.val().Analyst.Id,
            Name: child.val().Analyst.Name,
            Avatar: child.val().Analyst.Avatar
          }
        })
      });
      this.setState({ picks: picksFB, loading: false }); 
    });
  }



  getLiveData(roomsRef) {
    this.setState({ loading: true });
    roomsRef.on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        var key = child.key;
        if (key === 'Live' ){
          const quarter = child.val().Quarter
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
          this.setState({ 
            HomeTotal: child.val().Total.HomeTotal,
            AwayTotal: child.val().Total.AwayTotal,
            GameQuarter: quarter_text,
            GameClock: child.val().Clock,
          })
        }
        else if (key == 'Odds') {
          this.setState({ 
            MoneyLineAway: child.val().MoneyLineAway,
            MoneyLineHome: child.val().MoneyLineHome,
            SpreadAway: child.val().SpreadAway,
            SpreadHome: child.val().SpreadHome,
            TotalAway: child.val().TotalAway,
            TotalHome: child.val().TotalHome,
          })
        }
        
      });
      this.setState({ loading: false }); 
    
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
    if(item.Analyst.Avatar === null || item.Analyst.Avatar === '') {
      var avatar_null = true;
    }
    else {
      var avatar_null = false;
    }
    return ( 
      <View style={[{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }, styles.rowContainer]}>
        <TouchableHighlight
          underlayColor="#fff"
          onPress={() => this.openAnalystBio(item.Analyst)}
        >
          {avatar_null ? <Image style={styles.avatarNullImage} /> : <Image style={styles.avatarImage} source={{uri: item.Analyst.Avatar}} />}
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="#fff"
          onPress={() => this.openAnalystBio(item.Analyst)}
        >
          <Text style={styles.BettingName}>{item.Analyst.Name}</Text>
        </TouchableHighlight>
        </View>
    );
  }

  renderBet(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingNum}>{item.Bet}</Text>
      </View>
    ); 
  }
  renderSpread(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingNum}>{item.Allocation}</Text>
      </View>
    ); 
  }
  renderAllocation(item, index) {
    return (
      <View style={[{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }, styles.rowContainer]}>
          <Text style={styles.BettingNum}>{item.Allocation}</Text>
      </View>
    ); 
  }


  render() {
    if(this.is_final) {
      header = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <Text>{this.state.AwayTotal}</Text>
        <Text style={{fontSize: 11, fontWeight: '800'}}>FINAL</Text>
        <Text>{this.state.HomeTotal}</Text>
        <TeamIcon name={this.HomeTeam} />
      </View>;
    }
    else if(this.is_live) {
        header = 
        <View style={RowStyles.chatTeamRow}>
          <TeamIcon name={this.AwayTeam}/>
          <Text>{this.state.AwayTotal}</Text>
          <GameDate time={this.state.GameClock} date={this.state.GameQuarter}/>
          <Text>{this.state.HomeTotal}</Text>
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
    if (this.state.picks.length > 0) {
      picks = 
      <View style={styles.container2}>
        <View style={styles.Header}>
            <Text style={styles.HeaderText}>Our Picks</Text>
        </View>
        <View style={styles.RowStyle}>
          <View style={styles.ColumnItem1}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>Analyst</Text>
            </View>
            <FlatList
              data={this.state.picks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (this.renderAnalyst(item, index))}
            />
          </View>
          <View style={styles.ColumnItem3}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>Bet</Text>
            </View>
            <FlatList
              data={this.state.picks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (this.renderBet(item, index))}
            />
          </View>
          <View style={styles.ColumnItem3}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>%</Text>
            </View>
            <FlatList
              data={this.state.picks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (this.renderAllocation(item, index))}
            />
          </View>
        </View>
      </View>;
    }
    else {
      picks =
      <View style={styles.container2}>
        <View style={styles.Header}>
            <Text style={styles.HeaderText}>Our Picks</Text>
        </View>
        <View style={styles.RowStyle}>
          <View style={styles.ColumnItem1}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>Analyst</Text>
            </View>
          </View>
          <View style={styles.ColumnItem3}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>Bet</Text>
            </View>
          </View>
          <View style={styles.ColumnItem3}>
            <View style={styles.rowContainer2}>
              <Text style={styles.BettingHeader}>%</Text>
            </View>
          </View>
        </View>
        <View style={styles.EmptyTextBox}>
          <Text style={styles.EmptyTextStyle}>No Picks Yet</Text>
        </View>
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
                    <Text style={styles.BettingNum}>{this.state.SpreadHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.state.SpreadAway}</Text>
                  </View>
                </View>
                <View>
                  <View style={styles.BettingEntry} >
                    <Text style={styles.BettingHeader}>Moneyline</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.state.MoneyLineHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.state.MoneyLineAway}</Text>
                  </View>
                
                </View>
                <View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingHeader}>O/U</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.state.TotalHome}</Text>
                  </View>
                  <View style={styles.BettingEntry}  >
                    <Text style={styles.BettingNum}>{this.state.TotalAway}</Text>
                  </View>
                    
                </View>
            </View>
        
          
          </View>
          
            {picks}
          
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  EmptyTextBox: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  EmptyTextStyle: {
    fontWeight: '800',
    fontSize: 13,
    color: 'darkgrey'
  },
  RowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',   
  },
  ColumnItem1: {
    width: '40%',
  },
  ColumnItem3: {
    width: '30%',
  },
  rowContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
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
    padding: 6,
  
  },
  BettingEntry: {
    //width: 20,
    //height: 30
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BettingEntry2: {
    //width: 40,
    //height: 30
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 45,
    paddingBottom: 45
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#adadad',
    margin: 10,
    //resizeMode: 'contain'
  },
  avatarNullImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#adadad',
    backgroundColor: 'lightgrey',
    margin: 10,
    resizeMode: 'contain'
  },
  
});