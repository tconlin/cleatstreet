import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';

import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
const findDates = require('../../utils/dates')
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';
import { w, h, totalSize } from '../../components/Dimensions';


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
    this.analystRef = firebase.database().ref(`/Analysts/Bios/${this.AnalystId}`);
    this.state = {
      loading: true,
      user: '',
      messages: [],
      bio: ''
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
    this.getAnalystInfo(this.analystRef)
    
  }

  getAnalystInfo(analystRef) {
    this.setState({ loading: true });
    analystRef.on('value', (dataSnapshot) => {
      var bioFB = '';
      dataSnapshot.forEach((child) => {
        bioFB = child.val();
      });
      this.setState({ bio: bioFB, loading: false }); 
    });
  }


  render() {
    if(this.AnalystAvatar  === null || this.AnalystAvatar === '') {
      var avatar_null = true;
    }
    else {
      var avatar_null = false;
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
        <ScrollView>
        <View style={styles.pageContainer}>
          <View style={styles.heroContainer}>
          {avatar_null ? <Image style={styles.avatarImage} source={this.AnalystAvatar } /> : <Image style={styles.avatarNullImage} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{this.AnalystName}</Text>
              
            </View>
          </View>
          <View style={styles.mainContainer}> 
            <Text style={styles.settingsHeader}>Bio</Text>
              <View style={styles.itemContainer}>
                <Text>{this.state.bio}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}


const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    height: '100%'
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
  itemContainer: {
    padding: w(5),
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  mainContainer: {
    marginTop: 10,
    marginBottom: 400,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#adadad',
    marginHorizontal: 20,
  },
  avatarNullImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    backgroundColor: 'lightgrey',
    borderColor: '#adadad',
    marginHorizontal: 20,
  },
  settingsHeader: {
    fontSize: 14,
    color: '#828282',
    fontWeight: '600',
    marginLeft: 15, 
    marginBottom: 20
  },
  
});