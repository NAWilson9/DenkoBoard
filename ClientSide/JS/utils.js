/**
 * Created by nwilson on 6/9/2015.
 */

var initialize = function(){
    updateTime();
    //socket.emit('getWeather');
};

//Get's the current time and updates the time element every second
var updateTime = function() {
    var dateObj = new Date();
    var date = dateObj.toLocaleDateString();
    var time = dateObj.toLocaleTimeString();
    document.getElementById('time').innerHTML = date + ' ' + time;
    setTimeout(updateTime, 1000);
};

var contactsSubmit = function(){
    var contactValues = document.getElementsByName('contact');
    var emptyField = false;
    var contacts = {
        'contacts': []
    };
    for(var i = 0; i < contactValues.length && !emptyField; i++){
        var contact = {};
        contact.type = contactValues[i].getElementsByTagName('input')[0].value;
        contact.value = contactValues[i].getElementsByTagName('input')[1].value;
        if(!contact.type || !contact.value){
            emptyField = true;
        }
        contacts.contacts.push(contact);
    }
    if(emptyField){
        alert('You cannot submit an empty field')
    } else {
        socket.emit('updateContacts', contacts);
    }
};

var announcementsSubmit = function() {
    var announcementValues = document.getElementsByName('announcements');
    var emptyField = false;
    var announcements = {
        'announcements': []
    };
    for (var i = 0; i < announcementValues.length && !emptyField; i++) {
        var announcement= {};
        announcement.type = announcementValues[i].getElementsByTagName('input')[0].value;
        announcement.value = announcementValues[i].getElementsByTagName('input')[1].value;
        if(!announcement.type || !announcement.value){
            emptyField = true;
        }
        announcements.announcements.push(announcement);
    }
    if(emptyField){
        alert('You cannot submit an empty field')
    } else {
        socket.emit('updateAnnouncements', announcements);
    }
};

var clearAdminCells = function(name){
    var fields = document.getElementById(name);
    for (var i = 0; i < fields.children.length; i++) {
        if(fields.children[i].type == 'text'){
            fields.children[i].value = '';
        }
    }
};

var test = function(){
    console.log('Weather requested');
    socket.emit('getWeather');
};

var hype = function(){

};
