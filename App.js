/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import notifee, {EventType} from '@notifee/react-native';

import BackgroundFetch from "react-native-background-fetch";

const Section = ({children, title}): Node => {
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

notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;

    console.log('WE GOT AN EVENT THING');
    console.log(type);
    console.log(detail);
    console.log('END EVENT THINGY');

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
        // Update external API
        // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
        //     method: 'POST',
        // });

        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }

    if (type === EventType.PRESS) {
        await notifee.cancelNotification(notification.id);
    }
});

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [loading, setLoading] = useState(true);

    // Bootstrap sequence function
    async function bootstrap() {
        console.log("BOOTSTRAPPING")
        const initialNotification = await notifee.getInitialNotification();

        if (initialNotification) {
            console.log('Notification caused application to open', initialNotification.notification);
            console.log('Press action used to open the app', initialNotification.pressAction);
            // console.log("POOP")
            // console.log(initialNotification)
            // console.log("POOP")
            console.log("CANCELING AT bootstrap::initialNotification")
            cancel(initialNotification.notification.id)
        }
    }

    // function componentDidMount() {
    //     // Initialize BackgroundFetch ONLY ONCE when component mounts.
    //     initBackgroundFetch();
    //     console.log("Background Init'd")
    // }

    async function initBackgroundFetch() {
        // BackgroundFetch event handler.
        const onEvent = async (taskId) => {
            console.log('[BackgroundFetch] task: ', taskId);
            // Do your background work...
            // await this.addEvent(taskId);
            await onDisplayNotification()
            // IMPORTANT:  You must signal to the OS that your task is complete.
            BackgroundFetch.finish(taskId);
        }

        // Timeout callback is executed when your Task has exceeded its allowed running-time.
        // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
        const onTimeout = async (taskId) => {
            console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
            BackgroundFetch.finish(taskId);
        }

        // Initialize BackgroundFetch only once when component mounts.
        let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

        console.log('[BackgroundFetch] configure status: ', status);
    }


    useEffect(() => {
        bootstrap()
            .then(() => setLoading(false))
            .catch(console.error);
        initBackgroundFetch();
    }, []);

    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
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
            // cancel(detail.notification.id)
        });
    }, []);

    if (loading) {
        console.log("LOADING...")
        return <Text>LOADING...</Text>;
    }

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    async function cancel(notificationId) {
        await notifee.cancelNotification(notificationId);
    }

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
    );
};

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

export default App;

import { AppRegistry } from 'react-native';
AppRegistry.registerComponent('tricorder', () => App);