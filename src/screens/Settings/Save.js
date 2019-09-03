import React, { Component } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { w, h, totalSize } from '../../components/Dimensions';

export default class Save extends Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={this.props.click}
        style={styles.saveButton}>
        {this.props.isCreating
        ? <ActivityIndicator size="small" style={styles.spinner} color='black' />
        : <Text style={styles.text}>Save</Text>}
      </TouchableOpacity>
    );
  }
}

Save.propTypes = {
  click: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  saveButton: {
    width: '20%',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',

    borderColor: '#ccc',
  },
  spinner: {
    height: h(3),
  },
  text: {
    color: 'black',
    fontSize: 12,
    fontWeight: '300',
    //paddingVertical: h(1),
    
  }
});
