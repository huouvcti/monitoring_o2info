/* 기간별 검색 */



const log_search = function(){
    let start_input = document.getElementById("start_date").value;
    let end_input = document.getElementById("end_date").value;

    // let start_input = ''
    // let end_input = ''

    let start = new Date(start_input);            
    let end = new Date(end_input);

    if(start > end){
        alert("잘못된 날짜 입력");
        return "";
    } else if(!isNaN(start.getDate()) || !isNaN(end.getDate())){
        console.log(end_input)
        return `&start=${start_input}&end=${end_input}`;
    } else {
        return "";
    }
}

function date_format(y, m, d) {
    if(m < 10){
        m = '0'+m
    }
    if(d < 10){
        d = '0'+d
    }

    return y+'-'+m+'-'+d
}

const newly_search = function(selected){
    let start_input = document.getElementById("start_date");
    let end_input = document.getElementById("end_date");

    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let day = today.getDate();  // 날짜


    end_input.value = date_format(year, month, day)

    if(selected == 'month'){
        month -= 1

        if(month < 1){
            year -= 1
            month = 1
        }
        start_input.value = date_format(year, month, day)
    } else if(selected == 'week'){
        for (let i=0; i<7; i++){
            day -= 1
            if(day < 1){
                month -= 1
                day = 30
            }
        }
        start_input.value = date_format(year, month, day)
    } else if(selected == 'day'){
        start_input.value = date_format(year, month, day)
    } else if(selected == 'x'){
        start_input.value = ''
        end_input.value = ''
    }

    
}

// 연도별, 월별, 일별 검색
// const log_search = () => {
//     const select_year = document.getElementById('search_year');
//     const select_month = document.getElementById('search_month');
//     const select_day = document.getElementById('search_day');

//     const option_year = document.getElementsByClassName('search_year');
//     const option_month = document.getElementsByClassName('search_month');
//     const option_day = document.getElementsByClassName('search_day');

//     if(select_year.selectedIndex == 0 && (select_month.selectedIndex != 0 || select_day.selectedIndex != 0)){
//         alert("연도 선택을 해주세요")
//     } else if(select_month.selectedIndex == 0 && select_day.selectedIndex != 0){
//         alert("월 선택을 해주세요")
//     } else {
//         return `&year=${select_year.selectedIndex}&month=${select_month.selectedIndex}&day=${select_day.selectedIndex}`;
//     }
// }

// let newly_num;

// const newly_search = (num) => {
//     let newly;
//     newly_num = num;

//     for(let i=0; i<4; i++){
//         document.getElementsByClassName("newly_label")[i].style.backgroundColor = "#efefef";
//         document.getElementsByClassName("newly_label")[i].style.color = "#000";

//         if(i == num){
//             document.getElementsByClassName("newly_label")[num].style.backgroundColor = "#354793";
//             document.getElementsByClassName("newly_label")[num].style.color = "#fff";
//         }
            
//     }

//     if(num == 0){
//         newly = 'month';    
//     } else if(num == 1) {
//         newly = 'week';
//     } else if(num == 2){
//         newly = 'day';
//     } else {
//         newly = '';
//     }

//     return `&newly=${newly}`
// }




const sensor_value = {
    Tc: [],
    DO: [],
    DOper: [],
    pH: [],
    Sa: [],
    ORP: [],
    TUR: [],
    date: [],
}

let sensor_data_length = 0;

const log_graph_select = () =>  {
    const sensor_name = ['Tc', 'DO', 'DOper', 'pH', 'Sa', 'ORP', 'TUR']
    const sensor_title = ['수온 (°C)', '산소 (mg/L)', '산소 (%)', 'pH (pH)', '염도 (ppt)', 'ORP (mV)', '탁도 (NTU)']
    const sensor_unit = [' °C', ' mg/L', ' %', ' pH', ' ppt', ' mV', ' NTU']
    const sensor_color = ["#fa5252", "#52bafa", "#52bafa", "#665d54", "#3c8f70", "#fa9852", "#71548c"]

    let select_index = document.getElementById("graph_sensor_select").selectedIndex

    
    
    if(select_index > 0){
        select_index -= 1

        log_highchart(sensor_value[sensor_name[select_index]], sensor_value.date, sensor_title[select_index], sensor_unit[select_index], sensor_color[select_index])
    } else {
        log_all_highchart(sensor_value, sensor_value.date, sensor_title, sensor_unit, sensor_color)
    }
}


