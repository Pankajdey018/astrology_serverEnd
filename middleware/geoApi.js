require("dotenv").config();
const https = require("https");

function getCoordinatesFromAPI(location) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.weatherApiKey;
    const city = encodeURIComponent(location);
    const url = `/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const options = {
      hostname: "api.openweathermap.org",
      path: url,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          const lat = data?.coord?.lat;
          const lon = data?.coord?.lon;

          if (lat !== undefined && lon !== undefined) {
            console.log(`Geo coordinates -> Latitude: ${lat}, Longitude: ${lon}`);
            resolve({ lat, lon });
          } else {
            reject(new Error("Latitude/Longitude not found in API response."));
          }
        } catch (err) {
          reject(new Error("Failed to parse response from weather API"));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}

module.exports = { getCoordinatesFromAPI };