import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

const TeamRecord = ({ win, loss, ratio }) => (
  <View style={styles.recordContainer}>
    <Text style={styles.wins}>{win}</Text>
    <Text style={styles.hyphen}>-</Text>
    <Text style={styles.losses}>{loss}</Text>
    <Text style={styles.ratio}>({ratio.toFixed(3)})</Text>
  </View>
);

export default TeamRecord;