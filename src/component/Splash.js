import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Scroll from './Scroll';
import logo from '../asset/img/logo.png';

class Splash extends React.PureComponent
{
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
    alignItems: 'center',
    marginBottom: 32
  },

  logoImage: {
    height: 72,
    resizeMode: 'contain'
  }
});

export default Splash;