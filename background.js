var canvases = [];
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id, {msg: "start"}, function(response) {
	});
});

function onMessage(request, sender) {
    tabId = sender.tab.id;
    capture(tabId, request);
}

chrome.runtime.onMessage.addListener(onMessage);

function capture(tabId, dimensions) {
    chrome.tabs.get(tabId, function(tab) {
        console.log(dimensions);
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function(dataUrl) {
            var canvas = document.createElement("canvas");
            pixelDensity = window.devicePixelRatio;
            document.body.appendChild(canvas);
            var image = new Image();
            image.onload = function() {
                canvas.width = dimensions.width * pixelDensity;
                canvas.height = dimensions.height * pixelDensity;
                var context = canvas.getContext("2d");
                context.drawImage(image, 
                    dimensions.left * pixelDensity, dimensions.top * pixelDensity, 
                    dimensions.width * pixelDensity, dimensions.height * pixelDensity,
                    0, 0,
                    dimensions.width * pixelDensity, dimensions.height * pixelDensity);
                var croppedDataUrl = canvas.toDataURL("image/png");
                chrome.tabs.create({url : croppedDataUrl});
                //chrome.tabs.sendMessage(tab.id, {msg: "imageUrl", url: canvas.toDataURL("image/png")});
            }
            image.src = dataUrl;
        });
    });
}