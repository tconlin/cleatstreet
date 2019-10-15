import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
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
    //this.driveQuarterRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP/currentQuarter`);
    //this.driveRefTest = firebase.database().ref(`/NFL/${this.year}/${this.type}/5/36f8ff56-8f54-4026-b4bd-a58ce4c23f08/PBP2/CurrentDrive`);
    this.driveRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP/CurrentDrive`);
    this.roomsRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}`);
    this.PBPRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP`);
    this.GameTime = this.props.navigation.state.params.GameTime;
    this.GameDate = this.props.navigation.state.params.GameDate;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    
    this.is_live = this.props.navigation.state.params.is_live;
    this.is_final = this.props.navigation.state.params.is_final;
    this.AwayWins = this.props.navigation.state.params.AwayWins;
    this.AwayLosses = this.props.navigation.state.params.AwayLosses;
    this.AwayTies = this.props.navigation.state.params.AwayTies;
    this.HomeWins = this.props.navigation.state.params.HomeWins;
    this.HomeLosses = this.props.navigation.state.params.HomeLosses;
    this.HomeTies = this.props.navigation.state.params.HomeTies;
    
    this.HomeName = TeamNames.convertAlias(this.HomeTeam);
    this.AwayName = TeamNames.convertAlias(this.AwayTeam);
    this.state = {
      loading: true,
      user: '',
      pbp: [],
      current_pbp: [],
      non_current_pbp: [],
      organized_non_current_pbp: {},
      DriveTeam: '',
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
      GameClock: '',
      CurrentDriveTeam: '',
      CurrentQuarter: '',
      CurrentDriveId: '',
      activeSections: [],
      collapsed: true,
      multipleSelect: false,
    }
  }
  
  componentDidMount() {
    if(this.is_live) {
      this.getLiveData(this.roomsRef);
      this.getPBP(this.driveRef);
      
    }
    else {
      this.setState({ loading: false })
    }
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


  getPBP(driveRefTest) {
    this.setState({ loading: true });
    driveRefTest.once('value', (dataSnapshot) => {
      let currentDriveTeam = '';
      let currentQuarter = '';
      let currentDriveId = '';

      dataSnapshot.forEach((child) => {
          if (child.key === 'currentDriveId') {
            currentDriveId = child.val();
          }
          else if (child.key === 'currentQuarter') {
            currentQuarter = child.val();
          }
          else if (child.key === 'currentTeam') {
            currentDriveTeam = child.val();
          }
      });
      //this.setState({CurrentDriveId: currentDriveId, CurrentQuater: currentQuarter, CurrentDriveTeam: currentDriveTeam})
      this.doPBP(currentDriveId, currentQuarter, currentDriveTeam)
    });
    
  }

  doPBP(id, quarter, curr_team) {  
    if(typeof id !== 'undefined' && typeof quarter !== 'undefined' && id !== '' && quarter !== '') {
      firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/PBP/${quarter}/${id}`).orderByChild('Sequence')
      .on('value', (dataSnapshot) => {
        var pbp_arr = [];
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
          const driveId = child.val().DriveId
          const id = child.val().Key
          const quarter = child.val().Quarter

          if (typeof driveStart !== 'undefined' &&
              typeof driveTeam !== 'undefined' && 
              typeof driveId !== 'undefined' && 
              typeof playType !== 'undefined' && 
              typeof summary !== 'undefined' && 
              typeof yardLine !== 'undefined' && 
              typeof side !== 'undefined' &&
              typeof down !== 'undefined' &&
              typeof yfd !== 'undefined' &&
              typeof time !== 'undefined' &&
              typeof id !== 'undefined') {
                pbp_arr.push({
                  Key: id,
                  Quarter: quarter,
                  DriveStart: driveStart,
                  DriveTeam: driveTeam,
                  DriveId: driveId,
                  YFD: yfd,
                  Down: down,
                  Side: side,
                  YardLine: yardLine,
                  PlayType: playType,
                  Summary: summary,
                  Team: driveTeam,
                  Start: driveStart,
                  Time: time,
                })
          }
          else if ( typeof driveStart !== 'undefined' &&
                    typeof driveTeam !== 'undefined' &&
                    typeof driveId !== 'undefined' && 
                    typeof summary !== 'undefined' && 
                    typeof time !== 'undefined' &&
                    typeof id !== 'undefined' ) {
                      pbp_arr.push({
                        Key: id,
                        Quarter: quarter,
                        DriveStart: driveStart,
                        DriveId: driveId,
                        DriveTeam: driveTeam,
                        Summary: summary,
                        Time: time,
                      })
                  }
        });
        this.setState({ pbp: pbp_arr.reverse(), loading: false, CurrentDriveTeam: curr_team});
      });
    }
  }
  

  renderCurrPBP(item) {
    const down = item.Down
    if(typeof down !== 'undefined' ) {
      return (        
        <View style={{ backgroundColor: '#fff', textAlign: "left" }}>
          <Text style={styles.PBPText1}>{item.Down} &amp; {item.YFD} at the {item.Side} {item.YardLine} yard line</Text>
          <Text style={styles.PBPText2}>{item.Summary}</Text>
        </View>
      );
    }
    else {
      return (        
        <View style={{ backgroundColor: '#fff', textAlign: "left" }}>
          <Text style={styles.PBPText2}>{item.Summary}</Text>
        </View>
      );
    }

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
              {this.is_live ?
              <View style={styles.PBPContainer}>
              <View style={styles.PBPHeader}>
                <Text style={styles.PBPHeaderText}>{TeamNames.convertAlias(this.state.CurrentDriveTeam)} Driving...</Text>
              </View>
                <FlatList
                data={this.state.pbp}
                keyExtractor={item => item.Key}
                renderItem={({item}) => (this.renderCurrPBP(item))}
                />
            </View>
              : <View></View> }
            
            </View>
          </ScrollView>
        </View>
      );
    }
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
    //flex: 1,
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
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});