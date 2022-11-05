const adminDAO = require('../model/adminDAO');


const admin = {}

const admin_login = {}

const session_check = async (req, res, ejs) => {
    let user_key = (req.params.user_key == undefined) ? 1 : req.params.user_key;

    req.session.user_key = user_key;
    req.session.save(function(){
        if(req.session.admin_key){
            const parameters = {
                user_key: req.session.admin_key,
            }
            res.render(`../views${ejs}.ejs`, {admin: true, user_key});
        } else{
            res.send(`<script>location.href='/admin/login';</script>`);
        }
    })    
}


admin.login = async (req, res) => {
    if(req.session.admin_key){
        const parameters = {
            user_key: req.session.admin_key,
        }
        res.send(`<script>location.href='/admin';</script>`);
    } else{
        res.render(`../views/admin/login.ejs`);if(req.session.admin_key){
            const parameters = {
                user_key: req.session.admin_key,
            }
            res.render(`../views${ejs}.ejs`, );
        } else{
            res.send(`<script>location.href='/login';</script>`);
        }
    }
}

admin.monitoring = async (req, res) => {
    let ejs = '/sensor/monitoring'
    session_check(req, res, ejs)
}

admin.log = async (req, res) => {
    let ejs = '/sensor/log'
    session_check(req, res, ejs)
}

admin.setting = async (req, res) => {
    let ejs = '/admin/setting'
    session_check(req, res, ejs)
}

admin.sensorSet = async (req, res) => {
    let ejs = '/sensor/sensorSet'
    session_check(req, res, ejs)
}

admin.gapSet = async (req, res) => {
    let ejs = '/admin/gapSet'
    session_check(req, res, ejs)
}


admin_login.login = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await adminDAO.user_check(parameters);
    if(db_data.length != 0){
        req.session.admin_key = db_data[0].admin_key;
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/admin';</script>");
        })
    } else{
        delete req.session.admin_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/admin/login';</script>");
    }
}


admin_login.logout = async (req, res) => {
    delete req.session.admin_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/admin/login';</script>");
}


module.exports = {
    admin,
    admin_login
}