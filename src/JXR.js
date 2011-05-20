/**
 * JXR is a simple library for JSON data transformation and conversion to XML/XHTML
 * This plugin is released under both MIT & GPL licences.
 * 
 * @version 0.1.2
 * @author Daniel Zahariev
 * @todo
 *		- If possible allow attributes next to $job
 */

function JXR() {
	var singleTags = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input', 'link', 'meta', 'param'],
		outputSettings = {"newline": "\n", "indent": "  ", "checkSingleTags": true, "isXML": false, "autoCloseTags": false},
		xr_data = {}, $this = this;
	this.getSingleTags = function () {
		return singleTags;
	};
	this.setSingleTags = function (single_tags) {
		if (single_tags instanceof Array) {
			singleTags = single_tags;
		}
		return this;
	};
	this.getXR = function () {
		return xr_data;
	};
	this.setXR = function (data) {
		xr_data = data;
		return this;
	};
	this.getOutputSettings = function () {
		return outputSettings;
	};
	this.setOutputSettings = function (new_settings) {
		if ((new_settings instanceof Object) === false) {
			return this;
		}
		var key;
		for (key in outputSettings) {
			if (new_settings.hasOwnProperty(key)) {
				outputSettings[key] = new_settings[key];
			}
		}
		return this;
	};
	
	var JobManager = {
		"$template": {},
		"$dataset": {},
		"$current_dataset": {},
		"transform": function (template, data) {
			return $this.transform(template, data);
		},
		"path": function (value) {
			var data, i, tmp, tmp2;
			if (value instanceof Array) {
				data = [];
				for ( i = 0; i < value.length; i += 1) {
					tmp = JobManager.path(value[i]);
					if (tmp !== false) {
						Array.prototype.push.apply(data, tmp);
					}
				}
			} else if (typeof(value) === 'string') {
				if (value[0] === '$') {
					data = JXR.jsonpath(this.$dataset, value);
				} else if (value[0] === '@') {
					data = JXR.jsonpath(this.$current_dataset, '$' + value.substring(1));
				} else if (value[0] === '!') {
					if (value[1] === '$') {
						data = JXR.jsonpath(this.$dataset, '$' + value.substring(2));
						if (data !== false) {
							data = (data.length > 0) ? data[0] : false;
						}
					} else if (value[1] === '@') {
						data = JXR.jsonpath(this.$current_dataset, '$' + value.substring(2));
						if (data !== false) {
							data = (data.length > 0) ? data[0] : false;
						}
					} else {
						tmp = value.split('.');
						tmp.shift();
						tmp2 = this.$current_dataset;
						for ( i = 0; i < tmp.length; i += 1) {
							if (tmp2.hasOwnProperty(tmp[i])) {
								tmp2 = tmp2[tmp[i]];
							} else {
								tmp = false;
								break;
							}
						}
						if (tmp === false) {
							data = false;
						} else {
							data = tmp2;
						}
					}
				} else {
					data = value;
				}
			}
			return data;
		},
		"value": function () {
			var i, values = [];
			for ( i = 0; i < arguments.length; i += 1) {
				values[i] = this.transform(arguments[i]);
			}
			return values.join('');
		},
		"default": function (path, def_val) {
			var val = JobManager.path(path);
			return (val !== false ? val : def_val);
		},
		"if": function (clause, true_tpl, false_tpl) {
			if (clause instanceof Array && clause.length === 3) {
				var rule = clause[0], valid = false, t_tpl = {}, f_tpl = {},
					arg1 = this.transform(clause[1]),
					arg2 = this.transform(clause[2]);
				
				if (typeof(true_tpl) === 'string' && this.$template.hasOwnProperty(true_tpl)) {
					t_tpl = this.$template[true_tpl];
				} else if (typeof(true_tpl) === 'object') {
					t_tpl = true_tpl;
				}
				if (typeof(false_tpl) === 'string' && this.$template.hasOwnProperty(false_tpl)) {
					f_tpl = this.$template[false_tpl];
				} else if (typeof(false_tpl) === 'object') {
					f_tpl = false_tpl;
				}
				if(arg1 instanceof Array) {
					arg1 = (arg1.length === 0) ? false : arg1[0];
				}
				switch (rule) {
					case 'ne': valid = (arg1 != arg2); break;
					case 'eq': valid = (arg1 == arg2); break;
					case 'gt': valid = (arg1 > arg2); break;
					case 'gte': valid = (arg1 >= arg2); break;
					case 'lt': valid = (arg1 < arg2); break;
					case 'lte': valid = (arg1 <= arg2); break;
					case 'exist': valid = ((arg1 !== false) === arg2); break;
					case 'in': valid = (arg2.indexOf(arg1) > -1); break;
					case 'nin': valid = (arg2.indexOf(arg1) === -1); break;
					case 'match':
						try{
							valid = arg1.match(arg2);
						}
						catch(ex){}
						break;
				}
				return this.transform(valid ? t_tpl : f_tpl);
			}
			return false;
		},
		"for": function (path, loop_tpl, else_tpl) {
			var i, elements = JobManager.path(path), template = false, result = [];
			if (elements !== false && elements.length > 0) {
				if (typeof(loop_tpl) === 'string' && this.$template.hasOwnProperty(loop_tpl)) {
					template = this.$template[loop_tpl];
				} else if (loop_tpl instanceof Object) {
					template = loop_tpl;
				}
				if (template !== false) {
					for ( i = 0; i < elements.length; i += 1) {
						this.$current_dataset = elements[i];
						result[i] = this.transform(template);
					}
				}
			} else {
				if (typeof(else_tpl) === 'string' && this.$template.hasOwnProperty(else_tpl)) {
					template = this.$template[else_tpl];
				} else if (else_tpl instanceof Object) {
					template = else_tpl;
				}
				if (template !== false) {
					result = this.transform(template);
				}
			}
			return result;
		},
		"switch": function (path, default_tpl) {
			var val = JobManager.path(path), template = false, i;
			for (i = 2; i < arguments.length; i += 1) {
				if (arguments[i] instanceof Array && arguments[i].length === 2 && val == arguments[i][0]) {
					template = arguments[i][1];
					break;
				}
			}
			if (template === false) {
				template = default_tpl;
			}
			if (typeof(template) === 'string' && this.$template.hasOwnProperty(template)) {
				template = this.$template[template];
			}
			return this.transform(template);
		}
	};
	
	this.setJobData = function (key, data) {
		var data_keys = ['$template', '$dataset', '$current_dataset'];
		if (typeof(key) === 'string' && data_keys.indexOf(key) > -1) {
			JobManager[key] = data;
			return true;
		}
		else {
			return false;
		}
	};
	this.setJobManager = function (name, callback) {
		var key, added = false;
		if (name instanceof Object) {
			for (key in name) {
				if (typeof(name[key]) === 'function' && JobManager.hasOwnProperty(key) === false) {
					JobManager[key] = name[key];
					added = true;
				}
			}
		} else if (typeof(callback) === 'function' && JobManager.hasOwnProperty(name) === false) {
			JobManager[name] = callback;
			added = true;
		}
		return added;
	};
	this.manageJob = function (job, args) {
		if (JobManager.hasOwnProperty(job)) {
			return JobManager[job].apply(JobManager, args);
		} else {
			return false;
		}
	};
}
JXR.toXML = function (json, options) {
	var obj = new JXR();
	return obj.setXR(json).setOutputSettings(options).getXML();
};
JXR.prototype.getXML = function () {
	var json = this.getXR(), settings = this.getOutputSettings(), single_tags = this.getSingleTags();
	
	function convertToXhtml(json, parent_tag, indent) {
		var xml = '', attributes = '', i, key, valid_key, sp, new_indent = indent + settings.indent, has_text = false;
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
				if (json[key] === false) {
					continue;
				}
				valid_key = key.toLowerCase().replace('$', ':');
				sp = valid_key.indexOf(' ');
				if (sp > -1) {
					valid_key = valid_key.substring(0, sp);
				}
				if (valid_key[0] === ':') {
					if (valid_key === ':t' || valid_key === ':text') {
						xml += json[key];
						has_text = true;
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
						xml += settings.newline + convertToXhtml(json[key][i], valid_key, new_indent);
					}
				} else if (json[key] instanceof Object) {
					xml += settings.newline + convertToXhtml(json[key], valid_key, new_indent);
				}
			}
		}
		if (parent_tag !== '') {
			if (settings.checkSingleTags && single_tags.indexOf(parent_tag) > -1) {
				if (attributes !== '') {
					xml = indent + '<' + parent_tag + attributes + '/>';
				} else {
					xml = '';
				}
			} else if (settings.isXML && settings.autoCloseTags && xml === '') {
				xml = indent + '<' + parent_tag + attributes + '/>';
			} else if (parent_tag === ':xml') {
				xml = '<?xml' + attributes + ' ?>' + xml;
			} else {
				if (settings.isXML && has_text && (xml.indexOf('<') > -1 || xml.indexOf('&') > -1)) {
					xml = indent + '<' + parent_tag + attributes + '><![CDATA[' + xml + ']]></' + parent_tag + '>';
				} else if (has_text) {
					xml = indent + '<' + parent_tag + attributes + '>' + xml + '</' + parent_tag + '>';
				} else {
					xml = indent + '<' + parent_tag + attributes + '>' + xml + settings.newline + indent + '</' + parent_tag + '>';
				}
			}
		}
		return xml;
	}
	
	return convertToXhtml(json, (settings.isXML ? ':xml' : ''), '');
};
JXR.prototype.transform = function (template, data) {
	if (typeof(data) !== 'undefined') {
		this.setJobData('$template', template);
		this.setJobData('$dataset', data);
		this.setJobData('$current_dataset', {});
		if (template.hasOwnProperty("$main")) {
			this.setXR(this.transform(template.$main));
		} else {
			this.setXR(this.transform(template));
		}
		return this;
	}
	var result, key, i;
	if (typeof(template) === 'string') {
		return this.manageJob('path', [template]);
	} else if (template instanceof Object && template.hasOwnProperty('$job')) {
		if (template.$job instanceof Array && template.$job.length > 0) {
			return this.manageJob(template.$job[0], template.$job.slice(1));
		} else {
			return false;
		}
	} else if (template instanceof Array) {
		result = [];
		for ( i = 0; i < template.length; i += 1) {
			result[i] = this.transform(template[i]);
		}
		return result;
	} else if (template instanceof Object) {
		result = {};
		for (key in template) {
			result[key] = this.transform(template[key]);
		}
		return result;
	}
	return template;
};

/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
JXR.jsonpath = function (obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
};