import React from 'react';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet, ToastAndroid, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as Icon from 'react-native-feather';
import Api from './util/api/Api';
import Token from './util/api/Token';
import Context from './Context';
import Alert from './component/Alert';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';

class Home extends React.PureComponent
{
  static contextType = Context;

  state = {
    user: null,
    name: '',
    address: '',
    group: '',
    password: '',
    password_confirmation: '',
    isUpdated: false,
    isLoading: false,
    isSignoutLoading: false,
    error: null
  };

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('user/update', {withToken: true});
  _apiSignoutRequest = Api.createPostRequest('user/signout', {withToken: true});

  componentDidMount(){
    const user = this.context.get('user');
    this.setState({
      user,
      name: user.name,
      address: user.address,
      group: String(user.group.id)
    })
  }

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null
  }

  _back = () => {
    const {navigation} = this.props;
    navigation.goBack();
  }

  _update = () => {
    this.setState(state => {
      const data = {
        name: state.name,
        address: state.address,
        group: state.group,
        password: state.password,
        password_confirmation: state.password_confirmation
      }
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(({data}) => {
        this._apiFetcher = null;
        this.context.update('user', data.user, () => {
          this.setState({
            password: '',
            password_confirmation: '',
            isUpdated: true,
            isLoading: false
          });
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false, error});
      });
      return {isLoading: true,  error: null};
    });
  }

  _signout = () => {
    this.setState(() => {
      this._apiFetcher = this._apiSignoutRequest.fetch().safeThen(async () => {
        this._apiFetcher = null;
        await Token.clearToken();
        this.setState({isSignoutLoading: false}, () => {
          const {navigation} = this.props;
          navigation.dispatch(CommonActions.reset({
            index: 1,
            routes: [{
              name: 'signin'
            }]
          }));
        });
      }).catch((error) => {
        this._apiFetcher = null;
        this.setState({isSignoutLoading: false}, () => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
      });
      return {isSignoutLoading: true};
    });
  }

  render(){
    return !!this.state.user && (
      <View
        style={styles.layout}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={styles.back}
            onPress={this._back}>
            <Icon.ArrowLeft stroke={styles.back.color}/>
          </TouchableOpacity>
          <View
            style={styles.title}>
            <Text style={styles.titleText}>
              My Profil
            </Text>
          </View>
        </View>
        <Scroll>
          <View style={styles.content}>
            <View style={styles.form}>
              <Alert
                style={styles.alert}
                isVisible={!!this.state.error}>
                <Text style={styles.alertText}>
                  {this.state.error?.message}
                </Text>
              </Alert>
              <Alert
                style={[styles.alert, {backgroundColor: '#146c43'}]}
                isVisible={this.state.isUpdated}>
                <Text style={styles.alertText}>
                  Berhasil memperbarui profil anda.
                </Text>
              </Alert>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  NIP
                </Text>
                <Text
                  style={styles.formTextView}>
                  {this.state.user.nip}
                </Text>
                <Text style={styles.formTextHelp}>
                  NIP (Nomor Induk Pegawai) tidak diperbarui untuk alasan kevalidan data yang anda gunakan pada aplikasi.
                </Text>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Nama Lengkap
                </Text>
                <TextInput
                  style={styles.formTextInput}
                  defaultValue={this.state.name}
                  onChangeText={name => this.setState({name})}/>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Group
                </Text>
                <View style={styles.formSelectPicker}>
                  <Picker
                    selectedValue={this.state.group}
                    onValueChange={group => this.setState({group})}
                    style={styles.formSelectPickerInput}>
                    <Picker.Item label='...'/>
                    <Picker.Item label='N/A' value='1'/>
                    <Picker.Item label='A' value='2'/>
                    <Picker.Item label='B' value='3'/>
                    <Picker.Item label='C' value='4'/>
                    <Picker.Item label='D' value='5'/>
                    <Picker.Item label='NS' value='6'/>
                  </Picker>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Alamat Lengkap
                </Text>
                <TextInput
                  style={styles.formTextAreaInput}
                  defaultValue={this.state.address}
                  onChangeText={address => this.setState({address})}
                  multiline={true}/>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Otentikasi (Opsional)
                </Text>
                <TextInput
                  style={[styles.formTextInput, {marginBottom: 8}]}
                  defaultValue={this.state.password}
                  onChangeText={password => this.setState({password})}
                  placeholder='Password'/>
                <TextInput
                  style={styles.formTextInput}
                  defaultValue={this.state.password_confirmation}
                  onChangeText={password_confirmation => this.setState({password_confirmation})}
                  placeholder='Password (Konfirmasi)'/>
              </View>
              <TouchableOpacity
                style={styles.formSectionButton}
                onPress={this._update}>
                <Spinner
                  isVisible={this.state.isLoading}
                  color={styles.formSectionButtonText.color}>
                  <Text style={styles.formSectionButtonText}>
                    Simpan
                  </Text>
                </Spinner>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.signout}
              onPress={this._signout}>
              <Spinner
                isVisible={this.state.isSignoutLoading}
                color={styles.signoutText.color}>
                <Text style={styles.signoutText}>
                  Keluar
                </Text>
              </Spinner>
            </TouchableOpacity>
            <View style={{padding: 16}}>
              <Text style={styles.copyright}>
                Copyright © 2022 Novita Anggraini.
              </Text>
              <Text style={styles.copyright}>
                All Rights Reserved
              </Text>
            </View>
          </View>
        </Scroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#fafafa'
  },

  topbar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  back: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    color: '#fff'
  },

  title: {
    flex: 1,
    justifyContent: 'center'
  },

  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },

  alert: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffc107',
    borderRadius: 4
  },

  alertText: {
    color: '#fff'
  },

  content: {
    flex: 1
  },

  contact: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  contactTitle: {
    fontSize: 24,
    marginBottom: 16,
  },

  contactSection: {
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  contactSectionText: {
    marginLeft: 16,
  },

  contactSectionAddress: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)'
  },

  form: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  formTitle: {
    fontSize: 24,
    marginBottom: 16,
  },

  formSection: {
    marginBottom: 16
  },

  formSectionLabel: {
    marginBottom: 6,
    color: 'rgba(0,0,0,.5)'
  },

  formTextView: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(0,0,0,.05)',
    color: '#000'
  },

  formTextHelp: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(0,0,0,.35)',
  },

  formTextInput: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,.15)',
    color: '#000'
  },

  formTextAreaInput: {
    minHeight: 80,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,.15)',
    textAlignVertical: 'top',
    color: '#000'
  },

  formSelectPicker: {
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

  formSelectPickerInput: {
    marginTop: -18,
    marginBottom: -18,
    marginLeft: -16,
    marginRight: -16
  },

  formSectionButton: {
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f51b5'
  },

  formSectionButtonText: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff'
  },

  signout: {
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  signoutText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#dc3545'
  },

  copyright: {
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)'
  }
});

export default Home;