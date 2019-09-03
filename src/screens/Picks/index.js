import React from 'react'
import { StyleSheet, Platform, Image, Button, Text, View } from 'react-native'
import { NavigationScreenProps, TouchableOpacity } from "react-navigation";
import firebase from 'react-native-firebase'
import { w, h, totalSize } from '../../components/Dimensions'
import Swiper from 'react-native-swiper'
import HeaderImage from '../../components/HeaderImg';
import NavStyles from '../../constants/AppStyles'


export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Picks',
      headerStyle: { backgroundColor: NavStyles.colors.background },
      headerTitleStyle: { color: NavStyles.colors.headerText },
      headerTintColor: NavStyles.colors.headerTint,
    });
    

  state = { currentUser: null }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    const { currentUser } = firebase.auth()
    if (this._isMounted) {
      this.setState({ currentUser })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { currentUser } = this.state

    return (
      <Swiper
        loop={false}
        showsPagination={false}
        index={1}>
        <View >
          <Text>Left
          Hi {currentUser && currentUser.email}!
        </Text>
        </View>
        <Swiper
          horizontal={false}
          loop={false}
          showsPagination={false}
          index={1}>
          <View style={styles.view}>
            <Text>Top
          Hi {currentUser && currentUser.email}!
        </Text>
          </View>
          <View style={styles.view}>
            <Text>Home
          Hi {currentUser && currentUser.email}!
        </Text>
          </View>
          <View style={styles.view}>
            <Text>Bottom
          Hi {currentUser && currentUser.email}!
        </Text>
          </View>
        </Swiper>        
        <View style={styles.view}>
          <Text> Right
          Hi {currentUser && currentUser.email}!
        </Text>
        </View>
      </Swiper>
      
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
  }
});