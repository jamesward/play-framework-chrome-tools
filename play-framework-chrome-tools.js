// Play Auto Refresh
var ws = new WebSocket("ws://localhost:9001")
ws.onmessage = function(event) {
    if (event.data == "reload") {
        window.location = window.location.href
        ws.close()
    }
}
