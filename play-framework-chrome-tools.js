// Play Auto Refresh
var ws = new WebSocket("ws://localhost:9001")
ws.onmessage = function(event) {
    if (event.data == "reload") {
        window.location = window.location.href
        ws.close()
    }
}

// Open in editor
var filePattern = /In ([^ ]+)/;
var linePattern = /at line ([^.]+)/;

chrome.extension.sendRequest({method: "getLocalStorage", key: "playEditorURL"}, function(response) {
	var playEditorURL = response.data;
	if (playEditorURL) {

		var fileMatch = document.body.textContent.match(filePattern);
		var lineMatch = document.body.textContent.match(linePattern);

		if(fileMatch) {
			var file = fileMatch[1];
			var line = lineMatch[1];

			var editorInvocationURL = playEditorURL.replace('$file', file).replace('$line', line);
			var id = 'openInEditorAjax';
			if (editorInvocationURL.indexOf('http') == -1) {
				id = 'openInEditor';
			}
			document.body.innerHTML = document.body.innerHTML.replace(filePattern, "<span style='color: #FFA500; text-decoration: underline; cursor: pointer;' id='" + id + "'>" + file + "</span>");



			$('#openInEditorAjax').on('click', function() {
				$.get(editorInvocationURL);
			});
			$('#openInEditor').on('click', function() {
				window.open(editorInvocationURL, '_blank');
			});
		}
	}
});




