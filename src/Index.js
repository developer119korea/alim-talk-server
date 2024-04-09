const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const sendMessage = async (req, res) => {
  const { templateCode, recipients } = req.body;

  try {
    const appKey = process.env.ALIMTALK_APP_KEY;
    const secretKey = process.env.ALIMTALK_SECRET_KEY;
    const senderKey = process.env.ALIMTALK_SENDER_KEY;

    if (recipients.length > 1000) {
      return res.status(400).send("Maximum number of recipients is 1000");
    }

    const payload = {
      senderKey,
      templateCode,
      recipientList: recipients.map((recipient) => {
        Object.keys(recipient.params || {}).forEach((key) => {
          if (recipient.params[key].length >= 14) {
            recipient.params[key] = recipient.params[key].slice(0, 11) + "...";
          }
        });

        return {
          recipientNo: recipient.phoneNumber.replace(/-/g, ""),
          templateParameter: recipient.params,
        };
      }),
    };

    const { data } = await axios.post(
      `https://api-alimtalk.cloud.toast.com/alimtalk/v2.3/appkeys/${appKey}/messages`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Secret-Key": secretKey,
        },
      }
    );

    const { header, message } = data;

    if (!header.isSuccessful) {
      throw new Error(`[${header.resultCode}] ${header.resultMessage}`);
    }

    message.sendResults.forEach((result) => {
      if (result.resultCode !== 0) {
        console.error(`[${result.resultCode}] ${result.resultMessage}`);
      }
    });

    res.status(200).json({ requestId: message.requestId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "An error occurred");
  }
};

app.post("/send-alimtalk", sendMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
