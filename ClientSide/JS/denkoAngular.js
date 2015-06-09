/**
 * Created by Nick on 6/8/2015.
 */
(function(){
    var app = angular.module('denkoAngular', []);
    app.controller('musicController', function(){
        this.songs = songs;
    });

    app.controller('weatherController', function(){
       this.weather = weather;
    });

    app.controller('infoController', function(){
        this.announcements = announcements;
        this.contactInformation = contactInformation;
    });

    var songs = [
        { title: 'Summer', artist: 'Calvin Harris'},
        { title: 'Detonate', artist: 'Netsky'},
        { title: 'Fragile Earth', artist: 'UNQUOTE'},
        { title: 'Green Destiny', artist: 'Fred V & Grafix'},
        { title: 'Song in the Key of Knife', artist: 'London Elektricity'},
        { title: 'Black Cloud', artist: 'Royalston'},
        { title: 'Detroit', artist: 'Rockwell'},
        { title: '1234', artist: 'Rockwell'},
        { title: 'INeedU', artist: 'Rockwell'},
        { title: 'Atlantis', artist: 'Enei'}
    ];

    var weather = [
        { time: '8:00AM', temperature: '72F', conditions:'Sunny'},
        { time: '9:00AM', temperature: '72F', conditions:'Sunny'},
        { time: '10:00AM', temperature: '73F', conditions:'Sunny'},
        { time: '11:00AM', temperature: '73F', conditions:'Sunny'},
        { time: '12:00PM', temperature: '74F', conditions:'Sunny'},
        { time: '1:00PM', temperature: '74F', conditions:'Sunny'},
        { time: '2:00PM', temperature: '75F', conditions:'Sunny'},
        { time: '3:00PM', temperature: '74F', conditions:'Sunny'},
        { time: '4:00PM', temperature: '73F', conditions:'Sunny'},
        { time: '5:00PM', temperature: '72F', conditions:'Sunny'}

    ];

    var announcements = [
        { title: 'Time', comment: 'Get your time in by Friday'},
        { title: 'OOO', comment: "I'll be OOO Wednesday - Friday. Skype me if you have any problems"},
        { title: 'Pizza', comment: 'Pizza today!'}
    ];

    var contactInformation = [
        { type: '4 Help Number', value: '123-456-7890'},
        { type: 'Office Number', value: '123-456-7890'},
        { type: 'Cell Number', value: '123-456-7890'},
        { type: 'Email Address', value: 'Bossman@email.com'},
        { type: 'Skype Name', value: 'Boss@email.com'}
    ];
})();
