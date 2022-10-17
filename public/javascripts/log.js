/* 기간별 검색 */
const log_search = function(){
    let start_input = document.getElementById("start_date").value + " "+ document.getElementById("start_time").value;
    let end_input = document.getElementById("end_date").value + " "+ document.getElementById("end_time").value;

    

    let start = new Date(start_input);            
    let end = new Date(end_input);

    if(start > end){
        alert("잘못된 날짜 입력");
        return "";
    } else if(!isNaN(start.getDate()) || !isNaN(end.getDate())){
        return `&start=${start_input}&end=${end_input}`;
    } else {
        return "";
    }
}


/* 그래프 그리기 api 호출 */
log_graph_draw = () => {
    const sensor_value = {
        Tc: [],
        DO: [],
        DOper: [],
        pH: [],
        Sa: [],
        ORP: [],
        date: []
    }

    let search = log_search();
    $.ajax({
        type:'get',
        dataType:'json',
        url:`/api/sensor/log/graph?page=${search}`,
        success : function(responseData) {
            const log = responseData.result;
            
            for(let i=0; i<log.length; i++){
                sensor_value.Tc.unshift(log[i]['Tc'])
                sensor_value.DO.unshift(log[i]['DO'])
                sensor_value.DOper.unshift(log[i]['DOper'])
                sensor_value.pH.unshift(log[i]['pH'])
                sensor_value.Sa.unshift(log[i]['Sa'])
                sensor_value.ORP.unshift(log[i]['ORP'])
                sensor_value.date.unshift(log[i]['date'])
            }

            console.log(sensor_value)

            console.log(search)

            search_split = search.split("=")

            log_highchart(sensor_value)
            

        },
        error : function(error) {
        }
    });
}


/* highchart 그래프 설정  */
const log_highchart = (sensor_value) => {
    let chart = new Highcharts.chart('graph_container', {
        chart: {
            renderTo: 'graph_container',
            height: '470px'
        },
        title: {
            margin: 50,
            text: "그래프 그리기"
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: ''
            }
        },

        xAxis:{
            categories: sensor_value.date,
            visible: false,
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
            name: '수온 (C)',
            data: sensor_value.Tc,
            tooltip: {
                valueSuffix: ' C'
            },
            marker: { enabled: false }
        }, {
            name: 'DO (mg/L)',
            data: sensor_value.DO,
            tooltip: {
                valueSuffix: ' mg/L'
            },
            marker: { enabled: false }
        }, {
            name: 'DO (%)',
            data: sensor_value.DOper,
            tooltip: {
                valueSuffix: ' %'
            },
            marker: { enabled: false }
        }, {
            name: 'pH',
            data: sensor_value.pH,
            marker: { enabled: false }
        }, {
            name: '염도',
            data: sensor_value.Sa,
            marker: { enabled: false }
        },{
            name: 'ORP',
            data: sensor_value.ORP,
            marker: { enabled: false }
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
    console.log(search)
    let log_table_inner = `<tr>
                                <th>date</th>
                                <th>수온 (C)</th>
                                <th>DO (mg/L)</th>
                                <th>DO (%)</th>
                                <th>pH</th>
                                <th>염도</th>
                                <th>ORP</th>
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
    location.href = `/api/sensor/log/down?${search}`;
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