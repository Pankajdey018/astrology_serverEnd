const { getCalendarForMonth } = require("../Services/calendarService");

async function fetchCalendarForMonth(req, res) {
  const { location, year, month } = req.query;

  if (!location || !year || !month) {
    return res
      .status(400)
      .json({ error: "Location, year, and month are required." });
  }

  try {
    const data = await getCalendarForMonth(
      location,
      parseInt(year),
      parseInt(month)
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to generate monthly Panchanga data." });
  }
}

module.exports = {fetchCalendarForMonth}
