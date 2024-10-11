const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  bedrooms: { type: Number, required: true, min: 1 },
  bathrooms: { type: Number, required: true, min: 1 },
  guests: { type: Number, required: true, min: 1 },
  amenities: { type: [String], required: true },
  images: { type: [String] },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  weeklyDiscount: { type: Number, default: 0, min: 0 },
  cleaningFee: { type: Number, default: 0, min: 0 }, 
  serviceFee: { type: Number, default: 0, min: 0 },     
  occupancyTaxes: { type: Number, default: 0, min: 0 },
});

const Accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = Accommodation;  
