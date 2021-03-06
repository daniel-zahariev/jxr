var tests = {
	"xml": {
		"options": {"isXML": true, "autoCloseTags": true},
		"json": {
			"version": "1.0",
			"encoding": "UTF-8",
			"feed": {
				"xmlns": "http://www.w3.org/2005/Atom",
				"xmlns$openSearch": "http://a9.com/-/spec/opensearchrss/1.0/",
				"xmlns$gd": "http://schemas.google.com/g/2005",
				"xmlns$gCal": "http://schemas.google.com/gCal/2005",
				"id": {"$t": "...", "$c": "some comment"},
				"updated": {"$t": "2006-11-12T21:25:30.000Z"},
				"title": {
					"type": "text",
					"$t": "Google Developer Events"
				},
				"subtitle": {
				  "type": "text",
				  "$t": "The calendar contains information about upcoming developer conferences at which Google will be speaking, along with other developer-related events."
				},
				"link": [{
				  "rel": "....",
				  "type": "application/atom+xml",
				  "href": "..."
				  },{
				  "rel": "self",
				  "type": "application/atom+xml",
				  "href": "..."
				}],
				"author": [{
				  "name": {"$t": "Google Developer Calendar"},
				  "email": {"$t": "developer-calendar@google.com"}
				}],
				"generator":{
				  "version": "1.0",
				  "uri": "http://www.google.com/calendar",
				  "$t": "Google Calendar"
				},
				"openSearch$startIndex": {"$t": "1"},
				"openSearch$itemsPerPage": {"$t": "25"},
				"gCal$timezone": {"value": "America/Los_Angeles"},
				"entry": [{
				  "id": {"$t": "..."},
				  "published": {"$t": "2006-11-12T21:25:30.000Z"},
				  "updated": {"$t": "2006-11-12T21:25:30.000Z"},
				  "category": [{
					"scheme": "...",
					"term": "..."
				  }],
				  "title":{
					"type": "text",
					"$t": "WebmasterWorld PubCon 2006: Google Developer Tools in General"
				  },
				  "content": {
					"type": "text",
					"$t": "Google is sponsoring at <a href=\"http:\/\/www.pubcon.com\/\">WebmasterWorld PubCon 2006</a>.\nCome and visit us at the booth or join us for an evening demo reception where we will be talking \"5 ways to enhance your website with Google Code\".\nAfter all,\nit is Vegas, baby! See you soon."
				  },
				  "link": [{
					"rel": "alternate",
					"type": "text/html",
					"href": "...",
					"title": "alternate"
					},{
					"rel": "self",
					"type": "application/atom+xml",
					"href": "..."
				  }],
				  "author": [{
					"name": {"$t": "Google Developer Calendar"},
					"email": {"$t": "developer-calendar@google.com"}
				  }],
				  "gd$transparency": {"value": "http://schemas.google.com/g/2005#event.opaque"},
				  "gd$eventStatus": {"value": "http://schemas.google.com/g/2005#event.confirmed"},
				  "gd$comments": {"gd$feedLink": {"href": "..."}},
				  "gCal$sendEventNotifications": {"value": "true"},
				  "gd$when": [{
					"startTime": "2006-11-15",
					"endTime": "2006-11-17",
					"gd$reminder": [{"minutes": "10"}]
				  }],
				  "gd$where": [{"valueString": "3150 Paradise Road,Las Vegas,NV 89109"}],
				}]
			}
		}
	},
	"xhtml": {
		"options": {},
		"json": {
			"$doctype": "HTML",
			"html": {
				"head": {"title": {"$t": "Testing JSON.toXML"}},
				"body": {"div": {"$t": "Hello, World!"}, "hr": {}, "p": [{"$t": "Hello, World!"}, {"$t": "Hello, World2!"}]}
			}
		}
	},
	"tags": {
		"options": {},
		"json": [
			{'a': {'href': 'https://github.com', '$t': 'GitHub'}}, 
			{'A': {'HREF': 'http://google.com', '$T': 'Google'}}
		]
	},
	"texts_comments": {
		"options": {"newline": "", "indent": ""},
		"json": {
			"div": {
				"$comment 1": "Comment 1",
				"$text 1": "text1",
				"p": {"$t": "Some content"},
				"hr 1": {},
				"$comment 2": "Comment 2",
				"hr 2": {},
				"$text 2": "text2"
			}
		}
	}
};