// kundli.js

const swe = require('sweph');
const SunCalc = require('suncalc');
const { getCoordinatesFromAPI } = require('../middleware/geoApi'); // adjust path

const SEFLG_SWIEPH = 2;

const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  MEAN_NODE: 10,
  TRUE_NODE: 11
};

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
  "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun",
  "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
  "Jupiter", "Saturn", "Mercury"
];

function getNakshatraInfo(longitude) {
  const index = Math.floor(longitude / (360 / 27));
  return {
    nakshatra: NAKSHATRAS[index],
    lord: NAKSHATRA_LORDS[index]
  };
}

function getNavamshaSign(longitude) {
  const sign = Math.floor(longitude / 30); // 0 to 11
  const offset = longitude % 30;
  const navamshaIndex = Math.floor(offset / (30 / 9)); // 0 to 8
  const navamshaSign = (sign * 9 + navamshaIndex) % 12;
  return navamshaSign;
}

async function getKundli(date, locationName = "Kolkata") {
  try {
    const { lat, lon } = await getCoordinatesFromAPI(locationName);
    const sunTimes = SunCalc.getTimes(date, lat, lon);
    const sunrise = sunTimes.sunrise;

    const jd = swe.julday(
      sunrise.getFullYear(),
      sunrise.getMonth() + 1,
      sunrise.getDate(),
      sunrise.getHours() + sunrise.getMinutes() / 60,
      1
    );

    const planets = [
      { id: PLANETS.SUN, name: 'Sun' },
      { id: PLANETS.MOON, name: 'Moon' },
      { id: PLANETS.MERCURY, name: 'Mercury' },
      { id: PLANETS.VENUS, name: 'Venus' },
      { id: PLANETS.MARS, name: 'Mars' },
      { id: PLANETS.JUPITER, name: 'Jupiter' },
      { id: PLANETS.SATURN, name: 'Saturn' },
      { id: PLANETS.MEAN_NODE, name: 'Rahu' },
      { id: PLANETS.TRUE_NODE, name: 'Ketu' }
    ];

    const rashiChart = [];
    const navamshaChart = [];

    for (const p of planets) {
      const posRaw = swe.calc_ut(jd, p.id, SEFLG_SWIEPH);
      const pos = Array.isArray(posRaw.data) ? posRaw.data : [];
      const lon = pos[0] ?? null;
      const retro = pos[2] < 0;

      const { nakshatra, lord } = getNakshatraInfo(lon);
      const navSign = getNavamshaSign(lon);
      const navLon = (navSign * 30) + ((lon % (30 / 9)) * 9); // approximate

      const navNak = getNakshatraInfo(navLon);

      rashiChart.push({
        planet: p.name,
        longitude: lon?.toFixed(2),
        nakshatra,
        nakshatraLord: lord,
        retrograde: retro
      });

      navamshaChart.push({
        planet: p.name,
        longitude: navLon.toFixed(2),
        nakshatra: navNak.nakshatra,
        nakshatraLord: navNak.lord
      });
    }

    return {
      date: date.toISOString(),
      location: locationName,
      latitude: lat,
      longitude: lon,
      sunrise: sunrise.toLocaleTimeString(),
      rashiChart,
      navamshaChart
    };
  } catch (err) {
    return { error: err.message || "Failed to generate Kundli." };
  }
}

module.exports = { getKundli };