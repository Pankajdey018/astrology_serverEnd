require("dotenv").config();
const https = require("https");

function getCoordinatesFromAPI(location) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ location });

    const options = {
      hostname: "json.freeastrologyapi.com",
      path: "/geo-details",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.astroApi,
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          console.log("Parsed geo API response:", parsed);

          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstMatch = parsed[0];
            const lat = firstMatch.latitude;
            const lon = firstMatch.longitude;

            if (lat && lon) {
              resolve({ lat, lon });
            } else {
              reject(
                new Error("Latitude/Longitude not found in the first result.")
              );
            }
          } else {
            reject(new Error("No valid location data in API response."));
          }
        } catch (err) {
          reject(new Error("Failed to parse response from geo API"));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

module.exports = { getCoordinatesFromAPI };
