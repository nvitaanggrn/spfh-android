import React from 'react';
import {ScrollView} from 'react-native';

class Scroll extends React.PureComponent
{
  render(){
    const {contentContainerStyle, ...props} = this.props;
    return (
      <ScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          ...contentContainerStyle,
          flexGrow: 1
        }}/>
    );
  }
}

export default Scroll;