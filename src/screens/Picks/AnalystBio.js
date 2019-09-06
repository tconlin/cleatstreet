import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  ActivityIndicator
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
    this.Analyst = this.props.navigation.state.params.Analyst;
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
      <View style={styles.headerContainer}>
        <View style={styles.chatHeader}>
          {header}
        </View>
        <View style={styles.container}>
            <View style={styles.BoxScoreContainer}>
                <View>
                    <View style={{width: 100, height: 30, backgroundColor: 'blue'}} >
                    </View>
                    <View style={{width: 100, height: 30, backgroundColor: 'black'}} >
                    </View>
                    <View style={{width: 100, height: 30, backgroundColor: 'green'}} >
                    </View>
                    
                </View>
                <View>
                    <View style={{width: 50, height: 30, backgroundColor: 'powderblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'skyblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'steelblue'}} >
                    </View>
                    
                </View>

                <View>
                    <View style={{width: 50, height: 30, backgroundColor: 'black'}}>
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'grey'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'blue'}} >
                    </View>
                
                </View>
                <View>
                    <View style={{width: 50, height: 30, backgroundColor: 'powderblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'skyblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'steelblue'}} >
                    </View>
                    
                </View>
                <View>
                    <View style={{width: 50, height: 30, backgroundColor: 'blue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'red'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'green'}} >
                    </View>
                    
                </View>
                <View>
                    <View style={{width: 50, height: 30, backgroundColor: 'powderblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'skyblue'}} >
                    </View>
                    <View style={{width: 50, height: 30, backgroundColor: 'steelblue'}} >
                    </View>
                    
                </View>
            </View>
        </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
Score: {
    width: 25,
    height: 25
},
BoxScoreContainer: {
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
    backgroundColor: 'black',
    
    
    
  },
  left: {
      //backgroundColor: '#e5e6ea',
  },
  right: {
      //backgroundColor: '#d1b624',
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
  }
});