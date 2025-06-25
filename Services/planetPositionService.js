const swisseph = require('swisseph-v2');
const path = require('path');

swisseph.swe_set_ephe_path(path.resolve(__dirname, './Data/ephe'));

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

function getNakshatraInfo(deg) {
  const index = Math.floor(deg / (360 / 27));
  return {
    nakshatra: NAKSHATRAS[index],
    lord: NAKSHATRA_LORDS[index],
    padam: Math.floor((deg % (360 / 27)) / 3.3333) + 1
  };
}

function getFormattedDegree(deg) {
  const sign = Math.floor(deg / 30);
  const d = Math.floor(deg % 30);
  const m = Math.floor((deg % 1) * 60);
  const s = Math.round((((deg % 1) * 60) % 1) * 60);
  return `${d}°${m}'${s}" in sign ${sign + 1}`;
}

function getDailyPlanetaryPositions(input) {
  return new Promise((resolve, reject) => {
    const { year, month, day, hour, minute } = input;
    const decimalHour = hour + minute / 60;
    const jd = swisseph.swe_julday(year, month, day, decimalHour, swisseph.SE_GREG_CAL);

    const planets = [
      { id: swisseph.SE_SUN, name: 'Sun' },
      { id: swisseph.SE_MOON, name: 'Moon' },
      { id: swisseph.SE_MERCURY, name: 'Mercury' },
      { id: swisseph.SE_VENUS, name: 'Venus' },
      { id: swisseph.SE_MARS, name: 'Mars' },
      { id: swisseph.SE_JUPITER, name: 'Jupiter' },
      { id: swisseph.SE_SATURN, name: 'Saturn' },
      { id: swisseph.SE_URANUS, name: 'Uranus' },
      { id: swisseph.SE_NEPTUNE, name: 'Neptune' },
      { id: swisseph.SE_PLUTO, name: 'Pluto' },
      { id: swisseph.SE_MEAN_NODE, name: 'Rahu' } // Ketu will be derived
    ];

    const results = [];
    let completed = 0;
    let rahuLongitude = null;

    planets.forEach(({ id, name }) => {
      swisseph.swe_calc_ut(jd, id, swisseph.SEFLG_SPEED, (res) => {
        if (res.error) return reject(`Error calculating ${name}: ${res.error}`);

        const lon = typeof res.longitude === 'number' ? res.longitude : null;
        const speed = typeof res.speed === 'number' ? res.speed : null;
        const ra = typeof res.rightAscension === 'number' ? res.rightAscension : null;
        const dec = typeof res.declination === 'number' ? res.declination : null;

        const nak = lon !== null ? getNakshatraInfo(lon) : { nakshatra: null, lord: null, padam: null };

        const planetData = {
          planet: name,
          longitude: lon !== null ? lon.toFixed(4) : null,
          fullDegree: lon !== null ? getFormattedDegree(lon) : null,
          nakshatra: nak.nakshatra,
          nakshatraLord: nak.lord,
          padam: nak.padam,
          speedDegPerDay: speed !== null ? speed.toFixed(5) : null,
          rightAscension: ra !== null ? ra.toFixed(4) : null,
          declination: dec !== null ? dec.toFixed(4) : null
        };

        if (name === 'Rahu' && lon !== null) {
          rahuLongitude = lon;
        }

        results.push(planetData);
        completed++;

        if (completed === planets.length) {
          // Append Ketu (180° opposite Rahu)
          if (typeof rahuLongitude === 'number') {
            const ketuLon = (rahuLongitude + 180) % 360;
            const ketuNak = getNakshatraInfo(ketuLon);
            results.push({
              planet: 'Ketu',
              longitude: ketuLon.toFixed(4),
              fullDegree: getFormattedDegree(ketuLon),
              nakshatra: ketuNak.nakshatra,
              nakshatraLord: ketuNak.lord,
              padam: ketuNak.padam,
              speedDegPerDay: null,
              rightAscension: null,
              declination: null
            });
          }
          resolve(results);
        }
      });
    });
  });
}

module.exports = getDailyPlanetaryPositions;