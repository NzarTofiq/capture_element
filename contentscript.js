function startCapture(query){
	try {
		return document.querySelector(query);
	}catch(error){
		throw error;
	}
}

function send(request) {
    chrome.runtime.sendMessage(request, function(response) {});
}

function setDimensions(element){
	pixelDensity = 1/window.devicePixelRatio;
	var top = element.offsetTop * pixelDensity;
	var left = element.offsetLeft * pixelDensity;
	var height = element.clientHeight;
	var width = element.clientWidth;
	dimensions = {'left': left, 'top': top, 'height': height, 'width': width};
	return dimensions;
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	var form = function (){
		form = document.createElement('form');
		form.style.background = 'red';
		form.style.position = 'fixed';
		form.style.top = '93vh';
		form.style.right = '0';
		form.style.padding = '2vh';
		form.style.zIndex = '100000';
		form.style.display = 'inline-block'
		form.innerHTML = '<input id="capture_id_text" type="textbox"></input> <input id="capture_id_button" type="submit"></input>'
		document.body.appendChild(form);
		return form;
	}();

	if (request.msg === 'start'){
		document.querySelector('#capture_id_button').addEventListener('click', function(e){
			e.preventDefault();
			query = document.querySelector('#capture_id_text').value;
			document.body.removeChild(form);
			window.setTimeout(function(){
				element = startCapture(query);
				dimentions = setDimensions(element);
				send(dimentions);
			}, 200);
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