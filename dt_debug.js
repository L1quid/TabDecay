DT.tab_to_s = function(dtab)
{
  var s = "";
  
  if (dtab.title)
    s += dtab.title + "; ";
  
  if (dtab.url)
    s += dtab.url + "; ";
  
  if (dtab.parentId)
    s += String(dtab.parentId) + "; ";
  
  return(s);
};

DT.dmsg = function(msg, dtab)
{
  if (dtab)
    console.log(msg + " - " + DT.tab_to_s(dtab));
  else
    console.log(msg);
};
