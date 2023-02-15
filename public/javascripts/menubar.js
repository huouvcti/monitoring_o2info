const sidebar = document.getElementById("sidebar");
const board = document.getElementById("board");

const title_text = document.getElementById("title")


const logout_btn = document.getElementById("logout_btn");

const menu_text = document.getElementsByClassName("menu_text");

const menu_category = ['모니터링', '기록', '설정']



let sidebar_wide = () =>{
    sidebar.style.width = "5%";
    board.style.width = "95%";
}

sidebar.addEventListener("click", function(){
    sidebar.style.width = "15%";
    logout_btn.style.display = "block";

    for(let i=0; i< menu_text.length; i++){
        menu_text[i].innerText = menu_category[i];
    }
})

board.addEventListener("click", function(){
    sidebar.style.width = "100px";
    logout_btn.style.display = "none";

    for(let i=0; i< menu_text.length; i++){
        menu_text[i].innerText = "";
    }
    
})