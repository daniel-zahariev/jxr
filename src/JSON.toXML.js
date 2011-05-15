/**
 * A plugin to JSON object for easy converting JSON object (or array of) to XML
 * This plugin is released under both MIT & GPL licences.
 * 
 * @version 0.1.1
 * @author Daniel Zahariev
 */

if (typeof (JSON) !== 'object') {
	JSON = {};
}
(function ($) {
	var single_tags = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'link', 'meta', 'param'],
		settings, defaultSettings = {
			newline: '\n',
			indent: '  ',
			isXML: false,
			checkSingleTags: true
		};
	
	function convertToXhtml(json, parent_tag, indent) {
		var xml = '', attributes = '', i, key, valid_key, sp, new_indent = indent + settings.indent;
		if (parent_tag === ':xml') {
			new_indent = '';
		}
		if (json instanceof Array) {
			for (i = 0; i < json.length; i += 1) {
				xml += convertToXhtml(json[i], parent_tag, new_indent);
			}
			return xml;
		}
		if ((json instanceof Object) === false) {
			return '';
		}
		for (key in json) {
			if (json.hasOwnProperty(key)) {
				valid_key = key.toLowerCase().replace('$', ':');
				sp = valid_key.indexOf(' ');
				if (sp > -1) {
					valid_key = valid_key.substring(0, sp);
				}
				if (valid_key[0] === ':') {
					if (valid_key === ':t' || valid_key === ':text') {
						xml += json[key];
					} else if (valid_key === ':c' || valid_key === ':comment') {
						xml += '<!-- ' + json[key] + ' -->';
					} else if (valid_key === ':doctype') {
						xml += '<!DOCTYPE ' + json[key] + '>';
						new_indent = '';
					}
				} else if (typeof (json[key]) === 'string') {
					attributes += ' ' + valid_key + '="' + json[key] + '"';
				} else if (json[key] instanceof Array) {
					for (i = 0; i < json[key].length; i += 1) {
						xml += settings.newline + convertToXhtml(json[key][i], valid_key, new_indent) + settings.newline + indent;
					}
				} else if (json[key] instanceof Object) {
					xml += settings.newline + convertToXhtml(json[key], valid_key, new_indent) + settings.newline + indent;
				}
			}
		}
		if (parent_tag !== '') {
			if (settings.checkSingleTags && single_tags.indexOf(parent_tag) > -1) {
				xml = indent + '<' + parent_tag + attributes + '/>';
			} else if (parent_tag === ':xml') {
				xml = '<?xml' + attributes + ' ?>' + xml;
			} else {
				xml = indent + '<' + parent_tag + attributes + '>' + xml + '</' + parent_tag + '>';
			}
		}
		return xml;
	}
	
	/**
	 * Converts JSON object to XML string.
	 * 
	 * @param json object/array to convert
	 * @param options additional parameters 
	 * @return XML string 
	 */
	$.toXML = function (json, options) {
		if ((options instanceof Object) === false) {
			options = {};
		}
		settings = {};
		var i;
		for (i in defaultSettings) {
			settings[i] = options.hasOwnProperty(i) ? options[i] : defaultSettings[i];
		}
		
		return convertToXhtml(json, (settings.isXML ? ':xml' : ''), '');
	};
})(JSON);