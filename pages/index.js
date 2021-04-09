// @generated: @expo/next-adapter@2.1.5
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Spinner } from '@ui-kitten/components';
import { default as theme } from './theme.json';
import { default as mapping } from './mapping.json';
import OpenSansRegular from './OpenSans-Regular.ttf';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          OpenSansRegular: {
            uri: OpenSansRegular,
            fontDisplay: Font.FontDisplay.SWAP
          }
        });
      } catch ({ message }) {
        // This will be called if something is broken
        console.log(`Error loading font: ${message}`);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }} customMapping={mapping}>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!loaded ? <Spinner size='giant'/> :
          <Text category='h1'>Welcome to Expo + Next.js 👋</Text>
        }
      </Layout>
    </ApplicationProvider>
  )
}
