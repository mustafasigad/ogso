const router = require("express").Router();
const Review = require("../models/Review");
const Business = require("../models/Business");

router.get("/:businessId", async (req, res) => {
  try {
    const filter = { business: req.params.businessId };
    if (req.query.admin !== "true") filter.approved = true;
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const review = await Review.create({
      business: req.body.business, rating: req.body.rating,
      text: req.body.text, language: req.body.language || "en",
      guestName: req.body.guestName || "Guest",
      approved: false,
    });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, { approved: true }, { new: true }
    );
    if (review) {
      const stats = await Review.aggregate([
        { $match: { business: review.business, approved: true } },
        { $group: { _id: "$business", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
      ]);
      if (stats[0]) {
        await Business.findByIdAndUpdate(review.business, {
          rating: Math.round(stats[0].avg * 10) / 10,
          reviewCount: stats[0].count
        });
      }
    }
    res.json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;