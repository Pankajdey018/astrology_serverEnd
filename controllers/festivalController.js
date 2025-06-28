const { getFestivalsForMonth } = require("../Services/festivalService");

async function fetchFestival(req, res) {
  const { location, year, month } = req.query;

  if (!location || !year || !month) {
    return res.status(400).json({ error: "Missing location, year or month." });
  }

  try {
    const data = await getFestivalsForMonth(location, year, month);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch festivals." });
  }
}

module.exports = {fetchFestival};