function dt_enc_archives_init()
{
  var DT = dt_get();
  var xhr = new XMLHttpRequest();
  var params = "format=json&encrypted=1&uid=" + encodeURIComponent(DT.user_id);
  
  dt_enc_set_status("Loading...");
  
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
      
      for (var i = 0; i < ret["tabs"].length; i++)
      {
        var tab = ret["tabs"][i];
        tab["title"] = DT.decrypt(tab["title"]);
        tab["url"] = DT.decrypt(tab["url"]);
        var para = document.createElement("P");
        var anchor = document.createElement("A");
        anchor.target = "_blank";
        anchor.href = tab["url"];
        anchor.innerText = tab["title"];
        para.appendChild(anchor);
        para.innerHTML = para.innerHTML + "<br />Archived: " + tab["created_at"];
        content_elm.appendChild(para);
        tab = null;
        anchor = null;
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

document.addEventListener('DOMContentLoaded', dt_enc_archives_init);
