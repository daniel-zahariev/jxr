var tests = {	"xml": {		"options": {"isXML": true},		"json": {			"version": "1.0",			"encoding": "UTF-8",			"feed": {				"xmlns": "http://www.w3.org/2005/Atom",				"xmlns$openSearch": "http://a9.com/-/spec/opensearchrss/1.0/",				"xmlns$gd": "http://schemas.google.com/g/2005",				"xmlns$gCal": "http://schemas.google.com/gCal/2005",				"id": {"$t": "...", "$c": "some comment"},				"updated": {"$t": "2006-11-12T21:25:30.000Z"},				"title": {					"type": "text",					"$t": "Google Developer Events"				}			}		}	},	"xhtml": {		"options": {},		"json": {			"$doctype": "HTML",			"html": {				"head": {"title": {"$t": "Testing JSON.toXML"}},				"body": {"div": {"$t": "Hello, World!"}, "hr": {}, "p": {"$t": "Hello, World!"}}			}		}	},	"tags": {		"options": {},		"json": [			{'a': {'href': 'https://github.com', '$t': 'GitHub'}}, 			{'A': {'HREF': 'http://google.com', '$T': 'Google'}}		]	},	"texts_comments": {		"options": {"newline": "", "indent": ""},		"json": {			"div": {				"$comment 1": "Comment 1",				"$text 1": "text1",				"p": {"$t": "Some content"},				"hr 1": {},				"$comment 2": "Comment 2",				"hr 2": {},				"$text 2": "text2"			}		}	}};