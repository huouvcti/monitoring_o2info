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
        db.query(`INSERT INTO sensor(user_key, DO, pH, Sa, ORP. Tc, TUR) VALUES(?, ?, ?, ?, ?, ?, ?);`, [parameters.user_key, parameters.DO, parameters.pH, parameters.Sa, parameters.ORP, parameters.Tc, parameters.TUR], (err, db_data) => {
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
        db.query(`SELECT * FROM sensor_set WHERE user_key=?;`, [parameters.user_key], (err, db_data) => {
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
        db.query(`UPDATE sensor_set SET DO_high=?, DO_low=?, pH_high=?, pH_low=?, Sa_high=?, Sa_low=?, ORP_high=?, ORP_low=?, Tc_high=?, Tc_low=?, TUR_high=?, TUR_low=? WHERE user_key=?;`, [parameters.DO_high, parameters.DO_low, parameters.pH_high, parameters.pH_low, parameters.Sa_high, parameters.Sa_low, parameters.ORP_high, parameters.ORP_low, parameters.Tc_high, parameters.Tc_low, parameters.TUR_high, parameters.TUR_low, parameters.user_key], (err, db_data) => {
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