import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Signin from './Signin';
import Signup from './Signup';
import Home from './Home';
import Form from './Form';
import FormItem from './FormItem';
import FormCreate from './FormCreate';
import Event from './Event';
import News from './News';
import NewsItem from './NewsItem';
import Feedback from './Feedback';
import Profile from './Profile';

const Stack = createNativeStackNavigator();

class Navigator extends React.PureComponent
{
  render(){
    const {route} = this.props;
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={route}
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen
            name='home'
            component={Home}/>
          <Stack.Screen
            name='form'
            component={Form}/>
          <Stack.Screen
            name='form-item'
            component={FormItem}/>
          <Stack.Screen
            name='form-create'
            component={FormCreate}/>
          <Stack.Screen
            name='event'
            component={Event}/>
          <Stack.Screen
            name='news'
            component={News}/>
          <Stack.Screen
            name='news-item'
            component={NewsItem}/>
          <Stack.Screen
            name='feedback'
            component={Feedback}/>
          <Stack.Screen
            name='profile'
            component={Profile}/>
          <Stack.Screen
            name='signin'
            component={Signin}/>
          <Stack.Screen
            name='signup'
            component={Signup}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;