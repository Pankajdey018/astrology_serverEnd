const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Yamagandam timings are traditionally fixed assuming sunrise at 6:00 AM and sunset at 6:00 PM (12-hour day)
const yamagandamSlots = {
  Sunday: [12, 13.5],
  Monday: [10.5, 12],
  Tuesday: [9, 10.5],
  Wednesday: [7.5, 9],
  Thursday: [6, 7.5],
  Friday: [13.5, 15],
  Saturday: [15, 16.5]
};

/**
 * Given a JS Date object, returns the Yamagandam start and end time for that day
 */
function getYamagandam(date) {
  const weekday = WEEKDAYS[date.getDay()];
  const [startHour, endHour] = yamagandamSlots[weekday];

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

module.exports = { getYamagandam };