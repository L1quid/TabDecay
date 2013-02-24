function dt_get_setting(key, def_val)
{
  return(chrome.extension.getBackgroundPage().DT.get_setting(key, def_val));
}

function dt_set_setting(key, val)
{
  chrome.extension.getBackgroundPage().DT.set_setting(key, val);
}
