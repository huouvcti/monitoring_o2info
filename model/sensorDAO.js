const {db} = require('../config/dbconn');



const sensor = {}       // 대시보드
const sensor_set = {}   // 임계치 설정
const sensor_log = {}   // 로그

const sensor_gap = {}   // 오차 설정



sensor.before = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor WHERE user_key=? ORDER BY date DESC LIMIT 20;`, [parameters.user_key], (err, db_data) => {
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
        db.query(`INSERT INTO sensor(user_key, DO, DOper, pH, Sa, ORP, Tc, TUR) VALUES(?, ?, ?, ?, ?, ?, ?, ?);`, [parameters.user_key, parameters.DO, parameters.DOper, parameters.pH, parameters.Sa, parameters.ORP, parameters.Tc, parameters.TUR], (err, db_data) => {
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
        db.query(`UPDATE sensor_set SET DO_high=?, DO_low=?, pH_high=?, pH_low=?, Sa_high=?, Sa_low=?, ORP_high=?, ORP_low=?, Tc_high=?, Tc_low=?, TUR_high=?, TUR_low=? WHERE user_key=? OR user_key=?;`, [parameters.DO_high, parameters.DO_low, parameters.pH_high, parameters.pH_low, parameters.Sa_high, parameters.Sa_low, parameters.ORP_high, parameters.ORP_low, parameters.Tc_high, parameters.Tc_low, parameters.TUR_high, parameters.TUR_low, parameters.user_key1, parameters.user_key2], (err, db_data) => {
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
        db.query(`SELECT format(Tc, 2) as Tc, format(DO, 2) as DO, format(DOper, 2) as DOper, format(pH, 2) as pH, format(Sa, 2) as Sa, format(ORP, 2) as ORP, format(TUR, 2) as TUR, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [ parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
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

sensor_log.graph_tick = (parameters) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date from sensor
        where user_key=?
        AND mod(date_format(date, '%i'), 10)=0
        AND date_format(date, '%S') <= 15 ORDER BY date DESC limit 20`, [ parameters.user_key], (err, db_data) => {
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
        db.query(`SELECT DATE_FORMAT(date, '%Y-%m-%d %T') as date, format(Tc, 2) as 'RTD (C)', format(DO, 2) as 'DO (mg/L)', format(DOper, 2) as 'DO (%)', format(pH, 2) as pH, format(Sa, 2) as 'Salt', format(ORP, 2) as ORP, format(TUR, 2) as 'TUR' FROM sensor WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC;`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
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



sensor_gap.before = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM sensor_gap WHERE user_key=? OR user_key=?;`, [parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_gap.update = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`UPDATE sensor_gap SET DO=?, pH=?, Sa=?, ORP=?, Tc=?, TUR=? WHERE user_key=? OR user_key=?;`, [parameters.DO, parameters.pH, parameters.Sa, parameters.ORP, parameters.Tc, parameters.TUR, parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}



sensor_log.list_newly = (parameters) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT format(Tc, 2) as Tc, format(DO, 2) as DO, format(DOper, 2) as DOper, format(pH, 2) as pH, format(Sa, 2) as Sa, format(ORP, 2) as ORP, format(TUR, 2) as TUR, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor WHERE user_key=? AND date BETWEEN DATE_ADD(NOW(), INTERVAL -1 ${parameters.newly}) AND NOW() ORDER BY date DESC LIMIT ?, ?`, [ parameters.user_key, parameters.offset, parameters.limit], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

sensor_log.list_newly_cnt = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT COUNT(*) as cnt FROM sensor WHERE user_key=? AND date BETWEEN DATE_ADD(NOW(), INTERVAL -1 ${parameters.newly}) AND NOW();`, [parameters.user_key], (err, db_data) => {
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
    sensor_log,

    sensor_gap
}