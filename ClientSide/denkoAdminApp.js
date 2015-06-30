/**
 * Created by nwilson on 6/15/2015.
 */

var app = angular.module('denkoAdminApp', []);

app.controller('dataEditor', function($scope){
    var dataType = {};
    $scope.title = '';
    $scope.data = {};
    $scope.newData = {};

    //Sets up the controller for the type of data it's handling and registers the listener socket
    $scope.init = function(type){
      if(type == 'announcements'){
          dataType.data = 'announcement';
          dataType.receive = 'receiveAnnouncements';
          dataType.store = 'storeAnnouncements';
          $scope.title = 'Announcement';
      }  else if (type == 'contacts'){
          dataType.data = 'contact';
          dataType.receive = 'receiveContacts';
          dataType.store = 'storeContacts';
          $scope.title = 'Contact';
      }
        //Receives updated data
        socket.on(dataType.receive, function(data){
            console.log('hype');
            if(data && data.length){
                $scope.data = data;
                $scope.$apply();
                console.log('Updated ' + dataType.data + 's have been received');
            } else {
                console.log('Updated ' + dataType.data + 'object is empty');
            }
        });
    };

    //Deletes a data item
    $scope.deleteData = function(index){
        $scope.data.splice(index, 1);
    };

    //Called when the submit button is hit
    $scope.submit = function(){
        socket.emit(dataType.store, $scope.data);
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