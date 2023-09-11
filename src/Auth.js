import React from 'react';
import {ToastAndroid} from 'react-native';
import Api from './util/api/Api';
import datastore from './util/datastore';
import Splash from './component/Splash';
import Navigator from './Navigator';
import Context from './Context';

class Auth extends React.PureComponent
{
  state = {
    data: null
  };

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('user/auth', {withToken: true});

  componentDidMount(){
    this._apiFetcher = this._apiRequest.fetch().safeThen(({data}) => {
      this._apiFetcher = null;
      this.setState({data});
    }).catch(error => {
      this._apiFetcher = null;
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    });
  }

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }

  render(){
    return this.state.data ?
      <Context.Provider value={this._createDatastore()} children={<Navigator route={this._createRoute()}/>}/> :
      <Splash/>;
  }

  _createRoute(){
    const {data} = this.state;
    return data.status & 0x01 ? 'home' : 'signin';
  }

  _createDatastore(){
    const {user} = this.state.data;
    return datastore({user});
  }
}

export default Auth;