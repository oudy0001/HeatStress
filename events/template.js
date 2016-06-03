using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace HeatStressFinal
{
    //for passing values through the e.Params object (I would rather assign it to the static class though)
    public class HumidexObject
    {
        private double temperature;
        private double humidity;

        //constructors
        public HumidexObject()
        {
            temperature = 0.0;
            humidity = 0.0;
        }
        public HumidexObject(double temperatureIn, double humidityIn)
        {
            temperature = temperatureIn;
            humidity = humidityIn;
        }

        //getters
        public double getTemperature()
        {
            return temperature;
        }

        public double getHumidity()
        {
            return humidity;
        }

        //setters
        public void setTemperature(double value)
        {
            temperature = value;
        }

        public void setHumidity(double value)
        {
            humidity = value;
        }
    }

    //humidex
    =temperature+5/9*((6.112*10^(7.5*temperature/(237.7+temperature))*humidity/100)-10)+radiant*1.9*0.3+clothing*1.9
    //acclimatization
    =IF(acclimitzaton=0,(IF(B10<29.5,advice1!B1, IF(B10<33.5,advice1!B2, IF(B10<37.5,advice1!B3, IF(B10<39.5,advice1!B4, IF(B10<41.5,advice1!B5, IF(B10<44.5,advice1!B6, advice1!B7))))))),
        else
        (IF(B10<35.5,advice1!B1, IF(B10<39.5,advice1!B2, IF(B10<42.5,advice1!B3, IF(B10<44.5,advice1!B4, advice1!B7))))))

    public static class HumidexConverterModule
    {
        //humidex guides
        public static double[] unAclimatizedValues = new double[] { 29.5, 33.5, 37.5, 39.5, 41.5, 44.5 };
        public static double[] aclimatizedValues = new double[] { 35.5, 39.5, 42.5, 44.5 };
        
        //calculations, some could have been burried in others but I kept them separate to make it reusable
        public static bool HumidexIsValid(string temperatureInput, string humidityInput, bool isCelciusNotFerinheight)
        {
            double temperature;
            double humidity;
            if (double.TryParse(temperatureInput, out temperature) && double.TryParse(humidityInput, out humidity))
            {
                if (!isCelciusNotFerinheight)
                {
                    temperature = FahrenheitToCelsius(temperature);
                }
                if (temperature < 100 && temperature > 0 && humidity >= 0 && humidity <= 100)
                {
                    //Takes the humidity and temperature and returns the humidex from the converter module looking to SettingsAndData to determine
                    //if the temperature is in CelsiusNotFeriniheight
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }

        }

        public static double HumidexReturn(double temperature, double humidity, bool isCelciusNotFerinheight, double radiant, double clothing)
        {
            //probably didn't need to make this a separate method, but I figured it was easier
            if (isCelciusNotFerinheight)
            {
                return HumidexCalculator(temperature, humidity, radiant, clothing);
            }
            else
            {
                return HumidexCalculator(FahrenheitToCelsius(temperature), humidity, radiant, clothing);
            }
        }

        public static double FahrenheitToCelsius(double fahrenheit)
        {
            return (fahrenheit - 32) * Convert.ToDouble(5/9);
        }

        //this is for the americans (my dad said they would appreciate it if I did this)
        public static double CelsiusToFahrenheight( double celsius )
        {
            return celsius * Convert.ToDouble(5/9);
        }
        
        //I tried to make it as understandable as possible, but my dad keeps explaining it to me and I forget all the names
        public static double HumidexCalculator(double temperatureInCelcuis, double humidity, double radiant, double clothing)
        {
            double kelvin = (237.7 + temperatureInCelcuis);
            double humidexDecimal = humidity / 100;
            double baseHeatStress = ((double)5 / 9) * ((6.112 * Math.Pow(10, (7.5 * temperatureInCelcuis / kelvin)) * humidexDecimal) - 10) + temperatureInCelcuis;
            double radianHeatStress = radiant * 1.9 * 0.3;
            double clothingHeatStress = clothing * 1.9;

            return baseHeatStress + radianHeatStress + clothingHeatStress;
        }

        //From here on in it just returns the proper strings, I should have used an array of strings but I hardcoded it before
        //and by the time I get it all refactored it would be a waste of time

        //there is a separate set for acclimatization now based off what I learned...took a lot of re-writing to do
        public static string WaterAdvisory(double humidex, bool isNotAclimatized)
        {
            if (isNotAclimatized)
            {
                if (humidex > 0 && humidex < unAclimatizedValues[0])
                {
                    return "No humidex discomfort.";
                }
                if (humidex > unAclimatizedValues[0] && humidex < unAclimatizedValues[1])
                {
                    return "Provide water as needed.";
                }
                if (humidex >= unAclimatizedValues[1] && humidex < unAclimatizedValues[2])
                {
                    return "Encourage extra water.";
                }
                if (humidex >= unAclimatizedValues[2] && humidex < unAclimatizedValues[3])
                {
                    return "Drink extra water.";
                }
                if (humidex >= unAclimatizedValues[3]  && humidex < unAclimatizedValues[5])
                {
                    return "1 water unit / 20 min (see about).";
                }
                if (humidex >= unAclimatizedValues[5])
                {
                    return "Only medically supervised work.";
                }
                return "N//A";
            }
            else
            {
                if (humidex > 0 && humidex < aclimatizedValues[0])
                {
                    return "Normal water level.";
                }
                if (humidex > aclimatizedValues[0] && humidex < aclimatizedValues[1])
                {
                    return "Provide water as needed.";
                }
                if (humidex >= aclimatizedValues[1] && humidex < aclimatizedValues[2])
                {
                    return "Encourage extra water.";
                }
                if (humidex >= aclimatizedValues[2] && humidex < aclimatizedValues[3])
                {
                    return "1 water unit / 20 min (see about).";
                }
                if (humidex >= aclimatizedValues[3])
                {
                    return "Only medically supervised work.";
                }
                return "N//A";
            }
        }

        public static string BreakAdvisory(double humidex, bool isNotAclimatized)
        {
            if (isNotAclimatized)
            {
                if (humidex > 0 && humidex < unAclimatizedValues[1])
                {
                    return "Normal work.";
                }
                if (humidex >= unAclimatizedValues[1] && humidex < unAclimatizedValues[2])
                {
                    return "Post Heat Stress Alert.";
                }
                if (humidex >= unAclimatizedValues[2] && humidex < unAclimatizedValues[3])
                {
                    return "Post Heat Stress Warning.";
                }
                if (humidex >= unAclimatizedValues[3] && humidex < unAclimatizedValues[4])
                {
                    return "15 min/h cooling breaks.";
                }
                if (humidex >= unAclimatizedValues[3] && humidex < unAclimatizedValues[5])
                {
                    return "30 min/h cooling breaks.";
                }
                if (humidex >= unAclimatizedValues[5])
                {
                    return "45 min/h cooling breaks.";
                }
                return "N//A";
            }
            else
            {
                if (humidex > 0 && humidex < aclimatizedValues[1])
                {
                    return "Normal work.";
                }
                if (humidex > aclimatizedValues[1] && humidex < aclimatizedValues[2])
                {
                    return "Post Heat Stress Alert notice.";
                }
                if (humidex >= aclimatizedValues[2] && humidex < aclimatizedValues[3])
                {
                    return "Post Heat Stress Warning notice.";
                }
                if (humidex >= aclimatizedValues[3])
                {
                    return "15 min/h cooling breaks.";
                }
                return "N//A";
            }
        }

        public static Color DangerLevelColor(double humidex, bool isNotAclimatized)
        {
            if (isNotAclimatized)
            {
                if (humidex > 0 && humidex < unAclimatizedValues[1])
                {
                    return Colors.Green;
                }
                if (humidex >= unAclimatizedValues[1] && humidex < unAclimatizedValues[2])
                {
                    return Colors.Yellow;
                }
                if (humidex >= unAclimatizedValues[2] && humidex < unAclimatizedValues[3])
                {
                    return Colors.Orange;
                }
                if (humidex >= unAclimatizedValues[3] && humidex < unAclimatizedValues[4])
                {
                    return Colors.OrangeRed;
                }
                if (humidex >= unAclimatizedValues[4] && humidex < unAclimatizedValues[5])
                {
                    return Colors.Red;
                }
                if (humidex >= unAclimatizedValues[5])
                {
                    return Colors.Black;
                }
                return Colors.Gray;
            }
            else
            {
                if (humidex > 0 && humidex < aclimatizedValues[0])
                {
                    return Colors.Green;
                }
                if (humidex > aclimatizedValues[0] && humidex < aclimatizedValues[1])
                {
                    return Colors.Yellow;
                }
                if (humidex >= aclimatizedValues[1] && humidex < aclimatizedValues[2])
                {
                    return Colors.Orange;
                }
                if (humidex >= aclimatizedValues[2] && humidex < aclimatizedValues[3])
                {
                    return Colors.Red;
                }
                if (humidex >= aclimatizedValues[3])
                {
                    return Colors.Black;
                }
                return Colors.Gray;
            }
        }

        public static string DangerLevelText(double humidex, bool isNotAclimatized)
        {
            if (isNotAclimatized)
            {
                if (humidex > 0 && humidex < unAclimatizedValues[1])
                {
                    return "Normal";
                }
                if (humidex >= unAclimatizedValues[1] && humidex < unAclimatizedValues[2])
                {
                    return "Caution";
                }
                if (humidex >= unAclimatizedValues[2] && humidex < unAclimatizedValues[3])
                {
                    return "Alert";
                }
                if (humidex >= unAclimatizedValues[3] && humidex < unAclimatizedValues[4])
                {
                    return "Danger";
                }
                if (humidex >= unAclimatizedValues[5])
                {
                    return "Extreme";
                }
                return "Cold Warning";
            }
            else
            {
                if (humidex > 0 && humidex < aclimatizedValues[0])
                {
                    return "Normal";
                }
                if (humidex > aclimatizedValues[0] && humidex < aclimatizedValues[1])
                {
                    return "Alert";
                }
                if (humidex >= aclimatizedValues[1] && humidex < aclimatizedValues[2])
                {
                    return "Warning";
                }
                if (humidex >= aclimatizedValues[2] && humidex < aclimatizedValues[3])
                {
                    return "Danger";
                }
                if (humidex >= aclimatizedValues[3])
                {
                    return "Extreme";
                }
                return "Cold Warning";
            }
            
        }


    }
    
}
