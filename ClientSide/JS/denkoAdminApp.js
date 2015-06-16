/**
 * Created by nwilson on 6/15/2015.
 */

var app = angular.module('denkoAdminApp', []);

app.controller('announcementEditor', function($scope){
    $scope.announcements = {};
    $scope.newAnnouncement = {};

    //Clears the values of the new announcement cells
    $scope.clearNewAnnouncement = function(){
        $scope.newAnnouncement.title = '';
        $scope.newAnnouncement.value = '';
    };

    //Function that is called when the add button is hit
    $scope.addNewAnnouncement = function(){
        if(!$scope.newAnnouncement.title || ! $scope.newAnnouncement.value){
            alert('You cannot add an announcement with a blank field.');
        } else {
            var newAnnouncement = {
                'title': $scope.newAnnouncement.title,
                'value': $scope.newAnnouncement.value
            };
            $scope.announcements.push(newAnnouncement);
            $scope.clearNewAnnouncement();
        }
    };

    //Deletes an announcement
    $scope.deleteAnnouncement = function(index){
        $scope.announcements.splice(index, 1);
    };

    //Function that is called when the submit button is hit
    $scope.submit = function(){
      socket.emit('storeAnnouncements', $scope.announcements);
    };

    //Receives updated announcements
    socket.on('getAnnouncements', function(data){
        if(data && data.length){
            console.log('Updated announcements have been received');
            $scope.announcements = data;
            $scope.$apply();
        } else {
            console.log('Received announcement object was blank. Trying again...');
            setTimeout(function(){ socket.emit('getAnnouncements');}, 1000);
        }
    });
});

app.controller('contactEditor', function($scope){
    $scope.contacts = {};
    $scope.newContact = {};

    //Clears the values of the new contact cells
    $scope.clearNewContact = function(){
        $scope.newContact.title = '';
        $scope.newContact.value = '';
    };

    //Function that is called when the add button is hit
    $scope.addNewContact = function(){
        if(!$scope.newContact.title || ! $scope.newContact.value){
            alert('You cannot add a contact with a blank field.');
        } else {
            var newContact = {
                'title': $scope.newContact.title,
                'value': $scope.newContact.value
            };
            $scope.contacts.push(newContact);
            $scope.clearNewContact();
        }
    };

    //Deletes an contact
    $scope.deleteContact = function(index){
        $scope.contacts.splice(index, 1);
    };

    //Function that is called when the submit button is hit
    $scope.submit = function(){
        socket.emit('storeContacts', $scope.contacts);
    };

    //Receives updated contacts
    socket.on('getContacts', function(data){
        if(data && data.length){
            console.log('Updated contacts have been received');
            $scope.contacts = data;
            $scope.$apply();
        } else {
            console.log('Received contact object was blank. Trying again...');
            setTimeout(function(){ socket.emit('getContacts');}, 1000);
        }
    });
});

