import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Context from './Context';
import * as Icon from 'react-native-feather';
import Scroll from './component/Scroll';
import logo from './asset/img/logo.png';
import formIcon from './asset/img/form.png';
import eventIcon from './asset/img/event.png';
import newsIcon from './asset/img/news.png';
import feedbackIcon from './asset/img/feedback.png';

class Home extends React.PureComponent
{
  static contextType = Context;

  render(){
    const {navigation} = this.props;
    const user = this.context.get('user');
    return (
      <View
        style={styles.layout}>
        <View style={styles.topbar}>
          <View
            style={styles.logo}>
            <Image
              source={logo}
              style={styles.logoImage}/>
          </View>
        </View>
        <Scroll>
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => navigation.navigate('profile')}
              style={styles.user}>
              <Text style={styles.userName}>
                <Text style={styles.userNameHi}>Hi,</Text> {user.name}
              </Text>
              <Icon.Settings width={16} height={16} stroke={styles.copyright.color}/>
            </TouchableOpacity>
            <View style={styles.section}>
              <TouchableOpacity
                onPress={() => navigation.navigate('form')}
                style={styles.card}>
                <View style={[styles.cardIcon, {backgroundColor: '#ffcd92'}]}>
                  <Image
                    style={styles.cardIconImage}
                    source={formIcon}/>
                </View>
                <Text style={styles.cardText}>
                  Hiyarihatto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('event')}
                style={styles.card}>
                <View style={[styles.cardIcon, {backgroundColor: '#a0ffa3'}]}>
                  <Image
                    style={styles.cardIconImage}
                    source={eventIcon}/>
                </View>
                <Text style={styles.cardText}>
                  Traning Online
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <TouchableOpacity
                onPress={() => navigation.navigate('news')}
                style={styles.card}>
                <View style={[styles.cardIcon, {backgroundColor: '#d7ecff'}]}>
                  <Image
                    style={styles.cardIconImage}
                    source={newsIcon}/>
                </View>
                <Text style={styles.cardText}>
                  Artikel &amp; Berita
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('feedback')}
                style={styles.card}>
                <View style={[styles.cardIcon, {backgroundColor: '#ffe0e5'}]}>
                  <Image
                    style={styles.cardIconImage}
                    source={feedbackIcon}/>
                </View>
                <Text style={styles.cardText}>
                  Kritik &amp; Saran
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.copyright, {marginTop: 16}]}>
              Copyright © 2022 Novita Anggraini.
            </Text>
            <Text style={styles.copyright}>
              All Rights Reserved
            </Text>
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
    height: 88,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  logo: {
    flex: 1,
    height: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },

  logoImage: {
    height: 56,
    resizeMode: 'contain'
  },

  content: {
    flex: 1
  },

  user: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  userName: {
    flex: 1,
    fontWeight: 'bold'
  },

  userNameHi: {
    color: '#fd7e14'
  },

  section: {
    padding: 4,
    flexDirection: 'row'
  },

  card: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.09)',
    overflow: 'hidden'
  },

  cardIcon: {
    padding: 24,
    alignItems: 'center'
  },

  cardIconImage: {
    height: 96,
    resizeMode: 'contain'
  },

  cardText: {
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.7)'
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