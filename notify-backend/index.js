const express = require("express");
const cors = require("cors");
const { db, messaging } = require("./firebaseadmin");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/notify-all", async (req, res) => {
  try {
    const { title, body } = req.body;

    // ✅ Only users who have tokens
    const snap = await db
      .collection("users")
      .get();
    console.log(snap);
    if (snap.empty) {
      return res.json({ message: "No users with tokens" });
    }

    const tokens = [];
    snap.forEach(doc => {
      const { fcmTokens } = doc.data();
      if (fcmTokens) {
        tokens.push(...Object.keys(fcmTokens));
      }
    });

    if (tokens.length === 0) {
      return res.json({ message: "No tokens found" });
    }

    // 🔔 FCM limit = 500 tokens per request
    const chunks = [];
    while (tokens.length) {
      chunks.push(tokens.splice(0, 500));
    }

    let success = 0;
    let failed = 0;

    for (const batch of chunks) {
      const response = await messaging.sendEachForMulticast({
        notification: { title, body },
        tokens: batch,
      });
      console.log(JSON.stringify(response, null, 2))
      success += response.successCount;
      failed += response.failureCount;
    }

    res.json({ success: true, sent: success, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Notification failed" });
  }
});
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
