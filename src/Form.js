import React from 'react';
import {StyleSheet, ToastAndroid, View, FlatList, Text, TouchableOpacity} from 'react-native';
import * as Icon from 'react-native-feather';
import Context from './Context';
import Api from './util/api/Api';
import Spinner from './component/Spinner';
import DateTime from './component/DateTime';

class Form extends React.PureComponent
{
  static contextType = Context;

  state = {
    page: 0,
    take: 20,
    data: [],
    deletes: {},
    isLoading: true,
    isMoreLoading: false,
    isFinishLoaded: false
  }

  _apiFetcher = null;
  _apiRequest = Api.createGetRequest('form/all', {withToken: true});
  _apiDeleteRequest = Api.createGetRequest('form/delete', {withToken: true});

  componentDidMount(){
    this.context.insert('form', this);
    setTimeout(this._loadData);
  }

  componentWillUnmount(){
    this.context.delete('form');
    this._apiFetcher && this._apiFetcher.cancel();
    this._apiFetcher = null;
  }
  
  _back = () => {
    const {navigation} = this.props;
    navigation.goBack();
  }
  
  _loadData = () => {
    this.setState(state => {
      this._apiFetcher = this._apiRequest.fetch().safeThen(({data}) => {
        this._apiFetcher = null;
        const isFinishLoaded = data.length < state.take;
        this.setState({
          data,
          page: 0,
          take: 20,
          isLoading: false,
          isMoreLoading: false,
          isFinishLoaded
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isLoading: false}, () => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
      });
      return {isLoading: true};
    });
  }

  _loadMore = () => {
    this.setState(state => {
      const data = {
        _page: state.page + 1,
        _take: state.take
      };
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(({data}) => {
        this._apiFetcher = null;
        let newPage = state.page;
        let newTake = state.take;
        const newData = [...state.data, ...data];
        const isFinishLoaded = data.length < state.take;
        if (!isFinishLoaded) newPage += 1;
        this.setState({
          data: newData,
          page: newPage,
          take: newTake,
          isMoreLoading: false,
          isFinishLoaded
        });
      }).catch(error => {
        this._apiFetcher = null;
        this.setState({isMoreLoading: false}, () => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
      });
      return {isMoreLoading: true};
    });
  }

  _create = () => {
    const {navigation} = this.props;
    navigation.navigate('form-create');
  }

  _preview = (item) => {
    const {navigation} = this.props;
    navigation.navigate('form-item', {item});
  }

  _delete = ({item, index}) => {
    this.setState(state => {
      const data = {
        id: item.id
      };
      this._apiFetcher = this._apiDeleteRequest.fetch({data}).safeThen(() => {
        this._apiFetcher = null;
        state.data.splice(index, 1);
        const newData = [...state.data];
        const deletes = {...state.deletes, [item.id]: false};
        this.setState({data: newData, deletes}, () => {
          ToastAndroid.show('Berhasil menghapus laporan.', ToastAndroid.SHORT);
        });
      }).catch(error => {
        this._apiFetcher = null;
        const deletes = {...state.deletes, [item.id]: false};
        this.setState({deletes}, () => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        });
      });
      const deletes = {...state.deletes, [item.id]: true};
      return {deletes}
    });
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
              Hiyarihatto
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          {this._renderList(data)}
        </View>
      </View>
    );
  }

  _renderList(data){
    return (
      <View
        style={{
          flex: 1,
          position: 'relative'
        }}>
        <FlatList
          data={data}
          style={{
            padding: 4
          }}
          onRefresh={this._loadData}
          renderItem={this._renderItem}
          refreshing={this.state.isLoading}
          ListFooterComponent={this._renderMore()}/>

        <TouchableOpacity
          style={styles.action}
          onPress={this._create}>
          <Icon.Plus stroke={styles.back.color}/>
        </TouchableOpacity>

      </View>
    );
  }

  _renderItem = ({item, index}) => {
    const user = this.context.get('user');
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => this._preview(item)}>
          <View style={styles.itemIcon}>
            <Icon.FileText width={48} height={48} stroke={styles.itemTitle.color}/>
          </View>
          <Text style={styles.itemTitle}>
            {item.group_name} / {item.location_name}
          </Text>
          <DateTime
            style={styles.itemDatetime}
            value={item.reported_at}/>
          <View style={styles.itemStatus}>
            <Text style={[
              styles.itemStatusText,
              styles.itemStatusTextes[item.form_status_id]
            ]}>
              {item.form_status_name}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.itemFooter}>
          <Text style={styles.itemUserName}>
            &rsaquo;&nbsp;&nbsp;&nbsp;{item.user_name}
          </Text>
          {item.form_status_id == 1 && user.id == item.user_id && (
            <TouchableOpacity onPress={() => this._delete({item, index})}>
              <Text style={styles.itemDeleteText}>
                Hapus
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!!this.state.deletes[item.id] && (
          <View
            style={styles.itemOverlay}>
            <Spinner isVisible={true}/>
            <Text style={styles.itemOverlayText}>
              Menghapus...
            </Text>
          </View>
        )}
      </View>
    );
  }

  _renderMore = () => {
    return !this.state.isLoading && !this.state.isFinishLoaded && (
      <View style={styles.itemMore}>
        <TouchableOpacity
          style={styles.itemMoreButton}
          onPress={this.state.isMoreLoading ? null : this._loadMore}>
          <Spinner isVisible={this.state.isMoreLoading}>
            <Icon.ArrowDown width={20} height={20} stroke={styles.action.backgroundColor}/>
          </Spinner>
          <Text style={styles.itemMoreButtonText}>
            Load More
          </Text>
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

  content: {
    flex: 1
  },

  item: {
    margin: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.09)',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden'
  },

  itemContent: {
    padding: 16
  },

  itemIcon: {
    padding: 16,
    alignItems: 'center'
  },

  itemTitle: {
    fontSize: 18,
    color: '#3f51b5',
    textAlign: 'center'
  },

  itemDatetime: {
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)'
  },

  itemStatus: {
    flex: 1,
    alignItems: 'center',
    marginTop: 8
  },

  itemStatusText: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.15)',
    borderRadius: 4,
    color: 'rgba(0,0,0,.5)'
  },

  itemStatusTextes: {
    4: {
      borderColor: '#0d6efd',
      color: '#0d6efd'
    },
    5: {
      borderColor: '#146c43',
      color: '#146c43'
    },
    6: {
      backgroundColor: '#146c43',
      borderColor: '#146c43',
      color: '#fff'
    }
  },

  itemFooter: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)'
  },

  itemUserName: {
    flex: 1,
    color: 'rgba(0,0,0,.5)'
  },

  itemDeleteText: {
    color: '#dc3545'
  },

  itemOverlay: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemOverlayText: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(0,0,0,.5)'
  },

  itemMore: {
    flex: 1,
    marginTop: 12,
    marginBottom: 24,
    justifyContent:'center',
    alignItems: 'center'
  },

  itemMoreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.15)',
    borderRadius: 8
  },

  itemMoreButtonText: {
    marginLeft: 8
  },

  action: {
    right: 12,
    bottom: 12,
    padding: 16,
    position: 'absolute',
    backgroundColor: '#3f51b5',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.09)',
    borderRadius: 50
  }
});

export default Form;