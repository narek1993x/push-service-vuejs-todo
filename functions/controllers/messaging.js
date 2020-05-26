const admin = require("../firebase-admin").admin;

async function sendNotification(message) {
  try {
    const response = await admin.messaging().send(message);
    console.log('Messages were sent successfully');
    
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = {
  sendNotification
}