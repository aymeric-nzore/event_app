import Event from "../models/event.js";

// Vérifier que l'utilisateur authentifié est le créateur de l'événement.
export const creator = async (req, res, next) => {
  const eventID = req.params.id || req.body.eventID || req.query.id;
  const userID = req.user._id;

  try {
    if (!eventID) {
      return res.status(400).json({ message: "eventID manquant" });
    }

    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.creator || !event.creator.equals(userID)) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
