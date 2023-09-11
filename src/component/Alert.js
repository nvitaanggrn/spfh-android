import React from 'react';
import {View} from 'react-native';

class Alert extends React.PureComponent
{
  static defaultProps = {
    isVisible: true
  };

  render(){
    const {isVisible, ...props} = this.props;
    return !!isVisible && <View {...props}/>;
  }
}

export default Alert;