import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { w, h, totalSize } from '../../../components/Dimensions';
import InputField from '../../../components/InputField';
import Continue from './Continue';
import Firebase from "../../api/Firebase";
import Terms from './Terms';

import { CheckBox } from 'react-native-elements'



const email = require('../../assets/email.png');
const password = require('../../assets/password.png');
const repeat = require('../../assets/repeat.png');
const person = require('../../assets/person.png');
const companyLogo = require('../../assets/CSLogoComplete.png');

export default class Register extends Component {
  state = {
    isNameCorrect: false,
    isEmailCorrect: false,
    isPasswordCorrect: false,
    isRepeatCorrect: false,
    isCreatingAccount: false,
    ageCheck: false,
    termsCheck: false
  };

  createUserAccount = () => {
    const name = this.name.getInputValue();
    const email = this.email.getInputValue();
    const password = this.password.getInputValue();
    const repeat = this.repeat.getInputValue();

    this.setState({
      isNameCorrect: name === '',
      isEmailCorrect: email === '',
      isPasswordCorrect: password === '',
      isRepeatCorrect: repeat === '' || repeat !== password,
    }, () => {
      if(name !== '' && email !== '' && password !== '' && (repeat !== '' && repeat === password && this.state.ageCheck && this.state.termsCheck )){
        this.createFireBaseAccount(name, email, password);
      } else {
        console.warn('Fill up all fields correctly');
      }
    })
    

  };

  onSelect = () => {
    if(this.state.ageCheck == false) {
      this.setState({ ageCheck: true})
    }
    else if(this.state.ageCheck == true) {
      this.setState({ ageCheck: false})
    }
  }
  onSelect2 = () => {
    if(this.state.termsCheck == false) {
      this.setState({ termsCheck: true})
    }
    else if( this.state.termsCheck == true) {
      this.setState({ termsCheck: false})
    }
    
  }

  createFireBaseAccount = (name, email, password) => {
    this.setState({ isCreatingAccount: true });
    Firebase.createFirebaseAccount(name, email, password)
      .then(result => {
        if(result) this.props.change('login')();
        this.setState({ isCreatingAccount: false });
      });
  };

  changeInputFocus = name => () => {
    switch (name) {
      case 'Name':
        this.setState({ isNameCorrect: this.name.getInputValue() === '' });
        this.email.input.focus();
        break;
      case 'Email':
        this.setState({ isEmailCorrect: this.email.getInputValue() === '' });
        this.password.input.focus();
        break;
      case 'Password':
        this.setState({ isPasswordCorrect: this.password.getInputValue() === '',
          isRepeatCorrect: (this.repeat.getInputValue() !== ''
            && this.repeat.getInputValue() !== this.password.getInputValue()) });
        this.repeat.input.focus();
        break;
      default:
        this.setState({ isRepeatCorrect: (this.repeat.getInputValue() === ''
            || this.repeat.getInputValue() !== this.password.getInputValue()) });
    }
  };

  render() {
    return(
      <View style={styles.container}>
        <Image style={styles.icon} resizeMode="contain" source={companyLogo}/>
        <InputField
          placeholder="Name"
          autoCapitalize="words"
          error={this.state.isNameCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.name = ref}
          icon={person}
        />
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          error={this.state.isEmailCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.email = ref}
          icon={email}
        />
        <InputField
          placeholder="Password"
          error={this.state.isPasswordCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.password = ref}
          secureTextEntry={true}
          icon={password}
        />
        <InputField
          placeholder="Repeat Password"
          error={this.state.isRepeatCorrect}
          style={styles.input}
          secureTextEntry={true}
          returnKeyType="done"
          blurOnSubmit={true}
          focus={this.changeInputFocus}
          ref={ref => this.repeat = ref}
          icon={repeat}
        />
        <View style={{
    justifyContent: 'flex-start'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          center
          containerStyle={{backgroundColor: '#fff', borderColor: '#fff'}}
          checked={this.state.termsCheck}
          onPress={() => this.onSelect2()}
        /> 
        <Text style={{color: '#757575'}}>I agree to the </Text>
        <TouchableOpacity onPress={this.props.change('terms')} >
            <Text style={{color: 'blue'}} >Terms and Conditions</Text>
          </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          containerStyle={{backgroundColor: '#fff', borderColor: '#fff'}}
          checked={this.state.ageCheck}
          onPress={() => this.onSelect()}
        />
        <Text style={{color: '#757575'}}>I am over the age of 18.</Text>
        </View>
        </View>
        <Continue isCreating={this.state.isCreatingAccount} click={this.createUserAccount}/>
        <TouchableOpacity onPress={this.props.change('login')} style={styles.touchable}>
          <Text style={styles.signIn}>{'<'} Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

Register.propTypes = {
  change: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    backgroundColor: '#fff'
  },
  create: {
    color:'#757575',
    fontSize: totalSize(2.4),
    marginTop: h(7),
    marginBottom: h(4),
    fontWeight: '700',
  },
  signIn: {
    color:'#757575',
    fontSize: totalSize(1.5),
    fontWeight: '400',
  },
  touchable: {
    alignSelf: 'flex-start',
    marginLeft: w(8),
    marginTop: h(4),
  },
  input: {
    marginVertical: h(2),
  },
  icon: {
    width: w(70),
    //height: h(30),
    marginTop: h(2),
    //marginBottom: h(7),
  }
});