

import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import NavStyles from '../../constants/AppStyles'



export default class Contact extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Contact Us',
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });


  render() {
    
		return (
        <View style={styles.heroContainer}>
            <Text style={styles.heroTitle}>
            If you have any questions or feedback, please reach out to us at info@cleat-street.com.
            </Text>
        </View>
				
		)
	}
}

const styles = StyleSheet.create({
    heroContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderColor: '#ccc',
      margin: 10,
    },

    heroTitle: {
      color: 'black',
      fontSize: 16,
    },
    heroSubtitle: {
      color: '#999',
      fontSize: 14,
      paddingBottom: 10
    }
    })
