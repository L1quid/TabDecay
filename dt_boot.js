DT.boot = function()
{
  DT.storage_key = "decayingtabs-devx";// + String(chrome.windows.WINDOW_ID_CURRENT);

  DT.ensure_bookmark_folder_exists();
  DT.setup_event_listeners();
  DT.start_decay_timer();
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
  window.setTimeout(DT.decay_interval, DT.decay_check_interval);
};
