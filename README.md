# Play framework Chrome Tools

## Play Auto Refresh

When using the Play Auto Refresh SBT plugin, the browser reloads the page at each reload. See https://github.com/jamesward/play-auto-refresh

## Open Errors in Editor

It is possible to configure a URL in the [extension options](chrome-extension://dchhggpgbommpcjpogaploblnpldbmen/options.html) to which the absolute path to the file in error and the line triggering the error are passed.

This can be used by editors to directly jump to the location of an error in the code.

For IntelliJ IDEA, the RemoteCall plugin (https://github.com/Zolotov/RemoteCall), also available form the plugin repository, can be used. In this case the URL to configure is `http://localhost:8091?message=$file:$line`
