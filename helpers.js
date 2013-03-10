$objectForEach = function(obj, func) {
	var keys = Object.keys(obj),
		length = keys.length,
		i = 0;
	for(; i < length; i++) {
		func(obj[keys[i]]);
	}
}

$getMessage = function(id, fallback) {
	var message = chrome.i18n.getMessage(id);
	if(message) return message;
	return fallback;
}

$create = function(type, options) {
	var keys, key, i, z, zLength, zKeys, zKey, length, element, type;
	if(options) {
		element = document.createElement(type);
		keys = Object.keys(options);
		for(i = 0, length = keys.length; i < length; i++) {
			key = keys[i];
			if(key == 'class') {
				element.className = options[key];
			} else if(key == 'styles') {
				zKeys = Object.keys(options[key]);
				for(z = 0, zLength = zKeys.length; z < zLength; z++) {
					zKey = zKeys[z];
					element.style[zKey] = options[key][zKey];
				}
			} else if(key == 'attributes') {
				zKeys = Object.keys(options[key]);
				for(z = 0, zLength = zKeys.length; z < zLength; z++) {
					zKey = zKeys[z];
					element.setAttribute(zKey, options[key][zKey]);
				}
			} else {
				element[key] = options[key];
			}
		}
	} else {
		return document.createElement(type);
	}
	return element;
}
Node.prototype.$set = function(options) {
	var keys, key, i, z, zLength, zKeys, zKey, length;
	keys = Object.keys(options);
	for(i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if(key == 'classs') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				if(options[key][zKey] == true) {
					this.classList.add(zKey);
				} else {
					this.classList.remove(zKey);
				}
			}
		} else if(key == 'class') {
			this.className = options[key];
		} else if(key == 'styles') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				this.style[zKey] = options[key][zKey];
			}
		} else if(key == 'attributes') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				this.setAttribute(zKey, options[key][zKey]);
			}
		} else {
			this[key] = options[key];
		}
	}
	return this;
}
$set = function(what, options) {
	$find(what).$set(options);
}
Node.prototype.$get = function(options) {
	var keys, key, i, z, zLength, zKeys, zKey, length;
	keys = Object.keys(options);
	for(i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if(key == 'classs') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				options[key][zKey] = this.classList.contains(zKey);
			}
		} else if(key == 'styles') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				options[key][zKey] = this.style[zKey];
			}
		} else if(key == 'attributes') {
			zKeys = Object.keys(options[key]);
			for(z = 0, zLength = zKeys.length; z < zLength; z++) {
				zKey = zKeys[z];
				options[key][zKey] = this.getAttribute(zKey);
			}
		} else {
			options[key] = this[key];
		}
	}
	return options;
}

Node.prototype.$append = function(what) {
	var i, length;
	if(Array.isArray(what)) {
		for(i = 0, length = what.length; i < length; i++) {
			this.appendChild(what[i]);
		}
	} else {
		this.appendChild(what);
	}
	return this;
}

Node.prototype.$addEvents = function(events) {
	var keys = Object.keys(events),
		length = keys.length,
		i = 0,
		key, event;
	for(; i < length; i++) {
		key = keys[i];
		this.addEventListener(key, events[key]);
	}
	return this;
}

Node.prototype.$find = function(what, all) {
	if(all) {
		return this.querySelectorAll(what);
	} else {
		return this.querySelector(what);
	}
}
$find = function(what, all) {
	if(all) {
		return document.querySelectorAll(what);
	} else {
		return document.querySelector(what);
	}
}



$getObjValue = function(obj, path, initial) {
	var paths = path.split('_');
	var length = paths.length - 1;
	var i = 0;
	for(; i < length; i++) {
		if(obj[paths[i]] === undefined) if(initial !== undefined) obj[paths[i]] = {};
		else return undefined;
		obj = obj[paths[i]];
	}
	if(obj[paths[length]] === undefined && initial !== undefined) obj[paths[length]] = initial;
	return obj[paths[length]];
}

