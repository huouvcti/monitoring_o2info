const pw_update = function(){
    const parameters = {
        id: document.getElementById("input_id").value,
        pw: document.getElementById("input_pw").value,
        pw_new: document.getElementById("input_pw_new").value,
    }

    if(parameters.id != "" && parameters.pw != "" && parameters.pw_new != ""){
        $.ajax({
            type:'post',
            data: parameters,
            dataType:'json',
            url:`/api/user/pw_update`,
            success : function(responseData) {
                let result = responseData.result;
    
                if(result.msg.includes("ERROR")){
                    alert(result.msg)
                } else{
                    alert(result.msg)
                    window.location.href = "/setting";
                }
    
            },
            error : function(error) {
            }
        });
    } else{
        alert("빈칸을 모두 입력해주세요")
    }

    
}