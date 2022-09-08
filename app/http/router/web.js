const express = require('express')
const router = express.Router();
const home_controller = require(__dir + '/app/http/controller/frontend/home-controller');

router.get('/', home_controller.index);

module.exports = router;