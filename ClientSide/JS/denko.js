/**
 * Created by nwilson on 6/9/2015.
 */

var initialize = function(){
    updateTime();
};

var updateTime = function() {
    var dateObj = new Date();
    var date = dateObj.toLocaleDateString();
    var time = dateObj.toLocaleTimeString();
    document.getElementById('time').innerHTML = date + ' ' + time;
    setTimeout(updateTime, 1000);

    /*console.log('toDatestring: ' + dateObj.toDateString());
    console.log('toLocaleDateString: ' + dateObj.toLocaleDateString());
    console.log('toLocaleString: ' + dateObj.toLocaleString());
    console.log('toLocaleTimeString: ' + dateObj.toLocaleTimeString());
    console.log('toUTCString: ' + dateObj.toUTCString());
    console.log('toString: ' + dateObj.toString());*/
};

var test = function(){
    console.log('Weather requested');
    socket.emit('getWeather');
};
