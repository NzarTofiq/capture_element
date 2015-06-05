var canvases = [];
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id, {msg: "start"}, function(response) {
	});
});

function onMessage(request, sender) {
    tabId = sender.tab.id;
    if(request.needsScrolling  === true){
        console.log(request);
    }else{
        capture(tabId, request);
    }
}

chrome.runtime.onMessage.addListener(onMessage);

function capture(tabId, dimensions) {
    chrome.tabs.get(tabId, function(tab) {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function(dataUrl) {
            var canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
            var image = new Image();
            image.onload = function() {
                pixelDensity = dimensions.pixelDensity;
                canvas.width = dimensions.width * pixelDensity;
                canvas.height = dimensions.height * pixelDensity;
                var context = canvas.getContext("2d");
                context.drawImage(image,
                    dimensions.left * pixelDensity, dimensions.top * pixelDensity,
                    dimensions.width * pixelDensity, dimensions.height * pixelDensity,
                    0, 0,
                    dimensions.width * pixelDensity, dimensions.height * pixelDensity
                );
                var croppedDataUrl = canvas.toDataURL("image/png");
                chrome.tabs.sendMessage(tab.id, {msg: "imageUrl", url: canvas.toDataURL("image/png")});
            }
            image.src = dataUrl;
        });
    });
}

function tieCanvases(canvases){
    canv = document.createElement('canvas');
    context = canv.getContext('2d');
    for (var i=0; i<canvases.length; i++){
        var can3 = document.getElementById('canvas3');
        context.drawImage(can, 0, canv.height);
    }
}