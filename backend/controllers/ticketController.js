import Ticket from "../models/ticket.js";
import QRCode from "qrcode";

//Scanner le ticket de l'evenement
export const scanTicket = async (req, res) => {
  const ticketID = req.body.ticketID || req.params.id;
  try {
    if (!ticketID) {
      return res.status(400).json({ message: "ticketID manquant" });
    }

    const ticket = await Ticket.findById(ticketID);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.used === true)
      return res.status(400).json({ message: "Ticket déja utilisé" });
    ticket.used = true;
    await ticket.save();

    return res.status(200).json({ message: "Ticket validé", ticket });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Route publique pour générer et afficher le QR code directement sous forme d'image (pour les emails)
export const renderQrCode = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) return res.status(400).send("Token manquant");
    
    const qrBuffer = await QRCode.toBuffer(token, {
      errorCorrectionLevel: "H",
      type: "png",
      margin: 1,
      width: 360,
      color: {
        dark: "#143D2F",
        light: "#F5FAF7",
      },
    });
    
    res.type("png");
    res.send(qrBuffer);
  } catch (e) {
    res.status(500).send("Erreur lors de la génération du QR code");
  }
};
