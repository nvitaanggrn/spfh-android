import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import Config from 'react-native-config';
import * as keychain from 'react-native-keychain';
import Auth from './Auth';
import Context from './Context';
import Api from './util/api/Api';
import Client from './util/api/Client';
import Alert from './component/Alert';
import Splash from './component/Splash';
import Spinner from './component/Spinner';
import Scroll from './component/Scroll';
import logo from './asset/img/logo.png';

class Server extends React.PureComponent
{
  static contextType = Context;

  state = {
    view: 1,
    baseurl: Config.API_BASEURL,
    keyconf: 'server.baseurl',
    isLoading: false,
    error: null
  };

  componentDidMount(){
    this._init();
  }

  _opts(baseurl){
    return {
      baseurl: baseurl + '/rest/enduser/',
      timeout: parseFloat(Config.API_TIMEOUT)
    };
  }

  _ping(baseurl, callback){
    this.setState(() => {
      const client = new Client(this._opts(baseurl));
      client.get('ping').safeThen(() => {
        this.setState({isLoading: false}, () => callback());
      }).catch(error => {
        this.setState({isLoading: false, error}, () => {
          callback(error);
        });
      });
      return {isLoading: true, error: null};
    });
  }

  _init = async () => {
    let baseurl = '';
    try {
      baseurl = await keychain.getInternetCredentials(this.state.keyconf);
      baseurl = baseurl ? baseurl.password : '';
    } catch (error){
      this.setState({view: 3, error});
      return;
    }
    if (!baseurl) {
      this.setState({view: 3});
      return;
    }
    this._ping(baseurl, async (error) => {
      if (error) {
        this.setState({view: 3, baseurl});
      } else {
        Api.init(this._opts(baseurl));
        this.setState({view: 2});
      }
    });
  }

  _save = async () => {
    const baseurl = this.state.baseurl?.toLocaleLowerCase();
    this._ping(baseurl, async (error) => {
      if (error) return;
      try {
        await keychain.setInternetCredentials(this.state.keyconf, this.state.keyconf, baseurl);
      } catch (error) {
        this.setState({error});
        return;
      }
      Api.init(this._opts(baseurl));
      this.setState({view: 2});
    });
  }

  render(){
    return this[`_render${this.state.view}`]();
  }

  _render1(){
    return (
      <Splash/>
    );
  }

  _render2(){
    return (
      <Auth/>
    );
  }

  _render3(){
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
              defaultValue={this.state.baseurl}
              placeholderTextColor={styles.inputTextPlaceholder.color}
              onChangeText={(baseurl) => this.state.baseurl = baseurl}
              autoFocus={true}
              autoCapitalize='none'
              placeholder={'eg. ' + Config.API_BASEURL}/>
          </View>
          <TouchableOpacity
            activeOpacity={.7}
            style={styles.button}
            onPress={this.state.isLoading ? null : this._save}>
            <Spinner
              isVisible={this.state.isLoading}
              color={styles.buttonText.color}>
              <Text style={styles.buttonText}>
                Simpan
              </Text>
            </Spinner>
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
    marginBottom: 16,
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

  copyright: {
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)'
  }
});

export default Server;