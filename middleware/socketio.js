const SocketIO = require('socket.io');

const app = require('../app');

const sensorDAO = require('../model/sensorDAO');

let count = 0;

const socketio = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

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
            room = data.room;
            count = 0;

            socket.join(room)
            console.log(room + " join")

            parameters = {
                user_key: room
            }

            if(parameters.user_key != undefined){
                const sensor_before = await sensorDAO.sensor.before(parameters);
                await socket.emit("sensor_before", sensor_before)
            }
        })

        socket.on('sensor_send', async (data) =>{
            console.log(data);

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

                    Tc: parseFloat(data.RTD),
                    DO: parseFloat(data.DOMG),
                    DOper: parseFloat(data.DOpercent),
                    pH: parseFloat(data.PH),
                    Sa: parseFloat(data.SALT),
                    ORP: parseFloat(data.ORP),
                    TUR: parseFloat(data.turbidity)
                }

                console.log(parameters)
    
                await sensorDAO.sensor.insert(parameters);
    
                const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
                const time = new Date().toTimeString().split(" ")[0];
                parameters.date = date + ' ' + time
                console.log(parameters.date);
    
                io.in(room).emit('sensor_update', parameters);
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