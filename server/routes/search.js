const router = require('express').Router();
router.get('/', (req, res) => res.json({ results: [] }));
module.exports = router;
