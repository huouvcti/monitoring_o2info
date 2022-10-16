const {db} = require('../config/dbconn');



const sensor = {}       // 대시보드
const sensor_set = {}   // 임계치 설정
const sensor_log = {}   // 로그



sensor.before = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM sensor WHERE user_key=? ORDER BY date DESC LIMIT 20;`, [parameters.user_key], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor.insert = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO sensor(user_key, DO, pH, Sa, ORP, Tc, DOper) VALUES(?, ?, ?, ?, ?, ?, ?);`, [parameters.user_key, parameters.DO, parameters.pH, parameters.Sa, parameters.ORP, parameters.Tc, parameters.DOper], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


sensor_set.before = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM sensor_set WHERE user_key=? OR user_key=?;`, [parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_set.update = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`UPDATE sensor_set SET DO_high=?, DO_low=?, pH_high=?, pH_low=?, Sa_high=?, Sa_low=?, ORP_high=?, ORP_low=?, Tc_high=?, Tc_low=?, DOper_high=?, DOper_low=? WHERE user_key=? OR user_key=?;`, [parameters.DO_high, parameters.DO_low, parameters.pH_high, parameters.pH_low, parameters.Sa_high, parameters.Sa_low, parameters.ORP_high, parameters.ORP_low, parameters.Tc_high, parameters.Tc_low, parameters.DOper_high, parameters.DOper_low, parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


sensor_log.list = (parameters) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [ parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_log.list_cnt = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT COUNT(*) as cnt FROM sensor WHERE user_key=? AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_log.graph = (parameters) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC`, [ parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_log.down = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT DATE_FORMAT(date, '%Y-%m-%d %T') as date, Tc as '수온 (C)', DO as 'DO (mg/L)', DOper as 'DO (%)', pH, Sa as '염도', ORP FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC;`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}



sensor_log.del = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`DELETE FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

module.exports = {
    sensor,
    sensor_set,
    sensor_log
}