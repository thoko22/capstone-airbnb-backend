const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation", // Reference to the Accommodation model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User making the reservation
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;

