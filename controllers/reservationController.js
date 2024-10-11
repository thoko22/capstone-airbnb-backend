const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const { 
      accommodation: accommodationId, 
      checkIn, 
      checkOut, 
      guests, 
      totalPrice // Accept totalPrice directly from the request body
    } = req.body;

    // Validate that required fields are present
    if (!accommodationId || !checkIn || !checkOut || !guests || !totalPrice) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found." });
    }

    // Check that number of guests is valid
    if (guests <= 0) {
      return res.status(400).json({ message: "Number of guests must be greater than 0." });
    }

    const reservationData = {
      accommodation: accommodationId,
      user: req.user._id,
      name: req.body.name,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    };

    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    console.error("Error creating reservation:", error); // Log the error details
    res.status(400).json({ message: "Reservation creation failed", error: error.message });
  }
};

// Get reservations by host (host refers to accommodation owner)
const getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate({
        path: "accommodation",
        match: { host: req.user._id },
      })
      .exec();

    // Filter out reservations where the accommodation did not match (i.e., host is not the same)
    const filteredReservations = reservations.filter(reservation => reservation.accommodation !== null);

    res.status(200).json(filteredReservations);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch reservations by host", error });
  }
};


// Get reservations by user
const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("accommodation", "title") // Populate only the title field
      .populate("user", "name"); // Optional: If you have a user field in Reservation

    if (reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found for the user" });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch reservations by user", error });
  }
};

// Delete a reservation by ID
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete reservation", error });
  }
};

module.exports = { createReservation, getReservationsByHost, getReservationsByUser, deleteReservation };
