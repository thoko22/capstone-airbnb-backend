const express = require("express");
const { createReservation, getReservationsByHost, getReservationsByUser, getAllReservations, deleteReservation } = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, createReservation);
router.get("/host", protect, getReservationsByHost);
router.get("/user", protect, getReservationsByUser);
router.get("/", protect, getAllReservations);
router.delete("/:id", protect, deleteReservation);

module.exports = router;

