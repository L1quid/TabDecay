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
      var list = DT.get_archived_tab_list();
      list.push(xhr.responseText);
      DT.store_archived_tab_list(list);
      DT.dmsg("Saved to web service", dtab);
    }
  }
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(params);
};

DT.store_archived_tab_list = function(list)
{
  list = JSON.stringify(list, function (key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
  });

  DT.set_setting(DT.storage_key("archived_tabs"), list);
};

DT.get_archived_tab_list = function()
{
  var list = DT.get_setting(DT.storage_key("archived_tabs"), "[]");

  list = JSON.parse(list, function (key, value) {
    var type;
    if (value && typeof value === 'object') {
        type = value.type;
        if (typeof type === 'string' && typeof window[type] === 'function') {
            return new (window[type])(value);
        }
    }
    return value;
  });

  return(list);
};
