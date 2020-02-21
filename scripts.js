


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






function loadWeather(zipCode){
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode+ "&units=imperial&APPID=f617b6cb95e94d59d5cc345b892aaabf",function(json){
      str = ""
      for (var key in json) {
        str += "<h4><u>" + key + "</u></h4>";
        str += strDict(json[key]);
      }

      document.getElementById("raw_data").innerHTML = str;
      document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + "@2x.png"
      console.log(JSON.stringify(json));


      // calculations
      n = (json["weather"][0]["id"]);
      num = (10/8) * (n == 800 ? 0 : n) / 10; // weatherDict[json["weather"][0]["id"]]
      clouds = json["clouds"]["all"];
      temp = json["main"]["feels_like"];
      humidity = json["main"]["humidity"];

      round = 1000;
      grade = (1/round) * Math.round(round * ((3 * num / 8) + (3 * clouds / 8) + (3 * (100 - temp) / 16) + (humidity / 16)));

      document.getElementById("grade").innerHTML = ("" + grade).substring(0,4) + "%";

      var gauge = new Gauge(document.getElementById("gauge"));

      gauge.value(grade/100);

    });
}
