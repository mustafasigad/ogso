const router = require("express").Router();
const Business = require("../models/Business");

router.get("/", async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.city) filter.city = new RegExp(req.query.city, "i");
    if (req.query.category) filter.category = new RegExp(req.query.category, 'i');
    if (req.query.territory) filter.territory = req.query.territory;
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
      name:        req.body.name,
      category:    req.body.category,
      city:        req.body.city,
      territory:   req.body.territory || "ET-SO",
      phone:       req.body.phone,
      whatsapp:    req.body.phone,
      description: req.body.description || "",
      plan:        "free",
      verified:    false,
      active: false,
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
    await Business.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: "Deactivated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

