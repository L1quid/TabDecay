DT.store_tab_list = function(list)
{
  list = JSON.stringify(list, function (key, value) {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
  });

  DT.set_setting(DT.storage_key("tabs"), list);
};

DT.get_tab_list = function()
{
  var list = DT.get_setting(DT.storage_key("tabs"), "{}");

  list = JSON.parse(list, function (key, value) {
    var type;
    if (value && typeof value === 'object') {
        type = value.type;
        if (typeof type === 'string' && typeof window[type] === 'function') {
            return new (window[type])(value);
        }
    }
    return value;
  });

  return(list);
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
      {
        DT.dmsg("Not decaying, tab is active", dtab);
        return(false);
      }
    }
  }

  var now = new Date().getTime();

  if ((now - dtab.timestamp) >= DT.max_lifetime)
  {
    DT.dmsg("Decaying...", dtab);
    DT.save_tab(dtab);
    DT.close_tab(dtab);

    return(true);
  }

  DT.dmsg("Not decaying", dtab);

  return(false);
};

DT.save_current_tab = function(dtab)
{
  chrome.tabs.query({active: true}, function(tabs) {
    var decayed_tabs = DT.get_tab_list();

    for (var i = 0; i < tabs.length; i++)
    {
      var dtab = decayed_tabs[tabs[i].id];

      if (!dtab)
      {
        alert("Active tab not found in dtabs; save_current_tab");
        continue;
      }

      DT.save_tab(dtab);
    }
  });
};

DT.save_tab = function(dtab)
{
  DT.dmsg("Saving tab...", dtab);
  DT.create_bookmark(dtab);
  DT.save_to_webservice(dtab);
};

DT.tab_allowed_to_decay = function(tab)
{
  if (!tab || tab.pinned || tab.incognito || !tab.url || tab.url == "")
    return(false);

  var to_ignore = new Array(
    "chrome-devtools://",
    "chrome-extension://",
    "chrome://",
    "tabdecay.cosmicshovel.com"
  );

  for (var i = 0; i < to_ignore.length; i++)
  {
    var ignore = to_ignore[i];

    if (tab.url.indexOf(ignore) >= 0)
      return(false);
  }

  // check white list here

  return(true);
};

DT.update_tab = function(tab)
{
  if (!DT.enabled || !DT.tab_allowed_to_decay(tab))
    return;

  var decayed_tabs = DT.get_tab_list();
  var dtab = DT.create_decaying_tab(tab);
  decayed_tabs[dtab.id] = dtab;
  DT.store_tab_list(decayed_tabs);
  decayed_tabs = null;
};

DT.close_tab = function(dtab)
{
  try
  {
    chrome.tabs.remove(dtab.id);
  }
  catch (e)
  {
    console.log("Error closing tab");
  }
};
