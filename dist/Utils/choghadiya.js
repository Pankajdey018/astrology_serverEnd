// choghadiya.js

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Each day has 7 daytime and 8 nighttime Choghadiya slots (1.5 hours each)
const choghadiyaMap = {
  Sunday: {
    day: ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    night: ["Shubh", "Amrit", "Chal", "Rog", "Kaal", "Labh", "Udveg", "Shubh"]
  },
  Monday: {
    day: ["Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"],
    night: ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Chal", "Rog", "Kaal"]
  },
  Tuesday: {
    day: ["Kaal", "Shubh", "Amrit", "Chal", "Labh", "Udveg", "Rog"],
    night: ["Labh", "Udveg", "Shubh", "Rog", "Kaal", "Amrit", "Chal", "Labh"]
  },
  Wednesday: {
    day: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal"],
    night: ["Udveg", "Rog", "Labh", "Kaal", "Shubh", "Amrit", "Chal", "Udveg"]
  },
  Thursday: {
    day: ["Shubh", "Rog", "Udveg", "Chal", "Amrit", "Kaal", "Labh"],
    night: ["Amrit", "Chal", "Rog", "Labh", "Udveg", "Shubh", "Kaal", "Amrit"]
  },
  Friday: {
    day: ["Amrit", "Chal", "Labh", "Udveg", "Shubh", "Rog", "Kaal"],
    night: ["Rog", "Shubh", "Kaal", "Amrit", "Chal", "Labh", "Udveg", "Rog"]
  },
  Saturday: {
    day: ["Chal", "Labh", "Udveg", "Shubh", "Rog", "Kaal", "Amrit"],
    night: ["Shubh", "Rog", "Kaal", "Labh", "Udveg", "Amrit", "Chal", "Shubh"]
  }
};

/**
 * Returns Choghadiya slots for both day and night
 */
function getChoghadiya(date) {
  const weekday = WEEKDAYS[date.getDay()];
  const data = choghadiyaMap[weekday];

  const sunrise = new Date(date);
  sunrise.setHours(6, 0, 0, 0); // 6 AM

  const sunset = new Date(date);
  sunset.setHours(18, 0, 0, 0); // 6 PM

  const daySlots = data.day.map((label, i) => {
    const start = new Date(sunrise.getTime() + i * 90 * 60000);
    const end = new Date(start.getTime() + 90 * 60000);
    return {
      type: label,
      start: start.toLocaleTimeString(),
      end: end.toLocaleTimeString()
    };
  });

  const nightSlots = data.night.map((label, i) => {
    const start = new Date(sunset.getTime() + i * 90 * 60000);
    const end = new Date(start.getTime() + 90 * 60000);
    return {
      type: label,
      start: start.toLocaleTimeString(),
      end: end.toLocaleTimeString()
    };
  });

  return {
    day: weekday,
    dayChoghadiya: daySlots,
    nightChoghadiya: nightSlots
  };
}

module.exports = { getChoghadiya };