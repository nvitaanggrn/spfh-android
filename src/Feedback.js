import React from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import * as Icon from 'react-native-feather';
import Context from './Context';
import Api from './util/api/Api';
import Alert from './component/Alert';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';

class Home extends React.PureComponent
{
  static contextType = Context;

  state = {
    title: '',
    description: '',
    isCreated: false,
    isLoading: false,
    error: null
  };

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('feedback/create', {withToken: true});

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }

  _back = () => {
    const {navigation} = this.props;
    navigation.goBack();
  }

  _create = () => {
    this.setState(state => {
      const data = {
        title: state.title,
        description: state.description
      }
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(() => {
        this._apiFetcher = null;
        this.setState({
          title: '',
          description: '',
          isCreated: true,
          isLoading: false
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false, error});
      });
      return {isLoading: true,  error: null};
    });
  }

  render(){
    return (
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
              Kritik &amp; Saran
            </Text>
          </View>
        </View>
        <Scroll>
        <View style={styles.content}>
          <View style={styles.contact}>
            <Text style={styles.contactTitle}>
              Kontak Kami
            </Text>
            <View style={styles.contactSection}>
              <Icon.Phone width={20} height={20} stroke={styles.topbar.backgroundColor}/>
              <Text style={styles.contactSectionText}>
                0-800-1522-822 
              </Text>
            </View>
            <View style={styles.contactSection}>
              <Icon.Inbox width={20} height={20} stroke={styles.topbar.backgroundColor}/>
              <Text style={styles.contactSectionText}>
                customer@unicharm.co.id
              </Text>
            </View>
            <View style={styles.contactSection}>
              <Text style={styles.contactSectionAddress}>
                Ngoro Industrial Park Lot D2 No. 1, Jarang Sari, Lolawang, Kec. Ngoro, Kabupaten Mojokerto, Jawa Timur 61385
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Kritik &amp; Saran (Form)
            </Text>
            <Alert
              style={styles.alert}
              isVisible={!!this.state.error}>
              <Text style={styles.alertText}>
                {this.state.error?.message}
              </Text>
            </Alert>
            <Alert
              style={[styles.alert, {backgroundColor: '#146c43'}]}
              isVisible={this.state.isCreated}>
              <Text style={styles.alertText}>
                Terima kasih atas kritik dan saran yang telah anda berikan kepada kami, semoga dengan kritik dan saran yang anda berikan kami dapat memperbaikinya.
              </Text>
            </Alert>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Perihal
              </Text>
              <TextInput
                style={styles.formTextInput}
                defaultValue={this.state.title}
                onChangeText={title => this.setState({title})}/>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Komentar
              </Text>
              <TextInput
                style={styles.formTextAreaInput}
                defaultValue={this.state.description}
                onChangeText={description => this.setState({description})}
                multiline={true}/>
            </View>
            <TouchableOpacity
              style={styles.formSectionButton}
              onPress={this._create}>
              <Spinner
                isVisible={this.state.isLoading}
                color={styles.formSectionButtonText.color}>
                <Text style={styles.formSectionButtonText}>
                  Kirim
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
    marginTop: 8,
    marginBottom: 8
  },

  formSectionLabel: {
    marginBottom: 6,
    color: 'rgba(0,0,0,.5)'
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

  formSectionButton: {
    height: 48,
    marginTop: 6,
    marginBottom: 16,
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

  copyright: {
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)'
  }
});

export default Home;