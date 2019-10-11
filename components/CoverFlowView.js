import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import Coverflow from 'react-native-coverflow';

let items = [];
for (let i = 1; i <= 20; i++) {
  items.push(`Card ${i}`);
}

let CARD_SIZE = 612;

function Item(props) {
  let { itemSize, isHorizontal } = props;
  return (
    <View style={{
      width: itemSize,
      height: itemSize,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#CCC',
      borderWidth: 2,
      borderColor: '#fff',
      transform: [{ rotate: isHorizontal ? '0deg' : '-90deg' }]
    }}>
      <Text>{props.children}</Text>
    </View>
  );
}

function CoverFlowView(props) {
  let { width, height } = Dimensions.get('window');
  let isHorizontal = true;
  if (height > width) {
    isHorizontal = false;
  }
  let targetSize = CARD_SIZE || props.itemSize;
  let itemSize = !isHorizontal ? Math.min(width, targetSize) : Math.min(height, targetSize);

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
        onChange={(index) => console.log('Current item', index)}
        {...props}
      >
        {items.map(i => <Item key={i} itemSize={itemSize} isHorizontal={isHorizontal}>{i}</Item>)}
      </Coverflow>
    </View>
  );
}

CoverFlowView.horizontalDefaults = {
  spacing: 500,
  wingSpan: 337.5,
  rotation: 0,
  midRotation: 20,
  scaleDown: 0.5,
  scaleFurther: 0.5,
  perspective: 800,
  initialSelection: 0,
};

export default CoverFlowView;
