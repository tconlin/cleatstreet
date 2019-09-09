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
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#377855',
    borderRadius: w(1),
    marginTop: h(8),
    borderColor: '#377855',
    borderWidth: 1
  },
  spinner: {
    height: h(3),
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    //paddingVertical: h(1),
    
  }
});