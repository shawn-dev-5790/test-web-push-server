const express = require("express");
const path = require("path");
const WP = require("web-push");
const BP = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

let memoSubscription = null;

// Set static folder
app.use(express.static(path.join(__dirname, "client")));

// Body Parser Middleware
app.use(BP.json());
app.use(cors());
app.use(morgan("dev"));

// VAPID keys should be generated only once
// console.log(WP.generateVAPIDKeys());
const key = {
  publicVapidKey:
    "BJWgvm5Oy1hQzoa2R_sOVzx6dijb7Cw_cYfJeAkoj7UNLyv03hRemh4oOxR2ywAHPP7m1DvTWDhpzpBIweknqQc",
  privateVapidKey: "LLDNyFILLXkHhUr2uT3gBTr0KzuK4NADry-sIyTzzN8",
};
console.log(key);

WP.setVapidDetails(
  "mailto:your-email@example.com",
  key.publicVapidKey,
  key.privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  memoSubscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "from server : Push Test" });

  // Pass object into sendNotification
  WP.sendNotification(subscription, payload).catch((err) => console.error(err));
});

app.get("/send", (req, res) => {
  if (!memoSubscription)
    return res.status(400).json({ msg: "Subscription not found" });

  const payload = JSON.stringify({
    title: "New Notification",
    body: "This is a push notification sent from the server.",
  });

  // Send push notification to client
  WP.sendNotification(memoSubscription, payload)
    .then(() => {
      res.status(200).send("Notification sent successfully.");
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).send("Failed to send notification.");
    });
});

app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
