//var localStorage = localStorage, navigator = navigator;
var heatStressLevelObjects = [
    {upperRange: 0, lowerRange: -150, colorValue: "green", waterAdvisory: "water as needed", breakAdvisory: "No humidex discomfort."},
    {upperRange: 29.5, lowerRange: 0, colorValue: "green", waterAdvisory: "water as needed", breakAdvisory: "Provide water as needed."},
    {upperRange: 37.5, lowerRange: 33.5, colorValue: "red", waterAdvisory: "Encourage extra water.", breakAdvisory: "Encourage extra water."},
    {upperRange: 39.5, lowerRange: 37.5, colorValue: "red", waterAdvisory: "Drink extra water.", breakAdvisory: "no special breaks"},
    {upperRange: 41.5, lowerRange: 39.5, colorValue: "red", waterAdvisory: "1 water unit / 20 min (see about).", breakAdvisory: "no special breaks"},
    {upperRange: 44.5, lowerRange: 41.5, colorValue: "red", waterAdvisory: "1 water unit / 20 min (see about).", breakAdvisory: "15 min/h cooling breaks."},
    {upperRange: 150.5, lowerRange: 44.5, colorValue: "red", waterAdvisory: "Only medically supervised work.", breakAdvisory: "Only medically supervised work."}
];

var upperRangeValue = 0;

angular.module('HeatStressApp')

.factory('gpsFinder', function(){
    return {
        getGPS: function() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition);
        
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
    };
})

.factory('googleMapFactory', ['gpsFinder', function(gpsFinder){
    return{
        setUpMap: function(div){
            
        }
    };
}])

.factory('heatStressCalculator', [function(){
    return{
        getHeatStressCategoryObject: function(humidex){
            for(var i = 0; i < heatStressLevelObjects.length; i++){
                if(humidex > heatStressLevelObjects[i].upperRange && humidex < heatStressLevelObjects[i].lowerRange){
                    return heatStressLevelObjects[i];
                }
            }
        }
    }
}])

.factory('temperatureConversions', [function(){
    return{
        celciusToFerinheight: function(temperatureInCelcuis){
            return /*temperatureInFerinheight*/;
        },
        ferinheightToCelcius: function(temperatureInFerinheight){
            return /*temperatureInCelcuis*/;
        },
        humidexCalulator: function(temperature, humidity){
            var humidex;
            return humidex;
        }
    }
}])

.factory('optionsFactory', ['$rootScope', function($rootScope){
    var vibrateBool;
    return{
        vibrateOnComplete: function(positive, toggle){
            var combinedBool = true;
            if(positive === false){
                combinedBool = false;
            }
            if(toggle == 'false'){
                combinedBool = false;
            }
            
            if(combinedBool){
                navigator.vibrate(300);
            }
        },
        noticeAllComplete: function(tasks, toggle){
            var allCompletedBool = true;
            for(var i = 0; i < tasks.length; i++){
                if(tasks[i].done === false){
                    allCompletedBool = false;
                }
            }
            if(toggle && allCompletedBool){
                cordova.plugins.notification.local.update({
                    id: 1,
                    title: 'You accomplished everthing on your list!'
                }, 0);
            }
        },
//                navigator.vibrate(300);
        setVibratePreference: function(toggle){
            vibrateBool = toggle;
            var localStorageReference = "ca.edumedia/oudy0001/mad9135/preferences/vibrate";
            localStorageFactory.setItems(localStorageReference, toggle);
        },
        setAllCompletePreference: function(toggle){
            vibrateBool = toggle;
            var localStorageReference = "ca.edumedia/oudy0001/mad9135/preferences/complete";
            localStorageFactory.setItems(localStorageReference, toggle);
        },
        getVibratePreference: function(){
            var localStorageReference = "ca.edumedia/oudy0001/mad9135/preferences/vibrate";
            var storedPref = localStorage.getItem(localStorageReference);
            if(storedPref == null){
                return true;
            }else{
                return storedPref;
            }
        },
        getAllCompletePreference: function(){
            var localStorageReference = "ca.edumedia/oudy0001/mad9135/preferences/complete";
            var storedPref = localStorage.getItem(localStorageReference);
            if(storedPref == null){
                return true;
            }else{
                return storedPref;
            }
        }
    };
}])
;