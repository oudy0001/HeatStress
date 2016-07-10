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
        {temp: 28, humd: 50},
        {temp: 28, humd: 50},
        {temp: 28, humd: 50},
        {temp: 28, humd: 50},
        {temp: 28, humd: 50},
        {temp: 28, humd: 50},
        {temp: 34, humd: 0},
        {temp: 38, humd: 0},
        {temp: 40, humd: 0},
        {temp: 44, humd: 0},
        {temp: 46, humd: 0}
        //db4hie
    ],
    settings: {
      celsius: true
    },
    //view constructor definately use
    renderList: function(HSRepeatingListHolder, accl, radiantLevel, clothingLevel){
		console.log('rendered. div:' + HSRepeatingListHolder +' accl:'+ accl +' clothing:' +  clothingLevel +' rad:'+ radiantLevel);//db4p
		console.log(accl.getAttribute('class'));//db4p
		var acclimatizationBool;
			acclimatizationBool = (accl.getAttribute('class') == "acclimatized");
			acclimatizationBool = (accl.getAttribute('class') == "acclimatized");
            HSRepeatingListHolder.innerHTML = null;
        for(var i = (HSAppByOHCOW.listOfEntries.length - 1); i > -1; i--){
			var humidex = HSAppByOHCOW.calculateHumidex(HSAppByOHCOW.listOfEntries[i].temp, HSAppByOHCOW.listOfEntries[i].humd, radiantLevel, clothingLevel);
            var translateObject = HSAppByOHCOW.interpert(humidex, acclimatizationBool);
            var container = document.createElement("div");
            container.setAttribute("class", "repeatingListItem");
            //icon
            var iconHolder = document.createElement("p");
            var iconClassString = "repBackground level" + translateObject.color;
            iconHolder.innerHTML = Math.round(humidex);
            iconHolder.setAttribute("class", iconClassString);
            var stringHolder = document.createElement("div");
            stringHolder.setAttribute("class", "repRight");
            //strings
            var waterString = document.createElement("p");
            waterString.innerHTML = HSAppByOHCOW.shortWaterStrings[translateObject.waterNumber];
            var breakString = document.createElement("p");
            breakString.innerHTML = HSAppByOHCOW.shortBreakStrings[translateObject.breakStrings];
            stringHolder.appendChild(breakString);
            stringHolder.appendChild(waterString);
            container.appendChild(iconHolder);
            container.appendChild(stringHolder);
            HSRepeatingListHolder.appendChild(container);
            //displays icons when necissary
            if(translateObject.breakStrings > 3){
                var timeClock = document.createElement("span");
                timeClock.setAttribute("class", "timeClock notice");
                breakString.appendChild(timeClock);
            }
            if(translateObject.waterNumber > 0){
                var waterBottle = document.createElement("span");
                waterBottle.setAttribute("class", "waterBottle notice");
                breakString.appendChild(waterBottle);
            }
        }
    },

