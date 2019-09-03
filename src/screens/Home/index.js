/*import React from 'react'
import { 
  ActivityIndicator,
  StyleSheet,  
  Platform, 
  Image, 
  Button, 
  Text, 
  View 
} from 'react-native'
import { NavigationScreenProps, TouchableOpacity } from "react-navigation";
import firebase from 'react-native-firebase'
import Firebase from '../../FirebaseLogin/api/Firebase'
import Icon from 'react-native-vector-icons/FontAwesome';
import { w, h, totalSize } from '../../components/Dimensions'
import Swiper from 'react-native-swiper'
import HeaderImage from '../../components/HeaderImg';


import Config from 'react-native-config';
import { StreamApp,
  FlatFeed,
  Activity,
  LikeButton,
  StatusUpdateForm, } from 'react-native-activity-feed';



class TitleText extends React.Component {
  render() {
    return (
      <Text style={{ fontSize: 48, color: 'white' }}>
        {this.props.label}
      </Text>
    )
  }
}

export default class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: { backgroundColor: '#FAFAFA' },
    headerTitleStyle: { color: '#000' },
    headerTintColor: '#FAFAFA',
    headerLeft: ( 
    <HeaderImage />  
    )
  }

  constructor(props) {
    super(props);
    var userId = firebase.auth().currentUser.uid;
    this.tokenRef = firebase.database().ref(`users/${userId}`);
    this.state = {
      currentUser: null,
      apiKey: null,
      appId: null,
      streamToken: null,
      loading: true
    }
  }


  componentWillMount() {
    this.setState({ currentUser: firebase.auth().currentUser });
    this.setState({apiKey: Config.STREAM_API_KEY});
    this.setState({appId: Config.STREAM_APP_ID});
    
    this.tokenRef.on('value', (snapshot) => {
      token = snapshot.val().token;
      this.setState({streamToken: token});
      console.log(this.state.streamToken);
      this.setState({loading:false});
    })
  }

  render() {
    if(this.state.loading) {
      return (<View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff" /></View>);
    }
    return (
      <StreamApp
      apiKey={this.state.apiKey}
      appId={this.state.apiId}
      token={this.state.streamToken}
     >
    </StreamApp>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
});*/