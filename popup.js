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

function dt_archive_page_now()
{
  var DT = chrome.extension.getBackgroundPage().DT;
  DT.save_current_tab();
  window.close();
}

function dt_popup_init()
{
  var DT = chrome.extension.getBackgroundPage().DT;
  document.querySelector('#dt_options_link').addEventListener('click', dt_show_options);
  var archive_link = document.querySelector("#dt_archive_page_now_link");
  archive_link.addEventListener("click", dt_archive_page_now);

  var msg = "Bookmark";

  if (DT.archive_enabled)
    msg += " and archive";

  msg += " this page";
  archive_link.innerText = msg;

  chrome.tabs.query({active: true, windowType: "normal"}, function(tabs) {
    archive_link.style.display = "none";

    for (var i = 0; i < tabs.length; i++)
    {
      if (DT.url_allowed(tabs[i].url))
      {
        archive_link.style.display = "";
        break;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', dt_popup_init);

