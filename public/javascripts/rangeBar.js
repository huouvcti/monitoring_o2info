let sliderOne = document.getElementsByClassName("slider-1");
let sliderTwo = document.getElementsByClassName("slider-2");

let valueOne = document.getElementsByClassName("value_low");
let valueTwo = document.getElementsByClassName("value_high");

let minGap = 0;
let sliderTrack = document.getElementsByClassName("slider-track");

function slideOne(i){
    if(sliderTwo[i].value - sliderOne[i].value <= minGap){
        sliderOne[i].value = sliderTwo[i].value - minGap;
    }
    valueOne[i].value = sliderOne[i].value;
    fillColor(i);
}
function slideTwo(i){
    if(sliderTwo[i].value - sliderOne[i].value <= minGap){
        sliderTwo[i].value = sliderOne[i].value + minGap;
    }
    valueTwo[i].value = sliderTwo[i].value;
    fillColor(i);
}

function inputOne(i){
    if(valueTwo[i].value - valueOne[i].value <= minGap){
        valueOne[i].value = valueTwo[i].value + minGap;
    }
    sliderOne[i].value = valueOne[i].value;
    fillColor(i)
}

function inputTwo(i){
    if(valueTwo[i].value - valueOne[i].value <= minGap){
        valueTwo[i].value = valueOne[i].value + minGap;
    }
    sliderTwo[i].value = valueTwo[i].value;
    fillColor(i)
}

function fillColor(i){
    percent1 = (sliderOne[i].value-sliderOne[i].min) / (sliderOne[i].max-sliderOne[i].min) * 100 ;
    percent2 = (sliderTwo[i].value-sliderOne[i].min) / (sliderOne[i].max-sliderOne[i].min) * 100 ;
    sliderTrack[i].style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}