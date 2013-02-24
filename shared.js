function dt_get_setting(key, def_val)
{
  var ret = localStorage[key];

  if (ret == null)
    ret = def_val;
  
  if (ret == "true")
    ret = true;
  else if (ret == "false")
    ret = false;

  return(ret);
}

function dt_set_setting(key, val)
{
  localStorage[key] = val;
}
