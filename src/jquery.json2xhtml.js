/**
 * A jQuery plugin for easy convert JSON to XHTML
 * Just as jQuery itself, this plugin is released under both MIT & GPL licences.
 * 
 * @version 0.1.0
 * @author Daniel Zahariev
 */
(function ($) {
	var single_tags = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'link', 'meta', 'param'],
		settings, defaultSettings = {
			newline: '\n',
			indent: '  ',
			isXML: false,
			checkSingleTags: true
		};
	
	function convertToXhtml(json, parent_tag, indent) {
		var xhtml = '', attributes = '', i, key, valid_key, new_indent = indent + settings.indent;
		if (json instanceof Array) {
			for (i = 0; i < json.length; i += 1) {
				xhtml += convertToXhtml(json[i], parent_tag, new_indent);
			}
			return xhtml;
		}
		if ((json instanceof Object) === false) {
			return '';
		}
		for (key in json) {
			if (json.hasOwnProperty(key)) {
				valid_key = key.toLowerCase().replace('$', ':');
				if (valid_key === ':t') {
					xhtml += settings.newline + new_indent + json[key];
				} else if (valid_key === ':doctype') {
					xhtml += '<!DOCTYPE ' + json[key] + '>';
				} else if (typeof (json[key]) === 'string') {
					attributes += ' ' + valid_key + '="' + json[key] + '"';
				} else if (json[key] instanceof Array) {
					for (i = 0; i < json[key].length; i += 1) {
						xhtml += convertToXhtml(json[key][i], valid_key, new_indent);
					}
				} else {
					xhtml += convertToXhtml(json[key], valid_key, new_indent);
				}
			}
		}
		if (parent_tag !== '') {
			if (settings.checkSingleTags && single_tags.indexOf(parent_tag) > -1) {
				xhtml = indent + '<' + parent_tag + attributes + '/>' + settings.newline;
			} else if (parent_tag === ':xml') {
				xhtml = '<?xml' + attributes + ' ?>' + xhtml;
			} else {
				xhtml = settings.newline + indent + '<' + parent_tag + attributes + '>'
						+ xhtml + settings.newline + indent + '</' + parent_tag + '>';
			}
		}
		return xhtml;
	}
	
	/**
	 * Converts JSON object to XHTML string.
	 * 
	 * @param json object to convert
	 * @param options additional parameters 
	 * @return XHTML string 
	 */
	$.json2xhtml = function (json, options) {
		if ((options instanceof Object) === false) {
			options = {};
		}
		settings = $.extend({}, defaultSettings, options);
		return convertToXhtml(json, (settings.isXML ? ':xml' : ''), '');
	};
})(jQuery);