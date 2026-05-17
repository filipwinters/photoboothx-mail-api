export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, imageBase64 } = req.body;

    if (!email || !imageBase64) {
      return res.status(400).json({ error: "Missing email or image" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "PhotoBoothX <mail@photoboothx.app>",
        to: [email],
        subject: "Je PhotoBoothX fotostrip!",
        html: "<p>Hier is je PhotoBoothX fotostrip.</p>",
        attachments: [
        {
          filename: "photostrip.jpg",
          content: imageBase64,
          contentType: "image/jpeg"
        }
]
      })
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
