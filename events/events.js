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
    listOfEntries: [
        //db4his this is temporary dummy data
        {temp: 28, accl: false},
        {temp: 30, accl: false},
        {temp: 35, accl: false},
        {temp: 38, accl: false},
        {temp: 40, accl: false},
        {temp: 43, accl: false},
        {temp: 46, accl: false},
        {temp: 34, accl: true},
        {temp: 38, accl: true},
        {temp: 40, accl: true},
        {temp: 44, accl: true},
        {temp: 46, accl: true}
        //db4hie
    ],
    settings: {
      celsius: true
    },
    //view constructor definately use
    
    renderList: function(HSRepeatingList){
        for(var i = (HSAppByOHCOW.listOfEntries.length - 1); i > -1; i--){
            var translateObject = HSAppByOHCOW.interpert(HSAppByOHCOW.listOfEntries[i].temp, HSAppByOHCOW.listOfEntries[i].accl);
            var container = document.createElement('div');
            container.setAttribute('class', 'repeatingListItem');
            //icon
            var iconHolder = document.createElement('p');
            var iconClassString = 'repBackground level' + translateObject.color;
            iconHolder.innerHTML = HSAppByOHCOW.listOfEntries[i].temp;
            iconHolder.setAttribute('class', iconClassString);
            var stringHolder = document.createElement('div');
            stringHolder.setAttribute('class', 'repRight');
            //strings
            var waterString = document.createElement('p');
            waterString.innerHTML = HSAppByOHCOW.shortWaterStrings[translateObject.waterNumber];
            var breakString = document.createElement('p');
            breakString.innerHTML = HSAppByOHCOW.shortBreakStrings[translateObject.breakStrings];
            stringHolder.appendChild(breakString);
            stringHolder.appendChild(waterString);
            container.appendChild(iconHolder);
            container.appendChild(stringHolder);
            HSRepeatingList.appendChild(container);
            //displays icons when necissary
            if(translateObject.breakStrings > 3){
                var timeClock = document.createElement('span');
                timeClock.setAttribute('class', 'timeClock notice');
                breakString.appendChild(timeClock);
            }
            if(translateObject.waterNumber > 0){
                var waterBottle = document.createElement('span');
                waterBottle.setAttribute('class', 'waterBottle notice');
                breakString.appendChild(waterBottle);
            }
        }
    },

//view constructors (not sure if this is the route we want to go down)
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

    
//MODLES
    //TODO celcius to ferinheight converter
    
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
            'No Heat Stress', //0
            'Post Heat Alerts, Start Recording', //1
            'Post Heat Warning, Watch for Symptoms', //2
            'Manditory 15 min Heat Break Every Hour', //3
            'Manditory 30 min Heat Break Every Hour', //4
            'Manditory 45 min Heat Break Every Hour', //5
            'ONLY MEDICALLY SUPERVISED WORK CAN CONTINUE', //6
            'error' //7
        ],

    waterStrings : [
            'Normal Water Amount', //0
            'Encourage Extra Water', //1
            'Workers Need Extra Water', //2
            'Minimum of 1 Cup of Cool (10-15 &ordm;C) Water Every 20 min', //3
            'Consult ACGIH TLV®' //4
        ],

    shortBreakStrings: [
            'No Added Stress', //0
            'Record Humidex', //1
            'Post Warning', //2
            '15min/h Heat Break', //3
            '30min/h Heat Break', //4
            '45min/h Heat Break', //5
            'STOP!!', //6
            'error' //7
    ],   

    shortWaterStrings: [
            'Normal Water', //1
            'Extra Water', //2
            'Need Extra Water', //3
            'Min 1 cup / 20 min', //4
            'Consult ACGIH TLV®' //5
    ],

    //separated from the calculation of the humidex because it is not a calculation
    interpert: function(humidex, acclimitzaton){
        if(isNaN(humidex)){
            console.error("humidex is NaN, please check console for more")
            return;
        };
        if(acclimitzaton){
            if(humidex<35.5)
            {

                return{
                    color: 1,
                    breakStrings: 0,
                    waterNumber: 0
                };
            } 
            else if(humidex<39.5)
            {
                return {
                    color: 2, 
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
            else
            {
                return {
                    color: 4, 
                    breakStrings: 6, 
                    waterNumber: 4
                };
            }
        }else{
            if(humidex<29.5)
            {
                return {
                    color: 1, 
                    breakStrings: 0, 
                    waterNumber: 0
                };
            }
             else if(humidex<33.5)
             {
                 return {
                     color: 2,
                     breakStrings: 1,
                     waterNumber: 1
                 };
             }
              else if(humidex<37.5)
              {
                  return {
                      color: 2,
                      breakStrings:2,
                      waterNumber:2
                  };
              }
            else if(humidex<39.5)
            {
                return {
                    color: 3,
                    breakStrings: 3,
                    waterNumber: 3
                };
            }
            else if(humidex<41.5)
            {
                return {
                    color: 3,
                    breakStrings: 4,
                    waterNumber: 3
                };
            }
            else if(humidex<44.5)
            {
                return {
                    color: 3,
                    breakStrings: 5,
                    waterNumber: 3
                };
            }
            else
                {
                    return {
                        color: 4,
                        breakStrings: 6,
                        waterNumber: 4
                    }
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
        HSWrapper = document.getElementById("OHCOWwrapper"),
//        HSBigTemperature = document.getElementById("bigTemperature"),
//        HSBigCelOrFer = document.getElementById("bigCelOrFer"),
//        HSBigHumidity = document.getElementById("bigHumidity"),
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
//            HSBigTemperature.setAttribute('class', 'editing');
//            HSBigHumidity.setAttribute('class', '');
        }else{
            HSNumberPad.setAttribute('class', 'none');
            HSRepeatingList.setAttribute('class', '');
//            HSBigTemperature.setAttribute('class', '');
//            HSBigHumidity.setAttribute('class', '');
        }
    });
    //handling temperature or humidity input needs updated index.html
//    HSBigTemperature.addEventListener('click', function(){
//        HSNumberPad.setAttribute('class', '');
//        HSRepeatingList.setAttribute('class', 'none');
//        HSBigTemperature.setAttribute('class', 'editing');
//        HSBigHumidity.setAttribute('class', '');
//    });
//    HSBigHumidity.addEventListener('click', function(){
//        HSNumberPad.setAttribute('class', '');
//        HSRepeatingList.setAttribute('class', 'none');
//        HSBigTemperature.setAttribute('class', '');
//        HSBigHumidity.setAttribute('class', 'editing');
//    });
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
            case 'next':
                break;
            case 'done':
                break;
            case 'back':
                break;
            default:
                break;
        };
       console.log(ev.target.textContent); 
    });
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
    
    HSAppByOHCOW.renderList(HSRepeatingList);
    
    //Experimental junk
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