"use strict";

const express = require('express');
const router = express.Router();

const adminCtrl = require('../controller/adminCtrl');



// user
router.get("/login", adminCtrl.admin.login);

// 로그인
// body: id(string), pw(string)
router.post("/login", adminCtrl.admin_login.login);

// 로그아웃
router.get("/logout", adminCtrl.admin_login.logout);



router.get("/", adminCtrl.admin.monitoring);
router.get("/:user_key", adminCtrl.admin.monitoring);
router.get("/:user_key/monitoring", adminCtrl.admin.monitoring);
router.get("/:user_key/log", adminCtrl.admin.log);
router.get("/:user_key/setting", adminCtrl.admin.setting);

router.get("/:user_key/sensorSet", adminCtrl.admin.sensorSet);
router.get("/:user_key/gapSet", adminCtrl.admin.gapSet);









module.exports = router;