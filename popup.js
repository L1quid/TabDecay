function dt_show_options()
{
  chrome.tabs.create({url: "options.html"});
}

function dt_toggle_enabled(event)
{
  if (event.target.type)
    return;

  document.querySelector("#dt_enabled").checked = !document.querySelector("#dt_enabled").checked;
  dt_set_setting("dt_enabled", document.querySelector("#dt_enabled").checked);

  return(false);
}

function dt_popup_init()
{
  document.querySelector("#dt_version_head").innerHTML = "v1.0";
  document.querySelector("#dt_enabled").checked = dt_get_setting("dt_enabled", true);
  document.querySelector('#dt_options_link').addEventListener('click', dt_show_options);
  document.querySelector('#dt_enabled_link, #dt_enabled').addEventListener('click', dt_toggle_enabled);
}

document.addEventListener('DOMContentLoaded', dt_popup_init);

