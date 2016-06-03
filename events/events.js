var HSAppByOHCOW = {
    defaultStaus: {
        indoorBool: true,
        clothingLevel: 0,
        radiantLevel: 0,
        acclimatized: false
    },
    currentStatus: {
        indoorBool: true,
        clothingLevel: 0,
        radiantLevel: 0,
        acclimatized: false
    },
    
icon:{},

    layoutStrings: {
    title : 'Heat Stress Indicator',
    //info strings
    info : {
        acclimatization : 'stuff about acclimatixation',
        radiantHeat : 'stuff about heat radiation',
        clothing : 'stuff about clothing'
    }
    },
    //inflating
    construct: function(div){
        var Header_HS = document.createElement("div");
        var OutdoorMap_HS = document.createElement("div");
        var List_HS = document.createElement("div");
        var IndoorInput_HS = document.createElement("div");
        var Footer_HS = document.createElement("div");

        var divInnerHeight = div.innerHeight;
        var divInnerWidth = div.innerWidth;

        //headder
        if(divInnerHeight < '200px'){
            var HeadderTitle_HS = document.createElement("h3");
            Header_HS.appendChild(HeadderTitle_HS);

        }else{

            console.log(divInnerHeight);
            div.style = "background: blue; height: 4rem; width: 4rem;";
        }

        //list holder
        if(divInnerHeight < '50px'){
            console.log("too small");
            div.style = "background: blue; height: 4rem; width: 4rem;";
        }

        //footer
        if(divInnerHeight < '140px'){

        }
    },

    //adjust the div
    adjustHeightWidth: function (div){
        if(div.innerWidth < '50px'){
            div.width = '50px';
        }
        if(div.innerHeight < '120px'){
            div.width = '120px';
        }
    },

    //humidex
    calculateHumidex: function (temperature, humidity, radiant, clothing){
        //basic validation
        if(clothing > 3 || clothing < 0){
            console.error("clothing is out of range");
            return;
        };
        if(radiant > 10 || radiant < 0){
            console.error("radiant is out of range");
            return;
        };

        //calculation
        return temperature+5/9*((6.112* Math.pow(10,(7.5*temperature/(237.7+temperature)))*humidity/100)-10)+radiant*1.9*0.3+clothing*1.9;
    },

    //interpertation of humidex
    breakStrings : [
            'No Heat Stress', 
            'Post Heat Alerts, Start Recording',
            'Post Heat Warning, Watch for Symptoms',
            'Manditory 15 min Heat Break Every Hour',
            'Manditory 30 min Heat Break Every Hour',
            'Manditory 45 min Heat Break Every Hour',
            'ONLY MEDICALLY SUPERVISED WORK CAN CONTINUE',
            'error'
        ],

    waterNumbers : [
            'No Extra Water',
            'Encourage Extra Water',
            'Workers Need Extra Water',
            'Minimum of 1 Cup of Cool (10-15 &ordm;C) Water Every 20 min',
            'error'
        ],

    shortBreakStrings: [
            'No Stress', 
            'Record',
            'Warning',
            '15min/h',
            '30min/h',
            '45min/h',
            'STOP',
            'error'
    ],   

    shortWaterStrings: [
            'No Extra',
            'Extra Water',
            'Need Extra',
            'Min 1 cup / 20 min',
            'error'
    ],

    interpert: function(humidex, acclimitzaton){
        if(isNaN(humidex)){
            console.error("humidex is NaN, please check console for more")
            return;
        };
        if(acclimitzaton=false){
            if(humidex<29.5)
            {
                return {
                    color: 1, 
                    breakStrings: 1, 
                    waterNumber: 1
                };
            }
             else if(humidex<33.5)
             {
                 return {
                     color: 2,
                     breakStrings: 2,
                     waterNumbers: 2
                 };
             }
              else if(humidex<37.5)
              {
                  return {
                      color: 3,
                      breakStrings:3,
                      waterNumbers:3
                  };
              }
            else if(humidex<39.5)
            {
                return {
                    color: 4,
                    breakStrings: 4,
                    waterNumbers: 3
                };
            }
            else if(humidex<41.5)
            {
                return {
                    color: 5,
                    breakStrings: 5,
                    waterNumbers: 3
                };
            }
            else if(humidex<44.5)
            {
                return {
                    color: 6,
                    breakStrings: 6,
                    waterNumbers: 3
                };
            }
            else
                {
                    return {
                        color: 7,
                        breakStrings: 7,
                        waterNumbers: 4
                    }
                }
        }else{
            if(humidex<35.5)
            {

                return{
                    color: 0,
                    breakStrings: 0,
                    waterNumbers: 0
                };
            } 
            else if(humidex<39.5)
            {
                return {
                    color: 1, 
                    breakStrings: 1, 
                    waterNumber: 1
                };
            }
            else if(humidex<42.5)
            {
                return {
                    color: 2, 
                    breakStrings: 2, 
                    waterNumber: 2
                };
            }
            else if(humidex<44.5)
            {
                return {
                    color: 3, 
                    breakStrings: 3, 
                    waterNumber: 3
                };
            }
            //case exception
            else
            {
                return {
                    color: 1, 
                    breakStrings: 1, 
                    waterNumber: 1
                };
            }
        }
    },

    //maps
    mapFunction: function () {
      var mapProp = {
        center:new google.maps.LatLng(1.508742,-0.120850),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };

        var mapDiv = document.getElementById("googleMap");

      var map=new google.maps.Map(mapDiv,mapProp);

        console.log(window.innerHeight);
        mapDiv.style.height = window.innerHeight + 'px';

        google.maps.event.addListener(map, "click", function(event){
            console.log(event.latLng.lat());
            console.log(event.latLng.lng());
            console.log(event.latLng);
        })
    },

    //get weather data non-jquery
    createAJAXObj: function () {
        'use strict';
        try {
            return new XMLHttpRequest();
        } catch (er1) {
            try {
                return new ActiveXObject("Msxml3.XMLHTTP");
            } catch (er2) {
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (er3) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    } catch (er4) {
                        try {
                            return new ActiveXObject("Msxml2.XMLHTTP");
                        } catch (er5) {
                            try {
                                return new ActiveXObject("Microsoft.XMLHTTP");
                            } catch (er6) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    },//works

    sendRequest: function (url, callback, postData) {
        'use strict';
        var req = createAJAXObj(), method = (postData) ? "POST" : "GET";
        if (!req) {
            console.log("no link");
            return;  //stop if unable to create an XHR object
        }
        req.open(method, url, true);
        if (postData) {
            console.log("post data exists");
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        req.onreadystatechange = function () {
            console.log("ready state changed");
            if (req.readyState !== 4) {
                console.log("ready state is not complete");
                return; //stop if readyState is not complete
            }
            if (req.status !== 200 && req.status !== 304) {
                console.log("invalid response response type " + req.status);
                return; //stop if not a valid response
            }
            callback(req); //run the callback function and pass it the xhr object
        }
        req.send(postData);
        console.log(req);
        return req;
    },

    ajaxData: {},

    weatherForecastgotData : function(){
        console.log("$.ajax got data");
        console.log("data= " + ajaxData.responseJSON.hourly.data[0].temperature);
    },

    weatherForecastwhoops : function(error){
            console.log("$.ajax error in events");
        },

    position: {},

    handlePosition: function(gpsPosition){
    //    var url = "events/data.json";
            var url = "https://api.forecast.io/forecast/e57b7dc490cba92f53d8815729b7c623/"+ gpsPosition.coords.latitude +"," + gpsPosition.coords.longitude +"?units=ca";

    //    var url = "events/data.json";
        console.log(url);
        ajaxData =  $.ajax({ 
      url:url, 
      dataType: 'jsonp', 
      crossDomain: true 
     }).done( HSAppByOHCOW.weatherForecastgotData ).fail( HSAppByOHCOW.weatherForecastwhoops );
        position = gpsPosition;
    },

    getLocation: function () {
        if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(HSAppByOHCOW.handlePosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    },

    showPosition: function (position) {
        x.innerHTML = "Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude;	
    }
}

document.addEventListener("DOMContentLoaded", function(){
//    mapFunction();
  
    //TODO: change to make impossible to have naming confilicts
    var x = document.getElementById("demo"), 
        OHCOWwrapper = document.getElementById("OHCOWwrapper"),
        HSNumPad = document.getElementById("numberPad"),
        HSIndoorOutdoor = document.getElementById("indoorOutdoor"),
        HSClothingLevel = document.getElementById("clothingLevel"),
        HSRadiantLevel = document.getElementById("radiantLevel"),
        HSAccl = document.getElementById("acclimatization"),
        HSFeedbackText = document.getElementById("feedbackText"),
        HSResetBtn = document.getElementById("resetBtn"),
        HSNewEntry = document.getElementById("newEntry"),
        HSRepeatingList = document.getElementById("repeatingList"),
        HSNumberPad = document.getElementById("numberPad")
        ;
    //new entry
    HSNewEntry.addEventListener('click', function(){
        if(HSNumberPad.getAttribute('class') == 'none'){
            HSNumberPad.setAttribute('class', '');
            HSRepeatingList.setAttribute('class', 'none');
        }else{
            HSNumberPad.setAttribute('class', 'none');
            HSRepeatingList.setAttribute('class', '');
        }
    })
    //bottom buttons
    HSIndoorOutdoor.addEventListener('click', function(){
        alert('Outdoor temperature is coming soon!');
    })
    HSClothingLevel.addEventListener('click', function(){
        if(HSAppByOHCOW.currentStatus.clothingLevel == 3){
            HSAppByOHCOW.currentStatus.clothingLevel = 0;
        }else{
            HSAppByOHCOW.currentStatus.clothingLevel = ++HSAppByOHCOW.currentStatus.clothingLevel;
        }
        HSClothingLevel.textContent = HSAppByOHCOW.currentStatus.clothingLevel;
    });
    //TODO when outdoor weather is avaialble this icon set must change
    HSRadiantLevel.addEventListener('click', function(){
        if(HSAppByOHCOW.currentStatus.radiantLevel == 10){
            HSRadiantLevel.setAttribute('class', 'radiantNone');
            HSAppByOHCOW.currentStatus.radiantLevel = 0;
        }else{
            HSAppByOHCOW.currentStatus.radiantLevel = ++HSAppByOHCOW.currentStatus.radiantLevel;
            if(HSAppByOHCOW.currentStatus.radiantLevel > 5){
                HSRadiantLevel.setAttribute('class', 'radiantHot');
            }
        }
        HSRadiantLevel.textContent = HSAppByOHCOW.currentStatus.radiantLevel;
    });
    HSAccl.addEventListener('click', function(){
        var HSAcclClass = HSAccl.getAttribute('class');
        if(HSAcclClass == 'acclimatized'){
            HSAppByOHCOW.currentStatus.acclimatized = false;
            HSAccl.setAttribute('class', 'unacclimatized');
        }else{
            HSAppByOHCOW.currentStatus.acclimatized = true;
            HSAccl.setAttribute('class', 'acclimatized');
        }
    });
    //reset button on bottom
    HSResetBtn.addEventListener('click', function(){
        
        HSAppByOHCOW.currentStatus.clothingLevel = 0;
        HSClothingLevel.textContent = HSAppByOHCOW.currentStatus.clothingLevel;
        
        HSRadiantLevel.setAttribute('class', 'radiantNone');
        HSAppByOHCOW.currentStatus.radiantLevel = 0;
        
        HSAppByOHCOW.currentStatus.acclimatized = false;
        HSAccl.setAttribute('class', 'unacclimatized');
    })
    
    //numberpad
    HSNumPad.addEventListener('click', function(ev){
        switch (ev.target.textContent){
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                break;
            default:
                break;
        };
       console.log(ev.target.textContent); 
    });
//    HSAppByOHCOW.construct(x);
    
//    HSAppByOHCOW.getLocation();

    //*/
    
    //non-JQuery
    /*
//    var url = "events/data.json";
        var url = "https://api.forecast.io/forecast/e57b7dc490cba92f53d8815729b7c623/45.348391,-75.757045?units=ca";
    
//  xhttp.open(url, function(data){console.log(data);}, true);
//  xhttp.send();

    //*
    var dataHolder;
    var dataHolderDuplicate;
    
    HSAppByOHCOW.sendRequest(url, function(data){
        console.log("success data = " + data);
        console.log("success data = " + Object.keys(data));
        dataHolder = data;
        dataHolderDuplicate = 5;
//        console.log(data.response);
    }, true);
    //*/
    
//        console.log(dataHolder);
//        console.log(dataHolderDuplicate);
        });