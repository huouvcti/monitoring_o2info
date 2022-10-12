"use strict"

const user = {}
const sensor = {}

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
sensor.dashboard = async (req, res) => {
    let ejs = '/sensor/dashboard'
    session_check(req, res, ejs)
}

sensor.log = async (req, res) => {
    let ejs = '/sensor/log'
    session_check(req, res, ejs)
}




module.exports = {
    user,
    sensor
}