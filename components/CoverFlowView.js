import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Coverflow from 'react-native-coverflow';

let items = [];
for (let i = 1; i <= 20; i++) {
  items.push(`Card ${i}`);
}

let CARD_SIZE = 612;

function Item(props) {
  return (
    <View style={{
      width: CARD_SIZE,
      height: CARD_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'red',
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: 10
    }}>
      <Text>{props.children}</Text>
    </View>
  );
}

function CoverFlowView(props) {
  let { width, height } = Dimensions.get('window');
  let isHorizontal = true;
  /*
  if (height > width) {
    isHorizontal = false;
  }
  */

  return (
    <View style={{
      flex: 1,
      transform: [{ rotate: isHorizontal ? '0deg' : '90deg' }]
    }}>
      <Coverflow
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        spacing={CARD_SIZE * .3}
        onChange={(index) => console.log('Current item', index)}
        {...props}
      >
        {items.map(i => <Item key={i}>{i}</Item>)}
      </Coverflow>
    </View>
  );
}

export default CoverFlowView;
