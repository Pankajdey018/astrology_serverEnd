const axios = require('axios');
const rules = require('../Utils/festival');

async function getFestivalsForMonth(location, year, month) {
  const res = await axios.get(`http://localhost:8080/api/calendar-month`, {
    params: { location, year, month }
  });

  const festivals = [];

  for (const day of res.data) {
    //console.log(day.date, day.lunarMonth, day.tithi, day.paksha);
    for (const rule of rules) {
      if (rule.match(day)) {
        festivals.push({
          name: rule.name,
          date: day.date,
          tithi: day.tithi,
          lunarMonth: day.lunarMonth,
          paksha: day.paksha
        });
      }
    }
  }

  return festivals;
}

module.exports = { getFestivalsForMonth };