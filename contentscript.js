function startCapture(elementId){
	if(!!document.querySelector('#'+elementId)){
		return document.querySelector('#'+elementId);
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

function dimentions(element){
	var top = element.offsetTop;
	var left = element.offsetLeft;
	var height = element.offsetHeight;
	var width = element.offsetWidth;
	return {'top': top, 'left': left, 'height': height, 'width': width};
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log(request);
	if (request.msg === 'start'){
		if(document.querySelector('.guide-card')){
			element = document.querySelector('.guide-card');
			dimentions = dimentions(element);
			send(dimentions);
		}else{
			form();
			document.querySelector('#capture_id_button').addEventListener('click', function(e){
				e.preventDefault();
				elementId = document.querySelector('#capture_id_text').value;
				document.body.removeChild(form);
				element = startCapture(elementId);
				dimentions = dimentions(element);
				send(dimentions);
			});
		}
	}
});