//MODLES
    //TODO celcius to ferinheight converter
    moveToTemp: function(tempFeedback, humidFeedback){
			humidFeedback.setAttribute("class", "");
			tempFeedback.setAttribute("class", "editing");
			tempFeedback.value = "";
            tempFeedback.focus();
	},
    moveToHumid: function(tempFeedback, humidFeedback){
			humidFeedback.setAttribute("class", "editing");
			tempFeedback.setAttribute("class", "");
			humidFeedback.value = "";
			humidFeedback.focus();
	},
	//new number
	handleInput: function(input, tempFeedback, humidFeedback, humidexFeedback, bigBreakString, bigWaterString, radiant, clothing, acclimatized, confirmBtn){
		var newTemperature = tempFeedback.value + input;
		var newHumidity = humidFeedback.value + input;
		var tempFeedbackClass = tempFeedback.getAttribute("class");
		var humidFeedbackClass = humidFeedback.getAttribute("class");
		var finishInput = function(){
			humidFeedback.setAttribute("class", "");
			tempFeedback.setAttribute("class", "");
			humidFeedback.blur();
			tempFeedback.blur();
			var humidex = HSAppByOHCOW.calculateHumidex(tempFeedback.value, humidFeedback.value, radiant, clothing);
			humidexFeedback.innerHTML = Math.round(humidex);
			var acclimatizedBool = acclimatized.getAttribute("class") == "acclimatized" ? true : false;
			var interperted = HSAppByOHCOW.interpert(humidex, acclimatizedBool);
			humidexFeedback.setAttribute('class', ('level' + interperted.color));
			bigBreakString.innerHTML = HSAppByOHCOW.breakStrings[interperted.breakStrings];
			bigWaterString.innerHTML = HSAppByOHCOW.waterStrings[interperted.breakStrings];
			confirmBtn.innerHTML = 'done';
		}
		//
		if(tempFeedbackClass === "editing"){
			if(newTemperature < 50){
				tempFeedback.value = newTemperature;
			}else{
				tempFeedback.value = 50;
			}
//			if(humidFeedback.value == ''){
			if(tempFeedback.value.length > 1 && humidFeedback.value == ''){
				HSAppByOHCOW.moveToHumid(tempFeedback, humidFeedback);
			}else if(humidFeedback.value != '' && tempFeedback.value.length > 1){
				finishInput();
			}
		}else if(humidFeedbackClass === "editing"){
			if(newHumidity <= 100 ){
				humidFeedback.value = newHumidity;
			}
			if(humidFeedback.value.length > 1 && tempFeedback.value == '' && humidFeedback.value != 10){
				HSAppByOHCOW.moveToTemp(tempFeedback, humidexFeedback);
			}else if(humidFeedback.value.length > 1 && tempFeedback.value != '' && humidFeedback.value != 10){
				finishInput();
			}
		}

	},
	
	//toggle new input page
	toggleNewEntry: function(numberPad, newEntryButton, repeatingList, tempFeedback){
        if(numberPad.getAttribute("class") == "none"){
            numberPad.setAttribute("class", "");
            newEntryButton.setAttribute("class", "none");
			tempFeedback.setAttribute("class", "editing");
            repeatingList.setAttribute("class", "none");
        }else{
            numberPad.setAttribute("class", "none");
            newEntryButton.setAttribute("class", "");
            repeatingList.setAttribute("class", "");
			tempFeedback.setAttribute("class", "");
        }
	},
	
    //Number inputs
    handleKeypad: function(key, tempFeedback, humidFeedback, humidexFeedback, bigBreakString, bigWaterString, radiant, clothing, acclimatized,  confirmBtn, numberPad, repeatingList, newEntry){
        //TODO if we use icons instead of next and done we would need to change this (probably by adding some attribue)
		var tempFeedbackClass = tempFeedback.getAttribute("class");
		var humidFeedbackClass = humidFeedback.getAttribute("class");
        switch (key.textContent){
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
				if(tempFeedback.getAttribute("class") != "editing" && humidFeedback.getAttribute("class" != "editing")){
					console.log('setting temp to editing b/c nothing is set');
					tempFeedback.setAttribute("class", "editing");
//					alert("nothing editing");
				};
//				var input = 
				HSAppByOHCOW.handleInput(key.textContent, tempFeedback, humidFeedback, humidexFeedback, bigBreakString, bigWaterString, radiant, clothing, acclimatized, confirmBtn);
                break;
            case "next":
                break;
            case "done":
				var newItem = {temp: parseInt(tempFeedback.value), humd: parseInt(humidFeedback.value)};
				HSAppByOHCOW.listOfEntries.push(newItem);
				console.log('pushed');
            case "back":
				HSAppByOHCOW.renderList(repeatingList, acclimatized, radiant, clothing);
				HSAppByOHCOW.toggleNewEntry(numberPad, newEntry, repeatingList, tempFeedback);
                break;
            default:
                break;
        };
    },
    
    //humidex
    calculateHumidex: function (temperature, humidity, radiant, clothing){
		temperature = parseInt(temperature);
		humidity = parseInt(humidity);
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
        return temperature+5/9*((6.112 * (Math.pow(10,(7.5*temperature/(237.7+temperature))))*humidity/100)-10)+radiant*1.9*0.3+clothing*1.9;
    },
    
    //interpertation of humidex
    breakStrings : [
            "No Heat Stress", //0
            "Post Heat Alerts, Start Recording", //1
            "Post Heat Warning, Watch for Symptoms", //2
            "Manditory 15 min Heat Break Every Hour", //3
            "Manditory 30 min Heat Break Every Hour", //4
            "Manditory 45 min Heat Break Every Hour", //5
            "ONLY MEDICALLY SUPERVISED WORK CAN CONTINUE", //6
            "error" //7
        ],

    waterStrings : [
            "Normal Water Amount", //0
            "Encourage Extra Water", //1
            "Workers Need Extra Water", //2
            "Minimum of 1 Cup of Cool (10-15 &ordm;C) Water Every 20 min", //3
            "Consult ACGIH TLV®" //4
        ],

    shortBreakStrings: [
            "No Added Stress", //0
            "Record Humidex", //1
            "Post Warning", //2
            "15min/h Heat Break", //3
            "30min/h Heat Break", //4
            "45min/h Heat Break", //5
            "STOP!!", //6
            "error" //7
    ],   

    shortWaterStrings: [
            "Normal Water", //1
            "Extra Water", //2
            "Need Extra Water", //3
            "Min 1 cup / 20 min", //4
            "Consult ACGIH TLV®" //5
    ],

    //separated from the calculation of the humidex because it is not a calculation
    interpert: function(humidex, acclimitzaton){
		console.log('interperteed');
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
    }
}

