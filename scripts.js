function strDict(input) {
  stringOut = "";

  if (typeof input != 'object') {
    stringOut +=  "<strong>" + input + "</strong>";
  }

  else {
    stringOut += "<ul>" //  class=\"list-group flush\">";
    for (var key in input) {
      stringOut += "<li>" + key + ": " + strDict(input[key]) + "</li>"; // class=\"list-group-item\">
    }
    stringOut += "</ul>";
  }

  return stringOut;
}






function loadWeather(zipCode){
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode+ "&units=imperial&APPID=f617b6cb95e94d59d5cc345b892aaabf",function(json){
      document.getElementById("raw_data").innerHTML = strDict(json);
      icon = json["weather"][0]["icon"];
      document.getElementById("icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      console.log(JSON.stringify(json));

    });
}
