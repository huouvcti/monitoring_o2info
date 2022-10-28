"use strict";

const express = require('express');
const router = express.Router();

const testCtrl = require('../controller/testCtrl');




router.get("/sensor", testCtrl.sensor);

router.get("/sensorSend", testCtrl.sensorSend);





module.exports = router;