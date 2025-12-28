importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:  "AIzaSyA39G7ZiwPWBzut5nbDIYJ_rMD03e83CRY",
  authDomain: "event-hopper-e1f5a.firebaseapp.com",
  projectId: "event-hopper-e1f5a",
   messagingSenderId: "501245749236",
  appId:"1:501245749236:web:ee561490b59f623068bba1",
 


});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
