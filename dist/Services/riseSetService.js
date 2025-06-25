const SunCalc = require('suncalc');

/**
 * Computes local rise and set times for Sun and Moon (time only).
 * @param {Object} input - { year, month, day, lat, lon }
 * @returns {Array} - Array of { body, rise, set }
 */
function calculateRiseSet({ year, month, day, lat, lon }) {
  const date = new Date(Date.UTC(year, month - 1, day));

  const sunTimes = SunCalc.getTimes(date, lat, lon);
  const moonTimes = SunCalc.getMoonTimes(date, lat, lon);

  return [
    {
      body: 'Sun',
      rise: sunTimes.sunrise?.toLocaleTimeString() || null,
      set: sunTimes.sunset?.toLocaleTimeString() || null
    },
    {
      body: 'Moon',
      rise: moonTimes.rise?.toLocaleTimeString() || null,
      set: moonTimes.set?.toLocaleTimeString() || null
    }
  ];
}

module.exports = calculateRiseSet;