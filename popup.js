chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id, {msg: "start"}, function(response) {
		console.log(response.elem);
	});
});

chrome.runtime.onMessage.addListener(function(request, sender) {
	tabId = sender.tab.id;
	capture(tabId, request);
});

function capture(tabId, dimensions) {
    chrome.tabs.get(tabId, function(tab) {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function(dataUrl) {
            var canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
            var image = new Image();
            image.onload = function() {
                canvas.width = dimensions.width;
                canvas.height = dimensions.height;
                var context = canvas.getContext("2d");
                context.drawImage(image,
                    dimensions.left, dimensions.top,
                    dimensions.width, dimensions.height,
                    0, 0,
                    dimensions.width, dimensions.height
                );
                var croppedDataUrl = canvas.toDataURL("image/png");
                chrome.tabs.create({
                    url: croppedDataUrl,
                    windowId: tab.windowId
                });
            }
            image.src = dataUrl;
        });
    });
}