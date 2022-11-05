const sensorSet_before_value = function(setting){
    const sensor = ['Tc', 'DO', 'pH', 'Sa', 'ORP', 'TUR']

    for(let i=0; i<6; i++){
        let low = setting[sensor[i]+"_low"]
        let high = setting[sensor[i]+"_high"]

        sliderOne[i].min = low-10;
        sliderOne[i].max = high+10;
        sliderOne[i].value = low;

        sliderTwo[i].min = low-10;
        sliderTwo[i].max = high+10;
        sliderTwo[i].value = high;


        slideOne(i)
        slideTwo(i)
    }
}

const sensorSet_before = function(){
    $.ajax({
        type:'get',
        dataType:'json',
        url:`/api/sensor/set`,
        success : function(responseData) {
            const setting = responseData.result;

            sensorSet_before_value(setting)
        },
        error : function(error) {
        }
    });
}

const sensorSet_update = function () {
    const sensor = ['Tc', 'DO', 'pH', 'Sa', 'ORP', 'TUR']

    const parameters = {}

    for(let i=0; i<6; i++){
        parameters[sensor[i]+"_low"]  = valueOne[i].value
        parameters[sensor[i]+"_high"]  = valueTwo[i].value
    }
    console.log(parameters)

    sensorSet_update_ajax(parameters);
}


const sensorSet_update_ajax = function(parameters){
    $.ajax({
        type:'post',
        data: parameters,
        dataType:'json',
        url:`/api/sensor/set`,
        success : function(responseData) {
            
            alert("임계값 설정이 완료되었습니다.") 
        },
        error : function(error) {
        }
    });
}