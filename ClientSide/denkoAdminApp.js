/**
 * Created by nwilson on 6/15/2015.
 */

var app = angular.module('denkoAdminApp', []);

var token = '';

app.controller('dataEditor', function($scope){
    var dataType = {};
    $scope.title = '';
    $scope.data = {};
    $scope.newData = {};

    //Sets up the controller for the type of data it's handling and registers the listener socket
    $scope.init = function(type){
      if(type == 'announcements'){
          dataType.data = 'announcement';
          dataType.request = 'requestAnnouncements';
          dataType.receive = 'receiveAnnouncements';
          dataType.store = 'storeAnnouncements';
          $scope.title = 'Announcement';
      }  else if (type == 'contacts'){
          dataType.data = 'contact';
          dataType.request = 'requestContacts';
          dataType.receive = 'receiveContacts';
          dataType.store = 'storeContacts';
          $scope.title = 'Contact';
      }
        //Receives updated data
        socket.on(dataType.receive, function(data){
            if(data && data.length){
                $scope.data = data;
                $scope.$apply();
                console.log('Updated ' + dataType.data + 's have been received');
            } else {
                console.log('Updated ' + dataType.data + 'object is empty');
            }
        });

        //Requests updated data
        socket.emit(dataType.request);
    };

    //Deletes a data item
    $scope.deleteData = function(index){
        $scope.data.splice(index, 1);
    };

    //Called when the submit button is hit
    $scope.submit = function(){
        var sendData = {
            authentication: token,
            data: $scope.data
        };
        socket.emit(dataType.store, sendData);
    };

    //Clears the values of the new data cells
    $scope.clearNewData = function(){
        $scope.newData.title = '';
        $scope.newData.value = '';
    };

    //Function that is called when the add button is hit
    $scope.addNewData = function(){
        if(!$scope.newData.title || ! $scope.newData.value){
            alert('You cannot add an ' + dataType.data + ' with a blank field.');
        } else {
            var newData = {
                'title': $scope.newData.title,
                'value': $scope.newData.value
            };
            $scope.data.push(newData);
            $scope.clearNewData();
        }
    };
});

app.controller('login', function($scope){
    $scope.password = '';

    //Sets up the controller for the type of data it's handling and registers the listener socket
    $scope.init = function(){
        socket.on('authenticationResponse', function(data){
            if(data && data.length > 0){
                token = data;
                console.log('Authentication successful');
            } else{
                console.log('Authentication failed');
                alert("Authentication failed");
            }
        })
    };

    $scope.authenticate = function(){
        socket.emit('authenticate', $scope.password);
    }
});

app.controller('admin', function($scope){
    var adminLogin = 'adminLogin.html';
    var adminEditor = 'adminEditor.html';
    $scope.template = adminLogin;

    socket.on('authenticationResponse', function(data) {
        if (data && data.length > 0) {
            $scope.template = adminEditor;
            $scope.$apply();
        }
    });
});