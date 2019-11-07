import React, { Component } from 'react';
import { StyleSheet, TextInput} from 'react-native';
import {w, totalSize, h} from './Dimensions';

export default class LargeInputField extends Component {
  state = {
    text: ''
  };

  getInputValue = () => this.state.text;

  render() {
    return (
      <TextInput
        multiline
        style={styles.inputText}
        value={this.state.text}
        selectionColor="grey"
        autoCapitalize={this.props.autoCapitalize}
        ref={ref => this.input = ref}
        autoCorrect={false}
        underlineColorAndroid='transparent'
        secureTextEntry={this.props.secureTextEntry}
        blurOnSubmit={this.props.blurOnSubmit}
        keyboardType={this.props.keyboardType}
        returnKeyType={this.props.returnKeyType}
        placeholder={this.props.placeholder}
        placeholderTextColor="#757575"
        onChangeText={(text) => this.setState({ text })}
      />
    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingVertical: w(3.4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    width: '100%',
  },
  containerError: {
    backgroundColor: '#EF9A9A88',
    borderWidth: 1,
    borderColor: '#E57373',
  },
  inputText: {
    color: 'black',
    flex: 1,
    fontSize: 14,
    marginLeft: w(10),
    fontWeight: '300'
  },
  icon: {
    marginLeft: w(4),
    width: w(7),
    height: w(7),
  },
  iconError: {
    width: w(7),
    height: w(7),
    marginRight: w(3),
  }
});