"use strict";

const express = require('express');
const router = express.Router();

const webCtrl = require('../controller/webCtrl');



// user
router.get("/login", webCtrl.user.login);
router.get("/user_info", webCtrl.user.info)
router.get("/user_info/pw_update", webCtrl.user.pw_update);


// sensor
router.get("/", webCtrl.sensor.dashboard);
router.get("/dashboard", webCtrl.sensor.dashboard);
router.get("/log", webCtrl.sensor.log);




module.exports = router;