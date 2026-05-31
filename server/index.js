const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001','http://localhost:5001','http://localhost:5000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:IRoolslHmJMhfIEjuGILXAIvmNvVxMCc@zephyr.proxy.rlwy.net:47938/ogso')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/hotels',     require('./routes/hotels'));
app.use('/api/bookings',   require('./routes/bookings'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/search',     require('./routes/search'));
app.use('/api/upload',     require('./routes/upload'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', platform: 'Ogso' }));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('✅ Ogso server running on port ' + PORT));


