// setAdmin.js

const admin = require("firebase-admin");
const serviceAccount = require("./booking-system-b425d-firebase-adminsdk-fbsvc-f619254805"); // download this from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "S02zThgUvkeIw6XgoEkVD4tub3R2"; // 👈 replace with the actual UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully set admin role for UID: ${uid}`);
  })
  .catch((error) => {
    console.error("❌ Error setting admin role:", error);
  });
