function dt_get()
{
  return(chrome.extension.getBackgroundPage().DT);
}

function dt_get_setting(key, def_val)
{
  return(dt_get().get_setting(key, def_val));
}

function dt_set_setting(key, val)
{
  dt_get().set_setting(key, val);
}
