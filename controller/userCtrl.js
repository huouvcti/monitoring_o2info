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
        user_key1: (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null,
        user_key2: req.session.user_key,

        id: req.body.id,
        pw: req.body.pw,

        pw_new: req.body.pw_new
    }
    const result = {}

    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        if(parameters.user_key1 == db_data[0].user_key || parameters.user_key2 == db_data[0].user_key){
            await userDAO.pw_update(parameters);

            result.user_key = null;
            result.msg = "비밀번호가 변경되었습니다.";

            res.send({"result": result});
        } else {
            result.user_key = null;
            result.msg = "ERROR: 관리자 문의";
            res.send({"result": result});
        }
    } else {
        result.user_key = null;
        result.msg = "ERROR: 아이디와 비밀번호를 확인해주세요.";

        res.send({"result": result});
    }
}



module.exports = {
    login,
    // logout,
    pw_update
}