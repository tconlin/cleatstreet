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
  ScrollView,
  ActivityIndicator
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
    this.analystBioRef = firebase.database().ref(`/Analysts/Bios/${currentUser.uid}`);
    this.analystRef = firebase.database().ref(`/Analysts/Verified`)
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



  componentDidMount() {
    const { currentUser } = firebase.auth();
    var currentUserEmail = firebase.auth().currentUser.email;
    this.analystRef.on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        var email = child.val();
        
        if (email === currentUserEmail) {
          this.setState({currentUserAnalyst: true });
          this.analystBioRef.on('value', (dataSnapshot) => {
            if(dataSnapshot.exists()) {
              dataSnapshot.forEach((child) => {
                this.setState({bio: child.val()})
              });
            }
          });
        }
      });
    });
    
    this.setState( {
      avatar: currentUser.photoURL,
      email: currentUser.email,
      displayName: currentUser.displayName
    })
  }

  checkVerified(analystRef, currentUserEmail) {
    analystRef.on('value', (dataSnapshot) => {
      this.setState({ loading: true });
      dataSnapshot.forEach((child) => {
        var email = child.val();
        
        console.log(email)
        if (email === currentUserEmail) {
          this.state.currentUserAnalyst = true
          this.analystBioRef.on('value', (dataSnapshot) => {
            if(dataSnapshot.exists()) {
              dataSnapshot.forEach((child) => {
                this.setState({bio: child.val()})
              });
            }
          });
        }
      });
    });
    this.setState({ loading: false });
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out Cleat Street in the iOS App Store! \
          Never pay for picks again.\
          Hear from expert analysts, follow the games,\
          and chat with other bettors. Completely free.',
        url: 'https://www.cleat-street.com'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  

  changeBio = () => {
    Keyboard.dismiss();
    const bio = this.bio.getInputValue();
    this.setState({ isCreatingAccount3: true });
    if (bio === null || bio === '' ) {
      this.setState({ isCreatingAccount3: false });
      Alert.alert('Bio info must not be empty');
    }
    else {
      this.analystRef.set({
        Bio: bio
      })
      this.setState({ isCreatingAccount3: false });
      this.bio.input.clear();
      Alert.alert('Bio was successfully updated.');
    }
  }



	render() {
    const { uploading, currentUser } = this.state;

    if(this.state.currentUserAnalyst) {
      if(this.state.bio === null || this.state.bio === '') {
        var bio = 'Your Bio: '
      }
      else {
        var bio = this.state.bio
      }
      AnalystInput = 
      <View style={styles.mainContainer}> 
        <Text style={styles.settingsHeader}>Analyst Info</Text>
        <View style={styles.itemContainer}>
          <LargeInputField
            placeholder={bio}
            style={styles.input}
            ref={ref => this.bio = ref}
          />
          <Save isCreating={this.state.isCreatingAccount3} click={this.changeBio}/>
        </View>
      </View>; 
    }
    else {
      AnalystInput = <View></View>;
    }



    if (this.state.avatar) {
      profilePic = 
      <TouchableOpacity
      onPress={() => this.props.navigation.navigate('Upload')}
      disabled={uploading}
      >   
        <Image
        source={{uri: this.state.avatar}}
        style={styles.heroImage}
        ></Image>
        <View style={{ position: 'absolute' }}>
          <Icon style={styles.uploadIcon} name="upload"></Icon>
        </View>
      </TouchableOpacity>;
    } 
    else {
      profilePic = 
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Upload')}
        disabled={uploading}
        >
          <Icon name="emptyProfile"></Icon>
          <View style={{ position: 'absolute' }}>
            <Icon style={styles.uploadIcon} name="upload"></Icon>
          </View>
        </TouchableOpacity>;
    }
    
      return (
        <ScrollView>
          <View style={styles.pageContainer}>
            <View style={styles.heroContainer}>
              {profilePic}
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>{this.state.displayName}</Text>
                <Text style={styles.heroSubtitle}>{this.state.email}</Text>
              </View>
            </View>
            {AnalystInput}
            <View style={styles.BottomContainer}>
            <TouchableOpacity
              style={styles.bottomItem}
              onPress={this.onShare}
            >
              <View style={styles.bottomItemContainer}>
                
                <Text style={styles.bottomText}>Share Cleat Street With Friends</Text>
                <Image style={styles.arrow} source={require('../../images/icons/arrow.png')}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomItem}
              onPress={() => this.props.navigation.navigate('Account')}
            >
              <View style={styles.bottomItemContainer}>
                
                <Text style={styles.bottomText}>Change Account Info</Text>
                <Image style={styles.arrow} source={require('../../images/icons/arrow.png')}/>
              </View >
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomItem}
              onPress={() => this.props.navigation.navigate('Terms')}
            >
              <View style={styles.bottomItemContainer}>
                
                <Text style={styles.bottomText}>Terms and Conditions</Text>
                <Image style={styles.arrow} source={require('../../images/icons/arrow.png')}/>
              </View >
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.bottomItem}
                  onPress={() => this.props.navigation.navigate('PP')}
                  >
              <View style={styles.bottomItemContainer}>
                <Text style={styles.bottomText}>Privacy Policy</Text>
                <Image style={styles.arrow} source={require('../../images/icons/arrow.png')}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomItem}
              onPress={() => this.props.navigation.navigate('Contact')}
              >
              <View style={styles.bottomItemContainer}>
                <Text style={styles.bottomText}>Contact Us</Text>
                <Image style={styles.arrow} source={require('../../images/icons/arrow.png')}/>
              </View>
            </TouchableOpacity>
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