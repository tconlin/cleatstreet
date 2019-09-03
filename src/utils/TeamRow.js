import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';

import TeamIcon from './TeamIcon';
import TeamRecord from './TeamRecord';
import styles from './styles';

//<TeamRecord win={win} loss={loss} ratio={win_p} />
// <TouchableHighlight onPress={() => onPress({ id, name, abbr })}>
//</TouchableHighlight>
const TeamRow = ({ name, abbr}) => (
    <View style={styles.teamRow}>
      <TeamIcon abbr={abbr} name={name} />
    </View>
  
);

export default TeamRow;
