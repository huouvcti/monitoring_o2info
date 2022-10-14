"use strict";

const express = require('express');
const router = express.Router();

const sensorCtrl = require('../../controller/sensorCtrl');

router.get('/set', sensorCtrl.set.before);

// 임계치 변경
// header: user_key(int)
// body: DO_high, DO_low, pH_high, pH_low, Sa_high, Sa_low, ORP_high, ORP_low, Tc_high, Tc_low, TUR_high, TUR_low

router.post('/set', sensorCtrl.set.update);


// query: page, start, end
router.get('/log', sensorCtrl.log.list);




module.exports = router;