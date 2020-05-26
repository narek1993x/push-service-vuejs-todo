const _get = require("lodash/get");
const _pick = require("lodash/pick");
const _keys = require("lodash/keys");
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
          id: itemKey
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
        id: key
      };
    }

    return resultSubscription;
  } catch (error) {
    console.error("Error in getSubscriptionByUserId :", error);
  }
}

async function addUserSubscription({ token, deviceInfo, ...data }) {
  try {
    const subscription = await getSubscriptionByUserId(data.userId);
    const os = _get(deviceInfo, "os", { name: "default" });
    const browser = _get(deviceInfo, "browser", { name: "default" });

    if (subscription === null) {
      await subscriptionsRef.child(data.userId).push({
        ...data,
        deviceTokens: {
          [`${os.name}-${browser.name}`]: token
        }
      });
    } else {
      const deviceTokens = _get(subscription, "deviceTokens", {});

      await subscriptionsRef
        .child(data.userId)
        .child(subscription.id)
        .update({
          deviceTokens: {
            ...deviceTokens,
            [`${os.name}-${browser.name}`]: token
          }
        });
    }
  } catch (error) {
    console.error("Error in addUserSubscription :", error);
  }
}

async function updateUserSubscription({ token, deviceInfo, ...data }) {
  try {
    const subscription = await getSubscriptionByUserId(data.userId);
    const deviceTokens = _get(subscription, "deviceTokens", {});
    const os = _get(deviceInfo, "os", { name: "default" });
    const browser = _get(deviceInfo, "browser", { name: "default" });

    return await subscriptionsRef
      .child(data.userId)
      .child(subscription.id)
      .update({
        deviceTokens: {
          ...deviceTokens,
          [`${os.name}-${browser.name}`]: token
        }
      });
  } catch (error) {
    console.error("Error in updateUserSubscription :", error);
  }
}

async function removeUserSubscription({ deviceInfo, userId }) {
  try {
    const subscription = await getSubscriptionByUserId(userId);
    const deviceTokens = _get(subscription, "deviceTokens", {});
    const os = _get(deviceInfo, "os", { name: "default" });
    const browser = _get(deviceInfo, "browser", { name: "default" });

    if (_keys(deviceTokens).length > 1) {
      const newDeviceTokens = _pick(
        deviceTokens,
        _keys(deviceTokens).filter(key => key !== `${os.name}-${browser.name}`)
      );

      return await subscriptionsRef
        .child(userId)
        .child(subscription.id)
        .update({
          deviceTokens: newDeviceTokens
        });
    }

    return await subscriptionsRef
      .child(userId)
      .child(subscription.id)
      .remove();
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
