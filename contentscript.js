function startCapture(query){
	if(document.querySelector(query)){
		return document.querySelector(query);
	}else{
		return 'error: Element does not exist in the context of this document'
	}
}

function send(request) {
    chrome.runtime.sendMessage(request, function(response) {});
}

function form(){
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
}

function setDimentions(element, x, y, originalX, originalY){
	var top = y;
	var left = x;
	var height = element.offsetHeight;
	var width = element.offsetWidth;
	var pixelDensity = window.devicePixelRatio;
	dimensions = {'top': top, 'left': left, 'height': height, 'width': width, 'pixelDensity': pixelDensity};
	window.scrollTo(originalX,originalY);
	return dimensions;
}

function dimentions(element){
	originalX = window.scrollX;
	originalY = window.scrollY;
	if(element.offsetHeight > window.innerHeight){
		y = element.scrollTop;
		x = element.scrollLeft;
		send({'needsScrolling' : true})
		window.scrollTo(0, element.offsetTop);
		dimensions = setDimentions(element, x, y, originalX, originalY);
		return dimensions;
	}else{
		window.scrollTo(0, element.offsetTop)
		return setDimentions(element);
	}

}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.msg === 'start'){
		if(!!document.querySelector('.guide-card')){
			element = document.querySelector('.guide-card');
			dimentions = dimentions(element);
			send(dimentions);
		}else{
			form();
			document.querySelector('#capture_id_button').addEventListener('click', function(e){
				e.preventDefault();
				query = document.querySelector('#capture_id_text').value;
				document.body.removeChild(form);
				window.setTimeout(function(){
					element = startCapture(query);
					dimentions = dimentions(element);
					send(dimentions);
				}, 200);
			});
		}
		
	} else if (request.msg === 'imageUrl') {
		var downloadLink = document.createElement('a');
		downloadLink.innerHTML = 'Click here';
		downloadLink.download = 'screenshot.png';
		downloadLink.href = request.url;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
});