function dt_enc_archives_init()
{
  document.querySelector("#dt_enc_form").addEventListener("submit", dt_enc_submit_form);
  
  var DT = dt_get();
  var xhr = new XMLHttpRequest();
  var params = "format=json&encrypted=1&uid=" + encodeURIComponent(DT.user_id);
  
  dt_enc_set_status("Loading...");
  
  document.querySelector("#dt_uid").value = DT.user_id;
  document.querySelector("#dt_submit_btn").style.display = "none";
  
  xhr.open("GET", "https://tabdecay.cosmicshovel.com/list.php?" + params, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //alert(xhr.responseText);
      // store uuid here
      dt_enc_set_status("Parsing...");
      var ret = JSON.parse(xhr.responseText, function (key, value) {
        var type;
        if (value && typeof value === 'object') {
            type = value.type;
            if (typeof type === 'string' && typeof window[type] === 'function') {
                return new (window[type])(value);
            }
        }
        return value;
      });
      
      dt_enc_set_status("Decrypting " + String(ret["tabs"].length) + "/" + String(ret["total_tabs"]) + " tabs...");
      
      var content_elm = document.querySelector("#dt_enc_content");
      var form = document.querySelector("#dt_enc_form");
      var list = document.querySelector("#dt_enc_list");
      
      list.innerHTML = "";
      
      if (ret["tabs"].length == 0)
      {
        var li = document.createElement("LI");
        li.innerHTML = "You have no encrypted tabs.";
        list.appendChild(li);
        li = null;
      }
      else
      {
        for (var i = 0; i < ret["tabs"].length; i++)
        {
          var tab = ret["tabs"][i];
          tab["title"] = DT.decrypt(tab["title"]);
          tab["url"] = DT.decrypt(tab["url"]);
          var li = document.createElement("LI");
          var anchor = document.createElement("A");
          var chk = document.createElement("INPUT");
          chk.type = "checkbox";
          chk.name = "keys[]";
          chk.value = tab["public_id"];
          li.appendChild(chk);
          anchor.target = "_blank";
          anchor.href = tab["url"];
          anchor.innerText = tab["title"];
          li.appendChild(anchor);
          li.innerHTML = li.innerHTML + "<br />Archived: " + tab["created_at"];
          list.appendChild(li);
          tab = null;
          anchor = null;
        }
        
        document.querySelector("#dt_submit_btn").style.display = "";
      }
      
      dt_enc_set_status("Done!");
    }
  }
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
}

function dt_enc_set_status(msg)
{
  document.querySelector("#dt_enc_status").innerHTML = "Status: " + msg;
}

function dt_enc_submit_form(event)
{
  var DT = dt_get();
  var chks = document.querySelectorAll("li input[type='checkbox']");
  var to_rm = 0;
  var params = "uid=" + encodeURIComponent(DT.user_id);
  var form = document.querySelector("#dt_enc_form");
  
  event.preventDefault();
  
  for (var i = 0; i < chks.length; i++)
  {
    var chk = chks[i];
    
    if (!chk.checked)
      continue;
    
    to_rm++;
    params += "&keys[]=" + encodeURIComponent(chk.value);
  }
  
  if (to_rm == 0)
  {
    dt_enc_set_status("You must select one or more bookmarks to delete.");
    return(false);
  }
  
  dt_enc_set_status("Submitting deletions...");
  
  var xhr = new XMLHttpRequest();
  xhr.open(form.method, form.action, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4)
    {
      dt_enc_set_status("Deleted!");
      // the rm script should really just return this data
      // instead of requiring us to make a second request to get the updated list
      dt_enc_archives_init();
    }
  };
  
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
  
  return(false);
}

document.addEventListener('DOMContentLoaded', dt_enc_archives_init);
