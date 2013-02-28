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
  
  if (DT.should_encrypt())
  {
    chrome.tabs.sendRequest(dtab.id, {action : 'dt_get_source'}, function(source) {
      DT.finish_save_to_webservice(uid, dtab, source, true);
    });
  }
  else
    DT.finish_save_to_webservice(uid, dtab, null, false);
};

DT.finish_save_to_webservice = function(uid, dtab, source, encrypt)
{
  var xhr = new XMLHttpRequest();
  var params;
  
  if (encrypt)
  {
    params = "enc=1&url=" + encodeURIComponent(DT.encrypt(dtab.url));
    params += "&title=" + encodeURIComponent(DT.encrypt(dtab.title));
    params += "&uid=" + encodeURIComponent(DT.encrypt(uid));
    params += "&src=" + encodeURIComponent(DT.encrypt(source || ""));
  }
  else
  {
    params = "enc=0&url=" + encodeURIComponent(dtab.url);
    params += "&title=" + encodeURIComponent(dtab.title);
    params += "&uid=" + encodeURIComponent(uid);
    params += "&src=" + encodeURIComponent(source || "");
  }
  
  xhr.open("POST", "https://tabdecay.cosmicshovel.com/add.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //alert(xhr.responseText);
      // store uuid here
      var list = DT.get_archived_tab_list();
      list.push(xhr.responseText.replace(/\s+/g, ''));
      DT.store_archived_tab_list(list);
      DT.dmsg("Saved to web service", dtab);
    }
  }
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
};

DT.store_archived_tab_list = function(list)
{
  DT.set_setting_array(DT.storage_key("archived_tabs"), list);
};

DT.get_archived_tab_list = function()
{
  return(DT.get_setting_array(DT.storage_key("archived_tabs")));
};

DT.store_encryption_key = function(list)
{
  DT.set_setting_array(DT.storage_key("encryption_key"), list);
};

DT.get_encryption_key = function()
{
  return(DT.get_setting_array(DT.storage_key("encryption_key")));
};
