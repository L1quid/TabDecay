function dt_save_options()
{
  var DT = dt_get();
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
  dt_set_setting(DT.storage_key("encryption_key"), DT.encryption_key);
  dt_set_setting(DT.storage_key("encryption_enabled"), document.querySelector("#dt_archive_encryption_enabled").checked);
  
  dt_get().load_settings();
  
  var status = document.getElementById("dt_save_status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function dt_show_generate_encryption_key()
{
  var DT = dt_get();
  document.querySelector("#dt_archive_encryption_set_pass").style.display = "";
  document.querySelector("#dt_archive_encryption_pass_exists").style.display = "none";
  document.querySelector("#dt_archive_encryption_pass_cancel").style.display = DT.has_valid_encryption_key() ? "" : "none";
}

function dt_hide_generate_encryption_key()
{
  document.querySelector("#dt_archive_encryption_set_pass").style.display = "none";
  document.querySelector("#dt_archive_encryption_pass_exists").style.display = "";
}

function dt_toggle_archive_encryption()
{
  var DT = dt_get();
  var elm = document.querySelector("#dt_archive_encryption_enabled");
  
  if (elm.checked)
  {
    if (DT.has_valid_encryption_key())
    {
      document.querySelector("#dt_archive_encryption_set_pass").style.display = "none";
      document.querySelector("#dt_archive_encryption_pass_exists").style.display = "";
    }
    else
    {
      document.querySelector("#dt_archive_encryption_set_pass").style.display = "";
      document.querySelector("#dt_archive_encryption_pass_exists").style.display = "none";
    }
  }
  else
  {
    document.querySelector("#dt_archive_encryption_set_pass").style.display = "none";
    document.querySelector("#dt_archive_encryption_pass_exists").style.display = "none";
  }
}

function dt_generate_encryption_key()
{
  var pass_elm = document.querySelector("#dt_archive_encryption_pass");
  
  if (pass_elm.value.length <= 7)
  {
    pass_elm.style.border = "1px solid red";
    document.getElementById("dt_archive_encryption_pass_status").innerHTML = "Password must be at least 8 characters.";
    return;
  }
  
  var DT = dt_get();
  
  if (DT.set_encryption_key(pass_elm.value))
  {
    pass_elm.value = "";
    dt_toggle_archive_encryption();
    var status = document.getElementById("dt_save_status");
    status.innerHTML = "Encryption key generated.";
    setTimeout(function() {
      status.innerHTML = "";
    }, 750);
  }
  else
  {
    document.getElementById("dt_archive_encryption_pass_status").innerHTML = "Error generating key";
  }
}

function dt_options_init()
{
  document.querySelector('#dt_save_settings').addEventListener('click', dt_save_options);
  document.querySelector('#dt_reset_settings').addEventListener('click', dt_reset_options);
  document.querySelector("#dt_archive_encryption_enabled").addEventListener("change", dt_toggle_archive_encryption);
  document.querySelector("#dt_archive_encryption_pass_save").addEventListener("click", dt_generate_encryption_key);
  document.querySelector("#dt_archive_encryption_change_pass").addEventListener("click", dt_show_generate_encryption_key);
  document.querySelector("#dt_archive_encryption_pass_cancel").addEventListener("click", dt_hide_generate_encryption_key);
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
  var DT = dt_get();
  var decay_value = dt_get_setting(DT.storage_key("decay_value"), String(DT.def_decay_value));
  var decay_interval = dt_get_setting(DT.storage_key("decay_interval"), String(DT.def_decay_interval));
  var archive = dt_get_setting(DT.storage_key("archive_enabled"), DT.def_archive_enabled);
  var enabled = dt_get_setting(DT.storage_key("enabled"), DT.def_enabled);
  var uid = dt_get_setting(DT.storage_key("user_id"), null);
  var encryption_enabled = dt_get_setting(DT.storage_key("encryption_enabled"), DT.def_encryption_enabled);
  
  if (!uid)
    document.querySelector("#dt_archive_user_link").style.display = "none";
  else
    document.querySelector("#dt_archive_user_link").href = "https://tabdecay.cosmicshovel.com/list.php?uid=" + uid;
  
  document.querySelector("#dt_decay_value").value = decay_value;
  document.querySelector("#dt_decay_interval_" + String(decay_interval)).selected = "true";
  document.querySelector("#dt_archive_enabled").checked = archive;
  document.querySelector("#dt_enabled").checked = enabled;
  document.querySelector("#dt_archive_encryption_enabled").checked = encryption_enabled;
  dt_toggle_archive_encryption();
}

document.addEventListener('DOMContentLoaded', dt_options_init);
