"use strict"

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

const sensor = async (req, res) => {
    let ejs = '/test/sensor'
    session_check(req, res, ejs)
}

const sensorSend = async (req, res) => {
    let ejs = '/test/sensorSend'
    session_check(req, res, ejs)
}



module.exports = {
    sensor,
    sensorSend
}