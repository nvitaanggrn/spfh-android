import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Api from './util/api/Api';
import Alert from './component/Alert';
import Spinner from './component/Spinner';
import Scroll from './component/Scroll';
import Context from './Context';
import logo from './asset/img/logo.png';

class Signup extends React.PureComponent
{
  static contextType = Context;

  state = {
    nip: '',
    name: '',
    group: '',
    password: '',
    password_confirmation: '',
    isLoading: false,
    error: null
  };

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('user/signup');

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }

  _signup = () => {
    const data = {
      nip: this.state.nip,
      name: this.state.name,
      group: this.state.group,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    };
    this.setState({isLoading: true, error: null}, () => {
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(() => {
        this._apiFetcher = null;
        const {navigation} = this.props;
        navigation.replace('signin');
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false, error});
      });
    });
  }

  _signin = () => {
    const {navigation} = this.props;
    navigation.replace('signin')
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
              defaultValue={this.state.name}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(text) => this.state.name = text}
              placeholder='Nama Lengkap'/>
            <View style={styles.selectPicker}>
              <Picker
                selectedValue={this.state.group}
                onValueChange={group => this.setState({group})}
                style={styles.selectPickerInput}>
                <Picker.Item label='Pilih Group...'/>
                <Picker.Item label='N/A' value='1'/>
                <Picker.Item label='A' value='2'/>
                <Picker.Item label='B' value='3'/>
                <Picker.Item label='C' value='4'/>
                <Picker.Item label='D' value='5'/>
                <Picker.Item label='NS' value='6'/>
              </Picker>
            </View>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.password}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(text) => this.state.password = text}
              autoCapitalize='none'
              secureTextEntry={true}
              placeholder='Password'/>
            <TextInput
              style={styles.inputText}
              defaultValue={this.state.password_confirmation}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(text) => this.state.password_confirmation = text}
              autoCapitalize='none'
              secureTextEntry={true}
              placeholder='Password (Konfirmasi)'/>
          </View>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.button}
            onPress={this.state.isLoading ? null : this._signup}>
            <Spinner
              isVisible={this.state.isLoading}
              color={styles.buttonText.color}>
              <Text style={styles.buttonText}>
                Daftar
              </Text>
            </Spinner>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.7}
            style={[styles.button, styles.buttonSignup]}
            onPress={this._signin}>
            <Text style={[styles.buttonText, styles.buttonSignupText]}>
              Masuk
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

  selectPicker: {
    height: 48,
    marginTop: 6,
    marginBottom: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,.15)',
  },

  selectPickerInput: {
    marginTop: -18,
    marginBottom: -18,
    marginLeft: -16,
    marginRight: -16
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

export default Signup;