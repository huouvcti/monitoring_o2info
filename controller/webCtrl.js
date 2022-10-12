"use strict"

const userDAO = require('../model/userDAO');


const main = async (req, res) => {
    console.log(req.session.s_admin_key)
    if(req.session.s_admin_key){
        const parameters = {
            user_key: req.session.s_admin_key,
            url: env_var.HOST
        }

        if(env_var.HOST === "localhost"){
            parameters.url += ":" + env_var.S_PORT;
        }
        res.render('../views/simulator/admin.ejs', {info: parameters});
    } else{
        res.send("<script>location.href='/simulator/admin/login';</script>");
    }
}




module.exports = {
    main,
}