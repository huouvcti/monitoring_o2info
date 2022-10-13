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



// 로그인
// body: id(string), pw(string)
router.post("/login", webCtrl.login.login);

// 로그아웃
router.get("/logout", webCtrl.login.logout);

// 비밀번호 변경
// body: id(string), pw(string), pw_new(string)
router.post('/user_info/pw_update', webCtrl.login.pw_update);




module.exports = router;