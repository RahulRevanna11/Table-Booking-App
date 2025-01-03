require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');
const tableRoutes = require('./routes/tableRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();
console.log(process.env.FRONTEND_URL);

// Configure CORS to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
 
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/tables', tableRoutes);
app.get('/', (req, res) => {
  console.log('Root route accessed'); // Debugging log
  return res.send(`<p>${process.env.FRONTEND_URL}</p>`);
});

// Error handling
// app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
