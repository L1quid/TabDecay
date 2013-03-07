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
  var DT = dt_get();
  DT.save_current_tab();
  window.close();
}

function dt_popup_init()
{
  var DT = dt_get();
  document.querySelector('#dt_options_link').addEventListener('click', dt_show_options);
  var archive_link = document.querySelector("#dt_archive_page_now_link");
  archive_link.addEventListener("click", dt_archive_page_now);

  var msg = "Bookmark";

  if (DT.archive_enabled)
    msg += " + Archive";

  msg += " This Page";
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
  
  var view_archive = document.querySelector("#dt_view_archives");
  var view_enc_archive = document.querySelector("#dt_view_encrypted_archives");
  
  if (DT.user_id)
  {
    view_archive.href = "https://tabdecay.cosmicshovel.com/list.php?uid=" + DT.user_id;
    view_enc_archive.href = chrome.extension.getURL("/encrypted_archives.html");
  }
  else
  {
    view_archive.style.display = "none";
    view_enc_archive.style.display = "none";
  }
  
  if (!DT.has_valid_encryption_key())
    view_enc_archive.style.display = "none";
}

document.addEventListener('DOMContentLoaded', dt_popup_init);

