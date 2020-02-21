


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
  num = (10/8) * ((json["weather"][0]["id"]) == 800 ? 0 : (json["weather"][0]["id"])) / 10; // weatherDict[json["weather"][0]["id"]]
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
          str += "<div class=\"row\">";
          str += "<div class=\"col-xs-2\"></div>";
        }
        str += "<div class=\"col-xs-1 less_space\">";
        str += "<strong class=\"small\">" + ("" + calculateGrade(json["list"][i])).substring(0,4) + " % </strong><br>";
        str += hour + " " + ampm;
        str += "</div>";

        last_day = day;


      }
      document.getElementById("forecast").innerHTML = str;

    });

}
