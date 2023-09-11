import React from 'react';
import {Text} from 'react-native';
import moment from 'moment-timezone';

class DateTime extends React.PureComponent
{
  render(){
    const {value, ...props} = this.props;
    const formated = moment.utc(value).tz('Asia/Jakarta').format('D MMM Y HH:mm');
    return (
      <Text {...props} children={formated}/>
    );
  }
}

export default DateTime;