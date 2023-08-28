"use strict"

const sensorDAO = require('../model/sensorDAO');

const { paging } = require('./tool/paging');

const { checkNaN_int, checkNaN_float } = require('./tool/checkNaN');

const dayjs = require("dayjs");
const fastcsv = require('fast-csv');
const fs = require('fs');


const log_search = (year, month, day) => {
    const parameters = {
    }

    year = parseInt(year)
    month = parseInt(month)
    day = parseInt(day)

    let start_year=0, start_month=0, start_day=0;
    let end_year=0, end_month=0, end_day=0;


    if(year == 0){
        start_year = 0;
        end_year = 3000;
    } else {
        if(month == 0){
            start_year = year + 2021;
            end_year = start_year+1;

            start_month = 0;
            end_month = 1;
            
        } else {
            start_year = year + 2021;
            end_year = start_year;

            if(day == 0){
                start_month = month;
                end_month = month+1;

                start_day = 0;
                end_day = 1;
            } else {
                start_month = month;
                end_month = start_month;

                start_day = day;
                end_day = day+1;  
            }
        }

    }

    parameters.date_start = start_year+'-'+start_month+'-'+start_day;
    parameters.date_end = end_year+'-'+end_month+'-'+end_day;

    return parameters
}

const set = {}
const log = {}

const gap = {}


const sensor = {}


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




/*
log.list = async (req, res) => {
    let currentPage = req.query.page;
    const pageSize = 10;
    const page = paging(currentPage, pageSize);

    console.log(req.query)

    if(req.query.newly == 'month' || req.query.newly == 'week' || req.query.newly == 'day'){
        const parameters = {
            user_key: req.session.user_key,
            newly: req.query.newly,
    
            offset: page.offset,
            limit: page.limit,
        }

        console.log(parameters)
        const pageCnt = await sensorDAO.sensor_log.list_newly_cnt(parameters);
        const cnt = parseInt(pageCnt[0].cnt / pageSize);
    
        const total_cnt = pageCnt[0].cnt
    
        const db_data =  await sensorDAO.sensor_log.list_newly(parameters);
    
        console.log(db_data)
    
        res.send({result:db_data, total_cnt, cnt});

    } else {
        const parameters = {
            user_key: req.session.user_key,
            // date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
            // date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    
            offset: page.offset,
            limit: page.limit,
        }
    
        let date_format = log_search(req.query.year, req.query.month, req.query.day)
    
        parameters.date_start = date_format.date_start
        parameters.date_end = date_format.date_end
    
    
        console.log(parameters)
        const pageCnt = await sensorDAO.sensor_log.list_cnt(parameters);
        const cnt = parseInt(pageCnt[0].cnt / pageSize);
    
        const total_cnt = pageCnt[0].cnt
    
        const db_data =  await sensorDAO.sensor_log.list(parameters);
    
        // console.log(db_data)
    
        res.send({result:db_data, total_cnt, cnt});
    }
}
*/

log.list = async (req, res) => {
    let currentPage = req.query.page;
    const pageSize = 10;
    const page = paging(currentPage, pageSize);

    console.log(req.query)

    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,

        offset: page.offset,
        limit: page.limit,
    }

    parameters.date_start += ' 00:00:00'
    parameters.date_end += ' 23:59:59'

    console.log(parameters)

    const pageCnt = await sensorDAO.sensor_log.list_cnt(parameters);
    const cnt = parseInt(pageCnt[0].cnt / pageSize);

    const total_cnt = pageCnt[0].cnt
    
    const db_data =  await sensorDAO.sensor_log.list(parameters);

    // console.log(db_data)

    res.send({result:db_data, total_cnt, cnt});
}

log.graph = async (req, res) => {
    // const parameters = {
    //     user_key: req.session.user_key,
    //     // date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
    //     // date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    // }

    // let date_format = log_search(req.query.year, req.query.month, req.query.day)

    // parameters.date_start = date_format.date_start
    // parameters.date_end = date_format.date_end

    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    }

    parameters.date_start += ' 00:00:00'
    parameters.date_end += ' 23:59:59'

    const db_data =  await sensorDAO.sensor_log.graph(parameters);

    res.send({result:db_data});
}

log.graph_tick = async (req, res) => {
    const parameters = {
        user_key: checkNaN_int(req.get('user_key'))
    }
    if(parameters.user_key != null){
        const db_data =  await sensorDAO.sensor_log.graph_tick(parameters);

        res.send({result:db_data});
    } else {
        res.send({result:"user_key null"});
    }
    

    
}


log.down = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    }

    parameters.date_start += ' 00:00:00'
    parameters.date_end += ' 23:59:59'

    // let date_format = log_search(req.query.year, req.query.month, req.query.day)

    // parameters.date_start = date_format.date_start
    // parameters.date_end = date_format.date_end

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
        date_start: (req.query.start == "" || req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == "" || req.query.end == undefined) ? "3000:01:01" : req.query.end,
    }

    // let date_format = log_search(req.query.year, req.query.month, req.query.day)

    // parameters.date_start = date_format.date_start
    // parameters.date_end = date_format.date_end

    console.log(parameters)

    await sensorDAO.sensor_log.del(parameters);

    const result = {}
    result.user_key = parameters.user_key;
    result.msg = "log delete success"

    if(req.session.admin_key){
        res.send("<script>alert(`데이터 삭제 완료`); location.href = '/admin' </script>")
    } else {
        res.send("<script>alert(`데이터 삭제 완료`); location.href = '/log' </script>")
    }
    
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




sensor.update = async (req, res) => {
    const parameters = {
        user_key: checkNaN_int(req.get('user_key')),
        
        Tc: checkNaN_float(req.body.temperature),
        DO: checkNaN_float(req.body.domg),
        DOper: checkNaN_float(req.body.DOpercent),
        pH: checkNaN_float(req.body.ph),
        Sa: checkNaN_float(req.body.salt),
        ORP: checkNaN_float(req.body.orp),
        TUR: checkNaN_float(req.body.turbidity),
    }

    if(!parameters.user_key){
        res.send({"result": "user_key null"})
    } else {
        await sensorDAO.sensor.insert(parameters);
        res.send({"result": "sensor update", "data": parameters})
    }

    
}



module.exports = {
    set,
    log,

    gap,
    sensor
}