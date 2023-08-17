const SocketIO = require('socket.io');

const app = require('../app');

const userDAO = require('../model/userDAO');
const sensorDAO = require('../model/sensorDAO');

const { checkNaN_int, checkNaN_float} = require('../controller/tool/checkNaN');


/*
    FCM 메시지 보내기
*/
const admin = require('firebase-admin');       // module
const fcm_key = require('../firebase-key.json');    // 다운받은 key
    
// SDK 초기화
if (!admin.apps.length) {
    var fcm_admin = admin.initializeApp({
        credential: admin.credential.cert(fcm_key),
    });
}


let connect_count = 0;


// 버퍼 -> 조인 후 처음 값은 무시
let count = 0;

let sensor_name = ['Tc', 'DO', 'pH', 'Sa', 'ORP', 'TUR']
let sensor_name_show = ['수온', '산소', 'pH', '염도', 'ORP', '탁도']

const socketio = (server) => {
    const io = SocketIO(server, { path: '/socket.io', pingTimeout: 60000 });

    io.on('connection',  async (socket) => {
        let room = "";
    
        console.log("socket 접속");


        // disconnect
        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    
        // err
        socket.on('error', (err) => {
            console.log(err);
        });

        
        await socket.on('join', async (data) => {
            // console.log(data);


            let roomCount = io.sockets.adapter.rooms.get(1)?.size;
            console.log("user1 count: ", roomCount)


            room = parseInt(data.room);

            if(isNaN(room) || room == 'logout' || room == undefined){
                console.log("android socket");

                

                let data_android = JSON.parse(data)
                room = parseInt(data_android.room)
            }
            count = 0;


            

            socket.join(room)

            
            console.log(room + " join")

            parameters = {
                user_key: room
            }


            if(!isNaN(parameters.user_key) && parameters.user_key != undefined && parameters.user_key != ''){
                const sensor_before = await sensorDAO.sensor.before(parameters);
                await socket.emit("sensor_before", sensor_before)
            }

            
        })

        socket.on('sensor_send', async (data) =>{
            // console.log(data);

            // { "RTD" : "25.77" , "DOMG" : "0.01" , "PH" : "7.91" , "SALT" : "42.55" , "DOpersent" : "100.02" , "ORP" : "xxx.xx"}
            // DOMG: 용존산소 : DO
            // PH: 산성도 : pH
            // SALT: 염도 : Sa
            // ORP : ORP
            // RTD : 수온 : Tc
            // TUR : 탁도 : turbidity

            if(count != 0){         // 첫번째 값 무시
                const parameters = {
                    user_key: room,

                    Tc: checkNaN_float(data.RTD),
                    DO: checkNaN_float(data.DOMG),
                    DOper: checkNaN_float(data.DOpercent),
                    pH: checkNaN_float(data.PH),
                    Sa: checkNaN_float(data.SALT),
                    ORP: checkNaN_float(data.ORP),
                    TUR: checkNaN_float(data.turbidity),
                }

                

                if(isNaN(parameters.user_key) || parameters.user_key == ''){
                    console.log("user_key: ", parameters.user_key)
                } else{
                    // 오차 조정
                    let sensor_gap_db = await sensorDAO.sensor_gap.before({user_key1: room});
                    let sensor_gap = sensor_gap_db[0]

                    // console.log(sensor_gap_db)

                    for(let i=0; i<sensor_name.length; i++){
                        parameters[sensor_name[i]] += sensor_gap[sensor_name[i]]
                    }

                    // console.log(parameters)

                    await sensorDAO.sensor.insert(parameters);

                    const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
                    const time = new Date().toTimeString().split(" ")[0];
                    parameters.date = date + ' ' + time

                    // parameters.date = time;
                    // console.log(parameters.date);

                    io.in(room).emit('sensor_update', parameters);



                    const token_parameters = {
                        user_key: parameters.user_key,
                        user_key1: parameters.user_key,
                        user_key2: parameters.user_key,
                    }

                    let token_list = await userDAO.token.get(token_parameters)

                    let sensor_set_db = await sensorDAO.sensor_set.before(token_parameters)
                    let sensor_set = sensor_set_db[0]

                    for(let i=0; i<6; i++){
                        if(parameters[sensor_name[i]] != null){
                            let msg = [];

                            if(parameters[sensor_name[i]] < sensor_set[sensor_name[i]+'_low']){
                                // console.log(parameters.user_key + ", 임계치 미만")
                                // 임계치 보다 작은 값

                                for(let j=0; j<token_list.length; j++){
                                    await msg.push({
                                        notification: {
                                            title: "센서값 경고",
                                            body: sensor_name_show[i] + " 값이 임계치 미만입니다."
                                        },
                                        token: token_list[j]['token'] 
                                    })
                                }
                            } else if(parameters[sensor_name[i]] > sensor_set[sensor_name[i]+'_high']){
                                // console.log(parameters.user_key + ", 임계치 초과")
                                // 임계치 보다 큰 값
                                

                                for(let j=0; j<token_list.length; j++){
                                    await msg.push({
                                        notification: {
                                            title: "센서값 경고",
                                            body: sensor_name_show[i] + " 값이 임계치 초과입니다."
                                        },
                                        token: token_list[j]['token']
                                    })
                                }
                            }

                            if(msg.length != 0){
                                await fcm_admin.messaging().sendAll(msg)
                                .then((response) => {
                                    // Response is a message ID string.
                                    // console.log('Successfully sent message:', response);
                                })
                                .catch((error) => {
                                    // console.log('Error sending message:', error);
                                });
                            }

                            
                        }
                    }
        
                    
                }
            }

            count++;
        })


        // socket.on('on', async (data) =>{
        //     io.in(room).emit('ctrl_on', data);
        // })
        // socket.on('off', async (data) =>{
        //     io.in(room).emit('ctrl_off', data);
        // })
    });
 };

module.exports = {socketio}