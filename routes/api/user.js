"use strict";

const express = require('express');
const router = express.Router();

const userCtrl = require('../../controller/userCtrl');


// 로그인
// body: id(string), pw(string)
router.post("/login", userCtrl.login);

// 로그아웃
// router.get("/logout", userCtrl.logout);

// 비밀번호 변경
// header: user_key(int)
// body: id(string), pw(string), pw_new(string)
router.post('/pw_update', userCtrl.pw_update);



router.post("/user_key", userCtrl.user_key);





module.exports = router;