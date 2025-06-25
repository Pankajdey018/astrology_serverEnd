// controller/ephemerisController.js
const swe = require("sweph");
const path = require("path");
const request = require("request");
require("dotenv").config();
const https = require("https");

const { getCoordinatesFromAPI } = require("../middleware/geoApi");

const calculateTransit = require("../Services/transitChartService");
const getDailyPlanetaryPositions = require("../Services/planetPositionService");
const calculateRiseSet = require("../Services/riseSetService");
const { getYamagandam } = require("../Utils/Yamagandam");
const { getGulikaKaal } = require("../Utils/gulika");
const { getChoghadiya } = require("../Utils/choghadiya");
const { getPanchanga } = require("../Utils/panchanga");
const { getKundli } = require("../Utils/kundli");

// Set the path to your Swiss Ephemeris data folder
swe.set_ephe_path(path.join(__dirname, "../Data/ephe"));
console.log("Ephemeris path:", path.join(__dirname, "../Data/ephe"));

const { getPlanetPosition } = require("../Services/ephemerisService");
const { getRahuKaal } = require("../Services/RahuService");
const { getBirthChart } = require("../Services/kundliService");
const { getMoonPhase } = require("../Services/ephemerisService");

const SE_SUN = 0;
const SEFLG_SWIEPH = 2;
const SE_GREG_CAL = 1;


async function fetchSunPosition(req, res) {
  try {
    const { location, date: dateStr } = req.query;

    if (!location || !dateStr) {
      return res.status(400).json({ error: "Missing location or date" });
    }

    const geoData = await getCoordinatesFromAPI(location);
    const { latitude, longitude } = geoData;

    const date = new Date(dateStr);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours() + date.getUTCMinutes() / 60;

    const jd = swe.julday(year, month, day, hour, SE_GREG_CAL);
    const sun = swe.calc_ut(jd, SE_SUN, SEFLG_SWIEPH);
    const [lon, lat, dist] = sun.data;

    res.status(200).json({
      date: dateStr,
      location: { location, latitude, longitude },
      sunPosition: { longitude: lon, latitude: lat, distance: dist },
    });
  } catch (error) {
    console.error("Sun position error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchMoonPhase(req, res) {
  try {
    const { location, date: dateStr } = req.query;

    if (!location || !dateStr) {
      return res.status(400).json({ error: "Missing location or date" });
    }

    const geoData = await getCoordinatesFromAPI(location);
    const date = new Date(dateStr);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = 0;
    const gregflag = SE_GREG_CAL;

    const jd = swe.julday(year, month, day, hour, gregflag);
    const phase = getMoonPhase(jd); // Assumes your own phase logic

    res.status(200).json({
      date: dateStr,
      location: {
        location,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
      },
      moonPhase: phase,
    });
  } catch (error) {
    console.error("Error in fetchMoonPhase:", error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchRahuKaal(req, res) {
  try {
    const { location, date: dateStr } = req.query;

    if (!location || !dateStr) {
      return res.status(400).json({ error: "Missing location or date" });
    }

    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const geoData = await getCoordinatesFromAPI(location);

    // Double-check: log or inspect parsedDate before calling getRahuKaal
    console.log("Parsed Date:", parsedDate); // <— optional but helpful during dev

    const rahu = getRahuKaal(parsedDate);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        date: parsedDate.toISOString().split("T")[0],
        location: {
          location,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        },
        rahuKaal: rahu,
      })
    );
  } catch (error) {
    console.error("Error in fetchRahuKaal:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

function fetchJanmaKundli(req, res) {
  try {
    const { date: dateString, location } = req.query;
    if (!dateString || !location) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Missing 'date' or 'location' query parameter.",
        })
      );
      return;
    }

    const date = new Date(dateString);
    if (isNaN(date)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid date format." }));
      return;
    }

    const geoOptions = {
      method: "POST",
      url: "https://json.freeastrologyapi.com/geo-details",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.astroApi, // Replace with your actual key
      },
      body: JSON.stringify({ location }),
    };

    request(geoOptions, function (error, response) {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Location lookup failed.",
            details: error.message,
          })
        );
        return;
      }

      let geoData;
      try {
        geoData = JSON.parse(response.body);
      } catch (parseError) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Invalid response from location service." })
        );
        return;
      }

      if (!Array.isArray(geoData) || geoData.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Coordinates not found for the given location.",
          })
        );
        return;
      }

      const { latitude, longitude } = geoData[0];

      const julianDay = swe.julday(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours() + date.getMinutes() / 60,
        1
      );

      const chart = getBirthChart(julianDay, latitude, longitude);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          date: date.toISOString(),
          location,
          latitude,
          longitude,
          chart,
        })
      );
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Internal server error.",
        details: error.message,
      })
    );
  }
}

async function getTransitChart(req, res) {
  try {
    const { location, year, month, day, hour, minute } = req.query;
    const { lat, lon } = await getCoordinatesFromAPI(location);
    console.log("Coordinates:", lat, lon); // Add this line to verify

    const result = await calculateTransit({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      lat,
      lon,
    });
    res.status(200).json({ location, coordinates: { lat, lon }, result });
  } catch (error) {
    console.error("Detailed error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to calculate transit chart." });
  }
}

async function getDailyPosition(req, res) {
  try {
    const { location, year, month, day, hour = 12, minute = 0 } = req.query;

    if (!location || !year || !month || !day) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters." });
    }

    const { lat, lon } = await getCoordinatesFromAPI(location);
    const result = await getDailyPlanetaryPositions({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      lat,
      lon,
    });

    res.status(200).json({ location, coordinates: { lat, lon }, result });
  } catch (error) {
    console.error("Daily position error:", error);
    res.status(500).json({
      error: error.message || "Failed to calculate daily planetary positions.",
    });
  }
}

async function getRiseSetTimes(req, res) {
  try {
    const { location, year, month, day } = req.query;

    if (!location || !year || !month || !day) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters." });
    }

    const { lat, lon } = await getCoordinatesFromAPI(location);

    const result = await calculateRiseSet({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      lat,
      lon,
    });

    res.status(200).json({ location, coordinates: { lat, lon }, result });
  } catch (error) {
    console.error("Rise/Set error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to calculate rise/set times." });
  }
}

function fetchYamagandam(req, res) {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const result = getYamagandam(date);
    res.json(result);
  } catch (error) {
    console.log("error getting yamagandam", error);
    res.status(500).json({ error: error.message });
  }
}

function fetchGulikaKaal(req, res) {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const result = getGulikaKaal(date);
    res.json(result);
  } catch (error) {
    console.log("error getting GulikaKaal", error);
    res.status(500).json({ error: error.message });
  }
}

function fetchChoghadiya(req, res) {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const result = getChoghadiya(date);
    res.json(result);
  } catch (error) {
    console.log("error getting Choghadiya", error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchPanchanga(req, res) {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const location = req.query.location || "Kolkata";

    const result = await getPanchanga(date, location);
    res.json(result);
  } catch (error) {
    console.log("error getting Panchanga", error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchKundli(req, res) {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  const location = req.query.location || 'Kolkata';

  const result = await getKundli(date, location);
  res.json(result);
}
module.exports = {
  fetchSunPosition,
  fetchMoonPhase,
  fetchRahuKaal,
  fetchJanmaKundli,
  getTransitChart,
  getDailyPosition,
  getRiseSetTimes,
  fetchYamagandam,
  fetchGulikaKaal,
  fetchChoghadiya,
  fetchPanchanga,
  fetchKundli
};
