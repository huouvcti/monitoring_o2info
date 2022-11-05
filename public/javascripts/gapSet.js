const sensor = ['Tc', 'DO', 'pH', 'Sa', 'ORP', 'TUR']
const gap_value = document.getElementsByClassName('gap_value')

const gapSet_before = function(){
    $.ajax({
        type:'get',
        dataType:'json',
        url:`/api/sensor/gapSet`,
        success : function(responseData) {
            const setting = responseData.result;

            for(let i=0; i<gap_value.length; i++){
                gap_value[i].value = setting[sensor[i]];
            }
        },
        error : function(error) {
        }
    });
}

const gapSet_update = function () {
    const parameters = {}
    for(let i=0; i<gap_value.length; i++){
        parameters[sensor[i]]  = gap_value[i].value
    }
    console.log(parameters)

    $.ajax({
        type:'post',
        data: parameters,
        dataType:'json',
        url:`/api/sensor/gapSet`,
        success : function(responseData) {
            alert("오차값 설정이 완료되었습니다.")
        },
        error : function(error) {
        }
    });
}