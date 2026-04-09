import Ticket from "../models/ticket.js";

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
