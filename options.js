function dt_save_options()
{
  var DT = chrome.extension.getBackgroundPage().DT;
  var interval_select = document.querySelector("#dt_decay_interval");
  var idx = interval_select.selectedIndex;
  var dv_elm = document.querySelector("#dt_decay_value");
  var decay_value = parseInt(dv_elm.value);
  
  if (isNaN(decay_value))
  {
    dv_elm.style.border = "1px solid red";
    document.getElementById("dt_save_status").innerHTML = "Invalid decay value";
    return;
  }
  
  dv_elm.style.border = "";
  dt_set_setting(DT.storage_key("decay_value"), decay_value);
  dt_set_setting(DT.storage_key("decay_interval"), interval_select.options[idx].value);
  dt_set_setting(DT.storage_key("archive_enabled"), document.querySelector("#dt_archive_enabled").checked);
  dt_set_setting(DT.storage_key("enabled"), document.querySelector("#dt_enabled").checked);
  
  chrome.extension.getBackgroundPage().DT.load_settings();
  
  var status = document.getElementById("dt_save_status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function dt_options_init()
{
  document.querySelector('#dt_save_settings').addEventListener('click', dt_save_options);
  document.querySelector('#dt_reset_settings').addEventListener('click', dt_reset_options);
  dt_restore_options();
}

function dt_reset_options()
{
  dt_restore_options();
  
  var status = document.getElementById("dt_save_status");
  status.innerHTML = "Options reset.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function dt_restore_options()
{
  var DT = chrome.extension.getBackgroundPage().DT;
  var decay_value = dt_get_setting(DT.storage_key("decay_value"), String(DT.def_decay_value));
  var decay_interval = dt_get_setting(DT.storage_key("decay_interval"), String(DT.def_decay_interval));
  var archive = dt_get_setting(DT.storage_key("archive_enabled"), DT.def_archive_enabled);
  var enabled = dt_get_setting(DT.storage_key("enabled"), DT.def_enabled);
  var uid = dt_get_setting(DT.storage_key("user_id"), null);
  
  if (!uid)
    document.querySelector("#dt_archive_user_link").style.display = "none";
  else
    document.querySelector("#dt_archive_user_link").href = "https://tabdecay.cosmicshovel.com/list.php?uid=" + uid;
  
  document.querySelector("#dt_decay_value").value = decay_value;
  document.querySelector("#dt_decay_interval_" + String(decay_interval)).selected = "true";
  document.querySelector("#dt_archive_enabled").checked = archive;
  document.querySelector("#dt_enabled").checked = enabled;
}

document.addEventListener('DOMContentLoaded', dt_options_init);
