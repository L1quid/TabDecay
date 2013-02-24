DT.boot = function()
{
  DT.load_settings();
  DT.ensure_bookmark_folder_exists();
  DT.setup_event_listeners();
  DT.start_decay_timer();
};

DT.load_settings = function()
{
  DT.stop_decay_timer();
  DT.user_id = DT.get_setting(DT.storage_key("user_id"), null);
  
  if (!DT.user_id)
    DT.user_id = DT.generate_user_id();
  
  DT.enabled = DT.get_setting(DT.storage_key("enabled"), DT.def_enabled);
  DT.archive_enabled = DT.get_setting(DT.storage_key("archive_enabled"), DT.archive_enabled);
  var dv = parseInt(DT.get_setting(DT.storage_key("decay_value"), DT.def_decay_value));
  var di = parseInt(DT.get_setting(DT.storage_key("decay_interval"), DT.def_decay_interval));
  DT.max_lifetime = 1000 * dv * di;
  DT.start_decay_timer();
};

DT.generate_user_id = function()
{
  var x = new Date().toISOString() + String(Math.random());
  x = hex_sha1(x);
  DT.set_setting(DT.storage_key("user_id"), x);
  
  return(x);
};

DT.ensure_bookmark_folder_exists = function()
{
  chrome.bookmarks.getTree(function(bookmarks) {
    var bookmark_id = DT.check_for_bookmark_folder(bookmarks, DT.bookmark_folder_title);

    if (!bookmark_id)
    {
      var bookmark = {
        title: DT.bookmark_folder_title
      };

      chrome.bookmarks.create(bookmark, function(new_bookmark) {
        DT.bookmark_folder = new_bookmark.id;
      });

      delete bookmark;
    }
    else
      DT.bookmark_folder = bookmark_id;
  });
};

DT.setup_event_listeners = function()
{
  chrome.tabs.onCreated.addListener(function(tab) {
    DT.update_tab(tab);
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    DT.update_tab(tab);
  });

  chrome.tabs.onActivated.addListener(function(active_info) {
    //DT.deactivate_tabs();
    //DT.active_info.tabId = active_info.tabId;

    chrome.tabs.get(active_info.tabId, function(tab) {
      DT.update_tab(tab);
    });
  });
};

DT.start_decay_timer = function()
{
  if (!DT.enabled)
  {
    DT.dmsg("not starting decay timer; not enabled", null);
    return;
  }
  
  DT.stop_decay_timer();
  DT.dmsg("starting decay timer", null);
  DT.timeout_id = window.setTimeout(DT.decay_interval, DT.decay_check_interval);
};

DT.stop_decay_timer = function()
{
  if (!DT.timeout_id)
  {
    DT.dmsg("not stopping decay timer; not started", null);
    return;
  }
  
  DT.dmsg("stopping decay timer", null);
  
  window.clearTimeout(DT.timeout_id);
  DT.timeout_id = null;
};
