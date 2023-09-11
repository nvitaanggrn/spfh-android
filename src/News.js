import React from 'react';
import {StyleSheet, ToastAndroid, Dimensions, View, FlatList, Text, Image, TouchableOpacity, TextInput} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import * as Icon from 'react-native-feather';
import Context from './Context';
import Api from './util/api/Api';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';
import DateTime from './component/DateTime';

class News extends React.PureComponent
{
  static contextType = Context;

  state = {
    page: 0,
    take: 20,
    data: [],
    params: {},
    search: '',
    category: '',
    isLoading: true,
    isMoreLoading: false,
    isFinishLoaded: false
  }

  colors = [
    '#0d6efd', '#0dcaf0', '#ffc107','#dc3545','#212529','#6c757d'
  ]

  _apiFetcher = null;
  _apiRequest = Api.createGetRequest('news/all', {withToken: true});

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
      const data = state.params;
      this._apiFetcher = this._apiRequest.fetch({data}).safeThen(({data}) => {
        this._apiFetcher = null;
        const isFinishLoaded = data.length < state.take;
        this.setState({
          data,
          page: 0,
          take: 20,
          category: data.length > 0 && state.params.category ? data[0].category_name : '',
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

  _filter = (params) => {
    params = {...this.state.params, ...params};
    this.setState({params}, this._loadData);
  }

  _preview = (item) => {
    const {navigation} = this.props;
    navigation.navigate('news-item', {item});
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
              Artikel &amp; Berita
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
        ListHeaderComponent={this._renderTags()}
        ListFooterComponent={this._renderMore()}/>
    );
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this._preview(item)}>
        <View
          style={styles.itemImage}>
          <AutoHeightImage
            style={styles.itemImage}
            width={styles.itemImage.width}
            source={{uri: item.image_url}}/>
        </View>
        <Text style={styles.itemDetail}>
          <Text style={styles.itemDetailCategory}>{item.category_name}</Text> &middot; <DateTime value={item.created_at}/>
        </Text>
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

  _renderTags = () => {
    return (
      <View>
        <View
            style={styles.itemSearch}>
          <TextInput
            style={styles.itemSearchInput}
            defaultValue={this.state.search}
            onChangeText={search => this.setState({search})}
            placeholder='Search...'/>
          <TouchableOpacity
            onPress={() => this._filter({search: this.state.search})}
            style={styles.itemSearchButton}>
            <Icon.Search width={16} height={16} stroke='#3f51b5'/>
          </TouchableOpacity>
        </View>
        <Scroll
          style={styles.itemTags}
          horizontal={true}>
          <TouchableOpacity
            onPress={() => this._filter({category: null})}
            style={[styles.itemTagsButton, {borderColor: '#0d6efd'}]}>
            <Icon.Tag width={16} height={16} stroke='#0d6efd'/>
            <Text style={styles.itemTagsButtonText}>
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._filter({category: 1})}
            style={[styles.itemTagsButton, {borderColor: '#dc3545'}]}>
            <Icon.Tag width={16} height={16} stroke='#dc3545'/>
            <Text style={styles.itemTagsButtonText}>
              Dasar Safety 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._filter({category: 2})}
            style={[styles.itemTagsButton, {borderColor: '#198754'}]}>
            <Icon.Tag width={16} height={16} stroke='#198754'/>
            <Text style={styles.itemTagsButtonText}>
              Obat-Obatan 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._filter({category: 3})}
            style={[styles.itemTagsButton, {borderColor: '#ffc107'}]}>
            <Icon.Tag width={16} height={16} stroke='#ffc107'/>
            <Text style={styles.itemTagsButtonText}>
              Alat Safety 
            </Text>
          </TouchableOpacity>
        </Scroll>
        {!!this.state.category && (
          <Text style={styles.itemTag}>
            {this.state.category}
          </Text>
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,.09)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  itemImage: {
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').width / 2,
    resizeMode: 'contain'
  },

  itemDetail: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 4,
    fontSize: 12,
    color: 'rgba(0,0,0,.5)'
  },

  itemDetailCategory: {
    color: '#000'
  },
  
  itemContent: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16
  },

  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4
  },

  itemTag: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  itemSearch: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.09)'
  },

  itemSearchInput: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    color: '#000'
  },

  itemSearchButton: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center'
  },

  itemTags: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row'
  },

  itemTagsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 4,
    marginRight: 4,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1
  },
  itemTagsButtonText: {
    marginLeft: 8
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

export default News;