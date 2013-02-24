DT.save_to_webservice = function(dtab)
{
  if (!DT.archive_enabled)
  {
    DT.dmsg("Not archiving; disabled", null);
    return;
  }
  
  var uid = DT.user_id;
  
  if (!uid)
  {
    DT.dmsg("Not archiving; no uid", null);
    return;
  }
  
  var xhr = new XMLHttpRequest();
  var params = "url=" + encodeURIComponent(dtab.url);
  params += "&title=" + encodeURIComponent(dtab.title);
  params += "&uid=" + encodeURIComponent(uid);
  
  xhr.open("POST", "https://tabdecay.cosmicshovel.com/add.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //alert(xhr.responseText);
      // store uuid here
      DT.dmsg("Saved to web service", dtab);
    }
  }
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(params);
};
