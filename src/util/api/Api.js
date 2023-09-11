import Config from 'react-native-config';
import Client from './Client';

const Api = new Client({
  baseurl: Config.API_BASEURL,
  timeout: parseFloat(Config.API_TIMEOUT)
});

export default Api;