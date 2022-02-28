/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  Text,
} from 'react-native';

import {ExampleAppView} from './twitarr/components/example'
import {
  initBackgroundFetch,
  bootstrap,
  cancel
} from './twitarr/components/notifications'
import notifee, {EventType} from '@notifee/react-native';
import {MainView} from "./twitarr/components/Views/Main";

const App = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error);
    initBackgroundFetch();
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          console.log("CANCELING AT useEffect::EventType.PRESS")
          cancel(detail.notification.id)
          break;
      }
    });
  }, []);

  if (loading) {
    console.log("LOADING...")
    return <Text>LOADING...</Text>;
  }

  // return (<ExampleAppView/>);
  return (<MainView/>)
};

export default App;

import {AppRegistry} from 'react-native';
AppRegistry.registerComponent('tricorder', () => App);