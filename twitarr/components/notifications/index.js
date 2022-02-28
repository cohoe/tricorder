import notifee, {EventType} from "@notifee/react-native";
import BackgroundFetch from "react-native-background-fetch";

console.log("Setting up background events...")
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

export async function initBackgroundFetch() {
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

// Bootstrap sequence function
export async function bootstrap() {
  console.log("BOOTSTRAPPING")
  const initialNotification = await notifee.getInitialNotification();

  if (initialNotification) {
    console.log('Notification caused application to open', initialNotification.notification);
    console.log('Press action used to open the app', initialNotification.pressAction);
    // console.log("POOP")
    // console.log(initialNotification)
    // console.log("POOP")
    console.log("CANCELING AT bootstrap::initialNotification")
    await cancel(initialNotification.notification.id)
  }
}

export async function cancel(notificationId) {
  await notifee.cancelNotification(notificationId);
}