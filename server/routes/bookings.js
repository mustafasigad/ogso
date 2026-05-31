const router = require("express").Router();
const Booking = require("../models/Booking");

router.post("/", async (req, res) => {
  try {
    const ci = new Date(req.body.checkIn);
    const co = new Date(req.body.checkOut);
    const nights = Math.ceil((co - ci) / 86400000) || 1;
    const totalPrice = req.body.pricePerNight * nights;
    const booking = await Booking.create({
      roomType:      req.body.roomType,
      roomName:      req.body.roomName,
      pricePerNight: req.body.pricePerNight,
      totalPrice,
      nights,
      checkIn:       req.body.checkIn,
      checkOut:      req.body.checkOut,
      guests:        req.body.guests,
      guestName:     req.body.guestName,
      guestPhone:    req.body.guestPhone,
      notes:         req.body.notes || "",
      paymentMethod: req.body.paymentMethod || "cash",
    });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;