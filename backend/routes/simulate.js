const express = require('express');
const router = express.Router();
const { simulate, simulatePriority, simulateSJF, simulateRoundRobin, healthCheck } = require('../controllers/simulateController');

router.post('/simulate', simulate);
router.post('/simulate-priority', simulatePriority);
router.post('/simulate-sjf', simulateSJF);
router.post('/simulate-rr', simulateRoundRobin);
router.get('/health', healthCheck);

module.exports = router;
