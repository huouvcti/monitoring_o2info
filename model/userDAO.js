const {db} = require('../config/dbconn');

const user_info = {}

const token = {}

const user_check = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM user WHERE (id=? AND pw=?)`, [parameters.id, parameters.pw], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const pw_update = (parameters) =>{
    console.log(parameters)
    return new Promise((resolve, reject) =>{
        db.query(`UPDATE user SET pw=? WHERE user_key=? OR user_key=?`, [parameters.pw_new, parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}



user_info.fishery = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM user_info WHERE user_key=? OR user_key=?`, [parameters.user_key1, parameters.user_key2], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


token.check = (parameters) =>{
    console.log(parameters)
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM user_device WHERE user_key=? AND token=?`, [parameters.user_key, parameters.token], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


token.insert = (parameters) =>{
    console.log(parameters)
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO user_device(user_key, token) VALUES(?, ?)`, [parameters.user_key, parameters.token], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


token.get = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT token FROM user_device WHERE user_key=? AND login=1`, (parameters.user_key), (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const login = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`UPDATE user_device set login=1 where user_key=? AND token=?`, (parameters.user_key, parameters.token), (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


const logout = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`UPDATE user_device set login=0 where user_key=? AND token=?`, (parameters.user_key, parameters.token), (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


module.exports = {
    user_check,
    pw_update,

    user_info,
    
    token,

    login,
    logout

}