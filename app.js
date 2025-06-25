// // app.js
// const express = require("express");
// const app = express();

// // Import your router
// const astroRoutes = require("./Routes/astroRoutes");

// // Middleware
// app.use(express.json()); 
// app.use('/api', astroRoutes);

// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Astrology server running at http://localhost:${PORT}/api`);
// });

// require('dotenv').config();  // ✅ load .env

// const express = require("express");
// const app = express();


// app.use(express.json()); 


// app.use((req, res, next) => {
//   const apiKey = req.headers['x-api-key'];
//   if (!apiKey || apiKey !== process.env.astroApi) {
//     return res.status(401).json({ error: `Invalid value "${apiKey}" for header "x-api-key"` });
//   }
//   next();
// });


// const astroRoutes = require("./Routes/astroRoutes");
// app.use('/api', astroRoutes);


// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Astrology server running at http://localhost:${PORT}/api`);
// });

// app.js
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// Import your router
const astroRoutes = require("./Routes/astroRoutes");

// Middleware
app.use(express.json()); 
app.use('/api', astroRoutes);

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Astrology server running at http://localhost:${PORT}/api`);
});