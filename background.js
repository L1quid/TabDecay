var DecayingTab = function(tab)
{
  this.url = tab.url;
  this.timestamp = new Date().getTime();
  this.id = tab.id;
  this.active = tab.active;
  this.title = tab.title;
};

var DT = {
  bookmark_folder: null,
  storage_key: null,
  max_lifetime: 1000 * 30,
  decay_check_interval: 1000,
  bookmark_folder_title: "Decayed Tabs",
  active_tabs: null,

  /********************** STARTUP *****************************/

  boot: function()
  {
    DT.storage_key = "decayingtabs-dev";// + String(chrome.windows.WINDOW_ID_CURRENT);

    DT.ensure_bookmark_folder_exists();
    DT.setup_event_listeners();
    DT.start_decay_timer();
  },

  ensure_bookmark_folder_exists: function()
  {
    chrome.bookmarks.getTree(function(bookmarks) {
      var bookmark_id = DT.check_for_bookmark_folder(bookmarks);

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
  },

  check_for_bookmark_folder: function(bookmarks)
  {
    if (bookmarks.length == 0)
      return null;

    for (var i = 0; i < bookmarks.length; i++)
    {
      var bookmark = bookmarks[i];

      if (bookmark.url)
        continue;

      if (bookmark.title == DT.bookmark_folder_title)
        return(bookmark.id);

      if (bookmark.children.length > 0)
      {
        var bookmark_id = DT.check_for_bookmark_folder(bookmark.children);

        if (bookmark_id)
          return(bookmark_id);
      }
    }

    return(null);
  },

  setup_event_listeners: function()
  {
    chrome.tabs.onCreated.addListener(function(tab) {
      DT.update_tab(tab);
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      DT.update_tab(tab);
    });

    chrome.tabs.onActivated.addListener(function(active_info) {
      //DT.deactivate_tabs();
      DT.active_info.tabId = active_info.tabId;

      chrome.tabs.get(active_info.tabId, function(tab) {
        DT.update_tab(tab);
      });
    });
  },

  start_decay_timer: function()
  {
    window.setInterval(DT.decay_interval, DT.decay_check_interval);
  },

  /************************** TAB HANDLING ***************************/

  deactivate_tabs: function()
  {
    DT.get_tab_list(function(items) {
      var item = items[DT.storage_key];

      if (item == null || item == undefined)
        return;

      for (var tabid in item)
      {
        var dtab = item[tabid];

        if (!dtab)
          continue;

        dtab.active = false;
        item[tabid] = dtab;
      }

      DT.store_tab_list(item);
    });
  },

  store_tab_list: function(list)
  {
    var obj = {};
    obj[DT.storage_key] = list;

    chrome.storage.sync.set(obj);
    obj = null;
  },

  get_tab_list: function(callback)
  {
    chrome.storage.sync.get(DT.storage_key, callback);
  },

  create_decaying_tab: function(tab)
  {
    return(new DecayingTab(tab));
  },

  decay_tab: function(dtab)
  {
    if (DT.active_tabs)
    {
      for (var i = 0; i < DT.active_tabs.length; i++)
      {
        if (dtab.id == DT.active_tabs[i].id)
          return(false);
      }
    }

    var now = new Date().getTime();

    if (now - dtab.timestamp >= DT.max_lifetime)
    {
      DT.create_bookmark(dtab);
      chrome.tabs.remove(dtab.id);
      return(true);
    }

    return(false);
  },

  tab_allowed_to_decay: function(tab)
  {
    if (!tab || tab.pinned || tab.incognito)
      return(false);

    var to_ignore = new Array(
      "chrome-devtools://",
      "chrome-extension://",
      "chrome://"
    );

    for (var i = 0; i < to_ignore.length; i++)
    {
      var ignore = to_ignore[i];

      if (tab.url.indexOf(ignore) >= 0)
        return(false);
    }

    return(true);
  },

  update_tab: function(tab)
  {
    if (!DT.tab_allowed_to_decay(tab))
      return;

    DT.get_tab_list(function(items) {
      var item = items[DT.storage_key];

      if (item == null || item == undefined)
        item = new Object();

      var dtab = DT.create_decaying_tab(tab);
      item[dtab.id] = dtab;
      DT.store_tab_list(item);
    });
  },

  decay_interval: function()
  {
    chrome.tabs.query({active: true}, function(tabs) {
      DT.active_tabs = tabs;

      DT.get_tab_list(function(items) {
        if (!items)
          return;

        var item = items[DT.storage_key];

        if (!item)
          return;

        for (var tabid in item)
        {
          var dtab = item[tabid];

          if (!dtab)
            continue;

          if (DT.decay_tab(dtab))
            delete item[tabid];
        }

        DT.store_tab_list(item);
      });
    });
  },

  /******************** BOOKMARKS **********************/

  create_bookmark: function(dtab)
  {
    var bookmark = {
      parentId: DT.bookmark_folder,
      title: dtab.title,
      url: dtab.url,
    };

    chrome.bookmarks.getSubTree(DT.bookmark_folder, function(bookmarks) {
      for (var i = 0; i < bookmarks.length; i++)
      {
        if (bookmarks[i].url == bookmark.url)
          return;
      }

      chrome.bookmarks.create(bookmark);
    });

    delete bookmark;
  },
};

DT.boot();
