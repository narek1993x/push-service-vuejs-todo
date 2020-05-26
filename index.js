const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const subscription = require("./controllers/subscription");
const timer = require("./controllers/timer");
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Connected"));

app.post("/save-subscription", async (req, res) => {
  const { refresh = false, ...otherData } = req.body;

  if (refresh) {
    await subscription.updateUserSubscription(otherData);
  } else {
    await subscription.addUserSubscription(otherData);
  }
  res.json({ message: "subscription saved success" });
});

app.post("/remove-subscription", async (req, res) => {
  await subscription.removeUserSubscription(req.body);
  res.json({ message: "subscription removed success" });
});

timer.notificationJob.start();

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) {
    timer.notificationJob.stop();
    throw err;
  }
  console.log(`Server listening on http://localhost:${port}/`)
});