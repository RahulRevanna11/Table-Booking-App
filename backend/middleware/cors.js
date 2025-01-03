const cors = require('cors');
console.log(process.env.FRONTEND_URL);

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://table-booking-app-3bhw.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);