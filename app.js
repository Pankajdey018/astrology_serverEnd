const express = require("express");
const cors = require("cors");
const app = express();

// Load environment variables
require('dotenv').config(); 

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const astroRoutes = require("./Routes/astroRoutes");
app.use('/api', astroRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Astrology server running at http://localhost:${PORT}/api`);
});