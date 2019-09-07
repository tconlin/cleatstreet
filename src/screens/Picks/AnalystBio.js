import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
const findDates = require('../../utils/dates')
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';


export default class Boxscore extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });

  constructor(props) {
    super(props);
    this.Analyst = this.props.navigation.state.params.Analyst;
    this.AnalystName = this.props.navigation.state.params.AnalystName;
    this.AnalystAvatar = this.props.navigation.state.params.AnalystAvatar;
    this.AnalystId = this.props.navigation.state.params.AnalystId;
    this.state = {
      loading: true,
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
    
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.pageContainer}>
          <View style={styles.heroContainer}>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{this.AnalystName}</Text>
            </View>
          </View>
          </View>
        </ScrollView>

    );
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  heroContainer: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
  },
  heroTitle: {
    color: 'black',
    fontSize: 16,
  },
  heroSubtitle: {
    color: '#999',
    fontSize: 12,
  },
});