const log_graph_show = () =>{
    const sensor_name = ['Tc', 'DO', 'DOper', 'pH', 'Sa', 'ORP', 'TUR']
    const sensor_title = ['수온 (°C)', '산소 (mg/L)', '산소 (%)', 'pH (pH)', '염도 (ppt)', 'ORP (mV)', '탁도 (NTU)']
    const sensor_unit = [' °C', ' mg/L', ' %', ' pH', ' ppt', ' mV', ' NTU']
    const sensor_color = ["#fa5252", "#52bafa", "#52bafa", "#665d54", "#3c8f70", "#fa9852", "#71548c"]


    for(let i=0; i<7; i++){
        if(i != 2){
            log_highchart(('graph_container_'+sensor_name[i]), sensor_value[sensor_name[i]], sensor_value.date, sensor_title[i], sensor_unit[i], sensor_color[i])
        }
        
    }
}




/* 그래프 그리기 api 호출 */
const log_graph_api = () => {

    sensor_value.Tc = []
    sensor_value.DO = []
    sensor_value.DOper = []
    sensor_value.pH = []
    sensor_value.Sa = []
    sensor_value.ORP = []
    sensor_value.TUR = []
    sensor_value.date = []

    sensor_data_length = 0;

    let search = log_search();

    let search_tick_value = document.querySelector('input[name="search_tick"]:checked').value
    let search_tick

    if(search_tick_value == '5m'){
        // 5분
        search_tick = 15
    } else if(search_tick_value == '10m'){
        search_tick = 30
    } else{
        // 20초
        search_tick = 1
    }
    
    console.log(search_tick)
    

    $.ajax({
        type:'get',
        dataType:'json',
        url:`/api/sensor/log/graph?page=${search}`,
        success : function(responseData) {
            const log = responseData.result;

            sensor_data_length = log.length / search_tick
            
            for(let i=0; i<log.length; i+=search_tick){
                sensor_value.Tc.unshift((Math.round(log[i]['Tc'] * 100) / 100));
                sensor_value.DO.unshift((Math.round(log[i]['DO'] * 100) / 100));
                sensor_value.pH.unshift((Math.round(log[i]['pH'] * 100) / 100));
                sensor_value.Sa.unshift((Math.round(log[i]['Sa'] * 100) / 100));
                sensor_value.ORP.unshift((Math.round(log[i]['ORP'] * 100) / 100));
                sensor_value.TUR.unshift((Math.round(log[i]['TUR'] * 100) / 100));
                sensor_value.date.unshift(log[i]['date']);
            }

            console.log(sensor_value)

            console.log(search)


            log_graph_show();

            // log_graph_select();
            

        },
        error : function(error) {
        }
    });
}



/* highchart 그래프 설정  */
let chart;

