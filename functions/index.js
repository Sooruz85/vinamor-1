const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Initialisation unique de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://padelmate-3f83e.firebaseio.com" // Remplace par ton URL Firestore
});

// ✅ Fonction Firestore pour envoyer une notification après une réservation
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

      try {
        await admin.messaging().sendToTopic("reservations", payload);
        console.log("Notification envoyée !");
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
      }
    });
