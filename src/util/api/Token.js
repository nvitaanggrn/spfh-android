import Env from 'react-native-config';
import * as keychain from 'react-native-keychain';
import {ToastAndroid} from 'react-native';

class Token
{
  constructor(type, token){
    this.type = type;
    this.token = token;
    this.headers = {Authorization: `${type} ${token}`};
  }

  static async hasToken(){
    return await keychain.hasInternetCredentials(Env.API_SERVER);
  }

  static async getToken(){
    try {
      const data = await keychain.getInternetCredentials(Env.API_SERVER);
      return data ? new Token(data.username, data.password) : void 0;
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }

  static async getHeaders(){
    const token = await Token.getToken();
    return token ? token.headers : Object.create(null);
  }

  static async clearToken(){
    try {
      await keychain.resetInternetCredentials(Env.API_SERVER);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
      return false;
    }
    return true;
  }

  static async storeToken(token){
    try {
      await keychain.setInternetCredentials(Env.API_SERVER, token.type, token.token);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
      return false;
    }
    return true;
  }
}

export default Token;