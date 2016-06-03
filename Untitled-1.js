// JavaScript Document
$(document).ready(function(){
		$('#lastModified').html("Last modified: " + document.lastModified);
		$('input[name=reset]').click(function(){
			clearResults();
		});
		$('#humidexCalculator form').submit(function(e){
			e.preventDefault();
			calcHumidex();
		});
	});
	
	function clearResults(){		
		$('#humidexReport').css('background-color','#fff').html('');
	}
	
	function calcHumidex(){
		var temp= parseFloat($('input[name="temperature"]').val());
		var RH = parseFloat($('input[name="humidity"]').val());
		var bg;
		//check valid input
		if(isNaN(temp) || isNaN(RH)){
			alert('Please enter a valid number for temperature and humidity');
			clearResults();
			return false;
		}
        // vapour pressure
       kelvin = temp + 273;
	   eTs=Math.pow(10,((-2937.4 /kelvin)-4.9283* Math.log(kelvin)/Math.LN10 +23.5471));
	   eTd=eTs * RH /100;
	
	   //Calcul de l'humidex
	   //Equation from Environment Canada
	   //http://www.qc.ec.gc.ca/meteo/documentation/Humidex/humidex_a.html
	   
	  hx = Math.round(temp + ((eTd-10)*5/9));

		//output
		if (RH <0 || RH >100){
			comment = "Relative humidity must be a value between 0 and 100";
			bg = "#cc0000";
		}	else {	  
			comment = "The Humidex is: " + hx + "<br/>";
		  if (hx < temp){
			   hx = temp;
			   bg = "#fff";
		  }
			
		  if (hx>0 && hx <25 ){
			comment += "No discomfort.";
			bg="#99ff66";
		}
		  if (hx>24 && hx <30 ) {
			comment += "Provide water on as needed basis.";
			bg="#ffff99";
		}
		if (hx >= 30  && hx < 34){
			comment += "post Heat Stress Alert notice; encourage workers to drink extra water; start recording hourly temperature and relative humidity";
			bg="#ffff00";
		}
		if (hx >= 34  && hx < 38){
		   comment += "post Heat Stress Warning notice; notify workers that they need to drink extra water; ensure workers are trained to recognize symptoms";
			bg = "#ffdf00";
		}
		if (hx >= 38  && hx < 40){
		   comment += "Only work with 15 minutes relief per hour should continue - provide 240 mL of water every 20 minutes";
			bg = "#ffaf00";
		}
		if (hx >= 40  && hx < 42){
		   comment += "Only work with 30 minutes relief per hour should continue  - provide 240 mL of water every 20 minutes";
			bg = "#ff8f00";
		}
		if (hx >= 42  && hx < 45){
		   comment += "Only work with 45 minutes relief per hour should continue  - provide 240 mL of water every 20 minutes";
			bg = "#ff4f00";
		}
		if (hx >= 45){
		   comment += "only medically supervised work can continue";
			bg = "#ff0000";
		}

	}
	$('#humidexReport').css('background-color',bg).html(comment);
}