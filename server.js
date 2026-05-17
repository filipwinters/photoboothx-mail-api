import express from "express";

const app = express();

app.use(express.json({ limit: "15mb" }));

app.post("/send-photostrip", async (req, res) => {
  try {
    const { email, imageBase64 } = req.body;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Photobooth <onboarding@resend.dev>",
        to: [email],
        subject: "Je photobooth foto",
        html: "<p>Hier is je photobooth fotostrip.</p>",
        attachments: [
          {
            filename: "photostrip.jpg",
            content: imageBase64
          }
        ]
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000);