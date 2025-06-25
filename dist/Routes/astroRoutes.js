const express = require('express');
const router = express.Router();

const {
  fetchSunPosition,
  fetchMoonPhase,
  fetchRahuKaal,
  fetchJanmaKundli,
  getTransitChart,
  getDailyPosition,
  getRiseSetTimes,
  fetchYamagandam,
  fetchGulikaKaal,
  fetchChoghadiya,
  fetchPanchanga,
  fetchKundli
} = require('../controllers/astroController');


// Define routes
router.get('/sun', fetchSunPosition);
router.get('/moon-phase', fetchMoonPhase);
router.get('/rahu-kaal', fetchRahuKaal);
router.get('/janma-kundli', fetchJanmaKundli);
router.get("/transit", getTransitChart);
router.get("/daily-planet-position", getDailyPosition);
router.get('/riseset', getRiseSetTimes);
router.get('/yamagandam', fetchYamagandam);
router.get('/gulika-kaal', fetchGulikaKaal);
router.get('/choghadiya', fetchChoghadiya);
router.get('/panchanga', fetchPanchanga);
router.get('/kundli', fetchKundli);


module.exports = router;