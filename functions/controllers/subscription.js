const rootRef = require("../firebase-admin").rootRef;
const subscriptionsRef = rootRef.child("subscriptions");

async function getSubscriptions() {
  try {
    const fbVal = await subscriptionsRef.once("value");
    const subscriptions = fbVal.val();
    
    const resultSubscriptions = [];
    for (let key in subscriptions) {
      const item = subscriptions[key];

      for (let itemKey in item) {
        resultSubscriptions.push({
          ...item[itemKey],
          id: itemKey,
        });
      }
    }

    return resultSubscriptions;
  } catch (error) {
    console.error("Error in addUserSubscription :", error);
  }
}

async function getSubscriptionByUserId(userId) {
  try {
    const fbVal = await subscriptionsRef.child(userId).once("value");
    const subscription = fbVal.val();

    let resultSubscription = null;
    for (let key in subscription) {
      resultSubscription = {
        ...subscription[key],
        id: key,
      };
    }

    return resultSubscription;
  } catch (error) {
    console.error("Error in getSubscriptionByUserId :", error);
  }
}

async function addUserSubscription(data) {
  try {  
    const subscription = await getSubscriptionByUserId(data.userId);

    if (subscription === null) {
      await subscriptionsRef.child(data.userId).push(data);
    } else {
      await subscriptionsRef.child(data.userId).child(subscription.id).update({
        token: data.token,
      });
    }
  } catch (error) {
    console.error("Error in addUserSubscription :", error);
  }
}

async function updateUserSubscription(data) {
  try {
    const { id } = await getSubscriptionByUserId(data.userId);
    return await subscriptionsRef.child(data.userId).child(id).update({
      token: data.token,
    });
  } catch (error) {
    console.error("Error in updateUserSubscription :", error);
  }
}

async function removeUserSubscription(data) {
  try {
    const { id } = await getSubscriptionByUserId(data.userId);
    return await subscriptionsRef.child(data.userId).child(id).remove();
  } catch (error) {
    console.error("Error in removeUserSubscription :", error);
  }
}

module.exports = {
  getSubscriptions,
  getSubscriptionByUserId,
  addUserSubscription,
  updateUserSubscription,
  removeUserSubscription
};
