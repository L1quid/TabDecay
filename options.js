// Saves options to localStorage.
function dt_save_options()
{
  var interval_select = document.querySelector("#dt_decay_interval");
  var idx = interval_select.selectedIndex;
  dt_set_setting("dt_decay_value", document.querySelector("#dt_decay_value").value);
  dt_set_setting("dt_decay_interval", interval_select.options[idx].value);
  dt_set_setting("dt_archive", document.querySelector("#dt_archive").checked);
  // Update status to let user know options were saved.
  var status = document.getElementById("dt_save_status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function dt_options_init()
{
  document.querySelector('#dt_save_settings').addEventListener('click', dt_save_options);
  dt_restore_options();
}

// Restores select box state to saved value from localStorage.
function dt_restore_options()
{
  var decay_value = dt_get_setting("dt_decay_value", 2);
  var decay_interval = dt_get_setting("dt_decay_interval", "86400");
  var archive = dt_get_setting("dt_archive", false);
  
  document.querySelector("#dt_decay_value").value = decay_value;
  document.querySelector("#dt_decay_interval_" + String(decay_interval)).selected = "true";
  document.querySelector("#dt_archive").checked = archive;
}

document.addEventListener('DOMContentLoaded', dt_options_init);
