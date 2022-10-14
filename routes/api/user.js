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
router.post('/user_info/pw_update', userCtrl.pw_update);





module.exports = router;