const { getPanchanga } = require('../Utils/panchanga');
const { getCoordinatesFromAPI } = require('../middleware/geoApi');

async function getCalendarForMonth(location, year, month) {
  const results = [];

  // 1️⃣ Get coordinates once
  const { lat, lon } = await getCoordinatesFromAPI(location);

  // 2️⃣ Iterate through each day
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

    // 3️⃣ Pass lat/lon directly
    const panchanga = await getPanchanga(date, location, lat, lon);
    results.push(panchanga);
  }

  return results;
}

module.exports = { getCalendarForMonth };