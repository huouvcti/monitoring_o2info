"use strict"

const userDAO = require('../model/userDAO');


const login = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const result = {}

    const db_data = await userDAO.user_check(parameters);

    if(db_data.length != 0){
        result.user_key = db_data[0].user_key;
        result.msg = "login success";

        res.send({"result": result});
    } else{
        result.user_key = null;
        result.msg = "login fail: id, pw NOT FOUND";

        res.send({"result": result});
    }
}


// const logout = async (req, res) => {
//     delete req.session.user_key;

//     res.send("<script>alert(`로그아웃 성공`); location.href='/login';</script>");
// }


const pw_update = async (req, res) => {
    const parameters = {
        user_key: (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null,

        id: req.body.id,
        pw: req.body.pw,

        pw_new: req.body.pw_new
    }
    const result = {}

    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        if(parameters.user_key == db_data[0].user_key){
            await userDAO.pw_update(parameters);

            result.user_key = null;
            result.msg = "pw update success";

            res.send({"result": result});
        } else {
            result.user_key = null;
            result.msg = "pw update fail: Does not match session";
            res.send({"result": result});
        }
    } else {
        result.user_key = null;
        result.msg = "pw update fail: id, pw NOT FOUND";

        res.send({"result": result});
    }
}



module.exports = {
    login,
    // logout,
    pw_update
}