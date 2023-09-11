import React from 'react';
import {ActivityIndicator} from 'react-native';

class Spinner extends React.PureComponent
{
  static defaultProps = {
    isVisible: true
  };

  render(){
    const {isVisible, children = null, ...props} = this.props;
    return isVisible ?
      <ActivityIndicator size='small' {...props}/> :
      children;
  }
}

export default Spinner;