import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  KeyboardAvoidingView,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import NavStyles from '../../constants/AppStyles';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import emojiUtils from 'emoji-utils';
const findDates = require('../../utils/dates')
import SlackMessage from './SlackMessage';
import RowStyles from '../../utils/styles'
import { GameDate, TeamIcon } from '../../utils/index';




export default class Chat extends Component {
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
    this.roomKey = this.props.navigation.state.params.roomKey;
    this.GameTime = this.props.navigation.state.params.GameTime;
    this.GameDate = this.props.navigation.state.params.GameDate;
    this.HomeTeam = this.props.navigation.state.params.homeTeam;
    this.AwayTeam = this.props.navigation.state.params.awayTeam;
    this.Clock = this.props.navigation.state.params.Clock;
    this.QuarterText = this.props.navigation.state.params.QuarterText;
    this.HomeTotal = this.props.navigation.state.params.HomeTotal;
    this.AwayTotal = this.props.navigation.state.params.AwayTotal;
    this.is_live = this.props.navigation.state.params.is_live;
    this.messagesRef = firebase.database().ref(`/NFL/${this.year}/${this.type}/${this.week}/${this.roomKey}/Messages`)
    this.state = {
      loading: true,
      user: '',
      messages: []
    }
  }

  componentDidMount() {
    this.setState({ user: firebase.auth().currentUser });
    this.listenForMessages(this.messagesRef);
  }

  listenForMessages(messagesRef) {
    messagesRef.on('value', (dataSnapshot) => {
      var messagesFB = [];
      dataSnapshot.forEach((child) => {
        messagesFB = [({
          _id: child.key,
          text: child.val().text,
          createdAt: child.val().createdAt,
          user: {
            _id: child.val().user._id,
            name: child.val().user.name,
            avatar: child.val().user.avatar
          }
        }), ...messagesFB];
      });
      this.setState({ messages: messagesFB });
      //this.setState(previousState => ({
      //  messages: GiftedChat.
      //  messages: GiftedChat.append(previousState.messages, messagesFB),
      //}));
    });
  }

  addMessage(messages = {}) {
    var messageObj = messages[0]
    this.messagesRef.push({
      text: messageObj.text,
      createdAt: Date.now(),
      user: {
        _id: messageObj.user._id,
        name: messageObj.user.name,
        avatar: messageObj.user.avatar
      }
    })
  }


  renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <SlackMessage {...props} messageTextStyle={messageTextStyle} />
    );
  }
  
  renderRow(item) {
    return (
        <View style={RowStyles.teamRow}>
          <TeamIcon name={navigation.state.params.awayTeam}/>
          <Text>VS</Text>
          <TeamIcon name={navigation.state.params.homeTeam} />
        </View>
    )
  }


  render() {
    if(this.is_live) {
      header = 
      <View style={RowStyles.chatTeamRow}>
        <TeamIcon name={this.AwayTeam}/>
        <Text>{this.AwayTotal}</Text>
        <GameDate time={this.Clock} date={this.QuarterText}/>
        <Text>{this.HomeTotal}</Text>
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
      
        <SafeAreaView style={styles.container}>
          <GiftedChat
            bottomOffset={50}
            messages={this.state.messages}
            onSend={this.addMessage.bind(this)}
            alwaysShowSend
            showUserAvatar
            isAnimated={false}
            //placeholder={('Type your message here')}
            showAvatarForEveryMessage
            user={{
              _id: this.state.user.uid,
              name: this.state.user.displayName,
              avatar: this.state.user.photoURL
            }}
            renderMessage={this.renderMessage}
            textInputProps={{
              autoCapitalize: 'none',
              keyboardAppearance: 'dark',
              autoCorrect: false,
          }}
          />
          <KeyboardAvoidingView/>
        </SafeAreaView>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  chatHeader: {
    position: "absolute",
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
    backgroundColor: '#fcfcfc',
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