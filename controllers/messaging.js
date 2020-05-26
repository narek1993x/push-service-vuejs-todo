const admin = require("../firebase-admin").admin;

function createMessages(schedules, subscriptions) {
  const messages = [];
  schedules.forEach(schedule => {
    const subscription = subscriptions.find(s => s.userId === schedule.ownerId);

    Object.keys(subscription.deviceTokens).forEach(deviceToken => {
      messages.push({
        data: {
          name: schedule.name,
          content: schedule.content
        },
        token: subscription.deviceTokens[deviceToken]
      });
    });
  });

  return messages;
}

async function sendNotification(message) {
  try {
    await admin.messaging().send(message);
    console.log("Messages were sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = {
  sendNotification,
  createMessages
};
