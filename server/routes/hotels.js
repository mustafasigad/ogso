const router = require('express').Router();
const hotels = [{"id":"1","name":"Jigjiga Grand Hotel","city":"Jigjiga","category":"hotel","rating":4.6,"reviewCount":84,"verified":true,"phone":"+251911234567","price":850,"amenities":["WiFi","Breakfast","AC","Parking"],"territory":"ET-SO"},{"id":"2","name":"Al-Bayaan Hotel","city":"Jigjiga","category":"hotel","rating":4.3,"reviewCount":51,"verified":false,"phone":"+251911234568","price":650,"amenities":["Parking","AC"],"territory":"ET-SO"},{"id":"3","name":"Hawd Guest House","city":"Jigjiga","category":"hotel","rating":4.1,"reviewCount":37,"verified":false,"phone":"+251911234569","price":420,"amenities":["WiFi"],"territory":"ET-SO"},{"id":"4","name":"Nugaal Palace Hotel","city":"Jigjiga","category":"hotel","rating":4.4,"reviewCount":62,"verified":true,"phone":"+251911234570","price":1100,"amenities":["Rooftop","Restaurant","WiFi"],"territory":"ET-SO"}];
router.get('/', (req, res) => {
  let results = hotels;
  if (req.query.city) results = results.filter(h => h.city.toLowerCase().includes(req.query.city.toLowerCase()));
  res.json(results);
});
router.get('/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === req.params.id);
  if (!hotel) return res.status(404).json({ error: 'Not found' });
  res.json({ ...hotel, rooms: [
    { type: 'standard', name: 'Standard room', price: hotel.price, beds: 'Double bed · AC · en-suite', available: true },
    { type: 'deluxe', name: 'Deluxe room', price: Math.round(hotel.price * 1.6), beds: 'King bed · city view · minibar', available: true, popular: true },
    { type: 'family', name: 'Family suite', price: Math.round(hotel.price * 2.5), beds: '2 rooms · sleeps 5 · kitchenette', available: true }
  ]});
});
module.exports = router;
