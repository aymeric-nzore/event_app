import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
  ticketID: String,
  userID: String,
  eventID: String,
  used: { type: Boolean, default: false },
});
export default mongoose.model("Ticket", ticketSchema);
