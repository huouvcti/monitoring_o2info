"use strict"

const userDAO = require('../model/userDAO');


const login = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        req.session.user_key = db_data[0].user_key;
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/';</script>");
        })
    } else{
        delete req.session.user_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/login';</script>");
    }
}


const logout = async (req, res) => {
    delete req.session.user_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/login';</script>");
}


const pw_update = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw,

        pw_new: req.body.pw_new
    }
    
    const db_data = await userDAO.user_check(parameters);
    if(db_data.length != 0){
        parameters.user_key = db_data[0].user_key;
        await userDAO.pw_update(parameters);
        res.send("<script>alert(`비밀번호 변경 완료`);</script>")
    } else {
        res.send("<script>alert(`아이디, 패스워드가 일치하는 계정이 없습니다.`); location.href='/login';</script>");
    }
}



module.exports = {
    login,
    logout,
    pw_update
}