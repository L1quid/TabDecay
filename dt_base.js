var DT = {
  storage_keys: {
    "tabs": "dt_tabs",
    "enabled": "dt_enabled",
    "decay_value": "dt_decay_value",
    "decay_interval": "dt_decay_interval",
    "archive_enabled": "dt_archive_enabled",
    "user_id": "dt_uid",
  },
  decay_check_interval: 1000 * 5,
  bookmark_folder_title: "Decayed Tabs",
  bookmark_folder: null,
  timeout_id: null,
  user_id: null,
  
  // user settings
  enabled: true, // dt_enabled
  max_lifetime: 1000 * 60 * 60 * 24, // dt_decay_value * dt_decay_interval * 1000
  archive_enabled: false, // dt_archive_enabled
  
  // default settings
  def_enabled: true,
  def_decay_value: 2,
  def_decay_interval: 86400,
  def_archive_enabled: false,
  
  storage_key: function(key)
  {
    return(DT.storage_keys[key]);
  },
  
  get_setting: function(key, def_val)
  {
    var ret = localStorage[key];

    if (ret == null)
      ret = def_val;
    
    if (ret == "true")
      ret = true;
    else if (ret == "false")
      ret = false;
  
    return(ret);
  },
  
  set_setting: function(key, val)
  {
    localStorage[key] = val;
  },

  decay_interval: function()
  {
    chrome.tabs.query({active: true}, function(tabs) {
      DT.active_tabs = tabs;
      
      var decayed_tabs = DT.get_tab_list();

      for (var tabid in decayed_tabs)
      {
        var dtab = decayed_tabs[tabid];

        if (!dtab)
          continue;

        if (DT.decay_tab(dtab))
          delete decayed_tabs[tabid];
      }

      DT.store_tab_list(decayed_tabs);
      decayed_tabs = null;
      DT.start_decay_timer();
    });
  },
};
