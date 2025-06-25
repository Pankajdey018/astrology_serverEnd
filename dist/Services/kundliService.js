const swe = require('sweph');

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

function getBirthChart(jd) {
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

  return planets.map(p => {
    try {
      const posRaw = swe.swe_calc_ut
        ? swe.swe_calc_ut(jd, p.id, SEFLG_SWIEPH)
        : swe.calc_ut(jd, p.id, SEFLG_SWIEPH);

      const pos = Array.isArray(posRaw.data) ? posRaw.data : [];

      if (typeof pos[0] !== 'number') {
        throw new Error(`Invalid response for ${p.name}`);
      }

      return {
        planet: p.name,
        longitude: pos[0].toFixed(2),         // degrees
        retrograde: pos[2] < 0                // negative speed indicates retrograde
      };
    } catch (err) {
      return {
        planet: p.name,
        error: err.message || 'Calculation error'
      };
    }
  });
}

module.exports = { getBirthChart };
