"use strict";

require('dotenv').config({ path: 'f.env'});

const express = require('express');
const app = express();

const session = require('express-session');
const {sessionStore} = require('./config/dbconn');

const path = require('path');

/*
 * router import
 */
const webRouter = require("./routes/web");
const userRouter = require("./routes/user");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express)

// app.use('/views/script', express.static(__dirname +'/views/script'))
// app.use('/views/css', express.static(__dirname +'/views/css'))
// app.use('/views/section', express.static(__dirname +'/views/section'))

app.use('/public', express.static(__dirname +'/public'));



app.use(session({
    secret: process.env.SECRET_KEY, // 암호화
    resave: false,                  // 세션을 언제나 저장
    saveUninitialized: true,        // 세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
    store: sessionStore,
    cookie: {
        maxAgeL: 1000 * 60 * 60
    }
}));


// 웹페이지(ejs) rendering
app.use("/", webRouter)

// 로그인 처리
app.use("/api/user", userRouter)



// ERROR 잘못된 경로
app.use(function(req, res, next) {
    res.status(404).send('404: Not Found!');
});
  
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('500: Something broke!')
});


module.exports = app;