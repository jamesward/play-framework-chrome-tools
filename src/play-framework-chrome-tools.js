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
chrome.extension.sendRequest({method: "getLocalStorage", key: "playEditorURL"}, function (response) {
  var playEditorURL = response.data;
  if (playEditorURL) {

    var replaceErrorMessageWithLink = function (file, line, replaceFn) {
      var editorInvocationURL = playEditorURL.replace('$file', file).replace('$line', line);
      var id = 'openInEditorAjax';
      if (editorInvocationURL.indexOf('http') == -1) {
        id = 'openInEditor';
      }
      document.body.innerHTML = replaceFn(document.body.innerHTML, id);

      $('#openInEditorAjax').on('click', function () {
        $.get(editorInvocationURL);
      });
      $('#openInEditor').on('click', function () {
        window.open(editorInvocationURL, '_blank');
      });
    };

    var tryPlay23 = function () {
      // Error Message 2.3: /path/to/file.suffix:6
      var errorElement = document.getElementsByTagName('h2')[0];
      if (!errorElement) {
        return false;
      }

      var fileLinePattern = /In\s*([^ ]*):([0-9]*)/;
      var fileAndLineMatch = errorElement.textContent.match(fileLinePattern);
      if (!fileAndLineMatch) {
        return false;
      }

      var file = fileAndLineMatch[1];
      var line = fileAndLineMatch[2];
      replaceErrorMessageWithLink(file, line, function (html, id) {
        return html.replace(fileLinePattern,
            "In <span style='color: #FFA500; text-decoration: underline; cursor: pointer;' id='" +
            id + "'>" + file + ":" + line + "</span>");
      });

      return true;
    };

    var tryPlay22 = function () {
      // Error Message 2.0-2.2: In /path/to/file.suffix at line 6
      var filePattern = /In ([^ ]+)/;
      var linePattern = /at line ([^.]+)/;

      var fileMatch = document.body.textContent.match(filePattern);
      var lineMatch = document.body.textContent.match(linePattern);
      if (fileMatch && lineMatch) {
        var file = fileMatch[1];
        var line = lineMatch[1];
        replaceErrorMessageWithLink(file, line, function (html, id) {
          return html.replace(filePattern,
              "In <span style='color: #FFA500; text-decoration: underline; cursor: pointer;' id='" +
              id + "'>" + file + "</span>"
          )
        });
      }
      return fileMatch && lineMatch;
    };

    if (!tryPlay23()) {
      tryPlay22();
    }
  }
});
