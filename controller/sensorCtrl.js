"use strict"

const sensorDAO = require('../model/sensorDAO');

const { paging } = require('./tool/paging');

const { checkNaN_int, checkNaN_float } = require('./tool/checkNaN');

const dayjs = require("dayjs");
const fastcsv = require('fast-csv');
const fs = require('fs');

const set = {}
const log = {}

const gap = {}

set.before = async (req, res) => {
    const parameters = {
        user_key1: checkNaN_int(req.get('user_key')),
        user_key2: checkNaN_int(req.session.user_key),
    }

    if(parameters == null && parameters && null){
        console.log("user_key: ", user_key1, user_key2)

        res.send({"result": "user_key null"})
    } else{
        let db_data = await sensorDAO.sensor_set.before(parameters)
        const result = db_data[0]

        res.send({"result": result})
    }
    
}

set.update = async (req, res) => {
    const parameters = {
        user_key1: checkNaN_int(req.get('user_key')),
        user_key2: checkNaN_int(req.session.user_key),

        DO_high: checkNaN_float(req.body.DO_high),
        DO_low: checkNaN_float(req.body.DO_low),
        pH_high: checkNaN_float(req.body.pH_high),
        pH_low: checkNaN_float(req.body.pH_low),
        Sa_high: checkNaN_float(req.body.Sa_high),
        Sa_low: checkNaN_float(req.body.Sa_low),
        ORP_high: checkNaN_float(req.body.ORP_high),
        ORP_low: checkNaN_float(req.body.ORP_low),
        Tc_high: checkNaN_float(req.body.Tc_high),
        Tc_low: checkNaN_float(req.body.Tc_low),
        TUR_high: checkNaN_float(req.body.TUR_high),
        TUR_low: checkNaN_float(req.body.TUR_low),
    }

    if(parameters == null && parameters && null){
        console.log("user_key: ", user_key1, user_key2)
        res.send({"result": "user_key null"})

    } else{
        if(parameters.DO_high == null || parameters.DO_low == null || 
            parameters.pH_high == null || parameters.pH_low == null ||
            parameters.Sa_high == null || parameters.Sa_low == null ||
            parameters.ORP_high == null || parameters.ORP_low == null ||
            parameters.Tc_high == null || parameters.Tc_low == null ||
            parameters.TUR_high == null || parameters.TUR_low == null ) {

            res.send({"result": "setting value null"})
        } else {
            await sensorDAO.sensor_set.update(parameters)

            let db_data = await sensorDAO.sensor_set.before(parameters)
            const result = db_data[0]

            res.send({"result": result})
        }
    }
}





log.list = async (req, res) => {
    let currentPage = req.query.page;
    const pageSize = 10;
    const page = paging(currentPage, pageSize);

    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
        offset: page.offset,
        limit: page.limit,
    }
    console.log(parameters)
    const pageCnt = await sensorDAO.sensor_log.list_cnt(parameters);
    const cnt = parseInt(pageCnt[0].cnt / pageSize);

    const total_cnt = pageCnt[0].cnt

    const db_data =  await sensorDAO.sensor_log.list(parameters);

    // console.log(db_data)

    res.send({result:db_data, total_cnt, cnt});
}

log.graph = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,

    }
    const db_data =  await sensorDAO.sensor_log.graph(parameters);

    res.send({result:db_data});
}


log.down = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == " " || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    }

    console.log(parameters)

    const time = dayjs().format('YYYY-MM-DD-HHmmss');

    try{
        const db_data = await sensorDAO.sensor_log.down(parameters);

        const ws = await fs.createWriteStream(__dirname + '/../public/csv/' + time + '.csv');
        
        fastcsv.write(db_data, {headers: true})
            .on("finish", () => {
                console.log("file write success");
            })
            .pipe(ws);

        setTimeout(() => {
            res.download(__dirname + '/../public/csv/' + time + '.csv');
        }, 500)

    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

log.del = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == " " || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    }

    console.log(parameters)

    await sensorDAO.sensor_log.del(parameters);

    const result = {}
    result.user_key = parameters.user_key;
    result.msg = "log delete success"
    res.send("<script>alert(`데이터 삭제 완료`); location.href='/log';</script>")
}





gap.before = async (req, res) => {
    const parameters = {
        user_key1: checkNaN_int(req.get('user_key')),
        user_key2: checkNaN_int(req.session.user_key),
    }

    if(parameters == null && parameters && null){
        console.log("user_key: ", user_key1, user_key2)

        res.send({"result": "user_key null"})
    } else{
        let db_data = await sensorDAO.sensor_gap.before(parameters)
        const result = db_data[0]

        res.send({"result": result})
    }
    
}

gap.update = async (req, res) => {
    const parameters = {
        user_key1: checkNaN_int(req.get('user_key')),
        user_key2: checkNaN_int(req.session.user_key),

        DO: checkNaN_float(req.body.DO),
        pH: checkNaN_float(req.body.pH),
        Sa: checkNaN_float(req.body.Sa),
        ORP: checkNaN_float(req.body.ORP),
        Tc: checkNaN_float(req.body.Tc),
        TUR: checkNaN_float(req.body.TUR),
    }

    if(parameters == null && parameters && null){
        console.log("user_key: ", user_key1, user_key2)
        res.send({"result": "user_key null"})

    } else{
        if(parameters.DO == null || parameters.pH == null ||
            parameters.Sa == null || parameters.ORP == null ||
            parameters.Tc == null || parameters.TUR == null) {

            res.send({"result": "setting value null"})
        } else {
            await sensorDAO.sensor_gap.update(parameters)

            let db_data = await sensorDAO.sensor_gap.before(parameters)
            const result = db_data[0]

            res.send({"result": result})
        }
    }
}






module.exports = {
    set,
    log,

    gap
}