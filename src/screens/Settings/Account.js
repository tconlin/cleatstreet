import React, { Children } from 'react';
import { 
  Share, 
  StyleSheet, 
  View, 
  Image, 
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase'
import NavStyles from '../../constants/AppStyles'
import Icon from '../../components/Icon'
import SettingsInputField from '../../components/SettingsInputField';
import LargeInputField from '../../components/LargeInputField';
import { w, h, totalSize } from '../../components/Dimensions';
import Save from './Save';

export default class Settings extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
    headerRight: ( 
      <View >
          <TouchableOpacity
            onPress={() => firebase.auth().signOut()} 
            > 
            <Text style={styles.signOutText}>Logout</Text>
          </TouchableOpacity>
         </View> 
      )
  });
  
  constructor(props) {
    super(props);
    const { currentUser } = firebase.auth()
    this.state = {
      uploading: false,
      progress: 0,
      currentUser: currentUser,
      avatar: currentUser.photoURL,
      isCreatingAccount: false,
      isCreatingAccount1: false,
      isCreatingAccount2: false,
      isCreatingAccount3: false,
      currentUserAnalyst: false,
      email: currentUser.email,
      displayName: currentUser.displayName,
      bio: ''
    }
  }

  onSelect= data => {
    console.log('here')
    this.setState(data);
  }


  componentDidMount() {
    const { currentUser } = firebase.auth();

    this.setState( {
      avatar: currentUser.photoURL,
      email: currentUser.email,
      displayName: currentUser.displayName
    })
  }


  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  }
  
  
  changeUsername = () => {
    Keyboard.dismiss();
    const name = this.name.getInputValue();
    const currentPassword = this.currentPassword.getInputValue();
    this.setState({ isCreatingAccount: true });
    
    if (currentPassword === null || currentPassword === '') {
      this.setState({ isCreatingAccount: false });
      Alert.alert('Enter current password to change username.');
    }
    else if(name !== '' && name.length < 13 && name.length > 2 ) {
      this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: name
        }).then(() => {
          this.setState({ 
            isCreatingAccount: false,
            displayName: firebase.auth().currentUser.displayName
           });
           this.currentPassword.input.clear();
           this.name.input.clear();
           Alert.alert('Username was changed successfully.');
        }).catch((error) => { console.log(error.message); });
      }).catch((error) => { console.log(error.message); });
    }
    else {
      this.setState({ isCreatingAccount: false });
      Alert.alert('Username must be between 3 and 12 characters.');
    }
  };


  changeEmail = () => {
    Keyboard.dismiss();
    const email = this.email.getInputValue();
    const currentPassword = this.currentPassword.getInputValue();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    var valid = reg.test(email);
    this.setState({ isCreatingAccount1: true });

    if (currentPassword === null || currentPassword === '') {
      this.setState({ isCreatingAccount1: false });
      Alert.alert('Enter current password to change email.');
    }
    else if ( email !== '' && valid === true ) {
      this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser;
        user.updateEmail(email).then(() => {
          this.setState({ 
            isCreatingAccount1: false,
            email: firebase.auth().currentUser.email
           });
           this.currentPassword.input.clear();
           this.email.input.clear();
           Alert.alert('Email was changed successfully.');
        }).catch((error) => { console.log(error.message); });
      }).catch((error) => { console.log(error.message); });
    }
    else {
      this.setState({ isCreatingAccount1: false });
      Alert.alert('The email address is badly formatted.');
    }
  };


  changePassword = () => {
    Keyboard.dismiss()
    const currentPassword = this.currentPassword.getInputValue();
    const newPassword = this.newPassword.getInputValue();
    const repeat = this.repeat.getInputValue();
    this.setState({ isCreatingAccount2: true });
    
    if (currentPassword === null || currentPassword === '') {
      this.setState({ isCreatingAccount2: false });
      Alert.alert('Enter current password to change password.');
    }
    else if ( newPassword !== '' && repeat !== '' && repeat === newPassword){ 
      this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser;
        user.updatePassword(newPassword).then(() => {
          this.setState({ isCreatingAccount2: false });
          this.currentPassword.input.clear();
          this.newPassword.input.clear();
          this.repeat.input.clear();
          Alert.alert('Password was changed successfully.');
        }).catch((error) => { console.log(error.message); });
      }).catch((error) => { console.log(error.message) });
    }  
    else {
      this.setState({ isCreatingAccount2: false });
      Alert.alert('The password is badly formatted.');
    }
  };




	render() {
	    return (
     
        <ScrollView>
        <View style={styles.pageContainer}>
          <View style={styles.mainContainer}> 
          <Text style={styles.settingsHeader}>Account</Text>
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="CURRENT PASSWORD:"
                secureTextEntry={true}
                blurOnSubmit={true}
                ref={ref => this.currentPassword = ref}
                style={styles.input}
              />
            </View>
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="USERNAME:"
                style={styles.input}
                ref={ref => this.name = ref}
              />
              <Save isCreating={this.state.isCreatingAccount} click={this.changeUsername}/>
            </View>
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="EMAIL:"
                keyboardType="email-address"
                style={styles.input}
                ref={ref => this.email = ref}
              />
              <Save isCreating={this.state.isCreatingAccount1} click={this.changeEmail}/>
            </View>
              
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="NEW PASSWORD:"
                secureTextEntry={true}
                blurOnSubmit={true}
                ref={ref => this.newPassword = ref}
                style={styles.input}
              />
            </View>
            <View style={styles.itemContainer}>
              <SettingsInputField
                placeholder="REPEAT NEW PASSWORD:"
                secureTextEntry={true}
                blurOnSubmit={true}
                ref={ref => this.repeat = ref}
                style={styles.input}
              />
              <Save isCreating={this.state.isCreatingAccount2} click={this.changePassword}/>
            </View>
          </View> 
        </View>
        </ScrollView>
       
		)
	}
}


