const checkNaN_int = (number) => {
    if(isNaN(parseInt(number))){
        return null
    } else {
        return parseInt(number)
    }
}


const checkNaN_float = (number) => {
    if(isNaN(parseFloat(number))){
        return null
    } else {
        return parseFloat(number)
    }
}


module.exports = {
    checkNaN_int,
    checkNaN_float
}   