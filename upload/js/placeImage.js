
var _file
var _index = 0
var _packageName = ""
var _tags = []
function change() {
	var pic = document.getElementById("preview"),
		file = document.getElementById("f");
	_file = file
	_index = 0
	document.getElementById("page").innerHTML = 1 + "/" + _file.files.length + " " + file.files[_index].name
	document.getElementById("tagName").innerHTML = _tags[_file.files[_index].name];
	var ext = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();

	if (ext != 'png' && ext != 'jpg' && ext != 'jpeg') {
		alert("File is not image type.");
		return;
	}
	var isIE = navigator.userAgent.match(/MSIE/) != null,
		isIE6 = navigator.userAgent.match(/MSIE 6.0/) != null;

	if (isIE) {
		file.select();
		var reallocalpath = document.selection.createRange().text;

		if (isIE6) {
			pic.src = reallocalpath;
		} else {
			pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";

			pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
		}
	} else {
		html5Reader(file);
	}
}

function html5Reader(file) {
	var file = file.files[0];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (e) {
		var pic = document.getElementById("preview");
		pic.src = this.result;
	}
}

function p_action() {
	if (_index > 0) {
		_index -= 1
	}
	document.getElementById("page").innerHTML = (_index + 1) + "/" + _file.files.length + " " + _file.files[_index].name
	document.getElementById("tagName").innerHTML = _tags[_file.files[_index].name];
	var file = _file.files[_index];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (e) {
		var pic = document.getElementById("preview");
		pic.src = this.result;
	}
}
function n_action() {
	if (_index < _file.files.length - 1) {
		_index += 1
	}
	document.getElementById("page").innerHTML = (_index + 1) + "/" + _file.files.length + " " + _file.files[_index].name
	document.getElementById("tagName").innerHTML = _tags[_file.files[_index].name];

	var file = _file.files[_index];
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (e) {
		var pic = document.getElementById("preview");
		pic.src = this.result;
	}
}

function onUpload(index) {
	//	alert(index)
	let photo = document.getElementById("f").files[_index];  // file from input
	if (photo == null) {
		return
	}

	if (_packageName == null || _packageName == "") {
		alert('Need to create package first.')
		return
	}

	if (_tags[_file.files[_index].name] != null && _tags[_file.files[_index].name] != undefined) {
		removeFile();
	}

	// if (_index + 1 == _file.files.length) {
	// 	var pic = document.getElementById("preview");
	// 	pic.src = "img/image.jpg";
	// }

	let req = new XMLHttpRequest();
	let formData = new FormData();

	//http.setRequestHeader('image-type', index);

	jQuery('#loading').showLoading();
	req.onreadystatechange = function () {
		if (req.readyState === 4) {
			jQuery('#loading').hideLoading();
			alert(_file.files[_index].name + ' Upload success.')
			//      alert(req.responseText);
		}
	}
	formData.append("image", photo);
	//formData.append('image-type', index);
	_tags[_file.files[_index].name] = index;
	req.open("POST", 'http://localhost:8001/upload?image-type=' + index + '&packageName=' + _packageName);
	req.send(formData);
	n_action()
}

function removeFile() {
	let photo = _file.files[_index];
	if (photo == null) {
		return
	}
	let index = _tags[photo.name]
	let req = new XMLHttpRequest();
	let formData = new FormData();

	req.onreadystatechange = function () {
		if (req.readyState === 4) {
			delete _tags[photo.name];
			document.getElementById("tagName").innerHTML = _tags[photo.name];
		}
	}
	req.open("POST", 'http://localhost:8001/removeFile?image-type=' + index + '&fileName=' + photo.name + '&packageName=' + _packageName);
	req.send();
}

function createPackage() {
	_packageName = document.getElementById("packageName").value;

	if ((_packageName).length == 0) {
		return
	}
	let req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (req.readyState === 4) {
			alert('Create Package success.')
		}
	}
	req.open("POST", 'http://localhost:8001/createPackage?packageName=' + _packageName);
	req.send();
}

function createType() {
	var typeList = document.getElementById("typeList");
	var a = document.createElement('a');
	a.href = '#'; // Insted of calling setAttribute 
	a.setAttribute('class', 'scrollto btn btn-white');
	a.innerHTML = "Type ?" // <a>INNER_TEXT</a>
	typeList.appendChild(a); // Append the link to the div
}