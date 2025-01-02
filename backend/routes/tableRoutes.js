const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getTables);
router.get('/availability', tableController.getTableAvailability);

module.exports = router;