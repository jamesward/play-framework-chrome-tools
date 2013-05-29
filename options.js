// Saves options to localStorage.
function save_options() {
  var playEditorURL = document.getElementById("playEditorURL").value;
  localStorage["playEditorURL"] = playEditorURL;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores editor URL state to saved value from localStorage.
function restore_options() {
  var playEditorURL = localStorage["playEditorURL"];
  if (!playEditorURL) {
    return;
  }
  var input = document.getElementById("playEditorURL");
  input.value = playEditorURL;

}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);