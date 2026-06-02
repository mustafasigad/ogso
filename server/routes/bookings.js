const router = require("express").Router();
const Booking = require("../models/Booking");

const sendWhatsApp = async (to, message) => {
  try {
    const twilio = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await twilio.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });
    return true;
  } catch (err) {
    console.error("WhatsApp error:", err.message);
    return false;
  }
};

router.post("/", async (req, res) => {
  try {
    const ci = new Date(req.body.checkIn);
    const co = new Date(req.body.checkOut);
    const nights = Math.ceil((co - ci) / 86400000) || 1;
    const totalPrice = req.body.pricePerNight * nights;
    const booking = await Booking.create({
      roomType: req.body.roomType,
      roomName: req.body.roomName,
      pricePerNight: req.body.pricePerNight,
      totalPrice, nights,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      guestName: req.body.guestName,
      guestPhone: req.body.guestPhone,
      notes: req.body.notes || "",
      paymentMethod: req.body.paymentMethod || "cash",
    });

    const guestMsg = 
      `Ogso Booking Confirmed!\n\n` +
      `Reference: ${booking.ref}\n` +
      `Room: ${req.body.roomName}\n` +
      `Check-in: ${new Date(req.body.checkIn).toDateString()}\n` +
      `Check-out: ${new Date(req.body.checkOut).toDateString()}\n` +
      `Nights: ${nights}\n` +
      `Total: ETB ${totalPrice.toLocaleString()}\n` +
      `Payment: ${req.body.paymentMethod}\n\n` +
      `Every business, verified. - ogso.app`;

    await sendWhatsApp(req.body.guestPhone, guestMsg);

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