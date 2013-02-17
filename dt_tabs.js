DT.deactivate_tabs = function()
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
};

DT.store_tab_list = function(list)
{
  var obj = {};
  obj[DT.storage_key] = list;

  chrome.storage.sync.set(obj);
  obj = null;
};

DT.get_tab_list = function(callback)
{
  chrome.storage.sync.get(DT.storage_key, callback);
};

DT.create_decaying_tab = function(tab)
{
  return(new DecayingTab(tab));
};

DT.decay_tab = function(dtab)
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
};

DT.tab_allowed_to_decay = function(tab)
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
};

DT.update_tab = function(tab)
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
};
