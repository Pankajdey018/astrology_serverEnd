const swisseph = require('swisseph-v2');
const path = require('path');
// Set path to Swiss Ephemeris data files
swisseph.swe_set_ephe_path('./Data/ephe'); // Make sure this folder contains .se1 files
console.log('Ephemeris:', path.resolve('./Data/ephe'));

/**
 * Calculates planetary positions (Gochar) for a given date, time, and location.
 * @param {Object} input - { year, month, day, hour, minute, lat, lon }
 * @returns {Promise<Object>} - Planetary longitudes keyed by planet name
 */
function calculateTransit(input) {
  return new Promise((resolve, reject) => {
    const { year, month, day, hour, minute, lat, lon } = input;

    // Convert time to decimal hours
    const decimalHour = hour + minute / 60;

    // Julian Day calculation (assumes input time is in UT)
    const jd = swisseph.swe_julday(year, month, day, decimalHour, swisseph.SE_GREG_CAL);
    console.log({ year, month, day, hour, minute, lat, lon });

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
      { id: swisseph.SE_PLUTO, name: 'Pluto' }
    ];

    const results = {};
    let completed = 0;

    planets.forEach(({ id, name }) => {
      swisseph.swe_calc_ut(jd, id, swisseph.SEFLG_SPEED, (res) => {
        if (res.error) {
          return reject(`Error calculating ${name}: ${res.error}`);
        }
        results[name] = res.longitude.toFixed(4);
        completed++;
        if (completed === planets.length) {
          resolve(results);
        }
      });
    });
  });
}

module.exports = calculateTransit;