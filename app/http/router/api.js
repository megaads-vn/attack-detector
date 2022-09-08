const express = require('express')
const router = express.Router();
const attacker_controller = require(__dir + '/app/http/controller/api/attacker-controller');

router.get('/attacker', attacker_controller.index);

module.exports = router;
