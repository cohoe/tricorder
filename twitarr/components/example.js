import {Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from "react-native";
import {Colors, Header} from "react-native/Libraries/NewAppScreen";
import React from "react";
import notifee from "@notifee/react-native";
import {cancel} from "./notifications";

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

export const ExampleAppView = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'seamail',
      name: 'Seamail',
    });

    // Display a notification
    await notifee.displayNotification({
      id: 'abc123',
      title: 'Jonathan Coulton',
      body: 'This was a triumph. I\'m making a note here: HUGE SUCCESS. It\'s hard to overstate my satisfaction.',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        autoCancel: false,
        // https://notifee.app/react-native/docs/android/interaction
        pressAction: {
          id: 'default'
        }
      },
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header/>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            OH HERRO
            {'\n'}
            <Button title="Display Notification???" onPress={() => onDisplayNotification()}/>
            {'\n'}
            <Button title="Cancel" onPress={() => {
              console.log("CANCELING AT return::onPress")
              cancel('abc123');
            }}/>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}