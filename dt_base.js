var DT = {
  storage_keys: {
    "tabs": "dt_tabs",
    "enabled": "dt_enabled",
    "decay_value": "dt_decay_value",
    "decay_interval": "dt_decay_interval",
    "archive_enabled": "dt_archive_enabled",
    "user_id": "dt_uid",
    "archived_tabs": "dt_archived_tabs",
    "encryption_key": "dt_encryption_key",
    "encryption_enabled": "dt_encryption_enabled",
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
  encryption_key: null,
  encryption_enabled: false,

  // default settings
  def_enabled: true,
  def_decay_value: 2,
  def_decay_interval: 86400,
  def_archive_enabled: false,
  def_encryption_enabled: false,

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
  
  get_setting_array: function(key)
  {
    var list = DT.get_setting(key, "[]");
    
    list = JSON.parse(list, function(key, value) {
      var type;
      
      if (value && typeof value === 'object')
      {
        type = value.type;
        
        if (typeof type === 'string' && typeof window[type] === 'function')
          return(new (window[type])(value));
      }
      
      return(value);
    });

    return(list);
  },
  
  set_setting_array: function(key, list)
  {
    list = JSON.stringify(list, function (k, value) {
      if (typeof value === 'number' && !isFinite(value)) {
          return String(value);
      }
      return value;
    });
  
    DT.set_setting(key, list);
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
        {
          alert("Active tab not in dtabs list; decay_interval");
          continue;
        }

        if (DT.decay_tab(dtab))
          delete decayed_tabs[tabid];
      }

      DT.store_tab_list(decayed_tabs);
      decayed_tabs = null;
      DT.start_decay_timer();
    });
  },
};
