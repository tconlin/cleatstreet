import React from 'react';
import { StyleSheet, Image } from 'react-native';

import Colors from '../constants/Colors';


export default function Icon(props) {
  if (props.name === 'games') {
    return (
     
      <Image
        source={require('../images/icons/score.png')}  
        style={[styles.PNGImage, {tintColor: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}]}
      />
    );
  } else if (props.name === 'picks') {
    return (
      <Image
        source={require('../images/icons/picks.png')}
        style={[styles.WidePNGImage, {tintColor: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}]}
      />
    );
  } else if (props.name === 'chat') {
    return (
      <Image
        source={require('../images/icons/chat.png')}
        style={[styles.WidePNGImage, {tintColor: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}]}
      />
    );
  } else if (props.name === 'profile') {
    return (
      <Image
        source={require('../images/icons/profile.png')}
        style={[styles.PNGImage, {tintColor: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}]}
      />
    );
  } else if (props.name === 'upload') {
    return (
      <Image
        source={require('../images/icons/pickphoto.png')}
        style={styles.UploadImage}
      />
    );
  } else if (props.name === 'emptyProfile') {
    return (
      <Image
        source={require('../images/icons/followers.png')}
        style={styles.EmptyProfile}
      />
    );
  }
};


var styles = StyleSheet.create({
  PNGImage: {
    flex: 1,
    resizeMode: 'contain',
    width: 25,
    height: 30,

  },
  WidePNGImage: {
    flex: 1,
    resizeMode: 'contain',
    width: 35,
    height: 20,

  },
  EmptyProfile: {
    width: 80,
    height: 80,
    marginHorizontal: 20,
    

  },
  UploadImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    zIndex: 1,
    marginTop: 60,
    marginLeft: 80,
  }
});