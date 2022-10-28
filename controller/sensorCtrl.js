"use strict"

const sensorDAO = require('../model/sensorDAO');

const { paging } = require('./tool/paging');

const dayjs = require("dayjs");
const fastcsv = require('fast-csv');
const fs = require('fs');
const { request } = require('http');
const session = require('express-session');

const set = {}
const log = {}

set.before = async (req, res) => {
    const parameters = {
        user_key1: (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null,
        user_key2: req.session.user_key
    }

    let db_data = await sensorDAO.sensor_set.before(parameters)
    const result = db_data[0]

    res.send({"result": result})
}

set.update = async (req, res) => {
    const parameters = {
        user_key1: (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null,
        user_key2: req.session.user_key,

        DO_high: req.body.DO_high,
        DO_low: req.body.DO_low,
        pH_high: req.body.pH_high,
        pH_low: req.body.pH_low,
        Sa_high: req.body.Sa_high,
        Sa_low: req.body.Sa_low,
        ORP_high: req.body.ORP_high,
        ORP_low: req.body.ORP_low,
        Tc_high: req.body.Tc_high,
        Tc_low: req.body.Tc_low,
        TUR_high: req.body.TUR_high,
        TUR_low: req.body.TUR_low,
    }

    await sensorDAO.sensor_set.update(parameters)

    let db_data = await sensorDAO.sensor_set.before(parameters)
    const result = db_data[0]

    res.send({"result": result})
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







module.exports = {
    set,
    log
}