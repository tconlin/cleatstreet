import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';
const TeamNames = require('../../utils/TeamName')
const findDates = require('../../utils/Dates')


export default class Boxscore extends Component {
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
    this.PBP = this.props.navigation.state.params.PBP;
    this.roomKey = this.props.navigation.state.params.roomKey;
    this.roomsRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}`)
    this.PBPRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP2`)
    this.GameTime = this.props.navigation.state.params.GameTime;
    this.GameDate = this.props.navigation.state.params.GameDate;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    
    //this.Clock = this.props.navigation.state.params.Clock;
    //this.QuarterText = this.props.navigation.state.params.QuarterText;
    
    this.is_live = this.props.navigation.state.params.is_live;
    this.is_final = this.props.navigation.state.params.is_final;
    this.AwayWins = this.props.navigation.state.params.AwayWins;
    this.AwayLosses = this.props.navigation.state.params.AwayLosses;
    this.AwayTies = this.props.navigation.state.params.AwayTies;
    this.HomeWins = this.props.navigation.state.params.HomeWins;
    this.HomeLosses = this.props.navigation.state.params.HomeLosses;
    this.HomeTies = this.props.navigation.state.params.HomeTies;
    
    /*this.Quarter1Home = this.props.navigation.state.params.Quarter1Home;
    this.Quarter2Home = this.props.navigation.state.params.Quarter2Home;
    this.Quarter3Home = this.props.navigation.state.params.Quarter3Home;
    this.Quarter4Home = this.props.navigation.state.params.Quarter4Home;
    this.HomeTotal = this.props.navigation.state.params.HomeTotal;
    this.Quarter1Away = this.props.navigation.state.params.Quarter1Away;
    this.Quarter2Away = this.props.navigation.state.params.Quarter2Away;
    this.Quarter3Away = this.props.navigation.state.params.Quarter3Away;
    this.Quarter4Away = this.props.navigation.state.params.Quarter4Away;
    this.AwayTotal = this.props.navigation.state.params.AwayTotal;*/
    
    this.HomeName = TeamNames.convertAlias(this.HomeTeam);
    this.AwayName = TeamNames.convertAlias(this.AwayTeam);
    this.state = {
      loading: true,
      user: '',
      pbp: [],
      Quarter1Home: '',
      Quarter2Home: '',
      Quarter3Home: '',
      Quarter4Home: '',
      Quarter1Away: '',
      Quarter2Away: '',
      Quarter3Away: '',
      Quarter4Away: '',
      AwayTotal: '',
      HomeTotal: '',
      GameQuarter: '',
      GameClock: ''
    }
  }


  componentDidMount() {
    this.parsePBP(this.PBP);
    this.getLiveData(this.roomsRef);
    this.getPBP(this.PBPRef);
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
            Quarter1Away: child.val().Quarter1.Away,
            Quarter2Away: child.val().Quarter2.Away,
            Quarter3Away: child.val().Quarter3.Away,
            Quarter4Away: child.val().Quarter4.Away,
            Quarter1Home: child.val().Quarter1.Home,
            Quarter2Home: child.val().Quarter2.Home,
            Quarter3Home: child.val().Quarter3.Home,
            Quarter4Home: child.val().Quarter4.Home,
            HomeTotal: child.val().Total.HomeTotal,
            AwayTotal: child.val().Total.AwayTotal,
            GameQuarter: quarter_text,
            GameClock: child.val().Clock,
          })
        }
      });
      this.setState({ loading: false }); 
    });
  }


  getPBP(PBPRef) {
    var pbp_arr = [];
    //this.setState({ loading: true });
    PBPRef.on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        var key = child.key;
        
        for (var obj in child.val()) {
          driveRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP2/${key}/${obj}`)
          driveRef.on('value', (dataSnapshot) => {
            dataSnapshot.forEach((child) => {  
              const summary = child.val().Summary
              const playType = child.val().PlayType;
              const yardLine = child.val().YardLine;
              const side = child.val().Side;
              const down = child.val().Down;
              const yfd = child.val().YFD;
              const time = child.val().Clock
              const driveStart = child.val().DriveStart
              const driveTeam = child.val().DriveTeam
              if (typeof driveStart !== 'undefined' &&
                  typeof driveTeam !== 'undefined' && 
                  typeof playType !== 'undefined' && 
                  typeof summary !== 'undefined' && 
                  typeof yardLine !== 'undefined' && 
                  typeof side !== 'undefined' &&
                  typeof down !== 'undefined' &&
                  typeof yfd !== 'undefined' &&
                  typeof time !== 'undefined'){
                    pbp_arr.push({
                      Quarter: key,
                      DriveStart: driveStart,
                      DriveTeam: driveTeam,
                      YFD: yfd,
                      Down: down,
                      side: side,
                      YardLine: yardLine,
                      PlayType: playType,
                      Summary: summary,
                      Team: driveTeam,
                      Start: driveStart,
                      Time: time,
                    })
              }
              else if(  typeof driveStart !== 'undefined' &&
                        typeof driveTeam !== 'undefined' && 
                        typeof summary !== 'undefined' && 
                        typeof time !== 'undefined' ) {
                          pbp_arr.push({
                            Quarter: obj,
                            DriveStart: driveStart,
                            DriveTeam: driveTeam,
                            Summary: summary,
                            Time: time,
                          })
              }
            });
          });

        }
        
      });
      
       
    
    });
    console.log(pbp_arr)
    this.setState({ pbp: pbp_arr });
  }



  parsePBP(PBP) {
    var pbp_arr = [];
    for (var key in PBP) {
      if (PBP.hasOwnProperty(key)) {
          for (var key2 in PBP[key]) {
            if (PBP[key].hasOwnProperty(key2)) {
              pbp_arr.push({
                Quarter: PBP[key][key2].Quarter,
                Team: PBP[key][key2].Team,
                Time: PBP[key][key2].Time,
                Summary: PBP[key][key2].Summary
              })
            }
          }
      }
    }
    this.setState({ pbp: pbp_arr });
  }

  renderPBP(item) {
    console.log(item)
    const quarter = item.Quarter;
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
    //{ backgroundColor: index % 2 === 0 ? '#e6e6e6' : '#fff'
    //<Text style={styles.PBPText1}>{item.Time} - {item.Team}</Text>
    return (
      <View style={{backgroundColor: '#fff', textAlign: "left" }}>
        
        <Text style={styles.PBPText2}>{item.Summary}</Text>
      </View>
    ); 
  }

  render() {
    if(this.is_live) {
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
      else {
        header = 
        <View style={RowStyles.chatTeamRow}>
          <TeamIcon name={this.AwayTeam}/>
          <Text>{this.state.AwayTotal}</Text>
          <GameDate time={this.state.GameClock} date={this.state.GameQuarter}/>
          <Text>{this.state.HomeTotal}</Text>
          <TeamIcon name={this.HomeTeam} />
        </View>;
      }
    }
    else {
      header = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <GameDate time={this.GameTime} date={this.GameDate}/>
        <TeamIcon name={this.HomeTeam} />
      </View>;
        
    }
    /*{this.is_live ?  : <Text style={styles.PBPText1}>Game not active.</Text>}*/
    console.log(this.state.pbp)
    return (
      <View style={styles.headerContainer}>
        <View style={styles.chatHeader}>
          {header}
        </View>
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.BoxScoreContainer}>
                <View>
                    <View style={styles.BoxScoreTitle} >
                      <Text style={styles.BoxScoreHeader}>Scoring</Text>
                    </View>
                    <View style={styles.BoxScoreTitle}>
                      <Text style={styles.BoxScoreName}>{this.HomeName} </Text>
                      <Text style={styles.BoxScoreRecord}>({this.HomeWins}-{this.HomeLosses}-{this.HomeTies})</Text>
                    </View>
                    <View style={styles.BoxScoreTitle}>
                      <Text style={styles.BoxScoreName}>{this.AwayName} </Text>
                      <Text style={styles.BoxScoreRecord}>({this.AwayWins}-{this.AwayLosses}-{this.AwayTies})</Text>
                    </View>
                    
                </View>
                <View>
                  <View style={styles.BoxScoreEntry} >
                    <Text style={styles.BoxScoreHeader}>1</Text>
                  </View>
                  <View style={styles.BoxScoreEntry}>
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter1Home}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter1Away}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                </View>
                <View>
                  <View style={styles.BoxScoreEntry} >
                    <Text style={styles.BoxScoreHeader}>2</Text>
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter2Home}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter2Away}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                
                </View>
                <View>
                  <View style={styles.BoxScoreEntry}  >
                    <Text style={styles.BoxScoreHeader}>3</Text>
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter3Home}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter3Away}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                    
                </View>
                <View>
                  <View style={styles.BoxScoreEntry}  >
                    <Text style={styles.BoxScoreHeader}>4</Text>
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter4Home}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                  <View style={styles.BoxScoreEntry}  >
                    {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.Quarter4Away}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                    
                </View>
                <View>
                  <View style={styles.BoxScoreEntry2}  >
                    <Text style={styles.BoxScoreHeader}>Final</Text>
                  </View>
                  <View style={styles.BoxScoreEntry2}  >
                  {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.HomeTotal}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                  <View style={styles.BoxScoreEntry2}  >
                  {this.is_live ? <Text style={styles.BoxScoreNum}>{this.state.AwayTotal}</Text> : <Text style={styles.BoxScoreNum}>0</Text>}
                  </View>
                    
                </View>
            </View>
        
          <View style={styles.PBPContainer}>
            <View style={styles.PBPHeader}>
              <Text style={styles.PBPHeaderText}>Play-by-Play</Text>
            </View>
            
            <FlatList
              data={this.state.pbp}
              renderItem={({item}) => (this.renderPBP(item))}
            />
            
            
            
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
  PBPContainer: {
    flex: 1,
    //justifyContent: 'space-between',
    //alignSelf: 'flex-end',
    //flexDirection: 'column',
    //flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginTop: 30,
    paddingBottom: 30
    //width: '100%'
  },
  PBPHeader: {
    borderBottomColor: '#dbdbdb',
    borderBottomWidth: 1.5,
    paddingLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 12.5,
    //marginTop: 30,
    //padding: 20,
    //flex: 1,
    //width: '100%'
  },
  PBPHeaderText: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BoxScoreTitle: {
    //width: 100,
    //height: 30,
    flexDirection: 'row', 
    //justifyContent: 'flex-end',
    textAlign: 'left',
    padding: 6
  },
  BoxScoreEntry: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BoxScoreEntry2: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BoxScoreNum: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BoxScoreName: {
    fontSize: 11,
    color: '#3b3b3b',
    fontWeight: '700'
  },
  BoxScoreRecord: {
    fontSize: 10,
    color: '#8a8a8a',
    fontWeight: '400'
  },
  BoxScoreHeader: {
    fontSize: 10,
    color: '#8a8a8a',
    fontWeight: '400'
  },
  BoxScoreContainer: {
    flex: 1,
    justifyContent: 'space-between',
    //alignSelf: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    //position: 'absolute',
    //top: 90,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
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
    
    marginTop: 90
  }
});