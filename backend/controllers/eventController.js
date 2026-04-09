import Event from "../models/event.js";
import User from "../models/user.js";
import Ticket from "../models/ticket.js";
import { geoCode } from "../config/geoLocalisationConfig.js";
import jwtConfig from "../config/jwtConfig.js";
import { generateQrCode } from "../utils/generateQR.js";
import crypto from "crypto";
import { sendQrEmail } from "../utils/sendQrEmail.js";
//CREER UN EVENEMENT
export const createEvent = async (req, res) => {
  const { eventType, name, description, adress, date } = req.body;
  const { lat, lng, formatted } = await geoCode(adress);
  try {
    const event = await Event.create({
      eventType: eventType,
      name: name,
      description: description,
      adress: formatted,
      date: date,
      creator: req.user._id,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    return res.status(201).json({
      message: "Evenement crée avec succes",
      data: event,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
//MODIFIER EVENEMENT
export const updateEvent = async (req, res) => {
  const eventID = req.params.id;
  const { updates } = req.body;
  try {
    const event = await Event.findById(eventID);
    if (!event) return res.status(404).json({ message: "Event not found" });

    //Si adresse modifiée → recalcul géolocalisation
    if (updates?.adress) {
      const { lat, lng, formatted } = await geoCode(updates.adress);
      updates.adress = formatted;
      updates.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }
    //Mise à jour dynamique
    const updatedEvent = await Event.findByIdAndUpdate(
      eventID,
      { $set: updates },
      { new: true, runValidators: true },
    );
    return res.status(200).json({
      message: "evenement modfié avec succes",
      data: updatedEvent,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
//SUPPRIMER EVENEMENT
export const deleteEvent = async (req, res) => {
  const userID = req.user._id;
  const eventID = req.params.id;
  try {
    const event = await Event.findById(eventID);
    if (!event) return res.status(404).json({ message: "Event not found (_(" });
    const eventToDelete = await Event.findByIdAndDelete(eventID);
    return res
      .status(200)
      .json({ message: "Evenement supprimé avec succes", data: eventToDelete });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
//TROUVER EVENEMENTS PROCHES
export const nearbyEvents = async (req, res) => {
  const { lat, lng, km } = req.query;
  try {
    if (!lat || !lng || !km)
      return res.status(401).json({ message: "Identifiants manquants" });
    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(km) * 1000,
        },
      },
    });
    res.status(200).json({ events });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
//REJOINDRE UN EVENEMENT
export const joinEvents = async (req, res) => {
  const userID = req.user._id;
  const eventID = req.params.id || req.query.id;
  try {
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User not found" });
    const event = await Event.findById(eventID);
    if (!event) return res.status(404).json({ message: "Event not found" });
    // Vérifier si déjà inscrit
    if (user.eventsJoined.some((id) => id.equals(eventID)))
      return res.status(400).json({ message: "Déja inscrit" });
    // Ajouter event
    user.eventsJoined.push(eventID);
    await user.save();
    //Génerer l'id du ticket
    const ticketId = crypto.randomUUID();
    //Creer le ticket
    const ticket = await Ticket.create({
      ticketID: ticketId,
      userID: userID,
      eventID: eventID,
    });
    //Generer le qrcode
    const token = jwtConfig.generateTicketToken({
      userID,
      eventID,
      ticketId,
    });
    const QrCode = await generateQrCode(token);
    //Envoyez e-mail
    await sendQrEmail(user.email, QrCode, event.name, token);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return res.status(200).json({
      message: "Utilisateur inscrit",
      user: userObj,
      event: event,
      QrCode,
      ticket: ticket,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
//VOIR LES VISITEURS ATTENDUES
export const userAttendus = async (req, res) => {
  const eventID = req.params.id;
  try {
    const users = await User.find({ eventsJoined: eventID }).select(
      "-password -refreshToken",
    );
    return res.status(200).json({
      message: "Opération réussie",
      nombre_de_visiteurs_attendus: users.length,
      users,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
