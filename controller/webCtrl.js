"use strict"

const userDAO = require('../model/userDAO');

const user = {}
const sensor = {}
const login = {}

const session_check = async (req, res, ejs) => {
    if(req.session.user_key){
        const parameters = {
            user_key: req.session.user_key,
        }
        res.render(`../views${ejs}.ejs`);
    } else{
        res.send(`<script>location.href='/login';</script>`);
    }
}


// user
user.login = async (req, res) => {
    if(req.session.user_key){
        const parameters = {
            user_key: req.session.user_key,
        }
        res.send(`<script>location.href='/';</script>`);
    } else{
        res.render(`../views/user/login.ejs`);
    }
}

user.info = async (req, res) => {
    let ejs = '/user/info'
    session_check(req, res, ejs)
}

user.pw_update = async (req, res) => {
    let ejs = '/user/pw_update'
    session_check(req, res, ejs)
}



// sensor
sensor.monitoring = async (req, res) => {
    if (req.session.user_key >= 20){
        let ejs = '/sensor/monitoring2'
        session_check(req, res, ejs)
    } else if(req.session.user_key == 10){
        let ejs = '/sensor/monitoring3'
        session_check(req, res, ejs)
    } else {
        let ejs = '/sensor/monitoring'
        session_check(req, res, ejs)
    }
}

sensor.log = async (req, res) => {
    if (req.session.user_key >= 20){
        let ejs = '/sensor/log2'
        session_check(req, res, ejs)
    } else {
        let ejs = '/sensor/log'
        session_check(req, res, ejs)
    }
}

sensor.cctv = async (req, res) => {
    let ejs = '/sensor/cctv'
    session_check(req, res, ejs)
}


sensor.cctvView = async (req, res) => {
    let ejs = '/sensor/cctvView'
    session_check(req, res, ejs)
}

sensor.setting = async (req, res) => {
    let ejs = '/sensor/setting'
    session_check(req, res, ejs)
}

sensor.sensorSet = async (req, res) => {
    let ejs = '/sensor/sensorSet'
    session_check(req, res, ejs)
}






login.login = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        req.session.user_key = db_data[0].user_key;
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/';</script>");
        })
    } else{
        delete req.session.user_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/login';</script>");
    }
}


login.logout = async (req, res) => {
    delete req.session.user_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/login';</script>");
}


login.pw_update = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        id: req.body.id,
        pw: req.body.pw,

        pw_new: req.body.pw_new
    }
    
    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        if(parameters.user_key == db_data[0].user_key){
            parameters.user_key = db_data[0].user_key;
            await userDAO.pw_update(parameters);
            res.send("<script>alert(`비밀번호 변경 완료`);</script>")
        } else {
            // 세션 정보와 일치하지 않음
            res.send("<script>alert(`아이디, 패스워드가 일치하는 계정이 없습니다.`); location.href='/login';</script>");
        }
        
    } else {
        res.send("<script>alert(`아이디, 패스워드가 일치하는 계정이 없습니다.`); location.href='/login';</script>");
    }
}




module.exports = {
    user,
    sensor,
    login
}