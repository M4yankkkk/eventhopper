import { onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";

admin.initializeApp();

export const notifyAllUsers = onCall(async (request) => {

  // 🔐 THIS AUTH CHECK IS FOR THE SENDER, NOT RECEIVERS
  if (!request.auth) {
    throw new Error("Unauthenticated");
  }

  const event = request.data.event;

  const snap = await admin.firestore().collection("users").get();

  const tokens = [];

  snap.forEach(doc => {
    const fcmTokens = doc.data().fcmTokens || {};
    tokens.push(...Object.keys(fcmTokens));
  });

  if (tokens.length === 0) {
    return { sent: 0 };
  }

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title: "New Event 🎉",
      body: `${event.clubName} starting at ${event.start_time} at ${event.location}`,
    },
  });

  return { sent: tokens.length };
});
