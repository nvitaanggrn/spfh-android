import React from 'react';
import {StyleSheet, ToastAndroid, Dimensions, View, Text, TouchableOpacity} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import RenderHtml from 'react-native-render-html';
import * as Icon from 'react-native-feather';
import Api from './util/api/Api';
import Scroll from './component/Scroll';
import Spinner from './component/Spinner';
import DateTime from './component/DateTime';

class NewsItem extends React.PureComponent
{
  state = {
    data: null
  }

  _apiFetcher = null;
  _apiRequest = Api.createGetRequest('news/item', {withToken: true});

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
    this._apiFetcher = null
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
              {!!data ? data.title : 'Artikel & Berita'}
            </Text>
            {!!data && (
              <Text style={styles.subtitleText}>
                {data.category_name} &middot; <DateTime value={data.created_at}/>
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
          <View
            style={styles.image}>
            <AutoHeightImage
              style={styles.image}
              width={styles.image.width}
              source={{uri: data.image_url}}/>
          </View>
          <View
            style={styles.htmlcontent}>
            <RenderHtml
              source={{html: data.content}}
              contentWidth={styles.image.width}
              tagsStyles={tagsStyles}/>
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

  image: {
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').width / 2,
    resizeMode: 'contain'
  },

  htmlcontent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  }
});

const tagsStyles = {
  body: {
    lineHeight: 21
  },

  p: {
    margin: 0,
    marginBottom: 8
  },
  
  blockquote: {
    margin: 0,
    marginBottom: 8,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,.25)'
  }
};

export default NewsItem;