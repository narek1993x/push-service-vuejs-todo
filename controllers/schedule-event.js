const rootRef = require("../firebase-admin").rootRef;

async function getScheduleList() {
  try {
    const scheduleEventsRef = rootRef.child("scheduleEvents");

    const fbVal = await scheduleEventsRef.once("value");
    const scheduleEvents = fbVal.val();

    const resultScheduleEvents = [];
    for (let key in scheduleEvents) {
      const item = scheduleEvents[key];

      for (let itemKey in item) {
        resultScheduleEvents.push({
          ...item[itemKey],
          id: itemKey
        });
      }
    }

    return resultScheduleEvents;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getScheduleList
};
