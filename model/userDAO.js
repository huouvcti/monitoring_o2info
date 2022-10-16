const {db} = require('../config/dbconn');

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


module.exports = {
    user_check,
    pw_update
}