const styles = StyleSheet.create({
  bottomItem: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  mainContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  BottomContainer: {
    flex: 1,
    marginBottom: 60
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    
  },
  settingsHeader: {
    fontSize: 14,
    color: '#828282',
    fontWeight: '600',
    marginLeft: 15, 
    marginBottom: 20
  },
  section: {
    backgroundColor: '#fff',
  },
  bottomText: {
    position: 'absolute',
    left: 0,
  },
  arrow: {
    tintColor: '#000',
    flex: 1,
    resizeMode: 'contain',
    width: 35,
    height: 20,
    position: 'absolute',
    right: 0,

  },
  input: {
    fontSize: 16,
    fontWeight: '300'
  },
  item: {
    fontWeight: '300',
    fontSize: 12,
    color: 'red'
  },
  itemContainer: {
    paddingVertical: w(5),
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  bottomItemContainer: {
    margin: 25,
    paddingBottom: 10,

    //flex: 1,
    //flexDirection: 'row',
     
      
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
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#adadad',
    marginHorizontal: 20,
  },
  heroTitle: {
    color: 'black',
    fontSize: 16,
  },
  heroSubtitle: {
    color: '#999',
    fontSize: 12,
  },
  uploadTitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10
  },
  uploadIcon: {
    zIndex: 1,
  },
  signOutBtn: {
    //alignContent: 'stretch',
    //flex: 1
  },
  signOutText: {
    paddingRight: 20,
    color: '#fff',
    fontSize: 12,
    fontWeight: '300'
  },
  progressBar: {
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  },
  btn: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgb(3, 154, 229)',
    marginTop: 20,
    alignItems: 'center'
  },
  disabledBtn: {
    backgroundColor: 'rgba(3,155,229,0.5)'
  },
  btnTxt: {
    color: '#fff'
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#ccc',
  },
  img: {
    flex: 1,
    height: 100,
    margin: 5,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#ccc'
  },
  progressBar: {
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  },
  touchable: {
    alignSelf: 'flex-start',
    marginLeft: w(8),
    marginTop: h(4),
  },
  saveButton: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: w(3.4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  spinner: {
    height: h(5),
  },
  saveText: {
    color: 'black',
    fontWeight: '300',
    fontSize: 12,
  }
  })