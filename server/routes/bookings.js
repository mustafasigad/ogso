const router = require("express").Router();
const Booking = require("../models/Booking");
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = process.env.TWILIO_WHATSAPP_FROM;

async function sendWA(to, msg) {
  try {
    if (!to || !FROM) return;
    const phone = to.replace(/[^0-9+]/g, "");
    if (phone.length < 7) return;
    await client.messages.create({
      from: FROM,
      to: `whatsapp:${phone.startsWith("+") ? phone : "+" + phone}`,
      body: msg,
    });
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
}

// GET all bookings
router.get("/my", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
    res.json(bookings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single booking by ref (for confirm page)
router.get("/ref/:ref", async (req, res) => {
  try {
    const booking = await Booking.findOne({ ref: req.params.ref.toUpperCase() });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const ref = Math.random().toString(36).substr(2, 8).toUpperCase();
    const nights = req.body.checkIn && req.body.checkOut
      ? Math.max(1, Math.ceil((new Date(req.body.checkOut) - new Date(req.body.checkIn)) / 86400000))
      : 1;
    const totalPrice = (req.body.pricePerNight || 0) * nights;
    const confirmUrl = `${process.env.CLIENT_URL}/confirm/${ref}`;

    const booking = await Booking.create({
      ref,
      businessId: req.body.businessId || req.body.hotelId,
      hotelName: req.body.hotelName,
      hotelPhone: req.body.hotelPhone,
      roomType: req.body.roomType,
      roomName: req.body.roomName,
      pricePerNight: req.body.pricePerNight,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      nights,
      guests: req.body.guests,
      guestName: req.body.guestName,
      guestPhone: req.body.guestPhone,
      notes: req.body.notes,
      paymentMethod: req.body.paymentMethod,
      totalPrice,
      status: "pending",
    });

    // WhatsApp to guest
    await sendWA(req.body.guestPhone,
      `âœ… Booking received on Ogso!\n\nRef: *${ref}*\nHotel: ${req.body.hotelName}\nRoom: ${req.body.roomName}\nCheck-in: ${req.body.checkIn}\nTotal: ETB ${totalPrice.toLocaleString()}\n\nThe hotel will confirm within 2 hours. We will notify you!`
    );

    // WhatsApp to hotel
    await sendWA(req.body.hotelPhone,
      `ðŸ¨ New booking on Ogso!\n\nGuest: *${req.body.guestName}*\nRoom: ${req.body.roomName}\nCheck-in: ${req.body.checkIn}\nNights: ${nights}\nTotal: ETB ${totalPrice.toLocaleString()}\nGuest phone: ${req.body.guestPhone}\n\nTap to confirm or cancel:\n${confirmUrl}`
    );

    res.status(201).json({ booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH confirm or cancel by ref
router.patch("/ref/:ref/status", async (req, res) => {
  try {
    const { status } = req.body; // "confirmed" or "cancelled"
    const booking = await Booking.findOneAndUpdate(
      { ref: req.params.ref.toUpperCase() },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Notify guest
    if (status === "confirmed") {
      await sendWA(booking.guestPhone,
        `âœ… *Booking Confirmed!*\n\nRef: *${booking.ref}*\nHotel: ${booking.hotelName}\nRoom: ${booking.roomName}\nCheck-in: ${booking.checkIn}\nNights: ${booking.nights}\nTotal: ETB ${booking.totalPrice?.toLocaleString()}\n\nSee you soon! ðŸŒŸ`
      );
    } else if (status === "cancelled") {
      await sendWA(booking.guestPhone,
        `âŒ Booking Cancelled\n\nRef: *${booking.ref}*\nUnfortunately ${booking.hotelName} has cancelled your booking. Please visit ogso-pink.vercel.app to find another hotel.`
      );
    }

    res.json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update by id (admin)
router.patch("/:id/status", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

