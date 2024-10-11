const express = require("express");
const { createAccommodation, getAccommodations, updateAccommodation, deleteAccommodation, upload, getAccommodationById } = require("../controllers/accommodationController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, upload.array('images', 10), createAccommodation); 

router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);

router.put("/:id", protect, upload.array('images', 10), updateAccommodation);


router.delete("/:id", protect, deleteAccommodation);

module.exports = router;