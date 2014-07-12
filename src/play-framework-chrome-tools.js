// Reset scroll bar from previous position
// ~~~
$(document).ready(function () {
  if (localStorage.getItem('offset') != null) {
    $(window).scrollTop(localStorage.getItem('offset'))
  }

  $(document).scroll(function () {
    //save new position
    var offset = $(window).scrollTop();
    localStorage.setItem('offset', offset)
  });
});

// Play Auto Refresh
// ~~~
var ws = new WebSocket('ws://localhost:9001');
ws.onmessage = function (event) {
  var reload = function () {
    window.location.reload();
    ws.close();
  };
  if (event.data.indexOf('reload') > -1) {
    var components = event.data.split(':');
    if (components.length == 1 && window.location.host === 'localhost:9000') {
      // Old plugin doesn't send port, so just reload default port
      reload();
    } else if (window.location.host === 'localhost:' + components[1]) {
      // otherwise check if the current page is the correct one
      reload();
    }
  }
};

// Open in editor
// ~~~
// E.g. /path/to/file.suffix:6
var fileLinePattern = /In\s*([^ ]*):([0-9]*)/;
chrome.extension.sendRequest({method: "getLocalStorage", key: "playEditorURL"}, function (response) {
  var playEditorURL = response.data;
  if (playEditorURL) {
    var fileAndLineMatch = document.body.textContent.match(fileLinePattern);
    if (fileAndLineMatch) {
      var file = fileAndLineMatch[1];
      var line = fileAndLineMatch[2];

      var editorInvocationURL = playEditorURL.replace('$file', file).replace('$line', line);
      var id = 'openInEditorAjax';
      if (editorInvocationURL.indexOf('http') == -1) {
        id = 'openInEditor';
      }
      document.body.innerHTML = document.body.innerHTML.replace(fileLinePattern,
          "<span style='color: #FFA500; text-decoration: underline; cursor: pointer;' id='" + id + "'>In " + file + ":" + line + "</span>");

      $('#openInEditorAjax').on('click', function () {
        $.get(editorInvocationURL);
      });
      $('#openInEditor').on('click', function () {
        window.open(editorInvocationURL, '_blank');
      });
    }
  }
});
