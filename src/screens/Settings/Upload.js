import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NavStyles from '../../constants/AppStyles'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class Upload extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Upload',
    headerStyle: { backgroundColor: NavStyles.colors.background },
    headerTitleStyle: { color: NavStyles.colors.headerText },
    headerTintColor: NavStyles.colors.headerTint,
  });

  state = {
    imgSource: '',
    uploading: false,
    progress: 0,
    currentUser: null
  };



uploadImage = () => {
    const currentUserId = firebase.auth().currentUser.uid;
    const path = `/${currentUserId}/`;
    this.setState({ uploading: true });
    firebase
      .storage()
      .ref(path)
      .putFile(this.state.imageUri)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let state = {};
          state = {
            ...state,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
          };
          if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            const currentUser = firebase.auth().currentUser
            currentUser.updateProfile({
              photoURL: snapshot.downloadURL
            })
          }
          const { navigation } = this.props;
          navigation.goBack();
          navigation.state.params.onSelect({ avatar: snapshot.downloadURL });
        },
        error => {
          unsubscribe();
          Alert.alert(error.message);
        }
      );
  };


  /**
   * Select image method
   */
  pickImage = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        Alert.alert('You cancelled image picker 😟');
      } else if (response.error) {
        Alert.alert(response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({
          imgSource: source,
          imageUri: response.uri
        });
      }
    });
  };


  render() {
    const { uploading, imgSource, progress} = this.state;
    const disabledStyle = uploading ? styles.disabledBtn : {};
    const actionBtnStyles = [styles.btn, disabledStyle];
		return (
        <View style={styles.heroContainer}>
            <TouchableOpacity
              style={actionBtnStyles}
              onPress={this.pickImage}
              disabled={uploading}
            >
              <View>
                <Text style={styles.btnTxt}>Select Photo</Text>
              </View>
            </TouchableOpacity>
            {imgSource !== '' && (
              <View>
                <Image source={imgSource} style={styles.image} />
                {uploading && (
                  <View
                    style={[styles.progressBar, { width: `${progress}%` }]}
                  />
                )}
                <TouchableOpacity
                  style={actionBtnStyles}
                  onPress={this.uploadImage}
                  disabled={uploading}
                >
                  <View>
                    {uploading ? (
                      <Text style={styles.btnTxt}>Uploading ...</Text>
                    ) : (
                      <Text style={styles.btnTxt}>Upload image</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
        </View>
				
		)
	}
}


const styles = StyleSheet.create({
heroContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  borderColor: '#ccc',
  flexDirection: 'row',
},
heroImage: {
  width: 80,
  height: 80,
  borderRadius: 40,
  borderWidth: 3,
  borderColor: 'black',
  marginHorizontal: 20,
},
heroTitle: {
  color: 'black',
  fontSize: 24,
},
heroSubtitle: {
  color: '#999',
  fontSize: 14,
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
  backgroundColor: NavStyles.colors.background,
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
}
})