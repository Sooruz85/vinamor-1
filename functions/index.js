/* eslint-disable no-unused-vars */
const admin = require("firebase-admin"); // 🔥 Import Firebase Admin SDK
const functions = require("firebase-functions"); // 🔥 Import Firebase Functions SDK


admin.initializeApp(); // 🔥 Initialise Firebase Admin

const serviceAccount = require("./serviceAccountKey.json"); // 🔥 Assure-toi d'avoir ce fichier

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://padelmate-3f83e.firebaseio.com", // 🔥 Remplace par ton URL Firestore
});


exports.sendNotificationOnReservation = functions.firestore
    .document("reservations/{reservationId}")
    .onCreate(async (snap, context) => {
      const reservation = snap.data();
      const payload = {
        notification: {
          title: "Nouvelle Réservation",
          body: `Une visite a été réservée par ${reservation.client}.`,
        },
      };

      // Envoyer la notification
      return admin.messaging().sendToTopic("reservations", payload);
    });
