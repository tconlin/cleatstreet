import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  Keyboard,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Picker,
  Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
const findDates = require('../../utils/Dates');
import { w, h, totalSize } from '../../components/Dimensions';
import Save from './Save';



export default class MakePicksGame extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.roomName,
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
    this.gameKey = this.props.navigation.state.params.roomKey;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    this.analyst = firebase.auth().currentUser.uid;
    this.pickRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.gameKey}/Picks/${this.analyst}`)
    this.oddsRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.gameKey}/Odds`)
    this.state = {
      isMakingPick: false,
      loading: true,
      user: '',
      messages: [],
      HomeMoneyLine: '',
      AwayMoneyLine: '',
      HomeSpread: '',
      AwaySpread: '',
      HomeTotal: '',
      AwayTotal: '',
      Bet: '',
      Allocation: '',
    }
  }

  componentDidMount() {
    this.setState({user: firebase.auth().currentUser})
    this.getBets(this.oddsRef);
  }

  getBets(oddsRef) {
    oddsRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      if(dataSnapshot.exists()) {
        this.setState({
          HomeMoneyLine: this.HomeTeam + '  ' + dataSnapshot.val().MoneyLineHome,
          AwayMoneyLine: this.AwayTeam + '  ' + dataSnapshot.val().MoneyLineAway,
          HomeSpread: this.HomeTeam + '  ' + dataSnapshot.val().SpreadHome,
          AwaySpread: this.AwayTeam + '  ' + dataSnapshot.val().SpreadAway,
          HomeTotal: 'O ' + dataSnapshot.val().TotalHome,
          AwayTotal: 'U ' + dataSnapshot.val().TotalAway,
        })
        
        this.setState({ loading: false });
      }
      else {
        this.setState({ loading: false });
        Alert.alert('Odds not out yet.');
        this.props.navigation.goBack();
      }
    });
  }

  addPick = () => {
    Keyboard.dismiss();
    const bet = this.state.Bet;
    const allocation = this.state.Allocation;
    this.setState({ isMakingPick: true });
    if (bet === null || bet === '' || allocation === null || bet === '') {
      this.setState({ isMakingPick: false });
      Alert.alert('Pick info must not be empty');
    }
    else {
      this.pickRef.set({
        Bet: bet,
        Allocation: allocation,
        CreatedAt: Date.now(),
        Analyst: {
          Id: this.state.user.uid,
          Name: this.state.user.displayName,
          Avatar: this.state.user.photoURL
        }
      })
      this.setState({ isMakingPick: false });
      this.setState({
        HomeMoneyLine: '',
        AwayMoneyLine: '',
        HomeSpread: '',
        AwaySpread: '',
        HomeTotal: '',
        AwayTotal: ''
      })
      Alert.alert('Pick was successfully made.');
      this.props.navigation.goBack();
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
    return (
      <View style={styles.container}>
        <ScrollView>
            <View style={styles.Header}>
              <Text style={styles.HeaderText}>Bet</Text>
            </View>
            <Picker
            selectedValue={this.state.Bet}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({Bet: itemValue})
            }>
              <Picker.Item label={this.state.HomeMoneyLine} value={this.state.HomeMoneyLine} />
              <Picker.Item label={this.state.AwayMoneyLine} value={this.state.AwayMoneyLine} />
              <Picker.Item label={this.state.HomeSpread} value={this.state.HomeSpread} />
              <Picker.Item label={this.state.AwaySpread} value={this.state.AwaySpread} />
              <Picker.Item label={this.state.HomeTotal} value= {this.state.HomeTotal} />
              <Picker.Item label={this.state.AwayTotal} value={this.state.AwayTotal} />
            </Picker> 
            <View style={styles.Header}>
              <Text style={styles.HeaderText}>Allocation</Text>
            </View>
            <Picker
            selectedValue={this.state.Allocation}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({Allocation: itemValue})
            }>
              <Picker.Item label="0.0%" value="0.0" />
              <Picker.Item label="0.1%" value="0.1" />
              <Picker.Item label="0.2%" value="0.2" />
              <Picker.Item label="0.3%" value="0.3" />
              <Picker.Item label="0.4%" value="0.4" />
              <Picker.Item label="0.5%" value="0.5" />
              <Picker.Item label="0.6%" value="0.6" />
              <Picker.Item label="0.7%" value="0.7" />
              <Picker.Item label="0.8%" value="0.8" />
              <Picker.Item label="0.9%" value="0.9" />
              <Picker.Item label="1.0%" value="1.0" />
              <Picker.Item label="1.1%" value="1.1" />
              <Picker.Item label="1.2%" value="1.2" />
              <Picker.Item label="1.3%" value="1.3" />
              <Picker.Item label="1.4%" value="1.4" />
              <Picker.Item label="1.5%" value="1.5" />
              <Picker.Item label="1.6%" value="1.6" />
              <Picker.Item label="1.7%" value="1.7" />
              <Picker.Item label="1.8%" value="1.8" />
              <Picker.Item label="1.9%" value="1.9" />
              <Picker.Item label="2.0%" value="2.0" />
              <Picker.Item label="2.1%" value="2.1" />
              <Picker.Item label="2.2%" value="2.2" />
              <Picker.Item label="2.3%" value="2.3" />
              <Picker.Item label="2.4%" value="2.4" />
              <Picker.Item label="2.5%" value="2.5" />
              <Picker.Item label="2.6%" value="2.6" />
              <Picker.Item label="2.7%" value="2.7" />
              <Picker.Item label="2.8%" value="2.8" />
              <Picker.Item label="2.9%" value="2.9" />
              <Picker.Item label="3.0%" value="3.0" />
              <Picker.Item label="3.1%" value="3.1" />
              <Picker.Item label="3.2%" value="3.2" />
              <Picker.Item label="3.3%" value="3.3" />
              <Picker.Item label="3.4%" value="3.4" />
              <Picker.Item label="3.5%" value="3.5" />
              <Picker.Item label="3.6%" value="3.6" />
              <Picker.Item label="3.7%" value="3.7" />
              <Picker.Item label="3.8%" value="3.8" />
              <Picker.Item label="3.9%" value="3.9" />
              <Picker.Item label="4.0%" value="4.0" />
              <Picker.Item label="4.1%" value="4.1" />
              <Picker.Item label="4.2%" value="4.2" />
              <Picker.Item label="4.3%" value="4.3" />
              <Picker.Item label="4.4%" value="4.4" />
              <Picker.Item label="4.5%" value="4.5" />
              <Picker.Item label="4.6%" value="4.6" />
              <Picker.Item label="4.7%" value="4.7" />
              <Picker.Item label="4.8%" value="4.8" />
              <Picker.Item label="4.9%" value="4.9" />
              <Picker.Item label="5.0%" value="5.0" />
          </Picker>
        <Save isCreating={this.state.isMakingPick} click={this.addPick}/>
      </ScrollView>
    </View>

    );
  }
  }
}


const styles = StyleSheet.create({
  Header: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  HeaderText: {
    fontSize: 14,
    fontWeight: '800'
  },
  makePicksContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
      
  },
  inputContainer: {
    minHeight: 44,
  },
  inputPrimary: {
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  itemContainer: {
    paddingVertical: w(5),
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  input: {
    fontSize: 16,
    fontWeight: '300'
  },
});