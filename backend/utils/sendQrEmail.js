export const sendQrEmail = async (email, qr, eventName) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY manquante dans .env");
      throw new Error("Configuration email manquante");
    }

    if (!process.env.BREVO_FROM_EMAIL) {
      console.error("BREVO_FROM_EMAIL manquante dans .env");
      throw new Error("Configuration expediteur email manquante");
    }

    const payload = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: [{ email }],
      subject: `Ticket d'entrée pour l'évenement ${eventName}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Votre ticket pour ${eventName}</h2>
            <p>Voici votre code QR. Présentez-le à l'entrée de l'évenement.</p>
            <img src="data:image/png;base64,${qr}" alt="Ticket QR" style="max-width: 400px; margin: 20px 0;" />
            <p style="color: #00ff00; font-size: 12px;">Ticket valide</p>
          </body>
        </html>
      `,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Erreur Brevo:", detail);
      throw new Error(`Erreur envoi email: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email OTP envoye avec succes (Brevo):", result?.messageId);
    return result;
  } catch (e) {
    console.error("sendQrEmail error:", e.message);
    throw e;
  }
};
