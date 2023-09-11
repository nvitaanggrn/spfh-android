import React from 'react';
import {StyleSheet, ToastAndroid, Linking, View, FlatList, Text, TouchableOpacity} from 'react-native';
import * as Icon from 'react-native-feather';
import Context from './Context';
import Api from './util/api/Api';
import Spinner from './component/Spinner';

class Event extends React.PureComponent
{
  static contextType = Context;

  state = {
    page: 0,
    take: 20,
    data: [],
    isLoading: true,
    isMoreLoading: false,
    isFinishLoaded: false
  }

  colors = [
    '#0d6efd', '#0dcaf0', '#ffc107','#dc3545','#212529','#6c757d'
  ]

  _apiFetcher = null;
  _apiRequest = Api.createGetRequest('event/all', {withToken: true});

  componentDidMount(){
    setTimeout(this._loadData);
  }

  componentWillUnmount(){
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
          data: this._colorize(data),
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
        const newData = [...state.data, ...this._colorize(data)];
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

  _preview = async (item) => {
    const isSupported = await Linking.canOpenURL(item.link);
    if (isSupported) {
      await Linking.openURL(item.link);
    } else {
      ToastAndroid.show(item.link, ToastAndroid.SHORT);
    }
  }

  _colorize = (data) => {
    return data.map(item => {
      item.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      return item;
    })
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
              Traning Online
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
      <FlatList
        data={data}
        onRefresh={this._loadData}
        renderItem={this._renderItem}
        refreshing={this.state.isLoading}
        ListFooterComponent={this._renderMore()}/>
    );
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this._preview(item)}>
        <View style={[styles.itemDate, {backgroundColor: item.color}]}>
          <Text style={styles.itemDateMonthYear}>
            {item.schedule_date.month}
          </Text>
          <Text style={styles.itemDateDay}>
            {item.schedule_date.day}
          </Text>
          <Text style={styles.itemDateMonthYear}>
            {item.schedule_date.year}
          </Text>
          <Text style={styles.itemDateTime}>
            {item.schedule_date.time}
          </Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {item.title}
          </Text>
          <Text>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderMore = () => {
    return !this.state.isLoading && !this.state.isFinishLoaded && (
      <View style={styles.itemMore}>
        <TouchableOpacity
          style={styles.itemMoreButton}
          onPress={this.state.isMoreLoading ? null : this._loadMore}>
          <Spinner isVisible={this.state.isMoreLoading}>
            <Icon.ArrowDown width={20} height={20} stroke={styles.topbar.backgroundColor}/>
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
    marginBottom: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },

  itemDate: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffc107',
  },

  itemDateDay: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff'
  },

  itemDateMonthYear: {
    color: '#fff',
    textTransform: 'uppercase'
  },

  itemDateTime: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,.75)'
  },
  
  itemContent: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold'
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
  }
});

export default Event;