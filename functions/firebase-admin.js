const admin = require("firebase-admin");

const serviceAccount = require("./config/firebase.account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vuejs-todo-list-297d2.firebaseio.com",
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const rootRef = admin.database().ref();

module.exports = {
  rootRef,
  admin,
};
