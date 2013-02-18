DT.save_to_webservice = function(dtab)
{
  var xhr = new XMLHttpRequest();
  var params = "url=" + encodeURIComponent(dtab.url);
  params += "&title=" + encodeURIComponent(dtab.title);
  
  xhr.open("POST", "https://tabdecay.cosmicshovel.com/add.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //alert(xhr.responseText);
      // store uuid here
    }
  }
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(params);
};
