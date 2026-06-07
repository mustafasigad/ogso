const router = require("express").Router();
const Business = require("../models/Business");

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    if (req.query.city) filter.city = new RegExp(req.query.city, "i");
    if (req.query.category) filter.category = new RegExp(req.query.category, "i");
    if (req.query.territory) filter.territory = req.query.territory;
    if (req.query.verified === "true") filter.verified = true;
    if (req.query.search) filter.name = new RegExp(req.query.search, "i");
    const businesses = await Business.find(filter).sort({ featured: -1, rating: -1 });
    res.json({ businesses });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    );
    if (!business) return res.status(404).json({ error: "Not found" });
    res.json(business);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const business = await Business.create({
      name: req.body.name, category: req.body.category,
      city: req.body.city, suburb: req.body.suburb || "",
      territory: req.body.territory || "ET-SO",
      address: req.body.address || "", phone: req.body.phone,
      whatsapp: req.body.whatsapp || req.body.phone,
      email: req.body.email || "", description: req.body.description || "",
      photos: req.body.photos || [], amenities: req.body.amenities || [],
      tags: req.body.tags || [], price: req.body.price || 0,
      rooms: req.body.rooms || [], verified: req.body.verified || false,
      featured: req.body.featured || false, active: req.body.active || false,
      plan: req.body.plan || "free",
    });
    res.status(201).json({ business });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(business);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;