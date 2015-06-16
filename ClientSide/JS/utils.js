/**
 * Created by nwilson on 6/9/2015.
 */

var initialize = function(){
    //updateTime();
};

//Get's the current time and updates the time element every second
/*var updateTime = function() {
    var dateObj = new Date();
    var date = dateObj.toLocaleDateString();
    var time = dateObj.toLocaleTimeString();
    document.getElementById('time').innerHTML = date + ' ' + time;
    setTimeout(updateTime, 1000);
};*/

var test = function(){
    console.log('Weather requested');
    socket.emit('getWeather');
};

var hype = function(){

};
