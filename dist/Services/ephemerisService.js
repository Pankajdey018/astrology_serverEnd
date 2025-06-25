const swe = require('sweph');
const path = require('path');

// Set path to your ephemeris data folder
swe.set_ephe_path(path.join(__dirname, '../Data/ephe'));

function getPlanetPosition(julianDay, planetId = swe.SE_SUN) {
  const flag = swe.SEFLG_SWIEPH;
  const result = swe.calc_ut(julianDay, planetId, flag);
  return result;
}

function getMoonPhase(jd) {
  const sun = swe.calc_ut(jd, 0, 2);
  const moon = swe.calc_ut(jd, 1, 2);

  const phaseAngle = Math.abs(moon.longitude - sun.longitude) % 360;

  if (phaseAngle < 10) return 'New Moon';
  if (phaseAngle < 90) return 'Waxing Crescent';
  if (phaseAngle === 90) return 'First Quarter';
  if (phaseAngle < 180) return 'Waxing Gibbous';
  if (phaseAngle === 180) return 'Full Moon';
  if (phaseAngle < 270) return 'Waning Gibbous';
  if (phaseAngle === 270) return 'Last Quarter';
  return 'Waning Crescent';
}

module.exports = { getPlanetPosition, getMoonPhase };

