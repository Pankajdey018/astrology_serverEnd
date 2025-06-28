const swe = require("sweph");
const SunCalc = require("suncalc");
const { getCoordinatesFromAPI } = require("../middleware/geoApi");

const SEFLG_SWIEPH = 2;
const SE_MOON = 1;
const SE_SUN = 0;

const TITHIS = [
  "Pratipada",
  "Dvitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima/Amavasya",
];

const Karanas = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
  "Shakuni",
  "Chatushpada",
  "Naga",
  "Kimstughna",
];

const Yogas = [
  "Vishkumbha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shula",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

async function getPanchanga(date, locationName = "Kolkata", lat = null, lon = null
) {
  try {
    //const { lat, lon } = await getCoordinatesFromAPI(locationName);
    if (!lat || !lon) {
      const coords = await getCoordinatesFromAPI(locationName);
      lat = coords.lat;
      lon = coords.lon;
    }
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

    const sunTimes = SunCalc.getTimes(date, lat, lon);
    const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
    const sunrise = sunTimes.sunrise;
    const sunset = sunTimes.sunset;

    const jd = swe.julday(
      sunrise.getFullYear(),
      sunrise.getMonth() + 1,
      sunrise.getDate(),
      sunrise.getHours() + sunrise.getMinutes() / 60,
      1
    );

    const moonLon = swe.calc_ut(jd, SE_MOON, SEFLG_SWIEPH).data[0] % 360;
    const sunLon = swe.calc_ut(jd, SE_SUN, SEFLG_SWIEPH).data[0] % 360;

    const tithiAngle = (moonLon - sunLon + 360) % 360;
    const tithiIndex = Math.floor(tithiAngle / 12);
    const tithi = TITHIS[tithiIndex % 15];

    const karanaIndex = Math.floor((tithiAngle % 12) / 6);
    const karana =
      karanaIndex < 7 ? Karanas[karanaIndex] : Karanas[7 + (tithiIndex % 4)];

    const nakshatra = NAKSHATRAS[Math.floor(moonLon / (360 / 27))];
    const yoga = Yogas[Math.floor(((moonLon + sunLon) % 360) / (360 / 27))];

    const brahmaStart = new Date(sunrise.getTime() - 96 * 60 * 1000);
    const brahmaEnd = new Date(brahmaStart.getTime() + 48 * 60 * 1000);
    const abhijitStart = new Date(
      sunrise.getTime() + 6 * 60 * 60 * 1000 - 24 * 60 * 1000
    );
    const abhijitEnd = new Date(abhijitStart.getTime() + 48 * 60 * 1000);

    return {
      date: date.toISOString().split("T")[0],
      location: locationName,
      weekday,
      sunrise: sunrise.toLocaleTimeString(),
      sunset: sunset.toLocaleTimeString(),
      moonrise: moonTimes.rise
        ? moonTimes.rise.toLocaleTimeString()
        : "No moonrise",
      moonset: moonTimes.set
        ? moonTimes.set.toLocaleTimeString()
        : "No moonset",
      tithi,
      karana,
      nakshatra,
      yoga,
      muhurta: {
        brahma: {
          start: brahmaStart.toLocaleTimeString(),
          end: brahmaEnd.toLocaleTimeString(),
        },
        abhijit: {
          start: abhijitStart.toLocaleTimeString(),
          end: abhijitEnd.toLocaleTimeString(),
        },
      },
    };
  } catch (err) {
    return { error: err.message || "Failed to compute Panchanga." };
  }
}

module.exports = { getPanchanga };
