import React from 'react';
import {StyleSheet, ToastAndroid, View, Text, TouchableOpacity, TextInput} from 'react-native';
import moment from 'moment-timezone';
import * as Icon from 'react-native-feather';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker'
import Context from './Context';
import Api from './util/api/Api';
import Alert from './component/Alert';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';
import DateTime from './component/DateTime';

class FormCreate extends React.PureComponent
{
  static contextType = Context;

  state = {
    datetime: moment.utc().toDate(),
    location: '',
    place: '',
    situation: '',
    possibility: '',
    repairsuggest: '',
    repairaction: '',
    isShowDatetime: false,
    isLoading: false,
    error: null
  }

  _apiFetcher = null;
  _apiRequest = Api.createPostRequest('form/create', {withToken: true});

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
        datetime: moment.utc(state.datetime).format('Y-MM-DD HH:mm:ss'),
        location: state.location,
        place: state.place,
        situation: state.situation,
        possibility: state.possibility,
        repairsuggest: state.repairsuggest,
        repairaction: state.repairaction
      }
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(() => {
        this._apiFetcher = null;
        this.setState({isLoading: false}, () => {
          ToastAndroid.show('Berhasil mengirim laporan.', ToastAndroid.SHORT);
          const form = this.context.get('form');
          form && form._loadData();
          this._back();
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false, error});
      });
      return {isLoading: true,  error: null};
    });
  }

  render(){
    const user = this.context.get('user');
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
              Tambah Laporan
            </Text>
          </View>
        </View>
        <Alert
          style={styles.alert}
          isVisible={!!this.state.error}>
          <Text style={styles.alertText}>
            {this.state.error?.message}
          </Text>
        </Alert>
        <Scroll>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  NIP
                </Text>
                <Text>
                  {user.nip}
                </Text>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Nama
                </Text>
                <Text>
                  {user.name}
                </Text>
              </View>
            </View>
            <View style={styles.form}>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Group
                </Text>
                <Text>
                  {user.group?.name}
                </Text>
              </View>
              <View
                style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Tanggal
                </Text>
                <TouchableOpacity
                  style={styles.formFrame}
                  onPress={() => this.setState({isShowDatetime: true})}>
                  <DateTime value={this.state.datetime}/>
                </TouchableOpacity>
                <DatePicker
                  modal={true}
                  title={null}
                  locale='id'
                  mode='datetime'
                  textColor='#000'
                  confirmText='Simpan'
                  cancelText='kembali'
                  timeZoneOffsetInMinutes={7 * 60}
                  date={this.state.datetime}
                  open={this.state.isShowDatetime}
                  onConfirm={datetime => this.setState({datetime, isShowDatetime: false})}
                  onCancel={() => this.setState({isShowDatetime: false})}/>
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
                <View style={styles.formFrame}>
                  <Picker
                    selectedValue={this.state.location}
                    onValueChange={location => this.setState({location})}
                    style={styles.formSelectPicker}>
                    <Picker.Item label='...'/>
                    <Picker.Item label='N/A' value='1'/>
                    <Picker.Item label=' Mesin 11' value='2'/>
                    <Picker.Item label=' Mesin 221' value='3'/>
                    <Picker.Item label=' Mesin 222' value='4'/>
                    <Picker.Item label=' Mesin 223' value='5'/>
                    <Picker.Item label=' Mesin 224' value='6'/>
                    <Picker.Item label=' Mesin 225' value='7'/>
                    <Picker.Item label=' Mesin 226' value='8'/>
                    <Picker.Item label=' Mesin 227' value='9'/>
                    <Picker.Item label=' Mesin 228' value='10'/>
                    <Picker.Item label=' Mesin 229' value='11'/>
                    <Picker.Item label=' Mesin 230' value='12'/>
                    <Picker.Item label=' Mesin 231' value='13'/>
                  </Picker>
                </View>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Bagian
                </Text>
                <TextInput
                  style={styles.formTextInput}
                  defaultValue={this.state.place}
                  onChangeText={place => this.setState({place})}/>
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
                <TextInput
                  style={styles.formTextAreaInput}
                  defaultValue={this.state.situation}
                  onChangeText={situation => this.setState({situation})}
                  multiline={true}/>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Potensi Bahaya
                </Text>
                <TextInput
                  style={styles.formTextAreaInput}
                  defaultValue={this.state.possibility}
                  onChangeText={possibility => this.setState({possibility})}
                  numberOfLines={4}
                  multiline={true}/>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Usulan Perbaikan
                </Text>
                <TextInput
                  style={styles.formTextAreaInput}
                  defaultValue={this.state.repairsuggest}
                  onChangeText={repairsuggest => this.setState({repairsuggest})}
                  multiline={true}/>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formSectionLabel}>
                  Tindakan Perbaikan
                </Text>
                <TextInput
                  style={styles.formTextAreaInput}
                  defaultValue={this.state.repairaction}
                  onChangeText={repairaction => this.setState({repairaction})}
                  numberOfLines={4}
                  multiline={true}/>
              </View>
            </View>
          </View>
        </Scroll>
        <TouchableOpacity
          style={styles.action}
          onPress={this._create}>
          <Spinner
            isVisible={this.state.isLoading}
            color={styles.actionText.color}>
            <Text style={styles.actionText}>
              Simpan
            </Text>
          </Spinner>
        </TouchableOpacity>
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
    backgroundColor: '#ffc107'
  },

  alertText: {
    color: '#fff'
  },

  content: {
    flex: 1
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

  formSectionLabel: {
    marginBottom: 6,
    color: 'rgba(0,0,0,.5)'
  },

  formFrame: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,.15)',
  },

  formSelectPicker: {
    marginTop: -18,
    marginBottom: -18,
    marginLeft: -16,
    marginRight: -16
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

  action: {
    height: 56,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  actionText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#3f51b5'
  }
});

export default FormCreate;