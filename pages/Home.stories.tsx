import React from 'react';
import { Story, Meta } from '@storybook/react';

import Home from './Home';

export default {
    title: 'Pages/Home',
    component: Home,
} as Meta;

export const Variant1 = () => <Home />;
