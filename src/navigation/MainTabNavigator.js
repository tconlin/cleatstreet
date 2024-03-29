import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import Icon from '../components/Icon';
import PicksScreen from '../screens/Picks/index';
import ProfileScreen from '../screens/Settings/index';
import ContactScreen from '../screens/Settings/Contact';
import PPScreen from '../screens/Settings/PP';
import TermsScreen from '../screens/Settings/Terms';
import UploadScreen from '../screens/Settings/Upload';
import ChatScreen from '../screens/Chat/Chat';
import RoomsScreen from '../screens/Chat/Rooms';
import NavStyles from '../constants/AppStyles';
import GameRooms from '../screens/Games/index';
import HomeNavigation from './HomeNavigator';
import MakePicksScreen from '../screens/Picks/MakePicks';
import MakePicksGameScreen from '../screens/Picks/MakePicksGame';
import AnalystBioScreen from '../screens/Picks/AnalystBio';
import GameChatScreen from '../screens/Games/GameChat';
import AccountScreen from '../screens/Settings/Account';


const GameStack = createStackNavigator({
  Games: {name: 'Games', screen: GameRooms, navigationOptions: () =>
  ({
    headerBackTitle: null,
    headerTitleStyle: { color: NavStyles.colors.headerText},
  }) 
  },
  HomeNav: {name: 'HomeNav', screen: HomeNavigation, navigationOptions: ({navigation}) =>
  ({
    headerTitle: navigation.state.params.roomName,
    headerStyle: { backgroundColor: NavStyles.colors.background, borderBottomWidth: 0 },  
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint, 
  })  
  }
});

GameStack.navigationOptions = {
  tabBarLabel: 'Games',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name='games'
    />
  ),
};

/*const GameStack1 = createStackNavigator ({
  Rooms: {name: 'Rooms', screen: RoomsScreen },
  Chat: {name: 'Chat', screen: ChatScreen },
});


const GameStack = createMaterialTopTabNavigator(
  {
 
    Channels: GameStack1,
    Games: {
      name: 'Games',
      screen: GamesScreen,
      navigationOptions: { title: 'GameFeed' }
    }
  },
  {
      headerBackground: NavStyles.colors.background,
      headerMode: 'screen',
      tabBarPosition: 'top',
      tabBarOptions: {
          activeTintColor: NavStyles.colors.accentColor,
          inactiveTintColor: NavStyles.colors.white,
          pressColor: NavStyles.colors.white,
          labelStyle: {
              fontWeight: 'bold',
              fontSize: 11,
          },
          indicatorStyle: {
              backgroundColor: NavStyles.colors.accentColor
          },
          style: {
              color: NavStyles.colors.background,
              backgroundColor: NavStyles.colors.background,
              marginTop: -10,
              paddingTop: 50
              
          }
      }
  }
);

GameStack.navigationOptions = {
  tabBarLabel: 'Games',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name='games'
    />
  ),
};
*/


const ChatStack = createStackNavigator ({
  Rooms: {name: 'Rooms', screen: RoomsScreen, navigationOptions: () =>
  ({
    headerBackTitle: null
  }) 
},
  Chat: {name: 'Chat', screen: ChatScreen}
})

ChatStack.navigationOptions = {
  headerBackTitle: 'a new page',
  headerBackground: NavStyles.colors.background,
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name='chat'
    />
  ),
};


/*const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='home'
    />
  ),
};*/

const PicksStack = createStackNavigator({
  Picks: PicksScreen,
  MakePicks: MakePicksScreen,
  MakePicksGame: MakePicksGameScreen,
  AnalystBio: AnalystBioScreen
});

PicksStack.navigationOptions = {
  tabBarLabel: 'Picks',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name='picks'
    />
  ),
};



const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  Upload: UploadScreen,
  Terms: TermsScreen,
  PP: PPScreen,
  Contact: ContactScreen,
  Account: AccountScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name='profile'
    />
  ),
};

const Navigation = createBottomTabNavigator({
  
  GameStack,
  //GamesStack: {screen: GameStack},
  //HomeScreen: {screen: Rooms2},
  PicksStack,
  ChatStack,
  ProfileStack,
}, 
{
  tabBarOptions: { 
    showLabel: true,
    activeTintColor: '#1E2E43',
    labelStyle: {
      fontSize: 10
    },
    style: {
      backgroundColor: '#ededed',
      borderTopWidth: 2,
      borderTopColor: '#dbdbdb'
    },
    /*tabStyle: {
      height: 62
    },
    iconStyle: {
      flexGrow: 1,
      marginTop: 1
    }*/
  }
}
);




export default Navigation;