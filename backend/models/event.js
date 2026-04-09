import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["Concert", "Other", "Evangelisation"],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    adress: { type: String, required: true },
    date: { type: Date, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true },
);
eventSchema.index({ location: "2dsphere" });
export default mongoose.model("Event", eventSchema);