document.addEventListener("DOMContentLoaded", function(){
//    mapFunction();
  
    //TODO: change to make impossible to have naming confilicts
    var x = document.getElementById("demo"), 
        HSWrapper = document.getElementById("OHCOWwrapper"),
        //big icon and feedback
        HSBigHumidex = document.getElementById("humidexFeedback"),
        HSBigTemperature = document.getElementById("bigTemperature"),
        HSTempFeedback = document.getElementById("tempFeedback"),
        HSBigCelOrFer = document.getElementById("bigCelOrFer"),
        HSBigHumidity = document.getElementById("bigHumidity"),
        HSBigBreakString = document.getElementById("bigBreakString"),
        HSBigWaterString = document.getElementById("bigWaterString"),
        HSHumidFeeback = document.getElementById("humidFeedback"),
        HSNewEntry = document.getElementById("newEntryOutline"),
        //main display
        HSNumberPad = document.getElementById("entryPage"),
        HSConfirmBtn = document.getElementById("confirmBtn"),
        HSRepeatingListPage = document.getElementById("repeatingListPage"),
        HSRepeatingListHolder = document.getElementById("repeatingListHolder"),
        //bottom
        HSIndoorOutdoor = document.getElementById("indoorOutdoor"),
        HSClothingLevel = document.getElementById("clothingLevel"),
        HSRadiantLevel = document.getElementById("radiantLevel"),
        HSAccl = document.getElementById("acclimatization"),
        HSFeedbackText = document.getElementById("feedbackText"),
        HSResetBtn = document.getElementById("resetBtn")
        ;
    //new entry
    HSNewEntry.addEventListener("click", function(){
		HSAppByOHCOW.toggleNewEntry(HSNumberPad, HSNewEntry, HSRepeatingListPage, HSTempFeedback)}
    );
    //numberpad
    HSNumberPad.addEventListener("click", function(ev){
        HSAppByOHCOW.handleKeypad(ev.target, HSTempFeedback, HSHumidFeeback, HSBigHumidex, HSBigBreakString, HSBigWaterString, HSRadiantLevel.innerHTML, HSClothingLevel.innerHTML, HSAccl, HSConfirmBtn, HSNumberPad, HSRepeatingListPage, HSNewEntry);
    });
	//listening to temp and humid input
	HSTempFeedback.addEventListener("click", function(){
		HSTempFeedback.value = '';
		HSAppByOHCOW.moveToTemp(HSTempFeedback, HSHumidFeeback);
	});
	HSHumidFeeback.addEventListener("click", function(){
		HSHumidFeeback.value = '';
		HSAppByOHCOW.moveToHumid(HSTempFeedback, HSHumidFeeback);
	});
	HSTempFeedback.addEventListener("input", function(){
		var acclimatizedBool = HSAccl.getAttribute("class") != "unacclimatized";
        HSAppByOHCOW.handleInput('', HSTempFeedback, HSHumidFeeback, HSBigHumidex, HSBigBreakString, HSBigWaterString, HSRadiantLevel.innerHTML, HSClothingLevel.innerHTML, acclimatizedBool, HSConfirmBtn, HSNumberPad, HSRepeatingListHolder);
	});
	HSHumidFeeback.addEventListener("input", function(){
		var acclimatizedBool = HSAccl.getAttribute("class") != "unacclimatized";
        HSAppByOHCOW.handleInput('', HSTempFeedback, HSHumidFeeback, HSBigHumidex, HSBigBreakString, HSBigWaterString, HSRadiantLevel.innerHTML, HSClothingLevel.innerHTML, acclimatizedBool, HSConfirmBtn, HSNumberPad, HSRepeatingListHolder);
	});
    //bottom buttons
    HSIndoorOutdoor.addEventListener("click", function(){
        alert("Outdoor temperature is coming soon!");
    })
    HSClothingLevel.addEventListener("click", function(){
        if(HSAppByOHCOW.currentStatus.clothingLevel == 3){
            HSAppByOHCOW.currentStatus.clothingLevel = 0;
        }else{
            HSAppByOHCOW.currentStatus.clothingLevel = ++HSAppByOHCOW.currentStatus.clothingLevel;
        }
        HSClothingLevel.textContent = HSAppByOHCOW.currentStatus.clothingLevel;
 		HSAppByOHCOW.renderList(HSRepeatingListPage, HSAccl, HSRadiantLevel.textContent, HSClothingLevel.textContent);
    });
    //TODO when outdoor weather is avaialble this icon set must change
    HSRadiantLevel.addEventListener("click", function(){
        if(HSAppByOHCOW.currentStatus.radiantLevel == 10){
            HSRadiantLevel.setAttribute("class", "radiantNone");
            HSAppByOHCOW.currentStatus.radiantLevel = 0;
        }else{
            HSAppByOHCOW.currentStatus.radiantLevel = ++HSAppByOHCOW.currentStatus.radiantLevel;
            if(HSAppByOHCOW.currentStatus.radiantLevel > 5){
                HSRadiantLevel.setAttribute("class", "radiantHot");
            }
        }
        HSRadiantLevel.textContent = HSAppByOHCOW.currentStatus.radiantLevel;
 		HSAppByOHCOW.renderList(HSRepeatingListPage, HSAccl, HSRadiantLevel.textContent, HSClothingLevel.textContent);
    });
    HSAccl.addEventListener("click", function(){
        var HSAcclClass = HSAccl.getAttribute("class");
        if(HSAcclClass == "acclimatized"){
            HSAppByOHCOW.currentStatus.acclimatized = false;
            HSAccl.setAttribute("class", "unacclimatized");
        }else{
            HSAppByOHCOW.currentStatus.acclimatized = true;
            HSAccl.setAttribute("class", "acclimatized");
        }
 		HSAppByOHCOW.renderList(HSRepeatingListPage, HSAccl, HSRadiantLevel.textContent, HSClothingLevel.textContent);
    });
    //reset button on bottom
//    HSResetBtn.addEventListener("click", function(){
//        
//        HSAppByOHCOW.currentStatus.clothingLevel = 0;
//        HSClothingLevel.textContent = HSAppByOHCOW.currentStatus.clothingLevel;
//        
//        HSRadiantLevel.setAttribute("class", "radiantNone");
//        HSAppByOHCOW.currentStatus.radiantLevel = 0;
//        
//        HSAppByOHCOW.currentStatus.acclimatized = false;
//        HSAccl.setAttribute("class", "unacclimatized");
//    })
    
 		HSAppByOHCOW.renderList(HSRepeatingListPage, HSAccl, HSRadiantLevel.textContent, HSClothingLevel.textContent);
});