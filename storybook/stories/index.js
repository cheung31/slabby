import React from 'react';
import { Text } from 'react-native';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// eslint-disable-next-line import/extensions
import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import CoverFlowView from "../../components/CoverFlowView";

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

let horizontalDefaults = CoverFlowView.horizontalDefaults;
storiesOf('CoverFlow', module)
  .addDecorator(withKnobs)
  .add('demo', () => <CoverFlowView
    spacing={number('spacing', 500)}
    wingSpan={number('wingSpan', 337.5)}
    rotation={number('rotation', 0)}
    midRotation={number('midRotation', 20)}
    scaleDown={number('scaleDown', 0.5)}
    scaleFurther={number('scaleFurther', 0.5)}
    perspective={number('perspective', 800)}
    initialSelection={number('initialSelection', 0)}
  />);

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));
