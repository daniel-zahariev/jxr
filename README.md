Inspiration===========Inspired by another jQuery [plugin][old plugin] by Michal Korecki and suited for this Google's [specification][]but is one more step ahead by providing a check for single tags defined in XHTML specification. This JSON formatthat is used here has the worktitle of JSONML which is plain JSON with several specific rules.Purpose=======The purpose of the plugin is to help 'translating' JSON to XML which also coversXHTML generation.Rules=====The specific rules do affect only the keys(tags) when presenting XML in JSON format.They are the following:- `$t` (and `$text`) does not wrap the value with tags but returns it- `$c` (and `$comment`) does wrap the value with comment tags - `<!-- {value} -->`- `$doctype` adds the value inside a `<!DOCTYPE {value}>` tagFunction Docs=============The plugin function exposes a method `toXML` added to the global JSON object. It has two arguments:- `json` - an JSONML object or array with such- `options` - object of options controlling the output format, where possible key/values are:    - `newline` (String|default: '\n') - defines the new line in the output    - `indent` (String|default: '  ') - defines the identation of the inner tags (cumulative)    - `isXML` (Boolean|default: false) - whether to build a pure XML or just a part of it    - `checkSingleTags` (Boolean|default: true) - controls the checking of single tags defined in XHTML specificationNote====Because the XHTML specification states that all tags and attributes should be in lower case this is doneby the code as 'correction'. Check out the Array example.Examples========### XML example	var xml = {	  "version": "1.0",	  "encoding": "UTF-8",	  "feed": {	    "xmlns": "http://www.w3.org/2005/Atom",	    "xmlns$openSearch": "http://a9.com/-/spec/opensearchrss/1.0/",	    "xmlns$gd": "http://schemas.google.com/g/2005",	    "xmlns$gCal": "http://schemas.google.com/gCal/2005",	    "id": {"$t": "...", "$c": "some comment"},	    "updated": {"$t": "2006-11-12T21:25:30.000Z"},	    "title": {	      "type": "text",	      "$t": "Google Developer Events"	    }	  }	};	JSON.toXML(xml, {newline: '', indent: '', isXML: true});does return:	<?xml version="1.0" encoding="UTF-8" ?>	<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearchrss/1.0/" 	xmlns:gd="http://schemas.google.com/g/2005" xmlns:gcal="http://schemas.google.com/gCal/2005">	<id>...<!-- some comment --></id><updated>2006-11-12T21:25:30.000Z</updated>	<title type="text">Google Developer Events</title></feed>### XHTML example (with HTML5 doctype)	var xhtml = {	    "$doctype": "HTML",	    "html": {	        "head": {"title": {"$t": "Testing JSON.toXML"}},	        "body": {"div": {"$t": "Hello, World!"}}	    }	};	JSON.toXML(xhtml, {newline: '', indent: '', isXML: false});does return:	<!DOCTYPE HTML><html><head><title>Testing JSON.toXML</title></head><body><div>Hello, World!</div></body></html>### Array example	var arr = [		{'a': {'href': 'https://github.com', '$t': 'GitHub'}}, 		{'A': {'HREF': 'http://google.com', '$T': 'Google'}}	];	JSON.toXML(arr, {newline: '', indent: '', isXML: false});does return:	<a href="https://github.com">GitHub</a><a href="http://google.com">Google</a>Licenze=======The plugin is released under both MIT & GPL licences.[old plugin]: http://michalkorecki.com/content/introducing-json-xml-jquery-plugin[specification]: http://code.google.com/apis/gdata/docs/json.html[xhtml tags]: http://www.w3schools.com/tags/default.asp[see1]: http://developer.yahoo.com/yql/guide/yql-javascript-objects.html (jsonToXml)