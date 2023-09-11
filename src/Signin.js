import React from 'react';
import {StyleSheet, ToastAndroid, View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import Api from './util/api/Api';
import Token from './util/api/Token';
import Alert from './component/Alert';
import Spinner from './component/Spinner';
import Scroll from './component/Scroll';
import Context from './Context';
import logo from './asset/img/logo.png';

class Signin extends React.PureComponent
{
  static contextType = Context;

  state = {
    nip: '',
    password: '',
    isLoading: false,
    error: null
  };

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('user/signin');

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }

  _signin = () => {
    const data = {
      nip: this.state.nip,
      password: this.state.password
    };
    this.setState({isLoading: true, error: null}, () => {
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(({data}) => {
        this._apiFetcher = null;
        const {navigation} = this.props;
        this.setState({isLoading: false}, () => {
          this.context.insert('user', data.user, async () => {
            await Token.storeToken(data.token);
            ToastAndroid.show('Welcome back!', ToastAndroid.SHORT);
            navigation.replace('home');
          });
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false, error});
      });
    });
  }

  _signup = () => {
    const {navigation} = this.props;
    navigation.replace('signup')
  }

  render(){
    return (
      <Scroll>
        <View
          style={styles.layout}>
          <View
            style={styles.logo}>
            <Image
              source={logo}
              style={styles.logoImage}/>
          </View>
          <Alert
            style={styles.alert}
            isVisible={!!this.state.error}>
            <Text style={styles.alertText}>
              {this.state.error?.message}
            </Text>
          </Alert>
          <View
            style={styles.input}>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.nip}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(text) => this.state.nip = text}
              autoFocus={true}
              autoCapitalize='none'
              keyboardType='numeric'
              placeholder='NIP'/>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.password}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(text) => this.state.password = text}
              autoCapitalize='none'
              secureTextEntry={true}
              placeholder='Password'/>
          </View>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.button}
            onPress={this.state.isLoading ? null : this._signin}>
            <Spinner
              isVisible={this.state.isLoading}
              color={styles.buttonText.color}>
              <Text style={styles.buttonText}>
                Masuk
              </Text>
            </Spinner>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.7}
            style={[styles.button, styles.buttonSignup]}
            onPress={this._signup}>
            <Text style={[styles.buttonText, styles.buttonSignupText]}>
              Daftar
            </Text>
          </TouchableOpacity>
          <Text style={styles.copyright}>
            Copyright © 2022 Novita Anggraini.
          </Text>
          <Text style={styles.copyright}>
            All Rights Reserved
          </Text>
        </View>
      </Scroll>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    flexDirection: 'column'
  },

  logo: {
    width: '100%',
    alignItems: 'center'
  },

  logoImage: {
    height: 80,
    resizeMode: 'contain',
    marginBottom: 32
  },

  alert: {
    width: '100%',
    padding: 16,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: '#ffc107'
  },

  alertText: {
    color: '#fff'
  },

  input: {
    width: '100%'
  },

  inputText: {
    height: 48,
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,.15)',
    color: '#000'
  },

  inputTextPlaceholder: {
    color: 'rgba(0,0,0,.5)'
  },

  button: {
    width: '100%',
    height: 48,
    marginTop: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f51b5'
  },

  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff'
  },

  buttonSignup: {
    borderWidth: 1,
    borderColor: '#3f51b5',
    backgroundColor: '#fff',
    marginBottom: 24
  },

  buttonSignupText: {
    color: '#3f51b5'
  },

  copyright: {
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)'
  }
});

export default Signin;