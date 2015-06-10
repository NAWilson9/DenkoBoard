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
    var contacts = {
        'contacts': []
    };
    for(var i = 0; i < contactValues.length; i++){
        var contact = {};
        contact.type = contactValues[i].getElementsByTagName('label')[0].innerHTML;
        contact.value = contactValues[i].getElementsByTagName('input')[0].value;
        contacts.contacts.push(contact);
    }
    socket.emit('updateContacts', contacts);
};

var announcementsSubmit = function() {
    var announcementValues = document.getElementsByName('announcements');
    var announcements = {
        'announcements': []
    };
    for (var i = 0; i < announcementValues.length; i++) {
        var contact = {};
        contact.type = announcementValues[i].getElementsByTagName('h4')[0].innerHTML;
        contact.value = announcementValues[i].getElementsByTagName('p')[0].innerHTML;
        announcements.announcements.push(contact);
    }
    socket.emit('updateAnnouncements', announcements);
};

var test = function(){
    console.log('Weather requested');
    socket.emit('getWeather');
};

var hype = function(){

};
