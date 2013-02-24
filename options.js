// Saves options to localStorage.
function dt_save_options() {
  // Update status to let user know options were saved.
  var status = document.getElementById("dt_save_status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function dt_options_init()
{
  document.querySelector('#dt_save_settings').addEventListener('click', dt_save_options);
  dt_restore_options();
}

// Restores select box state to saved value from localStorage.
function dt_restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
document.addEventListener('DOMContentLoaded', dt_options_init);
