const {db} = require('../config/dbconn');


const user_check = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM admin WHERE (id=? AND pw=?)`, [parameters.id, parameters.pw], (err, db_data) => {
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
}