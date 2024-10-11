const Accommodation = require("../models/Accommodation");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

const createAccommodation = async (req, res) => {
  console.log("Uploaded Files:", req.files);
  try {
    const imagePaths = req.files.map(file => file.path);

    const accommodation = new Accommodation({
      ...req.body,
      images: imagePaths
    });

    const savedAccommodation = await accommodation.save();
    res.status(201).json(savedAccommodation);
  } catch (error) {
    res.status(400).json({ message: "Accommodation creation failed", error });
  }
};

const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate('host');
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch accommodations", error });
  }
};

const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accommodation", error });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
` `

const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }
    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete accommodation", error });
  }
};

module.exports = { createAccommodation, getAccommodations, updateAccommodation, deleteAccommodation, upload, getAccommodationById };

