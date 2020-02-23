


function strDict(input) {
  stringOut = "";

  if (typeof input != 'object') {
    stringOut +=  "<strong>" + input + "</strong>";
  }

  else {
    stringOut += "<ul>"; // class=\"list-group flush\"
    for (var key in input) {
      stringOut += "<li>" + key + ": " + strDict(input[key]) + "</li>"; //  class=\"list-group-item\">
    }
    stringOut += "</ul>";
  }

  return stringOut;
}




function calculateGrade(json) {
  codeDict = {200:75,201:83,202:95,211:75,212:80,221:90,230:70,231:72,232:74,300:54,
    301:56,302:58,310:60,311:62,312:64,313:66,314:68,321:70,500:56,501:62,502:72,
    503:82,504:90,511:92,520:76,521:80,522:94,531:95,600:30,601:34,602:62,611:78,
    612:40,613:38,615:40,616:88,620:70,621:74,622:76,701:55,711:57,721:60,731:40,
    741:80,751:60,761:60,762:100,771:65,781:90,800:0,801:20,802:40,803:80,804:100};

  // num = (10/8) * ((json["weather"][0]["id"]) == 800 ? 0 : (json["weather"][0]["id"])) / 10;
  num = codeDict[json["weather"][0]["id"]];
  clouds = json["clouds"]["all"];
  temp = json["main"]["feels_like"];
  humidity = json["main"]["humidity"];

  grade = ((3 * num / 8) + (3 * clouds / 8) + (3 * (100 - temp) / 16) + (humidity / 16));

  return grade;
}




function loadWeather(zipCode){
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + "&units=imperial&APPID=f617b6cb95e94d59d5cc345b892aaabf",function(json){
      str = ""
      for (var key in json) {
        str += "<h4><u>" + key + "</u></h4>";
        str += strDict(json[key]);
      }

      document.getElementById("raw_data").innerHTML = str;
      document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + "@2x.png"
      console.log(JSON.stringify(json));

      grade = calculateGrade(json);

      console.log("grade: " + grade)
      document.getElementById("grade").innerHTML = ("" + grade).substring(0,4) + "%";
      document.getElementById("place").innerHTML = json["name"];

      advice = "";
      if (grade < 20) {
        advice = "Not looking too great for math today.";
      }
      else if (grade < 40) {
        advice = "Mehhhh.....";
      }
      else if (grade < 60) {
        advice = "That fair... maybe some claculus?";
      }
      else if (grade < 80) {
        advice = "It's lookin' mighty fine for math today!";
      }
      else if (grade < 100) {
        advice = "Get inside right now and solve the 3n+1 problem!";
      }
      else {
        advice = "This is probably a mistake. If not a volcano is probably erupting...";
      }
      document.getElementById("advice").innerHTML = advice;

      var gauge = new Gauge(document.getElementById("gauge"));

      gauge.value(grade/100);

    });


    $.getJSON("https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + "&units=imperial&appid=f617b6cb95e94d59d5cc345b892aaabf",function(json){

      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];

      last_day = 0;

      str = "";

      for (i in json["list"]) {

        dt = json["list"][i]["dt_txt"];
        year = dt.substring(0,4);
        month = dt.substring(5,7);
        day = dt.substring(8,10);
        hour = parseInt(dt.substring(11, 13));
        ampm = hour >= 12 ? "pm" : "am";
        hour = hour > 12 ? hour % 12 : hour;
        hour = hour == 0 ? 12 : hour;

        // console.log(year, month, day, hour, ampm);

        if (day != last_day) {
          str += "</div>";
          str += "<hr><h5>" + months[month - 1] + " " + day + ", " + year + "</h5>";
          str += "<div class=\"row small\">";
          str += "<div class=\"col-xs-3\"></div>";
        }
        str += "<div class=\"col-xs-1 less_space\">";
        str += "<strong>" + ("" + calculateGrade(json["list"][i])).substring(0,4) + " % </strong><br>";
        str += hour + " " + ampm;
        str += "</div>";


        last_day = day;

      }

      str += "<br><br><br><hr>";

      document.getElementById("forecast").innerHTML = str;

    });

}




function loadEmbed(zipCode){
  try {
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + "&units=imperial&APPID=f617b6cb95e94d59d5cc345b892aaabf",function(json){

      document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + "@2x.png"

      grade = calculateGrade(json);

      document.getElementById("grade").innerHTML = ("" + grade).substring(0,4) + "%</strong>";
      document.getElementById("place").innerHTML = json["name"];

    });
    }
    catch (err) {
      document.getElementById("grade").innerHTML = "Disable adblocker to allow this plugin -PEF";

    }
}
