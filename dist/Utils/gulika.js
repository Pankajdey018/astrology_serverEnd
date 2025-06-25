
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Gulika Kaal timings (assuming sunrise at 6 AM and 12-hour daytime)
const gulikaSlots = {
  Sunday: [9, 10.5],
  Monday: [7.5, 9],
  Tuesday: [6, 7.5],
  Wednesday: [13.5, 15],
  Thursday: [12, 13.5],
  Friday: [10.5, 12],
  Saturday: [15, 16.5]
};

/**
 * Returns Gulika Kaal time slot for the given date (defaults to today)
 */
function getGulikaKaal(date) {
  const weekday = WEEKDAYS[date.getDay()];
  const [startHour, endHour] = gulikaSlots[weekday];

  const start = new Date(date);
  start.setHours(Math.floor(startHour), (startHour % 1) * 60, 0, 0);

  const end = new Date(date);
  end.setHours(Math.floor(endHour), (endHour % 1) * 60, 0, 0);

  return {
    day: weekday,
    start: start.toLocaleTimeString(),
    end: end.toLocaleTimeString()
  };
}

module.exports = { getGulikaKaal };