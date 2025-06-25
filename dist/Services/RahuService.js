// services/rahuService.js
const rahuTable = {
  0: [7.5, 9],    // Sunday
  1: [15, 16.5],  // Monday
  2: [12, 13.5],  // Tuesday
  3: [13.5, 15],  // Wednesday
  4: [10.5, 12],  // Thursday
  5: [9, 10.5],   // Friday
  6: [16.5, 18]   // Saturday
};

function getRahuKaal(date = new Date()) {
  const safeDate = new Date(date);
  if (isNaN(safeDate.getTime())) {
    throw new Error("Invalid date provided to getRahuKaal");
  }

  const weekday = safeDate.getDay();
  const [start, end] = rahuTable[weekday];

  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    const m = Math.round((decimalHour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return {
    start: formatTime(start),
    end: formatTime(end)
  };
}
module.exports = { getRahuKaal };