import React from 'react';
import {StyleSheet, ToastAndroid, View, Text, TouchableOpacity} from 'react-native';
import * as Icon from 'react-native-feather';
import Api from './util/api/Api';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';
import DateTime from './component/DateTime';

class FormItem extends React.PureComponent
{
  state = {
    data: null
  }

  _apiFetcher = null;
  _apiRequest = Api.createGetRequest('form/item', {withToken: true});

  componentDidMount(){
    const {params} = this.props.route;
    const data = {
      id: params.item?.id
    };
    this._apiFetcher = this._apiRequest.fetch({data}).safeThen(({data}) => {
      this._apiFetcher = null;
      this.setState({data});
    }).catch(error => {
      this._apiFetcher = null;
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      this._back();
    });
  }

  componentWillUnmount(){
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }

  _back = () => {
    const {navigation} = this.props;
    navigation.goBack();
  }

  render(){
    const {data} = this.state;
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
              Laporan
            </Text>
            {!!data && (
              <Text style={styles.subtitleText}>
                Status &middot; {data.form_status_name}
              </Text>
            )}
          </View>
        </View>
        {this.state.data ? this._renderContent() : this._renderLoading()}
      </View>
    );
  }

  _renderContent(){
    const {data} = this.state;
    return (
      <Scroll>
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                NIP
              </Text>
              <Text>
                {data.user_nip}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Nama
              </Text>
              <Text>
                {data.user_name}
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Group
              </Text>
              <Text>
                {data.group_name}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View
              style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Tanggal
              </Text>
              <DateTime value={data.reported_at}/>
            </View>
          </View>
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Lokasi Kejadian
            </Text>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Mesin / Ruangan
              </Text>
              <Text>
                {data.location_name}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Bagian
              </Text>
              <Text>
                {data.place}
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Deskripsi Kejadian
            </Text>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Item Temuan
              </Text>
              <Text multiline={true}>
                {data.situation}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Potensi Bahaya
              </Text>
              <Text multiline={true}>
                {data.possibility}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Usulan Perbaikan
              </Text>
              <Text multiline={true}>
                {data.repairsuggest}
              </Text>
            </View>
            <View style={styles.formSectionLine}/>
            <View style={styles.formSection}>
              <Text style={styles.formSectionLabel}>
                Tindakan Perbaikan
              </Text>
              <Text multiline={true}>
                {data.repairaction}
              </Text>
            </View>
          </View>
        </View>
      </Scroll>
    );
  }

  _renderLoading(){
    return (
      <View style={styles.loading}>
        <Spinner isVisible={true} color={styles.topbar.backgroundColor}/>
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

  subtitleText: {
    color: 'rgba(255,255,255,.5)'
  },

  content: {
    flex: 1
  },

  loading: {
    flex: 1,
    justifyContent: 'center'
  },

  form: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.09)'
  },

  formTitle: {
    marginTop: 6,
    marginBottom: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  formSection: {
    marginTop: 8,
    marginBottom: 8
  },

  formSectionLine: {
    height: 1,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,.09)'
  },

  formSectionLabel: {
    marginBottom: 6,
    color: 'rgba(0,0,0,.5)'
  }
});

export default FormItem;