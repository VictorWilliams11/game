

const display = document.getElementById("display");


function appendToDisplay(input) {
    display.value+=input;
}
function clearDisplay() {
display.value='';
}
function caculate() {
    try{
    display.value = eval(display.value);}
    catch(error){
        display.value='oga type well';
    }
}
function victor11() {
    display.value /=100
}
function vic() {
    display.value='victor is good';
}