var DT = {
  storage_key: null,
  max_lifetime: 1000 * 60 * 60 * 24,
  decay_check_interval: 1000 * 60,
  bookmark_folder_title: "Decayed Tabs",
  bookmark_folder: null,
  active_tabs: null,

  decay_interval: function()
  {
    chrome.tabs.query({active: true}, function(tabs) {
      DT.active_tabs = tabs;

      DT.get_tab_list(function(items) {
        if (!items)
        {
          DT.start_decay_timer();
          return;
        }

        var item = items[DT.storage_key];

        if (!item)
        {
          DT.start_decay_timer();
          return;
        }

        for (var tabid in item)
        {
          var dtab = item[tabid];

          if (!dtab)
            continue;

          if (DT.decay_tab(dtab))
            delete item[tabid];
        }

        DT.store_tab_list(item);
        DT.start_decay_timer();
      });
    });
  },
};
