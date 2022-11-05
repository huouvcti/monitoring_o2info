"use strict";

const express = require('express');
const router = express.Router();

const adminCtrl = require('../controller/adminCtrl');



// user
router.get("/login", adminCtrl.admin.login);

// router.get("/user_info", webCtrl.user.info)

// router.get("/setting/pw_update", webCtrl.user.pw_update);


router.get("/", adminCtrl.admin.monitoring);
router.get("/:user_key", adminCtrl.admin.monitoring);
router.get("/:user_key/monitoring", adminCtrl.admin.monitoring);
router.get("/:user_key/log", adminCtrl.admin.log);
router.get("/:user_key/setting", adminCtrl.admin.setting);

router.get("/:user_key/sensorSet", adminCtrl.admin.sensorSet);
router.get("/:user_key/gapSet", adminCtrl.admin.gapSet);

// router.get("/monitoring", webCtrl.sensor.monitoring);
// router.get("/log", webCtrl.sensor.log);

// router.get("/setting", webCtrl.sensor.setting);

// router.get("/setting/sensorSet", webCtrl.sensor.sensorSet);



// 로그인
// body: id(string), pw(string)
router.post("/login", adminCtrl.admin_login.login);

// 로그아웃
router.get("/logout", adminCtrl.admin_login.logout);





module.exports = router;