const log_all_highchart = (sensor_data, date, title, unit, color) => {
    chart = new Highcharts.chart('graph_container', {
        chart: {
            renderTo: 'graph_container',
            height: '470px',
        },
        title: {
            margin: 30,
            text: '.'
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: ''
            },

            color:'#000',

            lineColor: '#000',

            labels : {
                style:{
                    color: '#000',
                    fontSize: '1rem',
                borderWidth: 0,
                color: (
                    Highcharts.defaultOptions.title &&
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || '#333333',
                style: {
                    fontSize: '16px'
                }
                }
            }
        },

        xAxis:{
            categories: date,
            // visible: false,

            gridLineWidth:1,

            labels : {
                style:{
                    color: '#000',
                    fontSize: '1rem',
                    top: '100px'
                }
            },

            tickInterval: 100,
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        tooltip:{
            formatter: this.x,
        },
        credits: {
            enabled: false
        },


        series: [{
            name: title[0],
            data: sensor_value.Tc,
            tooltip: {
                valueSuffix: unit[0]
            },
            color: color[0],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[1],
            data: sensor_value.DO,
            tooltip: {
                valueSuffix: unit[1]
            },
            color: color[1],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[2],
            data: sensor_value.DOper,
            tooltip: {
                valueSuffix: unit[2]
            },
            color: color[2],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[3],
            data: sensor_value.pH,
            tooltip: {
                valueSuffix: unit[3]
            },
            color: color[3],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[4],
            data: sensor_value.Sa,
            tooltip: {
                valueSuffix: unit[4]
            },
            color: color[4],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[5],
            data: sensor_value.ORP,
            tooltip: {
                valueSuffix: unit[5]
            },
            color: color[5],
            marker: { enabled: false },
            lineWidth: 3
        }, {
            name: title[6],
            data: sensor_value.TUR,
            tooltip: {
                valueSuffix: unit[6]
            },
            color: color[6],
            marker: { enabled: false },
            lineWidth: 3
        }]


    });

    return chart
}

const log_highchart = (container, sensor_data, date, title, unit, color) => {
    chart = new Highcharts.chart(container, {
        chart: {
            renderTo: container,
            height: '350px',
        },
        title: {
            margin: 30,
            text: title
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: ''
            },

            color:'#000',

            lineColor: '#000',

            labels : {
                style:{
                    color: '#000',
                    fontSize: '1rem',
                borderWidth: 0,
                color: (
                    Highcharts.defaultOptions.title &&
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || '#333333',
                style: {
                    fontSize: '16px'
                }
                }
            }
        },

        xAxis:{
            categories: date,
            // visible: false,

            gridLineWidth:1,

            labels : {
                style:{
                    color: '#000',
                    fontSize: '1rem',
                    top: '100px'
                }
            },

            tickInterval: Math.round(sensor_data_length*0.1),
            // tickLength: 100
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        tooltip:{
            formatter: this.x,
        },
        credits: {
            enabled: false
        },


        series: [{
            name: title,
            data: sensor_data,
            tooltip: {
                valueSuffix: unit
            },
            color: color,
            marker: { enabled: false },
            lineWidth: 3
        }]


    });

    return chart
}

/* 테이블 api 호출 */
let log_page = 0;
let log_cnt = 10;
let log_total_cnt = 100;

let paging = 10;

let log_table = document.getElementById("log_table")

let total_page_span = document.getElementById("total_page")
let page_span = document.getElementById("page")


const log_pageMove = function(move){
    let search = log_search();

    let newly_check_index = 100;

    // for(let i=0; i<4; i++){
    //     if(document.getElementsByName('newly')[i].checked){
    //         newly_check_index = i;
    //     }
    // }
    // let newly = newly_search(newly_check_index);

    console.log(search)
    let log_table_inner = `<tr>
                                <th>date</th>
                                <th>수온 (°C)</th>
                                <th>산소 (mg/L)</th>
                                <th>산소 (%)</th>
                                <th>pH (pH)</th>
                                <th>염도 (ppt)</th>
                                <th>ORP (mV)</th>
                                <th>탁도 (NTU)</th>
                            </tr>`;
    if(move === 'prev'){
        log_page--;
    } else if(move === 'next') {
        log_page++;
    } else {
        log_page = 0;
    }
    
    if(log_page < 0){
        log_page=0;
        alert("첫번째 페이지 입니다.")
    }
    if(log_page > log_cnt){
        log_page = log_cnt;
        alert("마지막 페이지 입니다.")
    }

    

    $.ajax({
        type:'get',
        dataType:'json',
        url:`/api/sensor/log?page=${log_page}${search}`,
        success : function(responseData) {
            const log = responseData.result;
            log_cnt = responseData.cnt;
            log_total_cnt = responseData.total_cnt;
            for(let i=0; i<log.length; i++){
                log_table_inner += `
                <tr>
                    <td> 
                        ${log[i]['date']}
                    </td>
                    <td> 
                        ${log[i]['Tc']}
                    </td>
                    <td> 
                        ${log[i]['DO']}
                    </td>
                    <td> 
                        ${log[i]['DOper']}
                    </td>
                    <td> 
                        ${log[i]['pH']}
                    </td>
                    <td> 
                        ${log[i]['Sa']}
                    </td>
                    <td> 
                        ${log[i]['ORP']}
                    </td>
                    <td> 
                        ${log[i]['TUR']}
                    </td>
                </tr>`;
            }
            log_table.innerHTML = log_table_inner;

            total_page_span.innerText = (log_page*10+1)+" to "+(log_page*10+log.length)+" of "+log_total_cnt;

            page_span.innerText = "Page "+(log_page+1)+" of "+(log_cnt+1);
        },
        error : function(error) {
        }
    });
}


/* 표/그래프 선택 버튼 */
const table_section = document.getElementById("table_section")
const graph_section = document.getElementById("graph_section")
const select_table = () =>{
    table_section.style.display= "block"
    graph_section.style.display = "none"
}
const select_graph = () =>{
    table_section.style.display = "none"
    graph_section.style.display = "block"
}



/* 로그 다운로드 */
const log_down = function(){
    let search = log_search();

    if(search == ''){
        alert('검색 기간을 설정해주세요')
    } else {
        location.href = `/api/sensor/log/down?${search}`;
    }
    
}

/* 로그 삭제 */
const log_del = function(){
    let search = log_search();

    if(confirm("정말로 삭제하시겠습니까?")){
        let check = prompt("'삭제합니다'를 입력해주세요.");
        if(check === "삭제합니다"){
            alert("데이터가 삭제됩니다.");
            location.href = `/api/sensor/log/del?${search}`;
        } else {
            alert("잘못된 입력");
        }
    }
}