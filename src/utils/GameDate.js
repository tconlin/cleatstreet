import React from 'react';
import { View, Text, Image } from 'react-native';

import Images from '../images/nfl-images';
import styles from './styles';
/*
const TeamIcon = ({ abbr, name }) => (
  <View style={styles.teamIconContainer}>
    <Image style={styles.teamIcon} source={Images[abbr]} />
    <View style={styles.teamNameContainer}>
      <Text style={styles.teamName}>{name}</Text> 
    </View>
  </View>
  
);
*/

const GameDate = ({ time, date }) => (
    <View style={styles.dateContainer}> 
        <View style={styles.teamNameContainer}>
            <Text style={styles.date}>{date} </Text>
            <Text style={styles.time}>{time}</Text> 
        </View>
    </View>
  
);

export default GameDate;