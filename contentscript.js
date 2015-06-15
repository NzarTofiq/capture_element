function startCapture(query){
	return document.querySelector(query);
}

function send(request) {
    chrome.runtime.sendMessage(request, function(response) {});
}

getDimensions = function (element) {
	dimensions = {};
	boundingBox = element.getBoundingClientRect();
	dimensions.width = boundingBox.width;
	dimensions.height = boundingBox.height;
	dimensions.left = boundingBox.left;
	dimensions.top = boundingBox.top;
	dimensions.bottom = boundingBox.bottom;
	return dimensions;
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	var form = function (){
		form = document.createElement('form');
		form.style.background = 'red';
		form.style.position = 'fixed';
		form.style.top = '93vh';
		form.style.right = '0';
		form.style.padding = '1vh';
		form.style.zIndex = '100000';
		form.style.display = 'inline-block'
		form.innerHTML = '<input id="capture_id_text" type="textbox" autofocus ></input> <input id="capture_id_button" type="submit"></input>'
		document.body.appendChild(form);
		return form;
	}();

	if (request.msg === 'start'){
		document.getElementById('capture_id_button').addEventListener('click', function(e){
			e.preventDefault();
			query = document.getElementById('capture_id_text').value;
			document.body.removeChild(form);
			window.setTimeout(function(){
				element = startCapture(query);
				dimensions = element.getBoundingClientRect();
				send(getDimensions(element));
			}, 200); //wait for the form to disappear
		});
		
	} else if (request.msg === 'imageUrl') {
		// var downloadLink = document.createElement('a');
		// downloadLink.innerHTML = 'Click here';
		// downloadLink.download = 'screenshot.png';
		// downloadLink.href = request.url;
		// document.body.appendChild(downloadLink);
		// downloadLink.click();
		// document.body.removeChild(downloadLink);
	}
});