$setObjValue = function(obj, path, value) {
	var paths = path.split('_');
	var length = paths.length - 1;
	var i = 0;
	for(; i < length; i++) {
		if(obj[paths[i]] === undefined) obj[paths[i]] = {};
		obj = obj[paths[i]];
	}
	obj[paths[length]] = value;
}

$mergeObj = function(source, destination) {
	var i = 0,
		key, value;
	// console.debug(source)
	var keys = Object.keys(source);
	var length = keys.length;
	for(; i < length; i++) {
		key = keys[i];
		value = source[key];
		if(Array.isArray(value)) {
			if(!Array.isArray(destination[key])) destination[key] = [];
			$mergeArray(value, destination[key]);
		} else if(value !== null && typeof value == 'object') {
			//	console.debug('obj',value)
			if(Array.isArray(destination[key]) || typeof destination[key] != 'object') destination[key] = {};
			$mergeObj(value, destination[key]);
		} else {
			destination[key] = value;
		}
	}
	return destination;
};

$mergeArray = function(source, destination) {
	var key = 0,
		length = source.length,
		value;
	for(; key < length; key++) {
		value = source[key];
		if(Array.isArray(value)) {
			// if(destination[key] === undefined || !Array.isArray(destination[key])) destination[key] = [];
			if(!Array.isArray(destination[key])) destination[key] = [];
			$mergeArray(value, destination[key]);
		} else if(value !== null && typeof value == 'object') {
			if(Array.isArray(destination[key]) || typeof destination[key] != 'object') destination[key] = {};
			$mergeObj(value, destination[key]);
		} else {
			destination[key] = value;
		}
	}
	return destination;
}

$merge = function(source, destination) {
	if(Array.isArray(source) && Array.isArray(destination)) {
		return $mergeArray(source, destination);
	} else if(typeof source == 'object' && !Array.isArray(source) && typeof destination == 'object' && !Array.isArray(destination)) {
		return $mergeObj(source, destination);
	} else return false;
}
/*
div = $create(
	"div", {
		class: 'button',
		id: 'something',
		styles: {
			color: 'blue'
		},
		attributes: {
			value: true
		},
		innerText: 'Something inside'
	}
);
div2 = $create(
	"div", {
		class: 'button',
		id: 'something',
		styles: {
			color: 'yellow'
		},
		attributes: {
			value: true
		},
		innerText: 'Something inside too'
	}
);
document.body.$append([div, div2]);

document.body.$append($create("code", {
	innerHTML: 'div\'s properties ' + JSON.stringify(div.$get({
		className: '',
		classs: {
			button: ''
		},
		id: '',
		styles: {
			color: ''
		},
		attributes: {
			value: ''
		},
		innerText: '',
		doesntExist: ''
	}), null, '&nbsp; ').replace(/\n/gi, '<br>')
}));

console.debug(div.$get({
	className: ' ',
	classs: {
		button: ' '
	},
	id: ' ',
	styles: {
		color: ' '
	},
	attributes: {
		value: ' '
	},
	innerText: ' ',
	doesntExist: ' '
}))*/

$_generateIndexs = function(manifest, indexs, path, depth) {

	if(Array.isArray(manifest)) {
		console.debug(Object.keys(manifest[0])[0])
		indexs[path + '_' + Object.keys(manifest[0])[0]] = depth;
		$generateIndexs(manifest[0][Object.keys(manifest[0])[0]], indexs, path + '_' + Object.keys(manifest[0])[0]);
	}
	return indexs;
}

$generateIndexs = function(manifest) {
	var indexs = {};
	for(var i = 0, length = manifest.length; i < length; i++) {
		indexs[Object.keys(manifest[i])[0]] = i;
		$_generateIndexs(manifest[i][Object.keys(manifest[i])[0]], indexs, Object.keys(manifest[i])[0], 0);
	}
	return indexs;
}