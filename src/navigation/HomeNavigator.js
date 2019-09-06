import {
  createMaterialTopTabNavigator
} from 'react-navigation';
import GamesScreen from '../screens/Games/index';


import GameChatScreen from '../screens/Games/GameChat';
import BoxScreen from '../screens/Games/Boxscore';
import BettingScreen from '../screens/Games/Betting';
import NavStyles from '../constants/AppStyles';


export default HomeNavigation = createMaterialTopTabNavigator( {
    Boxscore: {
        name: 'Boxscore',
        screen: BoxScreen,
        navigationOptions: { title: 'Boxscore' }
    },
    Betting: {
        name: 'Betting',
        screen: BettingScreen,
        navigationOptions: { title: 'Betting' }
    },
    Chat: {name: 'Chat', screen: GameChatScreen, navigationOptions: { title: 'Chat' } },
    },
    {
    headerBackground: NavStyles.colors.background,
    
    headerMode: 'screen',
    tabBarPosition: 'top',
    tabBarOptions: {
        //activeTintColor: NavStyles.colors.accentColor,
        inactiveTintColor: NavStyles.colors.white,
        pressColor: NavStyles.colors.white,
        labelStyle: {
            fontWeight: 'bold',
            fontSize: 11,
        },
        indicatorStyle: {
            backgroundColor: '#377855',
            height: 5
        },
        style: {
            color: NavStyles.colors.background,
            backgroundColor: NavStyles.colors.background,
            borderTopColor: "transparent",
            //marginTop: -20,
            //paddingTop: 20
            
        }
    }
}
);

