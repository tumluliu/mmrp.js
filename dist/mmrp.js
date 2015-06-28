;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mmrp.js');

L.mmrp = require('./src/directions');
L.mmrp.format = require('./src/format');
L.mmrp.layer = require('./src/layer');
L.mmrp.inputControl = require('./src/input_control');
L.mmrp.errorsControl = require('./src/errors_control');
L.mmrp.routesControl = require('./src/routes_control');
L.mmrp.instructionsControl = require('./src/instructions_control');

},{"./src/directions":8,"./src/errors_control":9,"./src/format":10,"./src/input_control":11,"./src/instructions_control":12,"./src/layer":13,"./src/routes_control":15}],2:[function(require,module,exports){
!function(){
  var d3 = {version: "3.4.1"}; // semver
var d3_arraySlice = [].slice,
    d3_array = function(list) { return d3_arraySlice.call(list); }; // conversion for NodeLists

var d3_document = document,
    d3_documentElement = d3_document.documentElement,
    d3_window = window;

// Redefine d3_array if the browser doesn’t support slice-based conversion.
try {
  d3_array(d3_documentElement.childNodes)[0].nodeType;
} catch(e) {
  d3_array = function(list) {
    var i = list.length, array = new Array(i);
    while (i--) array[i] = list[i];
    return array;
  };
}
var d3_subclass = {}.__proto__?

// Until ECMAScript supports array subclassing, prototype injection works well.
function(object, prototype) {
  object.__proto__ = prototype;
}:

// And if your browser doesn't support __proto__, we'll use direct extension.
function(object, prototype) {
  for (var property in prototype) object[property] = prototype[property];
};

function d3_vendorSymbol(object, name) {
  if (name in object) return name;
  name = name.charAt(0).toUpperCase() + name.substring(1);
  for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
    var prefixName = d3_vendorPrefixes[i] + name;
    if (prefixName in object) return prefixName;
  }
}

var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

function d3_selection(groups) {
  d3_subclass(groups, d3_selectionPrototype);
  return groups;
}

var d3_select = function(s, n) { return n.querySelector(s); },
    d3_selectAll = function(s, n) { return n.querySelectorAll(s); },
    d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")],
    d3_selectMatches = function(n, s) { return d3_selectMatcher.call(n, s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d3_select = function(s, n) { return Sizzle(s, n)[0] || null; };
  d3_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
  d3_selectMatches = Sizzle.matchesSelector;
}

d3.selection = function() {
  return d3_selectionRoot;
};

var d3_selectionPrototype = d3.selection.prototype = [];


d3_selectionPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      group,
      node;

  selector = d3_selection_selector(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(subnode = selector.call(node, node.__data__, i, j));
        if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selector(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_select(selector, this);
  };
}

d3_selectionPrototype.selectAll = function(selector) {
  var subgroups = [],
      subgroup,
      node;

  selector = d3_selection_selectorAll(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
        subgroup.parentNode = node;
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_selectorAll(selector) {
  return typeof selector === "function" ? selector : function() {
    return d3_selectAll(selector, this);
  };
}
var d3_nsPrefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

d3.ns = {
  prefix: d3_nsPrefix,
  qualify: function(name) {
    var i = name.indexOf(":"),
        prefix = name;
    if (i >= 0) {
      prefix = name.substring(0, i);
      name = name.substring(i + 1);
    }
    return d3_nsPrefix.hasOwnProperty(prefix)
        ? {space: d3_nsPrefix[prefix], local: name}
        : name;
  }
};

d3_selectionPrototype.attr = function(name, value) {
  if (arguments.length < 2) {

    // For attr(string), return the attribute value for the first node.
    if (typeof name === "string") {
      var node = this.node();
      name = d3.ns.qualify(name);
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    // For attr(object), the object specifies the names and values of the
    // attributes to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_attr(value, name[value]));
    return this;
  }

  return this.each(d3_selection_attr(name, value));
};

function d3_selection_attr(name, value) {
  name = d3.ns.qualify(name);

  // For attr(string, null), remove the attribute with the specified name.
  function attrNull() {
    this.removeAttribute(name);
  }
  function attrNullNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  // For attr(string, string), set the attribute with the specified name.
  function attrConstant() {
    this.setAttribute(name, value);
  }
  function attrConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  // For attr(string, function), evaluate the function for each element, and set
  // or remove the attribute as appropriate.
  function attrFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }
  function attrFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return value == null
      ? (name.local ? attrNullNS : attrNull) : (typeof value === "function"
      ? (name.local ? attrFunctionNS : attrFunction)
      : (name.local ? attrConstantNS : attrConstant));
}
function d3_collapse(s) {
  return s.trim().replace(/\s+/g, " ");
}
d3.requote = function(s) {
  return s.replace(d3_requote_re, "\\$&");
};

var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

d3_selectionPrototype.classed = function(name, value) {
  if (arguments.length < 2) {

    // For classed(string), return true only if the first node has the specified
    // class or classes. Note that even if the browser supports DOMTokenList, it
    // probably doesn't support it on SVG elements (which can be animated).
    if (typeof name === "string") {
      var node = this.node(),
          n = (name = d3_selection_classes(name)).length,
          i = -1;
      if (value = node.classList) {
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    // For classed(object), the object specifies the names of classes to add or
    // remove. The values may be functions that are evaluated for each element.
    for (value in name) this.each(d3_selection_classed(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_classed(name, value));
};

function d3_selection_classedRe(name) {
  return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
}

function d3_selection_classes(name) {
  return name.trim().split(/^|\s+/);
}

// Multiple class names are allowed (e.g., "foo bar").
function d3_selection_classed(name, value) {
  name = d3_selection_classes(name).map(d3_selection_classedName);
  var n = name.length;

  function classedConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  // When the value is a function, the function is still evaluated only once per
  // element even if there are multiple class names.
  function classedFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return typeof value === "function"
      ? classedFunction
      : classedConstant;
}

function d3_selection_classedName(name) {
  var re = d3_selection_classedRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
    } else {
      node.setAttribute("class", d3_collapse(c.replace(re, " ")));
    }
  };
}

d3_selectionPrototype.style = function(name, value, priority) {
  var n = arguments.length;
  if (n < 3) {

    // For style(object) or style(object, string), the object specifies the
    // names and values of the attributes to set or remove. The values may be
    // functions that are evaluated for each element. The optional string
    // specifies the priority.
    if (typeof name !== "string") {
      if (n < 2) value = "";
      for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
      return this;
    }

    // For style(string), return the computed style value for the first node.
    if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);

    // For style(string, string) or style(string, function), use the default
    // priority. The priority is ignored for style(string, null).
    priority = "";
  }

  // Otherwise, a name, value and priority are specified, and handled as below.
  return this.each(d3_selection_style(name, value, priority));
};

function d3_selection_style(name, value, priority) {

  // For style(name, null) or style(name, null, priority), remove the style
  // property with the specified name. The priority is ignored.
  function styleNull() {
    this.style.removeProperty(name);
  }

  // For style(name, string) or style(name, string, priority), set the style
  // property with the specified name, using the specified priority.
  function styleConstant() {
    this.style.setProperty(name, value, priority);
  }

  // For style(name, function) or style(name, function, priority), evaluate the
  // function for each element, and set or remove the style property as
  // appropriate. When setting, use the specified priority.
  function styleFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return value == null
      ? styleNull : (typeof value === "function"
      ? styleFunction : styleConstant);
}

d3_selectionPrototype.property = function(name, value) {
  if (arguments.length < 2) {

    // For property(string), return the property value for the first node.
    if (typeof name === "string") return this.node()[name];

    // For property(object), the object specifies the names and values of the
    // properties to set or remove. The values may be functions that are
    // evaluated for each element.
    for (value in name) this.each(d3_selection_property(value, name[value]));
    return this;
  }

  // Otherwise, both a name and a value are specified, and are handled as below.
  return this.each(d3_selection_property(name, value));
};

function d3_selection_property(name, value) {

  // For property(name, null), remove the property with the specified name.
  function propertyNull() {
    delete this[name];
  }

  // For property(name, string), set the property with the specified name.
  function propertyConstant() {
    this[name] = value;
  }

  // For property(name, function), evaluate the function for each element, and
  // set or remove the property as appropriate.
  function propertyFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return value == null
      ? propertyNull : (typeof value === "function"
      ? propertyFunction : propertyConstant);
}

d3_selectionPrototype.text = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; })
      : this.node().textContent;
};

d3_selectionPrototype.html = function(value) {
  return arguments.length
      ? this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; } : value == null
      ? function() { this.innerHTML = ""; }
      : function() { this.innerHTML = value; })
      : this.node().innerHTML;
};

d3_selectionPrototype.append = function(name) {
  name = d3_selection_creator(name);
  return this.select(function() {
    return this.appendChild(name.apply(this, arguments));
  });
};

function d3_selection_creator(name) {
  return typeof name === "function" ? name
      : (name = d3.ns.qualify(name)).local ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
      : function() { return this.ownerDocument.createElementNS(this.namespaceURI, name); };
}

d3_selectionPrototype.insert = function(name, before) {
  name = d3_selection_creator(name);
  before = d3_selection_selector(before);
  return this.select(function() {
    return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
  });
};

// TODO remove(selector)?
// TODO remove(node)?
// TODO remove(function)?
d3_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};
function d3_class(ctor, properties) {
  try {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  } catch (e) {
    ctor.prototype = properties;
  }
}

d3.map = function(object) {
  var map = new d3_Map;
  if (object instanceof d3_Map) object.forEach(function(key, value) { map.set(key, value); });
  else for (var key in object) map.set(key, object[key]);
  return map;
};

function d3_Map() {}

d3_class(d3_Map, {
  has: d3_map_has,
  get: function(key) {
    return this[d3_map_prefix + key];
  },
  set: function(key, value) {
    return this[d3_map_prefix + key] = value;
  },
  remove: d3_map_remove,
  keys: d3_map_keys,
  values: function() {
    var values = [];
    this.forEach(function(key, value) { values.push(value); });
    return values;
  },
  entries: function() {
    var entries = [];
    this.forEach(function(key, value) { entries.push({key: key, value: value}); });
    return entries;
  },
  size: d3_map_size,
  empty: d3_map_empty,
  forEach: function(f) {
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);
  }
});

var d3_map_prefix = "\0", // prevent collision with built-ins
    d3_map_prefixCode = d3_map_prefix.charCodeAt(0);

function d3_map_has(key) {
  return d3_map_prefix + key in this;
}

function d3_map_remove(key) {
  key = d3_map_prefix + key;
  return key in this && delete this[key];
}

function d3_map_keys() {
  var keys = [];
  this.forEach(function(key) { keys.push(key); });
  return keys;
}

function d3_map_size() {
  var size = 0;
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;
  return size;
}

function d3_map_empty() {
  for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;
  return true;
}

d3_selectionPrototype.data = function(value, key) {
  var i = -1,
      n = this.length,
      group,
      node;

  // If no value is specified, return the first value.
  if (!arguments.length) {
    value = new Array(n = (group = this[0]).length);
    while (++i < n) {
      if (node = group[i]) {
        value[i] = node.__data__;
      }
    }
    return value;
  }

  function bind(group, groupData) {
    var i,
        n = group.length,
        m = groupData.length,
        n0 = Math.min(n, m),
        updateNodes = new Array(m),
        enterNodes = new Array(m),
        exitNodes = new Array(n),
        node,
        nodeData;

    if (key) {
      var nodeByKeyValue = new d3_Map,
          dataByKeyValue = new d3_Map,
          keyValues = [],
          keyValue;

      for (i = -1; ++i < n;) {
        keyValue = key.call(node = group[i], node.__data__, i);
        if (nodeByKeyValue.has(keyValue)) {
          exitNodes[i] = node; // duplicate selection key
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
        keyValues.push(keyValue);
      }

      for (i = -1; ++i < m;) {
        keyValue = key.call(groupData, nodeData = groupData[i], i);
        if (node = nodeByKeyValue.get(keyValue)) {
          updateNodes[i] = node;
          node.__data__ = nodeData;
        } else if (!dataByKeyValue.has(keyValue)) { // no duplicate data key
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
        dataByKeyValue.set(keyValue, nodeData);
        nodeByKeyValue.remove(keyValue);
      }

      for (i = -1; ++i < n;) {
        if (nodeByKeyValue.has(keyValues[i])) {
          exitNodes[i] = group[i];
        }
      }
    } else {
      for (i = -1; ++i < n0;) {
        node = group[i];
        nodeData = groupData[i];
        if (node) {
          node.__data__ = nodeData;
          updateNodes[i] = node;
        } else {
          enterNodes[i] = d3_selection_dataNode(nodeData);
        }
      }
      for (; i < m; ++i) {
        enterNodes[i] = d3_selection_dataNode(groupData[i]);
      }
      for (; i < n; ++i) {
        exitNodes[i] = group[i];
      }
    }

    enterNodes.update
        = updateNodes;

    enterNodes.parentNode
        = updateNodes.parentNode
        = exitNodes.parentNode
        = group.parentNode;

    enter.push(enterNodes);
    update.push(updateNodes);
    exit.push(exitNodes);
  }

  var enter = d3_selection_enter([]),
      update = d3_selection([]),
      exit = d3_selection([]);

  if (typeof value === "function") {
    while (++i < n) {
      bind(group = this[i], value.call(group, group.parentNode.__data__, i));
    }
  } else {
    while (++i < n) {
      bind(group = this[i], value);
    }
  }

  update.enter = function() { return enter; };
  update.exit = function() { return exit; };
  return update;
};

function d3_selection_dataNode(data) {
  return {__data__: data};
}

d3_selectionPrototype.datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.property("__data__");
};

d3_selectionPrototype.filter = function(filter) {
  var subgroups = [],
      subgroup,
      group,
      node;

  if (typeof filter !== "function") filter = d3_selection_filter(filter);

  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    subgroup.parentNode = (group = this[j]).parentNode;
    for (var i = 0, n = group.length; i < n; i++) {
      if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
        subgroup.push(node);
      }
    }
  }

  return d3_selection(subgroups);
};

function d3_selection_filter(selector) {
  return function() {
    return d3_selectMatches(this, selector);
  };
}

d3_selectionPrototype.order = function() {
  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
};
d3.ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

d3_selectionPrototype.sort = function(comparator) {
  comparator = d3_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
  return this.order();
};

function d3_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d3.ascending;
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}
function d3_noop() {}

d3.dispatch = function() {
  var dispatch = new d3_dispatch,
      i = -1,
      n = arguments.length;
  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
  return dispatch;
};

function d3_dispatch() {}

d3_dispatch.prototype.on = function(type, listener) {
  var i = type.indexOf("."),
      name = "";

  // Extract optional namespace, e.g., "click.foo"
  if (i >= 0) {
    name = type.substring(i + 1);
    type = type.substring(0, i);
  }

  if (type) return arguments.length < 2
      ? this[type].on(name)
      : this[type].on(name, listener);

  if (arguments.length === 2) {
    if (listener == null) for (type in this) {
      if (this.hasOwnProperty(type)) this[type].on(name, null);
    }
    return this;
  }
};

function d3_dispatch_event(dispatch) {
  var listeners = [],
      listenerByName = new d3_Map;

  function event() {
    var z = listeners, // defensive reference
        i = -1,
        n = z.length,
        l;
    while (++i < n) if (l = z[i].on) l.apply(this, arguments);
    return dispatch;
  }

  event.on = function(name, listener) {
    var l = listenerByName.get(name),
        i;

    // return the current listener, if any
    if (arguments.length < 2) return l && l.on;

    // remove the old listener, if any (with copy-on-write)
    if (l) {
      l.on = null;
      listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
      listenerByName.remove(name);
    }

    // add the new listener, if any
    if (listener) listeners.push(listenerByName.set(name, {on: listener}));

    return dispatch;
  };

  return event;
}

d3.event = null;

function d3_eventPreventDefault() {
  d3.event.preventDefault();
}

function d3_eventSource() {
  var e = d3.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

// Like d3.dispatch, but for custom events abstracting native UI events. These
// events have a target component (such as a brush), a target element (such as
// the svg:g element containing the brush) and the standard arguments `d` (the
// target element's data) and `i` (the selection index of the target element).
function d3_eventDispatch(target) {
  var dispatch = new d3_dispatch,
      i = 0,
      n = arguments.length;

  while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);

  // Creates a dispatch context for the specified `thiz` (typically, the target
  // DOM element that received the source event) and `argumentz` (typically, the
  // data `d` and index `i` of the target element). The returned function can be
  // used to dispatch an event to any registered listeners; the function takes a
  // single argument as input, being the event to dispatch. The event must have
  // a "type" attribute which corresponds to a type registered in the
  // constructor. This context will automatically populate the "sourceEvent" and
  // "target" attributes of the event, as well as setting the `d3.event` global
  // for the duration of the notification.
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 =
        e1.sourceEvent = d3.event;
        e1.target = target;
        d3.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d3.event = e0;
      }
    };
  };

  return dispatch;
}

d3_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {

    // For on(object) or on(object, boolean), the object specifies the event
    // types and listeners to add or remove. The optional boolean specifies
    // whether the listener captures events.
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
      return this;
    }

    // For on(string), return the listener for the first node.
    if (n < 2) return (n = this.node()["__on" + type]) && n._;

    // For on(string, function), use the default capture.
    capture = false;
  }

  // Otherwise, a type, listener and capture are specified, and handled as below.
  return this.each(d3_selection_on(type, listener, capture));
};

function d3_selection_on(type, listener, capture) {
  var name = "__on" + type,
      i = type.indexOf("."),
      wrap = d3_selection_onListener;

  if (i > 0) type = type.substring(0, i);
  var filter = d3_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d3_selection_onFilter;

  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }

  function onAdd() {
    var l = wrap(listener, d3_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"),
        match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }

  return i
      ? listener ? onAdd : onRemove
      : listener ? d3_noop : removeAll;
}

var d3_selection_onFilters = d3.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d3_selection_onFilters.forEach(function(k) {
  if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
});

function d3_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d3.event; // Events can be reentrant (e.g., focus).
    d3.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d3.event = o;
    }
  };
}

function d3_selection_onFilter(listener, argumentz) {
  var l = d3_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}

d3_selectionPrototype.each = function(callback) {
  return d3_selection_each(this, function(node, i, j) {
    callback.call(node, node.__data__, i, j);
  });
};

function d3_selection_each(groups, callback) {
  for (var j = 0, m = groups.length; j < m; j++) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
      if (node = group[i]) callback(node, i, j);
    }
  }
  return groups;
}

d3_selectionPrototype.call = function(callback) {
  var args = d3_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};

d3_selectionPrototype.empty = function() {
  return !this.node();
};

d3_selectionPrototype.node = function() {
  for (var j = 0, m = this.length; j < m; j++) {
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
};

d3_selectionPrototype.size = function() {
  var n = 0;
  this.each(function() { ++n; });
  return n;
};

function d3_selection_enter(selection) {
  d3_subclass(selection, d3_selection_enterPrototype);
  return selection;
}

var d3_selection_enterPrototype = [];

d3.selection.enter = d3_selection_enter;
d3.selection.enter.prototype = d3_selection_enterPrototype;

d3_selection_enterPrototype.append = d3_selectionPrototype.append;
d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
d3_selection_enterPrototype.node = d3_selectionPrototype.node;
d3_selection_enterPrototype.call = d3_selectionPrototype.call;
d3_selection_enterPrototype.size = d3_selectionPrototype.size;


d3_selection_enterPrototype.select = function(selector) {
  var subgroups = [],
      subgroup,
      subnode,
      upgroup,
      group,
      node;

  for (var j = -1, m = this.length; ++j < m;) {
    upgroup = (group = this[j]).update;
    subgroups.push(subgroup = []);
    subgroup.parentNode = group.parentNode;
    for (var i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
        subnode.__data__ = node.__data__;
      } else {
        subgroup.push(null);
      }
    }
  }

  return d3_selection(subgroups);
};

d3_selection_enterPrototype.insert = function(name, before) {
  if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
  return d3_selectionPrototype.insert.call(this, name, before);
};

function d3_selection_enterInsertBefore(enter) {
  var i0, j0;
  return function(d, i, j) {
    var group = enter[j].update,
        n = group.length,
        node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n);
    return node;
  };
}

// import "../transition/transition";

d3_selectionPrototype.transition = function() {
  var id = d3_transitionInheritId || ++d3_transitionId,
      subgroups = [],
      subgroup,
      node,
      transition = d3_transitionInherit || {time: Date.now(), ease: d3_ease_cubicInOut, delay: 0, duration: 250};

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) d3_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }

  return d3_transition(subgroups, id);
};
// import "../transition/transition";

d3_selectionPrototype.interrupt = function() {
  return this.each(d3_selection_interrupt);
};

function d3_selection_interrupt() {
  var lock = this.__transition__;
  if (lock) ++lock.active;
}

// TODO fast singleton implementation?
d3.select = function(node) {
  var group = [typeof node === "string" ? d3_select(node, d3_document) : node];
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

d3.selectAll = function(nodes) {
  var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
  group.parentNode = d3_documentElement;
  return d3_selection([group]);
};

var d3_selectionRoot = d3.select(d3_documentElement);
  if (typeof define === "function" && define.amd) {
    define(d3);
  } else if (typeof module === "object" && module.exports) {
    module.exports = d3;
  } else {
    this.d3 = d3;
  }
}();

},{}],3:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.xhr = {}));
}(this, function (exports) { 'use strict';

  var dsv = function(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);

    function parse(text, f) {
      var o;
      return parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) { return f(a(row), i); } : a;
      });
    }

    function parseRows(text, f) {
      var EOL = {}, // sentinel value for end-of-line
          EOF = {}, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?

      function token() {
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line

        // special case: quotes
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, "\"");
        }

        // common case: find next delimiter or newline
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; // \n
          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }

        // special case: last token before EOF
        return text.slice(j);
      }

      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }

      return rows;
    }

    function format(rows) {
      if (Array.isArray(rows[0])) return formatRows(rows); // deprecated; use formatRows
      var fieldSet = Object.create(null), fields = [];

      // Compute unique fields in order of discovery.
      rows.forEach(function(row) {
        for (var field in row) {
          if (!((field += "") in fieldSet)) {
            fields.push(fieldSet[field] = field);
          }
        }
      });

      return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(text) {
      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    };
  }

  var tsv = dsv("\t");

  function responseOf(dsv, row) {
    return function(request) {
      return dsv.parse(request.responseText, row);
    };
  }

  function fixCallback(callback) {
    return function(error, request) {
      callback(error == null ? request : null);
    };
  }

  function hasResponse(request) {
    var type = request.responseType;
    return type && type !== "text"
        ? request.response // null on error
        : request.responseText; // "" on error
  }

  function Dispatch(types) {
    var i = -1,
        n = types.length,
        callbacksByType = {},
        callbackByName = {},
        type,
        that = this;

    that.on = function(type, callback) {
      type = parseType(type);

      // Return the current callback, if any.
      if (arguments.length < 2) {
        return (callback = callbackByName[type.name]) && callback.value;
      }

      // If a type was specified…
      if (type.type) {
        var callbacks = callbacksByType[type.type],
            callback0 = callbackByName[type.name],
            i;

        // Remove the current callback, if any, using copy-on-remove.
        if (callback0) {
          callback0.value = null;
          i = callbacks.indexOf(callback0);
          callbacksByType[type.type] = callbacks = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
          delete callbackByName[type.name];
        }

        // Add the new callback, if any.
        if (callback) {
          callback = {value: callback};
          callbackByName[type.name] = callback;
          callbacks.push(callback);
        }
      }

      // Otherwise, if a null callback was specified, remove all callbacks with the given name.
      else if (callback == null) {
        for (var otherType in callbacksByType) {
          if (callback = callbackByName[otherType + type.name]) {
            callback.value = null;
            var callbacks = callbacksByType[otherType], i = callbacks.indexOf(callback);
            callbacksByType[otherType] = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
            delete callbackByName[callback.name];
          }
        }
      }

      return that;
    };

    while (++i < n) {
      type = types[i] + "";
      if (!type || (type in that)) throw new Error("illegal or duplicate type: " + type);
      callbacksByType[type] = [];
      that[type] = applier(type);
    }

    function parseType(type) {
      var i = (type += "").indexOf("."), name = type;
      if (i >= 0) type = type.slice(0, i); else name += ".";
      if (type && !callbacksByType.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      return {type: type, name: name};
    }

    function applier(type) {
      return function() {
        var callbacks = callbacksByType[type], // Defensive reference; copy-on-remove.
            callback,
            callbackValue,
            i = -1,
            n = callbacks.length;

        while (++i < n) {
          if (callbackValue = (callback = callbacks[i]).value) {
            callbackValue.apply(this, arguments);
          }
        }

        return that;
      };
    }
  }

  function dispatch() {
    return new Dispatch(arguments);
  }

  dispatch.prototype = Dispatch.prototype; // allow instanceof

  var xhr = function(url, callback) {
    var xhr,
        event = dispatch("beforesend", "progress", "load", "error"),
        mimeType,
        headers = new Map,
        request = new XMLHttpRequest,
        response,
        responseType;

    // If IE does not support CORS, use XDomainRequest.
    if (typeof XDomainRequest !== "undefined"
        && !("withCredentials" in request)
        && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest;

    "onload" in request
        ? request.onload = request.onerror = respond
        : request.onreadystatechange = function() { request.readyState > 3 && respond(); };

    function respond() {
      var status = request.status, result;
      if (!status && hasResponse(request)
          || status >= 200 && status < 300
          || status === 304) {
        if (response) {
          try {
            result = response.call(xhr, request);
          } catch (e) {
            event.error.call(xhr, e);
            return;
          }
        } else {
          result = request;
        }
        event.load.call(xhr, result);
      } else {
        event.error.call(xhr, request);
      }
    }

    request.onprogress = function(e) {
      event.progress.call(xhr, e);
    };

    xhr = {
      header: function(name, value) {
        name = (name + "").toLowerCase();
        if (arguments.length < 2) return headers.get(name);
        if (value == null) headers.delete(name);
        else headers.set(name, value + "");
        return xhr;
      },

      // If mimeType is non-null and no Accept header is set, a default is used.
      mimeType: function(value) {
        if (!arguments.length) return mimeType;
        mimeType = value == null ? null : value + "";
        return xhr;
      },

      // Specifies what type the response value should take;
      // for instance, arraybuffer, blob, document, or text.
      responseType: function(value) {
        if (!arguments.length) return responseType;
        responseType = value;
        return xhr;
      },

      // Specify how to convert the response content to a specific type;
      // changes the callback value on "load" events.
      response: function(value) {
        response = value;
        return xhr;
      },

      // Alias for send("GET", …).
      get: function(data, callback) {
        return xhr.send("GET", data, callback);
      },

      // Alias for send("POST", …).
      post: function(data, callback) {
        return xhr.send("POST", data, callback);
      },

      // If callback is non-null, it will be used for error and load events.
      send: function(method, data, callback) {
        if (!callback && typeof data === "function") callback = data, data = null;
        if (callback && callback.length === 1) callback = fixCallback(callback);
        request.open(method, url, true);
        if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
        if (request.setRequestHeader) headers.forEach(function(value, name) { request.setRequestHeader(name, value); });
        if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
        if (responseType != null) request.responseType = responseType;
        if (callback) xhr.on("error", callback).on("load", function(request) { callback(null, request); });
        event.beforesend.call(xhr, request);
        request.send(data == null ? null : data);
        return xhr;
      },

      abort: function() {
        request.abort();
        return xhr;
      },

      on: function() {
        var value = event.on.apply(event, arguments);
        return value === event ? xhr : value;
      }
    };

    return callback
        ? xhr.get(callback)
        : xhr;
  }

  var xhrDsv = function(defaultMimeType, dsv) {
    return function(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var r = xhr(url).mimeType(defaultMimeType);
      r.row = function(_) { return arguments.length ? r.response(responseOf(dsv, row = _)) : row; };
      r.row(row);
      return callback ? r.get(callback) : r;
    };
  }

  var _tsv = xhrDsv("text/tab-separated-values", tsv);

  var csv = dsv(",");

  var _csv = xhrDsv("text/csv", csv);

  var xhrType = function(defaultMimeType, response) {
    return function(url, callback) {
      var r = xhr(url).mimeType(defaultMimeType).response(response);
      return callback ? r.get(callback) : r;
    };
  }

  var xml = xhrType("application/xml", function(request) {
    return request.responseXML;
  });

  var text = xhrType("text/plain", function(request) {
    return request.responseText;
  });

  var json = xhrType("application/json", function(request) {
    return JSON.parse(request.responseText);
  });

  var html = xhrType("text/html", function(request) {
    return document.createRange().createContextualFragment(request.responseText);
  });

  exports.xhr = xhr;
  exports.html = html;
  exports.json = json;
  exports.text = text;
  exports.xml = xml;
  exports.csv = _csv;
  exports.tsv = _tsv;

}));
},{}],4:[function(require,module,exports){
/**
 * Debounces a function by the given threshold.
 *
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, threshold, execAsap){
  var timeout;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap) {
        func.apply(obj, args);
      }
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
};

},{}],5:[function(require,module,exports){
var polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

function encode(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) return '';

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0] - b[0], factor);
        output += encode(a[1] - b[1], factor);
    }

    return output;
};

if (typeof module !== undefined) module.exports = polyline;

},{}],6:[function(require,module,exports){
(function() {
  var slice = [].slice;

  function queue(parallelism) {
    var q,
        tasks = [],
        started = 0, // number of tasks that have been started (and perhaps finished)
        active = 0, // number of tasks currently being executed (started but not finished)
        remaining = 0, // number of tasks not yet finished
        popping, // inside a synchronous task callback?
        error = null,
        await = noop,
        all;

    if (!parallelism) parallelism = Infinity;

    function pop() {
      while (popping = started < tasks.length && active < parallelism) {
        var i = started++,
            t = tasks[i],
            a = slice.call(t, 1);
        a.push(callback(i));
        ++active;
        t[0].apply(null, a);
      }
    }

    function callback(i) {
      return function(e, r) {
        --active;
        if (error != null) return;
        if (e != null) {
          error = e; // ignore new tasks and squelch active callbacks
          started = remaining = NaN; // stop queued tasks from starting
          notify();
        } else {
          tasks[i] = r;
          if (--remaining) popping || pop();
          else notify();
        }
      };
    }

    function notify() {
      if (error != null) await(error);
      else if (all) await(error, tasks);
      else await.apply(null, [error].concat(tasks));
    }

    return q = {
      defer: function() {
        if (!error) {
          tasks.push(arguments);
          ++remaining;
          pop();
        }
        return q;
      },
      await: function(f) {
        await = f;
        all = false;
        if (!remaining) notify();
        return q;
      },
      awaitAll: function(f) {
        await = f;
        all = true;
        if (!remaining) notify();
        return q;
      }
    };
  }

  function noop() {}

  queue.version = "1.0.7";
  if (typeof define === "function" && define.amd) define(function() { return queue; });
  else if (typeof module === "object" && module.exports) module.exports = queue;
  else this.queue = queue;
})();

},{}],7:[function(require,module,exports){
'use strict';

var d3xhr = require('d3-xhr');

function d3post(url, reqData, callback, cors) {
    var sent = false;

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : ''));
    }

    var respData;

    d3xhr.xhr(url)
        .header("Content-Type", "application/json")
        .post(
                JSON.stringify(reqData),
                function(err, rawData){
                    respData = rawData;
                    callback.call(err, respData, null);
                }
             );

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    return respData;
}

if (typeof module !== 'undefined') module.exports = d3post;

},{"d3-xhr":3}],8:[function(require,module,exports){
'use strict';

var request = require('./request'),
    polyline = require('polyline'),
    d3 = require('../lib/d3'),
    queue = require('queue-async');

var Directions = L.Class.extend({
    includes: [L.Mixin.Events],

    options: {
        units: 'imperial'
    },

    statics: {
        URL_TEMPLATE: 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token={token}',
        MMRP_API_TEMPLATE: 'http://luliu.me/mmrp/api/v1',
        GEOCODER_TEMPLATE: 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/{query}.json?proximity={proximity}&access_token={token}'
    },

    initialize: function(options) {
        L.setOptions(this, options);
        this._waypoints = [];
        this.profile = {
            "available_public_modes": [],
            "can_use_taxi":           false,
            "has_bicycle":            false,
            "has_motorcycle":         false,
            "has_private_car":        true,
            "need_parking":           true,
            "objective":              "fastest",
            "driving_distance_limit": 500,
            "source": {
                "type": "coordinate",
                "value": {
                    "x": 0.0,
                    "y": 0.0,
                    "srid": 4326
                }
            },
            "target": {
                "type": "coordinate",
                "value": {
                    "x": 0.0,
                    "y": 0.0,
                    "srid": 4326
                }
            }
        };
    },

    getOrigin: function () {
        return this.origin;
    },

    getDestination: function () {
        return this.destination;
    },

    setOrigin: function (origin) {
        origin = this._normalizeWaypoint(origin);

        this.origin = origin;
        this.fire('origin', {origin: origin});

        if (!origin) {
            this._unload();
        }

        this.profile.source.value.x = this.origin.geometry.coordinates[0];
        this.profile.source.value.y = this.origin.geometry.coordinates[1];

        return this;
    },

    setDestination: function (destination) {
        destination = this._normalizeWaypoint(destination);

        this.destination = destination;
        this.fire('destination', {destination: destination});

        if (!destination) {
            this._unload();
        }

        this.profile.target.value.x = this.destination.geometry.coordinates[0];
        this.profile.target.value.y = this.destination.geometry.coordinates[1];

        return this;
    },

    getProfile: function() {
        //return this.profile || this.options.profile || 'mapbox.driving';
        return this.profile;
    },

    setProfile: function (key, value) {
        this.profile[key] = value;
        //this.fire('profile', {profile: profile});
        return this;
    },

    getWaypoints: function() {
        return this._waypoints;
    },

    setWaypoints: function (waypoints) {
        this._waypoints = waypoints.map(this._normalizeWaypoint);
        return this;
    },

    addWaypoint: function (index, waypoint) {
        this._waypoints.splice(index, 0, this._normalizeWaypoint(waypoint));
        return this;
    },

    removeWaypoint: function (index) {
        this._waypoints.splice(index, 1);
        return this;
    },

    setWaypoint: function (index, waypoint) {
        this._waypoints[index] = this._normalizeWaypoint(waypoint);
        return this;
    },

    reverse: function () {
        var o = this.origin,
            d = this.destination;

        this.origin = d;
        this.destination = o;
        this._waypoints.reverse();

        this.fire('origin', {origin: this.origin})
            .fire('destination', {destination: this.destination});

        return this;
    },

    selectRoute: function (route) {
        this.fire('selectRoute', {route: route});
    },

    highlightRoute: function (route) {
        this.fire('highlightRoute', {route: route});
    },

    highlightStep: function (step) {
        this.fire('highlightStep', {step: step});
    },

    queryURL: function () {
        //var template = Directions.URL_TEMPLATE,
            //token = this.options.accessToken || L.mapbox.accessToken,
            //profile = this.getProfile(),
            //points = [this.origin].concat(this._waypoints).concat([this.destination]).map(function (point) {
                //return point.geometry.coordinates;
            //}).join(';');

        //if (L.mapbox.feedback) {
            //L.mapbox.feedback.record({directions: profile + ';' + points});
        //}

        //return L.Util.template(template, {
            //token: token,
            //profile: profile,
            //waypoints: points
        //});
        return Directions.MMRP_API_TEMPLATE;
    },

    queryable: function () {
        return this.getOrigin() && this.getDestination();
    },

    query: function (opts) {
        if (!opts) opts = {};
        if (!this.queryable()) return this;

        if (this._query) {
            this._query.abort();
        }

        if (this._requests && this._requests.length) this._requests.forEach(function(request) {
            request.abort();
        });
        this._requests = [];

        var q = queue();

        var pts = [this.origin, this.destination].concat(this._waypoints);
        for (var i in pts) {
            if (!pts[i].geometry.coordinates) {
                q.defer(L.bind(this._geocode, this), pts[i], opts.proximity);
            }
        }

        q.await(L.bind(function(err) {
            if (err) {
                return this.fire('error', {error: err.message});
            }

            var reqData = {"id": 1, "jsonrpc": "2.0", "method": "mmrp.findMultimodalPaths"};
            reqData.params = [this.profile];

            this._query = request(this.queryURL(), reqData, L.bind(function (err, resp) {
                this._query = null;

                if (err) {
                    return this.fire('error', {error: err.message});
                }

                this.directions = resp;
                this.directions.routes.forEach(function (route) {
                    route.geometry = {
                        type: "LineString",
                        coordinates: polyline.decode(route.geometry, 6).map(function (c) { return c.reverse(); })
                    };
                });

                if (!this.origin.properties.name) {
                    this.origin = this.directions.origin;
                } else {
                    this.directions.origin = this.origin;
                }

                if (!this.destination.properties.name) {
                    this.destination = this.directions.destination;
                } else {
                    this.directions.destination = this.destination;
                }

                this.fire('load', this.directions);
            }, this), this);
        }, this));

        return this;
    },

    _geocode: function(waypoint, proximity, cb) {
        if (!this._requests) this._requests = [];
        this._requests.push(request(L.Util.template(Directions.GEOCODER_TEMPLATE, {
            query: waypoint.properties.query,
            token: this.options.accessToken || L.mapbox.accessToken,
            proximity: proximity ? [proximity.lng, proximity.lat].join(',') : ''
        }), L.bind(function (err, resp) {
            if (err) {
                return cb(err);
            }

            if (!resp.features || !resp.features.length) {
                return cb(new Error("No results found for query " + waypoint.properties.query));
            }

            waypoint.geometry.coordinates = resp.features[0].center;
            waypoint.properties.name = resp.features[0].place_name;

            return cb();
        }, this)));
    },

    _unload: function () {
        this._waypoints = [];
        delete this.directions;
        this.fire('unload');
    },

    _normalizeWaypoint: function (waypoint) {
        if (!waypoint || waypoint.type === 'Feature') {
            return waypoint;
        }

        var coordinates,
            properties = {};

        if (waypoint instanceof L.LatLng) {
            waypoint = waypoint.wrap();
            coordinates = properties.query = [waypoint.lng, waypoint.lat];
        } else if (typeof waypoint === 'string') {
            properties.query = waypoint;
        }

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates
            },
            properties: properties
        };
    }
});

module.exports = function(options) {
    return new Directions(options);
};

},{"../lib/d3":2,"./request":14,"polyline":5,"queue-async":6}],9:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-errors', true);

    directions.on('load unload', function () {
        container
            .classed('mapbox-error-active', false)
            .html('');
    });

    directions.on('error', function (e) {
        container
            .classed('mapbox-error-active', true)
            .html('')
            .append('span')
            .attr('class', 'mapbox-directions-error')
            .text(e.error);

        container
            .insert('span', 'span')
            .attr('class', 'mapbox-directions-icon mapbox-error-icon');
    });

    return control;
};

},{"../lib/d3":2,"./format":10}],10:[function(require,module,exports){
'use strict';

module.exports = {
    duration: function (s) {
        var m = Math.floor(s / 60),
            h = Math.floor(m / 60);
        s %= 60;
        m %= 60;
        if (h === 0 && m === 0) return s + ' s';
        if (h === 0) return m + ' min';
        return h + ' h ' + m + ' min';
    },

    imperial: function (m) {
        var mi = m / 1609.344;
        if (mi >= 100) return mi.toFixed(0) + ' mi';
        if (mi >= 10)  return mi.toFixed(1) + ' mi';
        if (mi >= 0.1) return mi.toFixed(2) + ' mi';
        return (mi * 5280).toFixed(0) + ' ft';
    },

    metric: function (m) {
        if (m >= 100000) return (m / 1000).toFixed(0) + ' km';
        if (m >= 10000)  return (m / 1000).toFixed(1) + ' km';
        if (m >= 100)    return (m / 1000).toFixed(2) + ' km';
        return m.toFixed(0) + ' m';
    }
};

},{}],11:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3');

module.exports = function (container, directions) {
    var control = {}, map;
    var origChange = false,
        destChange = false;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-inputs', true);

    var publicTransitSelection = [];

    var form = container.append('form')
        .on('keypress', function () {
            if (d3.event.keyCode === 13) {
                d3.event.preventDefault();

                if (origChange)
                    directions.setOrigin(originInput.property('value'));
                if (destChange)
                    directions.setDestination(destinationInput.property('value'));

                if (directions.queryable())
                    directions.query({ proximity: map.getCenter() });

                origChange = false;
                destChange = false;
            }
        });

    var origin = form.append('div')
        .attr('class', 'mapbox-directions-origin');

    origin.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getOrigin() instanceof L.LatLng) {
                map.panTo(directions.getOrigin());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-depart-icon');

    var originInput = origin.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mmrp-origin-input')
        .attr('placeholder', 'Start')
        .on('input', function() {
            if (!origChange) origChange = true;
        });

    origin.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setOrigin(undefined);
        });

    form.append('span')
        .attr('class', 'mapbox-directions-icon mapbox-reverse-icon mapbox-directions-reverse-input')
        .attr('title', 'Reverse origin & destination')
        .on('click', function () {
            directions.reverse().query();
        });

    var destination = form.append('div')
        .attr('class', 'mapbox-directions-destination');

    destination.append('label')
        .attr('class', 'mapbox-form-label')
        .on('click', function () {
            if (directions.getDestination() instanceof L.LatLng) {
                map.panTo(directions.getDestination());
            }
        })
        .append('span')
        .attr('class', 'mapbox-directions-icon mapbox-arrive-icon');

    var destinationInput = destination.append('input')
        .attr('type', 'text')
        .attr('required', 'required')
        .attr('id', 'mmrp-destination-input')
        .attr('placeholder', 'End')
        .on('input', function() {
            if (!destChange) destChange = true;
        });

    destination.append('div')
        .attr('class', 'mapbox-directions-icon mapbox-close-icon')
        .attr('title', 'Clear value')
        .on('click', function () {
            directions.setDestination(undefined);
        });

    var car_profile = form.append('div')
        .attr('id', 'mmrp-car-profiles')
        .attr('class', 'mapbox-directions-profile');

    car_profile.append('h3')
        .attr('value', 'DRIVING')
        .attr('style', 'margin: 5px 0px 0px 5px')
        .text('DRIVING OPTIONS');

    car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', 'mmrp-profile-private-car')
        .property('checked', true)
        .on('change', function (d) {
            if (this.checked) {
                carParking.property('disabled', false);
                carParking.property('checked', true);
                isDrivingDistLimited.property('disabled', false);
                isDrivingDistLimited.property('checked', true);
                distanceLimit.property('disabled', false);
            }
            else {
                carParking.property('disabled', true);
                carParking.property('checked', false);
                isDrivingDistLimited.property('disabled', true);
                isDrivingDistLimited.property('checked', false);
                distanceLimit.property('disabled', true);
            }
            directions.setProfile('has_private_car', this.checked);
        });

    car_profile.append('label')
        .attr('for', 'mmrp-profile-private-car')
        .text('Private car available on departure');

    var carParking = car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', 'mmrp-profile-car-parking')
        .property('checked', true)
        .property('disabled', false)
        .on('change', function (d) {
            directions.setProfile('need_parking', this.checked);
        });

    car_profile.append('label')
        .attr('for', 'mmrp-profile-car-parking')
        .text('Need parking for the car');

    var isDrivingDistLimited = car_profile.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'driving-profile')
        .attr('id', 'driving-distance-limit')
        .property('checked', true)
        .on('change', function (d) {
            if (this.checked) {
                distanceLimit.property('disabled', false);
            }
            else
                distanceLimit.property('disabled', true);
        });

    car_profile.append('label')
        .attr('for', 'driving-distance-limit')
        .attr('style', 'width: 150px')
        .text('Distance limit (km): ');

    var distanceLimit = car_profile.append('input')
        .attr('type', 'number')
        .attr('min', '10')
        .attr('max', '2617')
        .property('value', '500')
        .attr('id', 'mmrp-driving-distance-limit')
        .attr('style', 'width: 80px;padding-left: 10px;padding-top: 2px;padding-bottom: 2px;background-color: white;border: 1px solid rgba(0,0,0,0.1);height: 30px;vertical-align: middle;');

    var public_profile = form.append('div')
        .attr('id', 'mmrp-public-profiles')
        .attr('class', 'mapbox-directions-profile');

    public_profile.append('h3')
        .attr('value', 'PUBLIC TRANSIT')
        .attr('style', 'margin: 5px 0px 0px 5px')
        .text('PUBLIC TRANSIT PREFERENCES');

    var public_profiles = public_profile.selectAll('span')
        .data([
            ['mmrp.suburban', 'suburban', 'Suburban'],
            ['mmrp.underground', 'underground', 'Underground'],
            ['mmrp.tram', 'tram', 'Tram']])
        .enter()
        .append('span');

    public_profiles.append('input')
        .attr('type', 'checkbox')
        .attr('name', 'profile')
        .attr('id', function (d) { return 'mmrp-profile-' + d[1]; })
        .on('change', function (d) {
            if (this.checked) {
                publicTransitSelection.push(d[1]);
            }
            else {
                var index = publicTransitSelection.indexOf(d[1]);
                if (index > -1) {
                    publicTransitSelection.splice(index, 1);
                }
            }
        });

    public_profiles.append('label')
        .attr('for', function (d) { return 'mmrp-profile-' + d[1]; })
        .text(function (d) { return d[2]; });

    public_profile.append('input')
        .attr('type', 'button')
        .attr('value', 'Find multimodal paths')
        .attr('name', 'find paths')
        .attr('id', 'find-mmpaths')
        .on('click', function (d) {
            if (isDrivingDistLimited.property('checked') === true) {
                directions.setProfile('driving_distance_limit', distanceLimit.property('value'));
            }
            directions.setProfile('available_public_modes', publicTransitSelection);
            alert(JSON.stringify(directions.getProfile()));
            directions.query();
        });

    function format(waypoint) {
        if (!waypoint) {
            return '';
        } else if (waypoint.properties.name) {
            return waypoint.properties.name;
        } else if (waypoint.geometry.coordinates) {
            var precision = Math.max(0, Math.ceil(Math.log(map.getZoom()) / Math.LN2));
            return waypoint.geometry.coordinates[0].toFixed(precision) + ', ' +
                   waypoint.geometry.coordinates[1].toFixed(precision);
        } else {
            return waypoint.properties.query || '';
        }
    }

    directions
        .on('origin', function (e) {
            originInput.property('value', format(e.origin));
        })
        .on('destination', function (e) {
            destinationInput.property('value', format(e.destination));
        })
        .on('profile', function (e) {
            profiles.selectAll('input')
                .property('checked', function (d) { return d[0] === e.profile; });
        })
        .on('load', function (e) {
            originInput.property('value', format(e.origin));
            destinationInput.property('value', format(e.destination));
        });

    return control;
};

},{"../lib/d3":2}],12:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-instructions', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('selectRoute', function (e) {
        var route = e.route;

        container.html('');

        var steps = container.append('ol')
            .attr('class', 'mapbox-directions-steps')
            .selectAll('li')
            .data(route.steps)
            .enter().append('li')
            .attr('class', 'mapbox-directions-step');

        steps.append('span')
            .attr('class', function (step) {
                return 'mapbox-directions-icon mapbox-' + step.maneuver.type.replace(/\s+/g, '-').toLowerCase() + '-icon';
            });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-maneuver')
            .html(function (step) { return step.maneuver.instruction; });

        steps.append('div')
            .attr('class', 'mapbox-directions-step-distance')
            .text(function (step) {
                return step.distance ? format[directions.options.units](step.distance) : '';
            });

        steps.on('mouseover', function (step) {
            directions.highlightStep(step);
        });

        steps.on('mouseout', function () {
            directions.highlightStep(null);
        });

        steps.on('click', function (step) {
            map.panTo(L.GeoJSON.coordsToLatLng(step.maneuver.location.coordinates));
        });
    });

    return control;
};

},{"../lib/d3":2,"./format":10}],13:[function(require,module,exports){
'use strict';

var debounce = require('debounce');

var Layer = L.LayerGroup.extend({
    options: {
        readonly: false
    },

    initialize: function(directions, options) {
        L.setOptions(this, options);
        this._directions = directions || new L.Directions();
        L.LayerGroup.prototype.initialize.apply(this);

        this._drag = debounce(L.bind(this._drag, this), 100);

        this.originMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#3BB2D0',
                'marker-symbol': 'a'
            })
        }).on('drag', this._drag, this);

        this.destinationMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-color': '#444',
                'marker-symbol': 'b'
            })
        }).on('drag', this._drag, this);

        this.stepMarker = L.marker([0, 0], {
            icon: L.divIcon({
                className: 'mapbox-marker-drag-icon mapbox-marker-drag-icon-step',
                iconSize: new L.Point(12, 12)
            })
        });

        this.dragMarker = L.marker([0, 0], {
            draggable: !this.options.readonly,
            icon: this._waypointIcon()
        });

        this.dragMarker
            .on('dragstart', this._dragStart, this)
            .on('drag', this._drag, this)
            .on('dragend', this._dragEnd, this);

        this.routeLayer = L.geoJson();
        this.routeHighlightLayer = L.geoJson();

        this.waypointMarkers = [];
    },

    onAdd: function() {
        L.LayerGroup.prototype.onAdd.apply(this, arguments);

        if (!this.options.readonly) {
          this._map
              .on('click', this._click, this)
              .on('mousemove', this._mousemove, this);
        }

        this._directions
            .on('origin', this._origin, this)
            .on('destination', this._destination, this)
            .on('load', this._load, this)
            .on('unload', this._unload, this)
            .on('selectRoute', this._selectRoute, this)
            .on('highlightRoute', this._highlightRoute, this)
            .on('highlightStep', this._highlightStep, this);
    },

    onRemove: function() {
        this._directions
            .off('origin', this._origin, this)
            .off('destination', this._destination, this)
            .off('load', this._load, this)
            .off('unload', this._unload, this)
            .off('selectRoute', this._selectRoute, this)
            .off('highlightRoute', this._highlightRoute, this)
            .off('highlightStep', this._highlightStep, this);

        this._map
            .off('click', this._click, this)
            .off('mousemove', this._mousemove, this);

        L.LayerGroup.prototype.onRemove.apply(this, arguments);
    },

    _click: function(e) {
        if (!this._directions.getOrigin()) {
            this._directions.setOrigin(e.latlng);
        } else if (!this._directions.getDestination()) {
            this._directions.setDestination(e.latlng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _mousemove: function(e) {
        if (!this.routeLayer || !this.hasLayer(this.routeLayer) || this._currentWaypoint !== undefined) {
            return;
        }

        var p = this._routePolyline().closestLayerPoint(e.layerPoint);

        if (!p || p.distance > 15) {
            return this.removeLayer(this.dragMarker);
        }

        var m = this._map.project(e.latlng),
            o = this._map.project(this.originMarker.getLatLng()),
            d = this._map.project(this.destinationMarker.getLatLng());

        if (o.distanceTo(m) < 15 || d.distanceTo(m) < 15) {
            return this.removeLayer(this.dragMarker);
        }

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var w = this._map.project(this.waypointMarkers[i].getLatLng());
            if (i !== this._currentWaypoint && w.distanceTo(m) < 15) {
                return this.removeLayer(this.dragMarker);
            }
        }

        this.dragMarker.setLatLng(this._map.layerPointToLatLng(p));
        this.addLayer(this.dragMarker);
    },

    _origin: function(e) {
        if (e.origin && e.origin.geometry.coordinates) {
            this.originMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.origin.geometry.coordinates));
            this.addLayer(this.originMarker);
        } else {
            this.removeLayer(this.originMarker);
        }
    },

    _destination: function(e) {
        if (e.destination && e.destination.geometry.coordinates) {
            this.destinationMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.destination.geometry.coordinates));
            this.addLayer(this.destinationMarker);
        } else {
            this.removeLayer(this.destinationMarker);
        }
    },

    _dragStart: function(e) {
        if (e.target === this.dragMarker) {
            this._currentWaypoint = this._findWaypointIndex(e.target.getLatLng());
            this._directions.addWaypoint(this._currentWaypoint, e.target.getLatLng());
        } else {
            this._currentWaypoint = this.waypointMarkers.indexOf(e.target);
        }
    },

    _drag: function(e) {
        var latLng = e.target.getLatLng();

        if (e.target === this.originMarker) {
            this._directions.setOrigin(latLng);
        } else if (e.target === this.destinationMarker) {
            this._directions.setDestination(latLng);
        } else {
            this._directions.setWaypoint(this._currentWaypoint, latLng);
        }

        if (this._directions.queryable()) {
            this._directions.query();
        }
    },

    _dragEnd: function() {
        this._currentWaypoint = undefined;
    },

    _removeWaypoint: function(e) {
        this._directions.removeWaypoint(this.waypointMarkers.indexOf(e.target)).query();
    },

    _load: function(e) {
        this._origin(e);
        this._destination(e);

        function waypointLatLng(i) {
            return L.GeoJSON.coordsToLatLng(e.waypoints[i].geometry.coordinates);
        }

        var l = Math.min(this.waypointMarkers.length, e.waypoints.length),
            i = 0;

        // Update existing
        for (; i < l; i++) {
            this.waypointMarkers[i].setLatLng(waypointLatLng(i));
        }

        // Add new
        for (; i < e.waypoints.length; i++) {
            var waypointMarker = L.marker(waypointLatLng(i), {
                draggable: !this.options.readonly,
                icon: this._waypointIcon()
            });

            waypointMarker
                .on('click', this._removeWaypoint, this)
                .on('dragstart', this._dragStart, this)
                .on('drag', this._drag, this)
                .on('dragend', this._dragEnd, this);

            this.waypointMarkers.push(waypointMarker);
            this.addLayer(waypointMarker);
        }

        // Remove old
        for (; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }

        this.waypointMarkers.length = e.waypoints.length;
    },

    _unload: function() {
        this.removeLayer(this.routeLayer);
        for (var i = 0; i < this.waypointMarkers.length; i++) {
            this.removeLayer(this.waypointMarkers[i]);
        }
    },

    _selectRoute: function(e) {
        this.routeLayer
            .clearLayers()
            .addData(e.route.geometry);
        this.addLayer(this.routeLayer);
    },

    _highlightRoute: function(e) {
        if (e.route) {
            this.routeHighlightLayer
                .clearLayers()
                .addData(e.route.geometry);
            this.addLayer(this.routeHighlightLayer);
        } else {
            this.removeLayer(this.routeHighlightLayer);
        }
    },

    _highlightStep: function(e) {
        if (e.step) {
            this.stepMarker.setLatLng(L.GeoJSON.coordsToLatLng(e.step.maneuver.location.coordinates));
            this.addLayer(this.stepMarker);
        } else {
            this.removeLayer(this.stepMarker);
        }
    },

    _routePolyline: function() {
        return this.routeLayer.getLayers()[0];
    },

    _findWaypointIndex: function(latLng) {
        var segment = this._findNearestRouteSegment(latLng);

        for (var i = 0; i < this.waypointMarkers.length; i++) {
            var s = this._findNearestRouteSegment(this.waypointMarkers[i].getLatLng());
            if (s > segment) {
                return i;
            }
        }

        return this.waypointMarkers.length;
    },

    _findNearestRouteSegment: function(latLng) {
        var min = Infinity,
            index,
            p = this._map.latLngToLayerPoint(latLng),
            positions = this._routePolyline()._originalPoints;

        for (var i = 1; i < positions.length; i++) {
            var d = L.LineUtil._sqClosestPointOnSegment(p, positions[i - 1], positions[i], true);
            if (d < min) {
                min = d;
                index = i;
            }
        }

        return index;
    },

    _waypointIcon: function() {
        return L.divIcon({
            className: 'mapbox-marker-drag-icon',
            iconSize: new L.Point(12, 12)
        });
    }
});

module.exports = function(directions, options) {
    return new Layer(directions, options);
};

},{"debounce":4}],14:[function(require,module,exports){
'use strict';

var d3post = require('./d3_post');

module.exports = function(url, reqData, callback) {
    return d3post(url, reqData, function (err, resp) {
        if (err && err.type === 'abort') {
            return;
        }

        if (err && !err.responseText) {
            return callback(err);
        }

        resp = resp || err;

        try {
            resp = JSON.parse(resp.response);
            alert("parsed response body in request.js: " + JSON.stringify(resp));
        } catch (e) {
            return callback(new Error(resp));
        }

        if (resp.error) {
            return callback(new Error(resp.error));
        }

        return callback(null, resp);
    });
};

},{"./d3_post":7}],15:[function(require,module,exports){
'use strict';

var d3 = require('../lib/d3'),
    format = require('./format');

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-routes', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('load', function (e) {
        container.html('');

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'mapbox-directions-route');

        routes.append('div')
            .attr('class','mapbox-directions-route-heading')
            .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-details')
            .text(function (route) {
                return format[directions.options.units](route.distance) + ', ' + format.duration(route.duration);
            });

        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.mapbox-directions-route')
            .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};

},{"../lib/d3":2,"./format":10}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvaW5kZXguanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy9tbXJwLmpzL2xpYi9kMy5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvbm9kZV9tb2R1bGVzL2QzLXhoci9idWlsZC94aHIuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy9tbXJwLmpzL25vZGVfbW9kdWxlcy9kZWJvdW5jZS9pbmRleC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvbm9kZV9tb2R1bGVzL3BvbHlsaW5lL3NyYy9wb2x5bGluZS5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvbm9kZV9tb2R1bGVzL3F1ZXVlLWFzeW5jL3F1ZXVlLmpzIiwiL1VzZXJzL3VzZXIvUHJvamVjdHMvbW1ycC5qcy9zcmMvZDNfcG9zdC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvc3JjL2RpcmVjdGlvbnMuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy9tbXJwLmpzL3NyYy9lcnJvcnNfY29udHJvbC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvc3JjL2Zvcm1hdC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvc3JjL2lucHV0X2NvbnRyb2wuanMiLCIvVXNlcnMvdXNlci9Qcm9qZWN0cy9tbXJwLmpzL3NyYy9pbnN0cnVjdGlvbnNfY29udHJvbC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvc3JjL2xheWVyLmpzIiwiL1VzZXJzL3VzZXIvUHJvamVjdHMvbW1ycC5qcy9zcmMvcmVxdWVzdC5qcyIsIi9Vc2Vycy91c2VyL1Byb2plY3RzL21tcnAuanMvc3JjL3JvdXRlc19jb250cm9sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmICghTC5tYXBib3gpIHRocm93IG5ldyBFcnJvcignaW5jbHVkZSBtYXBib3guanMgYmVmb3JlIG1tcnAuanMnKTtcblxuTC5tbXJwID0gcmVxdWlyZSgnLi9zcmMvZGlyZWN0aW9ucycpO1xuTC5tbXJwLmZvcm1hdCA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdCcpO1xuTC5tbXJwLmxheWVyID0gcmVxdWlyZSgnLi9zcmMvbGF5ZXInKTtcbkwubW1ycC5pbnB1dENvbnRyb2wgPSByZXF1aXJlKCcuL3NyYy9pbnB1dF9jb250cm9sJyk7XG5MLm1tcnAuZXJyb3JzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2Vycm9yc19jb250cm9sJyk7XG5MLm1tcnAucm91dGVzQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL3JvdXRlc19jb250cm9sJyk7XG5MLm1tcnAuaW5zdHJ1Y3Rpb25zQ29udHJvbCA9IHJlcXVpcmUoJy4vc3JjL2luc3RydWN0aW9uc19jb250cm9sJyk7XG4iLCIhZnVuY3Rpb24oKXtcbiAgdmFyIGQzID0ge3ZlcnNpb246IFwiMy40LjFcIn07IC8vIHNlbXZlclxudmFyIGQzX2FycmF5U2xpY2UgPSBbXS5zbGljZSxcbiAgICBkM19hcnJheSA9IGZ1bmN0aW9uKGxpc3QpIHsgcmV0dXJuIGQzX2FycmF5U2xpY2UuY2FsbChsaXN0KTsgfTsgLy8gY29udmVyc2lvbiBmb3IgTm9kZUxpc3RzXG5cbnZhciBkM19kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgIGQzX2RvY3VtZW50RWxlbWVudCA9IGQzX2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICBkM193aW5kb3cgPSB3aW5kb3c7XG5cbi8vIFJlZGVmaW5lIGQzX2FycmF5IGlmIHRoZSBicm93c2VyIGRvZXNu4oCZdCBzdXBwb3J0IHNsaWNlLWJhc2VkIGNvbnZlcnNpb24uXG50cnkge1xuICBkM19hcnJheShkM19kb2N1bWVudEVsZW1lbnQuY2hpbGROb2RlcylbMF0ubm9kZVR5cGU7XG59IGNhdGNoKGUpIHtcbiAgZDNfYXJyYXkgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgdmFyIGkgPSBsaXN0Lmxlbmd0aCwgYXJyYXkgPSBuZXcgQXJyYXkoaSk7XG4gICAgd2hpbGUgKGktLSkgYXJyYXlbaV0gPSBsaXN0W2ldO1xuICAgIHJldHVybiBhcnJheTtcbiAgfTtcbn1cbnZhciBkM19zdWJjbGFzcyA9IHt9Ll9fcHJvdG9fXz9cblxuLy8gVW50aWwgRUNNQVNjcmlwdCBzdXBwb3J0cyBhcnJheSBzdWJjbGFzc2luZywgcHJvdG90eXBlIGluamVjdGlvbiB3b3JrcyB3ZWxsLlxuZnVuY3Rpb24ob2JqZWN0LCBwcm90b3R5cGUpIHtcbiAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbn06XG5cbi8vIEFuZCBpZiB5b3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IF9fcHJvdG9fXywgd2UnbGwgdXNlIGRpcmVjdCBleHRlbnNpb24uXG5mdW5jdGlvbihvYmplY3QsIHByb3RvdHlwZSkge1xuICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm90b3R5cGUpIG9iamVjdFtwcm9wZXJ0eV0gPSBwcm90b3R5cGVbcHJvcGVydHldO1xufTtcblxuZnVuY3Rpb24gZDNfdmVuZG9yU3ltYm9sKG9iamVjdCwgbmFtZSkge1xuICBpZiAobmFtZSBpbiBvYmplY3QpIHJldHVybiBuYW1lO1xuICBuYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGQzX3ZlbmRvclByZWZpeGVzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIHZhciBwcmVmaXhOYW1lID0gZDNfdmVuZG9yUHJlZml4ZXNbaV0gKyBuYW1lO1xuICAgIGlmIChwcmVmaXhOYW1lIGluIG9iamVjdCkgcmV0dXJuIHByZWZpeE5hbWU7XG4gIH1cbn1cblxudmFyIGQzX3ZlbmRvclByZWZpeGVzID0gW1wid2Via2l0XCIsIFwibXNcIiwgXCJtb3pcIiwgXCJNb3pcIiwgXCJvXCIsIFwiT1wiXTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uKGdyb3Vwcykge1xuICBkM19zdWJjbGFzcyhncm91cHMsIGQzX3NlbGVjdGlvblByb3RvdHlwZSk7XG4gIHJldHVybiBncm91cHM7XG59XG5cbnZhciBkM19zZWxlY3QgPSBmdW5jdGlvbihzLCBuKSB7IHJldHVybiBuLnF1ZXJ5U2VsZWN0b3Iocyk7IH0sXG4gICAgZDNfc2VsZWN0QWxsID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gbi5xdWVyeVNlbGVjdG9yQWxsKHMpOyB9LFxuICAgIGQzX3NlbGVjdE1hdGNoZXIgPSBkM19kb2N1bWVudEVsZW1lbnRbZDNfdmVuZG9yU3ltYm9sKGQzX2RvY3VtZW50RWxlbWVudCwgXCJtYXRjaGVzU2VsZWN0b3JcIildLFxuICAgIGQzX3NlbGVjdE1hdGNoZXMgPSBmdW5jdGlvbihuLCBzKSB7IHJldHVybiBkM19zZWxlY3RNYXRjaGVyLmNhbGwobiwgcyk7IH07XG5cbi8vIFByZWZlciBTaXp6bGUsIGlmIGF2YWlsYWJsZS5cbmlmICh0eXBlb2YgU2l6emxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgZDNfc2VsZWN0ID0gZnVuY3Rpb24ocywgbikgeyByZXR1cm4gU2l6emxlKHMsIG4pWzBdIHx8IG51bGw7IH07XG4gIGQzX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHMsIG4pIHsgcmV0dXJuIFNpenpsZS51bmlxdWVTb3J0KFNpenpsZShzLCBuKSk7IH07XG4gIGQzX3NlbGVjdE1hdGNoZXMgPSBTaXp6bGUubWF0Y2hlc1NlbGVjdG9yO1xufVxuXG5kMy5zZWxlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvblJvb3Q7XG59O1xuXG52YXIgZDNfc2VsZWN0aW9uUHJvdG90eXBlID0gZDMuc2VsZWN0aW9uLnByb3RvdHlwZSA9IFtdO1xuXG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHN1Ymdyb3Vwcy5wdXNoKHN1Ymdyb3VwID0gW10pO1xuICAgIHN1Ymdyb3VwLnBhcmVudE5vZGUgPSAoZ3JvdXAgPSB0aGlzW2pdKS5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgPSAtMSwgbiA9IGdyb3VwLmxlbmd0aDsgKytpIDwgbjspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChzdWJub2RlID0gc2VsZWN0b3IuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIGlmIChzdWJub2RlICYmIFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgc2VsZWN0b3IgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gdGhpc1tqXSwgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IGQzX2FycmF5KHNlbGVjdG9yLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgaikpKTtcbiAgICAgICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3NlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdEFsbChzZWxlY3RvciwgdGhpcyk7XG4gIH07XG59XG52YXIgZDNfbnNQcmVmaXggPSB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuXG5kMy5ucyA9IHtcbiAgcHJlZml4OiBkM19uc1ByZWZpeCxcbiAgcXVhbGlmeTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gbmFtZS5pbmRleE9mKFwiOlwiKSxcbiAgICAgICAgcHJlZml4ID0gbmFtZTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpKTtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBkM19uc1ByZWZpeC5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpXG4gICAgICAgID8ge3NwYWNlOiBkM19uc1ByZWZpeFtwcmVmaXhdLCBsb2NhbDogbmFtZX1cbiAgICAgICAgOiBuYW1lO1xuICB9XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXG4gICAgLy8gRm9yIGF0dHIoc3RyaW5nKSwgcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgIG5hbWUgPSBkMy5ucy5xdWFsaWZ5KG5hbWUpO1xuICAgICAgcmV0dXJuIG5hbWUubG9jYWxcbiAgICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbClcbiAgICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIH1cblxuICAgIC8vIEZvciBhdHRyKG9iamVjdCksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHRoZVxuICAgIC8vIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmUgZnVuY3Rpb25zIHRoYXQgYXJlXG4gICAgLy8gZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgZm9yICh2YWx1ZSBpbiBuYW1lKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2F0dHIodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fYXR0cihuYW1lLCB2YWx1ZSkge1xuICBuYW1lID0gZDMubnMucXVhbGlmeShuYW1lKTtcblxuICAvLyBGb3IgYXR0cihzdHJpbmcsIG51bGwpLCByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ck51bGwoKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gYXR0ck51bGxOUygpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICB9XG5cbiAgLy8gRm9yIGF0dHIoc3RyaW5nLCBzdHJpbmcpLCBzZXQgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gYXR0ckNvbnN0YW50KCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBhdHRyQ29uc3RhbnROUygpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIEZvciBhdHRyKHN0cmluZywgZnVuY3Rpb24pLCBldmFsdWF0ZSB0aGUgZnVuY3Rpb24gZm9yIGVhY2ggZWxlbWVudCwgYW5kIHNldFxuICAvLyBvciByZW1vdmUgdGhlIGF0dHJpYnV0ZSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICB9XG4gIGZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKCkge1xuICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IChuYW1lLmxvY2FsID8gYXR0ck51bGxOUyA6IGF0dHJOdWxsKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAobmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAobmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSk7XG59XG5mdW5jdGlvbiBkM19jb2xsYXBzZShzKSB7XG4gIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbn1cbmQzLnJlcXVvdGUgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBzLnJlcGxhY2UoZDNfcmVxdW90ZV9yZSwgXCJcXFxcJCZcIik7XG59O1xuXG52YXIgZDNfcmVxdW90ZV9yZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNsYXNzZWQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcblxuICAgIC8vIEZvciBjbGFzc2VkKHN0cmluZyksIHJldHVybiB0cnVlIG9ubHkgaWYgdGhlIGZpcnN0IG5vZGUgaGFzIHRoZSBzcGVjaWZpZWRcbiAgICAvLyBjbGFzcyBvciBjbGFzc2VzLiBOb3RlIHRoYXQgZXZlbiBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBET01Ub2tlbkxpc3QsIGl0XG4gICAgLy8gcHJvYmFibHkgZG9lc24ndCBzdXBwb3J0IGl0IG9uIFNWRyBlbGVtZW50cyAod2hpY2ggY2FuIGJlIGFuaW1hdGVkKS5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCksXG4gICAgICAgICAgbiA9IChuYW1lID0gZDNfc2VsZWN0aW9uX2NsYXNzZXMobmFtZSkpLmxlbmd0aCxcbiAgICAgICAgICBpID0gLTE7XG4gICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCF2YWx1ZS5jb250YWlucyhuYW1lW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWVbaV0pLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGb3IgY2xhc3NlZChvYmplY3QpLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgbmFtZXMgb2YgY2xhc3NlcyB0byBhZGQgb3JcbiAgICAvLyByZW1vdmUuIFRoZSB2YWx1ZXMgbWF5IGJlIGZ1bmN0aW9ucyB0aGF0IGFyZSBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fY2xhc3NlZCh2YWx1ZSwgbmFtZVt2YWx1ZV0pKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYm90aCBhIG5hbWUgYW5kIGEgdmFsdWUgYXJlIHNwZWNpZmllZCwgYW5kIGFyZSBoYW5kbGVkIGFzIGJlbG93LlxuICByZXR1cm4gdGhpcy5lYWNoKGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY2xhc3NlZFJlKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIGQzLnJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VzKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuLy8gTXVsdGlwbGUgY2xhc3MgbmFtZXMgYXJlIGFsbG93ZWQgKGUuZy4sIFwiZm9vIGJhclwiKS5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSB7XG4gIG5hbWUgPSBkM19zZWxlY3Rpb25fY2xhc3NlcyhuYW1lKS5tYXAoZDNfc2VsZWN0aW9uX2NsYXNzZWROYW1lKTtcbiAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcblxuICBmdW5jdGlvbiBjbGFzc2VkQ29uc3RhbnQoKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gaXMgc3RpbGwgZXZhbHVhdGVkIG9ubHkgb25jZSBwZXJcbiAgLy8gZWxlbWVudCBldmVuIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjbGFzcyBuYW1lcy5cbiAgZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gLTEsIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvblxuICAgICAgOiBjbGFzc2VkQ29uc3RhbnQ7XG59XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9jbGFzc2VkTmFtZShuYW1lKSB7XG4gIHZhciByZSA9IGQzX3NlbGVjdGlvbl9jbGFzc2VkUmUobmFtZSk7XG4gIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgIGlmIChjID0gbm9kZS5jbGFzc0xpc3QpIHJldHVybiB2YWx1ZSA/IGMuYWRkKG5hbWUpIDogYy5yZW1vdmUobmFtZSk7XG4gICAgdmFyIGMgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgaWYgKCFyZS50ZXN0KGMpKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGQzX2NvbGxhcHNlKGMgKyBcIiBcIiArIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkM19jb2xsYXBzZShjLnJlcGxhY2UocmUsIFwiIFwiKSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnN0eWxlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igc3R5bGUob2JqZWN0KSBvciBzdHlsZShvYmplY3QsIHN0cmluZyksIHRoZSBvYmplY3Qgc3BlY2lmaWVzIHRoZVxuICAgIC8vIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IG9yIHJlbW92ZS4gVGhlIHZhbHVlcyBtYXkgYmVcbiAgICAvLyBmdW5jdGlvbnMgdGhhdCBhcmUgZXZhbHVhdGVkIGZvciBlYWNoIGVsZW1lbnQuIFRoZSBvcHRpb25hbCBzdHJpbmdcbiAgICAvLyBzcGVjaWZpZXMgdGhlIHByaW9yaXR5LlxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgaWYgKG4gPCAyKSB2YWx1ZSA9IFwiXCI7XG4gICAgICBmb3IgKHByaW9yaXR5IGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fc3R5bGUocHJpb3JpdHksIG5hbWVbcHJpb3JpdHldLCB2YWx1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZyksIHJldHVybiB0aGUgY29tcHV0ZWQgc3R5bGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBub2RlLlxuICAgIGlmIChuIDwgMikgcmV0dXJuIGQzX3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMubm9kZSgpLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gICAgLy8gRm9yIHN0eWxlKHN0cmluZywgc3RyaW5nKSBvciBzdHlsZShzdHJpbmcsIGZ1bmN0aW9uKSwgdXNlIHRoZSBkZWZhdWx0XG4gICAgLy8gcHJpb3JpdHkuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkIGZvciBzdHlsZShzdHJpbmcsIG51bGwpLlxuICAgIHByaW9yaXR5ID0gXCJcIjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSBuYW1lLCB2YWx1ZSBhbmQgcHJpb3JpdHkgYXJlIHNwZWNpZmllZCwgYW5kIGhhbmRsZWQgYXMgYmVsb3cuXG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBudWxsKSBvciBzdHlsZShuYW1lLCBudWxsLCBwcmlvcml0eSksIHJlbW92ZSB0aGUgc3R5bGVcbiAgLy8gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuIFRoZSBwcmlvcml0eSBpcyBpZ25vcmVkLlxuICBmdW5jdGlvbiBzdHlsZU51bGwoKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBzdHJpbmcpIG9yIHN0eWxlKG5hbWUsIHN0cmluZywgcHJpb3JpdHkpLCBzZXQgdGhlIHN0eWxlXG4gIC8vIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lLCB1c2luZyB0aGUgc3BlY2lmaWVkIHByaW9yaXR5LlxuICBmdW5jdGlvbiBzdHlsZUNvbnN0YW50KCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfVxuXG4gIC8vIEZvciBzdHlsZShuYW1lLCBmdW5jdGlvbikgb3Igc3R5bGUobmFtZSwgZnVuY3Rpb24sIHByaW9yaXR5KSwgZXZhbHVhdGUgdGhlXG4gIC8vIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZCBzZXQgb3IgcmVtb3ZlIHRoZSBzdHlsZSBwcm9wZXJ0eSBhc1xuICAvLyBhcHByb3ByaWF0ZS4gV2hlbiBzZXR0aW5nLCB1c2UgdGhlIHNwZWNpZmllZCBwcmlvcml0eS5cbiAgZnVuY3Rpb24gc3R5bGVGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gc3R5bGVOdWxsIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHN0eWxlRnVuY3Rpb24gOiBzdHlsZUNvbnN0YW50KTtcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cbiAgICAvLyBGb3IgcHJvcGVydHkoc3RyaW5nKSwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiKSByZXR1cm4gdGhpcy5ub2RlKClbbmFtZV07XG5cbiAgICAvLyBGb3IgcHJvcGVydHkob2JqZWN0KSwgdGhlIG9iamVjdCBzcGVjaWZpZXMgdGhlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgdGhlXG4gICAgLy8gcHJvcGVydGllcyB0byBzZXQgb3IgcmVtb3ZlLiBUaGUgdmFsdWVzIG1heSBiZSBmdW5jdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBldmFsdWF0ZWQgZm9yIGVhY2ggZWxlbWVudC5cbiAgICBmb3IgKHZhbHVlIGluIG5hbWUpIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkodmFsdWUsIG5hbWVbdmFsdWVdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIGJvdGggYSBuYW1lIGFuZCBhIHZhbHVlIGFyZSBzcGVjaWZpZWQsIGFuZCBhcmUgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fcHJvcGVydHkobmFtZSwgdmFsdWUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9wcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuXG4gIC8vIEZvciBwcm9wZXJ0eShuYW1lLCBudWxsKSwgcmVtb3ZlIHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlOdWxsKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIHN0cmluZyksIHNldCB0aGUgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG4gIGZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQoKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gRm9yIHByb3BlcnR5KG5hbWUsIGZ1bmN0aW9uKSwgZXZhbHVhdGUgdGhlIGZ1bmN0aW9uIGZvciBlYWNoIGVsZW1lbnQsIGFuZFxuICAvLyBzZXQgb3IgcmVtb3ZlIHRoZSBwcm9wZXJ0eSBhcyBhcHByb3ByaWF0ZS5cbiAgZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0geDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IHByb3BlcnR5TnVsbCA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uIDogcHJvcGVydHlDb25zdGFudCk7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGZ1bmN0aW9uKCkgeyB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMudGV4dENvbnRlbnQgPSBcIlwiOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7IH0pXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmh0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZnVuY3Rpb24oKSB7IHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjsgfSA6IHZhbHVlID09IG51bGxcbiAgICAgID8gZnVuY3Rpb24oKSB7IHRoaXMuaW5uZXJIVE1MID0gXCJcIjsgfVxuICAgICAgOiBmdW5jdGlvbigpIHsgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTsgfSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQobmFtZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fY3JlYXRvcihuYW1lKSB7XG4gIHJldHVybiB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZVxuICAgICAgOiAobmFtZSA9IGQzLm5zLnF1YWxpZnkobmFtZSkpLmxvY2FsID8gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpOyB9XG4gICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5hbWVzcGFjZVVSSSwgbmFtZSk7IH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgbmFtZSA9IGQzX3NlbGVjdGlvbl9jcmVhdG9yKG5hbWUpO1xuICBiZWZvcmUgPSBkM19zZWxlY3Rpb25fc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShuYW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIGJlZm9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn07XG5cbi8vIFRPRE8gcmVtb3ZlKHNlbGVjdG9yKT9cbi8vIFRPRE8gcmVtb3ZlKG5vZGUpP1xuLy8gVE9ETyByZW1vdmUoZnVuY3Rpb24pP1xuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBkM19jbGFzcyhjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdG9yLnByb3RvdHlwZSwga2V5LCB7XG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzW2tleV0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjdG9yLnByb3RvdHlwZSA9IHByb3BlcnRpZXM7XG4gIH1cbn1cblxuZDMubWFwID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBtYXAgPSBuZXcgZDNfTWFwO1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgZDNfTWFwKSBvYmplY3QuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7IG1hcC5zZXQoa2V5LCB2YWx1ZSk7IH0pO1xuICBlbHNlIGZvciAodmFyIGtleSBpbiBvYmplY3QpIG1hcC5zZXQoa2V5LCBvYmplY3Rba2V5XSk7XG4gIHJldHVybiBtYXA7XG59O1xuXG5mdW5jdGlvbiBkM19NYXAoKSB7fVxuXG5kM19jbGFzcyhkM19NYXAsIHtcbiAgaGFzOiBkM19tYXBfaGFzLFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzW2QzX21hcF9wcmVmaXggKyBrZXldO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1tkM19tYXBfcHJlZml4ICsga2V5XSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGQzX21hcF9yZW1vdmUsXG4gIGtleXM6IGQzX21hcF9rZXlzLFxuICB2YWx1ZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyB2YWx1ZXMucHVzaCh2YWx1ZSk7IH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0sXG4gIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgZW50cmllcy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlfSk7IH0pO1xuICAgIHJldHVybiBlbnRyaWVzO1xuICB9LFxuICBzaXplOiBkM19tYXBfc2l6ZSxcbiAgZW1wdHk6IGQzX21hcF9lbXB0eSxcbiAgZm9yRWFjaDogZnVuY3Rpb24oZikge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSBmLmNhbGwodGhpcywga2V5LnN1YnN0cmluZygxKSwgdGhpc1trZXldKTtcbiAgfVxufSk7XG5cbnZhciBkM19tYXBfcHJlZml4ID0gXCJcXDBcIiwgLy8gcHJldmVudCBjb2xsaXNpb24gd2l0aCBidWlsdC1pbnNcbiAgICBkM19tYXBfcHJlZml4Q29kZSA9IGQzX21hcF9wcmVmaXguY2hhckNvZGVBdCgwKTtcblxuZnVuY3Rpb24gZDNfbWFwX2hhcyhrZXkpIHtcbiAgcmV0dXJuIGQzX21hcF9wcmVmaXggKyBrZXkgaW4gdGhpcztcbn1cblxuZnVuY3Rpb24gZDNfbWFwX3JlbW92ZShrZXkpIHtcbiAga2V5ID0gZDNfbWFwX3ByZWZpeCArIGtleTtcbiAgcmV0dXJuIGtleSBpbiB0aGlzICYmIGRlbGV0ZSB0aGlzW2tleV07XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9rZXlzKCkge1xuICB2YXIga2V5cyA9IFtdO1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7IGtleXMucHVzaChrZXkpOyB9KTtcbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIGQzX21hcF9zaXplKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSArK3NpemU7XG4gIHJldHVybiBzaXplO1xufVxuXG5mdW5jdGlvbiBkM19tYXBfZW1wdHkoKSB7XG4gIGZvciAodmFyIGtleSBpbiB0aGlzKSBpZiAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IGQzX21hcF9wcmVmaXhDb2RlKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgdmFyIGkgPSAtMSxcbiAgICAgIG4gPSB0aGlzLmxlbmd0aCxcbiAgICAgIGdyb3VwLFxuICAgICAgbm9kZTtcblxuICAvLyBJZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgZmlyc3QgdmFsdWUuXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHZhbHVlID0gbmV3IEFycmF5KG4gPSAoZ3JvdXAgPSB0aGlzWzBdKS5sZW5ndGgpO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHZhbHVlW2ldID0gbm9kZS5fX2RhdGFfXztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZChncm91cCwgZ3JvdXBEYXRhKSB7XG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG0gPSBncm91cERhdGEubGVuZ3RoLFxuICAgICAgICBuMCA9IE1hdGgubWluKG4sIG0pLFxuICAgICAgICB1cGRhdGVOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZW50ZXJOb2RlcyA9IG5ldyBBcnJheShtKSxcbiAgICAgICAgZXhpdE5vZGVzID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBub2RlLFxuICAgICAgICBub2RlRGF0YTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciBub2RlQnlLZXlWYWx1ZSA9IG5ldyBkM19NYXAsXG4gICAgICAgICAgZGF0YUJ5S2V5VmFsdWUgPSBuZXcgZDNfTWFwLFxuICAgICAgICAgIGtleVZhbHVlcyA9IFtdLFxuICAgICAgICAgIGtleVZhbHVlO1xuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlID0gZ3JvdXBbaV0sIG5vZGUuX19kYXRhX18sIGkpO1xuICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICAgIGV4aXROb2Rlc1tpXSA9IG5vZGU7IC8vIGR1cGxpY2F0ZSBzZWxlY3Rpb24ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlWYWx1ZXMucHVzaChrZXlWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IC0xOyArK2kgPCBtOykge1xuICAgICAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKGdyb3VwRGF0YSwgbm9kZURhdGEgPSBncm91cERhdGFbaV0sIGkpO1xuICAgICAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IG5vZGVEYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKCFkYXRhQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7IC8vIG5vIGR1cGxpY2F0ZSBkYXRhIGtleVxuICAgICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUobm9kZURhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZURhdGEpO1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5yZW1vdmUoa2V5VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAtMTsgKytpIDwgbjspIHtcbiAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgZXhpdE5vZGVzW2ldID0gZ3JvdXBbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gLTE7ICsraSA8IG4wOykge1xuICAgICAgICBub2RlID0gZ3JvdXBbaV07XG4gICAgICAgIG5vZGVEYXRhID0gZ3JvdXBEYXRhW2ldO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBub2RlRGF0YTtcbiAgICAgICAgICB1cGRhdGVOb2Rlc1tpXSA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50ZXJOb2Rlc1tpXSA9IGQzX3NlbGVjdGlvbl9kYXRhTm9kZShub2RlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbTsgKytpKSB7XG4gICAgICAgIGVudGVyTm9kZXNbaV0gPSBkM19zZWxlY3Rpb25fZGF0YU5vZGUoZ3JvdXBEYXRhW2ldKTtcbiAgICAgIH1cbiAgICAgIGZvciAoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGV4aXROb2Rlc1tpXSA9IGdyb3VwW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyTm9kZXMudXBkYXRlXG4gICAgICAgID0gdXBkYXRlTm9kZXM7XG5cbiAgICBlbnRlck5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSB1cGRhdGVOb2Rlcy5wYXJlbnROb2RlXG4gICAgICAgID0gZXhpdE5vZGVzLnBhcmVudE5vZGVcbiAgICAgICAgPSBncm91cC5wYXJlbnROb2RlO1xuXG4gICAgZW50ZXIucHVzaChlbnRlck5vZGVzKTtcbiAgICB1cGRhdGUucHVzaCh1cGRhdGVOb2Rlcyk7XG4gICAgZXhpdC5wdXNoKGV4aXROb2Rlcyk7XG4gIH1cblxuICB2YXIgZW50ZXIgPSBkM19zZWxlY3Rpb25fZW50ZXIoW10pLFxuICAgICAgdXBkYXRlID0gZDNfc2VsZWN0aW9uKFtdKSxcbiAgICAgIGV4aXQgPSBkM19zZWxlY3Rpb24oW10pO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBiaW5kKGdyb3VwID0gdGhpc1tpXSwgdmFsdWUuY2FsbChncm91cCwgZ3JvdXAucGFyZW50Tm9kZS5fX2RhdGFfXywgaSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgYmluZChncm91cCA9IHRoaXNbaV0sIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUuZW50ZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGVudGVyOyB9O1xuICB1cGRhdGUuZXhpdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gZXhpdDsgfTtcbiAgcmV0dXJuIHVwZGF0ZTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9kYXRhTm9kZShkYXRhKSB7XG4gIHJldHVybiB7X19kYXRhX186IGRhdGF9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgdmFyIHN1Ymdyb3VwcyA9IFtdLFxuICAgICAgc3ViZ3JvdXAsXG4gICAgICBncm91cCxcbiAgICAgIG5vZGU7XG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZDNfc2VsZWN0aW9uX2ZpbHRlcihmaWx0ZXIpO1xuXG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBzdWJncm91cHMucHVzaChzdWJncm91cCA9IFtdKTtcbiAgICBzdWJncm91cC5wYXJlbnROb2RlID0gKGdyb3VwID0gdGhpc1tqXSkucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIGZpbHRlci5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihzdWJncm91cHMpO1xufTtcblxuZnVuY3Rpb24gZDNfc2VsZWN0aW9uX2ZpbHRlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGQzX3NlbGVjdE1hdGNoZXModGhpcywgc2VsZWN0b3IpO1xuICB9O1xufVxuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUub3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcbmQzLmFzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufTtcblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gIGNvbXBhcmF0b3IgPSBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB0aGlzW2pdLnNvcnQoY29tcGFyYXRvcik7XG4gIHJldHVybiB0aGlzLm9yZGVyKCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fc29ydENvbXBhcmF0b3IoY29tcGFyYXRvcikge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIGNvbXBhcmF0b3IgPSBkMy5hc2NlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9O1xufVxuZnVuY3Rpb24gZDNfbm9vcCgpIHt9XG5cbmQzLmRpc3BhdGNoID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXNwYXRjaCA9IG5ldyBkM19kaXNwYXRjaCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgZGlzcGF0Y2hbYXJndW1lbnRzW2ldXSA9IGQzX2Rpc3BhdGNoX2V2ZW50KGRpc3BhdGNoKTtcbiAgcmV0dXJuIGRpc3BhdGNoO1xufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2goKSB7fVxuXG5kM19kaXNwYXRjaC5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgaSA9IHR5cGUuaW5kZXhPZihcIi5cIiksXG4gICAgICBuYW1lID0gXCJcIjtcblxuICAvLyBFeHRyYWN0IG9wdGlvbmFsIG5hbWVzcGFjZSwgZS5nLiwgXCJjbGljay5mb29cIlxuICBpZiAoaSA+PSAwKSB7XG4gICAgbmFtZSA9IHR5cGUuc3Vic3RyaW5nKGkgKyAxKTtcbiAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaSk7XG4gIH1cblxuICBpZiAodHlwZSkgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICA/IHRoaXNbdHlwZV0ub24obmFtZSlcbiAgICAgIDogdGhpc1t0eXBlXS5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICBpZiAobGlzdGVuZXIgPT0gbnVsbCkgZm9yICh0eXBlIGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHR5cGUpKSB0aGlzW3R5cGVdLm9uKG5hbWUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuZnVuY3Rpb24gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpIHtcbiAgdmFyIGxpc3RlbmVycyA9IFtdLFxuICAgICAgbGlzdGVuZXJCeU5hbWUgPSBuZXcgZDNfTWFwO1xuXG4gIGZ1bmN0aW9uIGV2ZW50KCkge1xuICAgIHZhciB6ID0gbGlzdGVuZXJzLCAvLyBkZWZlbnNpdmUgcmVmZXJlbmNlXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IHoubGVuZ3RoLFxuICAgICAgICBsO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAobCA9IHpbaV0ub24pIGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH1cblxuICBldmVudC5vbiA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGwgPSBsaXN0ZW5lckJ5TmFtZS5nZXQobmFtZSksXG4gICAgICAgIGk7XG5cbiAgICAvLyByZXR1cm4gdGhlIGN1cnJlbnQgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGwgJiYgbC5vbjtcblxuICAgIC8vIHJlbW92ZSB0aGUgb2xkIGxpc3RlbmVyLCBpZiBhbnkgKHdpdGggY29weS1vbi13cml0ZSlcbiAgICBpZiAobCkge1xuICAgICAgbC5vbiA9IG51bGw7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuc2xpY2UoMCwgaSA9IGxpc3RlbmVycy5pbmRleE9mKGwpKS5jb25jYXQobGlzdGVuZXJzLnNsaWNlKGkgKyAxKSk7XG4gICAgICBsaXN0ZW5lckJ5TmFtZS5yZW1vdmUobmFtZSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBuZXcgbGlzdGVuZXIsIGlmIGFueVxuICAgIGlmIChsaXN0ZW5lcikgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXJCeU5hbWUuc2V0KG5hbWUsIHtvbjogbGlzdGVuZXJ9KSk7XG5cbiAgICByZXR1cm4gZGlzcGF0Y2g7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5kMy5ldmVudCA9IG51bGw7XG5cbmZ1bmN0aW9uIGQzX2V2ZW50UHJldmVudERlZmF1bHQoKSB7XG4gIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIGQzX2V2ZW50U291cmNlKCkge1xuICB2YXIgZSA9IGQzLmV2ZW50LCBzO1xuICB3aGlsZSAocyA9IGUuc291cmNlRXZlbnQpIGUgPSBzO1xuICByZXR1cm4gZTtcbn1cblxuLy8gTGlrZSBkMy5kaXNwYXRjaCwgYnV0IGZvciBjdXN0b20gZXZlbnRzIGFic3RyYWN0aW5nIG5hdGl2ZSBVSSBldmVudHMuIFRoZXNlXG4vLyBldmVudHMgaGF2ZSBhIHRhcmdldCBjb21wb25lbnQgKHN1Y2ggYXMgYSBicnVzaCksIGEgdGFyZ2V0IGVsZW1lbnQgKHN1Y2ggYXNcbi8vIHRoZSBzdmc6ZyBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGJydXNoKSBhbmQgdGhlIHN0YW5kYXJkIGFyZ3VtZW50cyBgZGAgKHRoZVxuLy8gdGFyZ2V0IGVsZW1lbnQncyBkYXRhKSBhbmQgYGlgICh0aGUgc2VsZWN0aW9uIGluZGV4IG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuXG5mdW5jdGlvbiBkM19ldmVudERpc3BhdGNoKHRhcmdldCkge1xuICB2YXIgZGlzcGF0Y2ggPSBuZXcgZDNfZGlzcGF0Y2gsXG4gICAgICBpID0gMCxcbiAgICAgIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2kgPCBuKSBkaXNwYXRjaFthcmd1bWVudHNbaV1dID0gZDNfZGlzcGF0Y2hfZXZlbnQoZGlzcGF0Y2gpO1xuXG4gIC8vIENyZWF0ZXMgYSBkaXNwYXRjaCBjb250ZXh0IGZvciB0aGUgc3BlY2lmaWVkIGB0aGl6YCAodHlwaWNhbGx5LCB0aGUgdGFyZ2V0XG4gIC8vIERPTSBlbGVtZW50IHRoYXQgcmVjZWl2ZWQgdGhlIHNvdXJjZSBldmVudCkgYW5kIGBhcmd1bWVudHpgICh0eXBpY2FsbHksIHRoZVxuICAvLyBkYXRhIGBkYCBhbmQgaW5kZXggYGlgIG9mIHRoZSB0YXJnZXQgZWxlbWVudCkuIFRoZSByZXR1cm5lZCBmdW5jdGlvbiBjYW4gYmVcbiAgLy8gdXNlZCB0byBkaXNwYXRjaCBhbiBldmVudCB0byBhbnkgcmVnaXN0ZXJlZCBsaXN0ZW5lcnM7IHRoZSBmdW5jdGlvbiB0YWtlcyBhXG4gIC8vIHNpbmdsZSBhcmd1bWVudCBhcyBpbnB1dCwgYmVpbmcgdGhlIGV2ZW50IHRvIGRpc3BhdGNoLiBUaGUgZXZlbnQgbXVzdCBoYXZlXG4gIC8vIGEgXCJ0eXBlXCIgYXR0cmlidXRlIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdHlwZSByZWdpc3RlcmVkIGluIHRoZVxuICAvLyBjb25zdHJ1Y3Rvci4gVGhpcyBjb250ZXh0IHdpbGwgYXV0b21hdGljYWxseSBwb3B1bGF0ZSB0aGUgXCJzb3VyY2VFdmVudFwiIGFuZFxuICAvLyBcInRhcmdldFwiIGF0dHJpYnV0ZXMgb2YgdGhlIGV2ZW50LCBhcyB3ZWxsIGFzIHNldHRpbmcgdGhlIGBkMy5ldmVudGAgZ2xvYmFsXG4gIC8vIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiAgZGlzcGF0Y2gub2YgPSBmdW5jdGlvbih0aGl6LCBhcmd1bWVudHopIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZTEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBlMCA9XG4gICAgICAgIGUxLnNvdXJjZUV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgIGUxLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZDMuZXZlbnQgPSBlMTtcbiAgICAgICAgZGlzcGF0Y2hbZTEudHlwZV0uYXBwbHkodGhpeiwgYXJndW1lbnR6KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGQzLmV2ZW50ID0gZTA7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gZGlzcGF0Y2g7XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgaWYgKG4gPCAzKSB7XG5cbiAgICAvLyBGb3Igb24ob2JqZWN0KSBvciBvbihvYmplY3QsIGJvb2xlYW4pLCB0aGUgb2JqZWN0IHNwZWNpZmllcyB0aGUgZXZlbnRcbiAgICAvLyB0eXBlcyBhbmQgbGlzdGVuZXJzIHRvIGFkZCBvciByZW1vdmUuIFRoZSBvcHRpb25hbCBib29sZWFuIHNwZWNpZmllc1xuICAgIC8vIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGNhcHR1cmVzIGV2ZW50cy5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChuIDwgMikgbGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgIGZvciAoY2FwdHVyZSBpbiB0eXBlKSB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX29uKGNhcHR1cmUsIHR5cGVbY2FwdHVyZV0sIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nKSwgcmV0dXJuIHRoZSBsaXN0ZW5lciBmb3IgdGhlIGZpcnN0IG5vZGUuXG4gICAgaWYgKG4gPCAyKSByZXR1cm4gKG4gPSB0aGlzLm5vZGUoKVtcIl9fb25cIiArIHR5cGVdKSAmJiBuLl87XG5cbiAgICAvLyBGb3Igb24oc3RyaW5nLCBmdW5jdGlvbiksIHVzZSB0aGUgZGVmYXVsdCBjYXB0dXJlLlxuICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgYSB0eXBlLCBsaXN0ZW5lciBhbmQgY2FwdHVyZSBhcmUgc3BlY2lmaWVkLCBhbmQgaGFuZGxlZCBhcyBiZWxvdy5cbiAgcmV0dXJuIHRoaXMuZWFjaChkM19zZWxlY3Rpb25fb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpKTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICB2YXIgbmFtZSA9IFwiX19vblwiICsgdHlwZSxcbiAgICAgIGkgPSB0eXBlLmluZGV4T2YoXCIuXCIpLFxuICAgICAgd3JhcCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyO1xuXG4gIGlmIChpID4gMCkgdHlwZSA9IHR5cGUuc3Vic3RyaW5nKDAsIGkpO1xuICB2YXIgZmlsdGVyID0gZDNfc2VsZWN0aW9uX29uRmlsdGVycy5nZXQodHlwZSk7XG4gIGlmIChmaWx0ZXIpIHR5cGUgPSBmaWx0ZXIsIHdyYXAgPSBkM19zZWxlY3Rpb25fb25GaWx0ZXI7XG5cbiAgZnVuY3Rpb24gb25SZW1vdmUoKSB7XG4gICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgIGlmIChsKSB7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbCwgbC4kKTtcbiAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uQWRkKCkge1xuICAgIHZhciBsID0gd3JhcChsaXN0ZW5lciwgZDNfYXJyYXkoYXJndW1lbnRzKSk7XG4gICAgb25SZW1vdmUuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpc1tuYW1lXSA9IGwsIGwuJCA9IGNhcHR1cmUpO1xuICAgIGwuXyA9IGxpc3RlbmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsKCkge1xuICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJeX19vbihbXi5dKylcIiArIGQzLnJlcXVvdGUodHlwZSkgKyBcIiRcIiksXG4gICAgICAgIG1hdGNoO1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgaWYgKG1hdGNoID0gbmFtZS5tYXRjaChyZSkpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuJCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpXG4gICAgICA/IGxpc3RlbmVyID8gb25BZGQgOiBvblJlbW92ZVxuICAgICAgOiBsaXN0ZW5lciA/IGQzX25vb3AgOiByZW1vdmVBbGw7XG59XG5cbnZhciBkM19zZWxlY3Rpb25fb25GaWx0ZXJzID0gZDMubWFwKHtcbiAgbW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcbiAgbW91c2VsZWF2ZTogXCJtb3VzZW91dFwiXG59KTtcblxuZDNfc2VsZWN0aW9uX29uRmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgaWYgKFwib25cIiArIGsgaW4gZDNfZG9jdW1lbnQpIGQzX3NlbGVjdGlvbl9vbkZpbHRlcnMucmVtb3ZlKGspO1xufSk7XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgbyA9IGQzLmV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgIGQzLmV2ZW50ID0gZTtcbiAgICBhcmd1bWVudHpbMF0gPSB0aGlzLl9fZGF0YV9fO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHopO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkMy5ldmVudCA9IG87XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fb25GaWx0ZXIobGlzdGVuZXIsIGFyZ3VtZW50eikge1xuICB2YXIgbCA9IGQzX3NlbGVjdGlvbl9vbkxpc3RlbmVyKGxpc3RlbmVyLCBhcmd1bWVudHopO1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLCByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xuICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGFyZ2V0ICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0YXJnZXQpICYgOCkpKSB7XG4gICAgICBsLmNhbGwodGFyZ2V0LCBlKTtcbiAgICB9XG4gIH07XG59XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbl9lYWNoKHRoaXMsIGZ1bmN0aW9uKG5vZGUsIGksIGopIHtcbiAgICBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGopO1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lYWNoKGdyb3VwcywgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgaSsrKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjayhub2RlLCBpLCBqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGdyb3Vwcztcbn1cblxuZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgYXJncyA9IGQzX2FycmF5KGFyZ3VtZW50cyk7XG4gIGNhbGxiYWNrLmFwcGx5KGFyZ3NbMF0gPSB0aGlzLCBhcmdzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGogPSAwLCBtID0gdGhpcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IHRoaXNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuID0gMDtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK247IH0pO1xuICByZXR1cm4gbjtcbn07XG5cbmZ1bmN0aW9uIGQzX3NlbGVjdGlvbl9lbnRlcihzZWxlY3Rpb24pIHtcbiAgZDNfc3ViY2xhc3Moc2VsZWN0aW9uLCBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUpO1xuICByZXR1cm4gc2VsZWN0aW9uO1xufVxuXG52YXIgZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlID0gW107XG5cbmQzLnNlbGVjdGlvbi5lbnRlciA9IGQzX3NlbGVjdGlvbl9lbnRlcjtcbmQzLnNlbGVjdGlvbi5lbnRlci5wcm90b3R5cGUgPSBkM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGU7XG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5hcHBlbmQgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUuYXBwZW5kO1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLmVtcHR5ID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmVtcHR5O1xuZDNfc2VsZWN0aW9uX2VudGVyUHJvdG90eXBlLm5vZGUgPSBkM19zZWxlY3Rpb25Qcm90b3R5cGUubm9kZTtcbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5jYWxsID0gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmNhbGw7XG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuc2l6ZSA9IGQzX3NlbGVjdGlvblByb3RvdHlwZS5zaXplO1xuXG5cbmQzX3NlbGVjdGlvbl9lbnRlclByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICB2YXIgc3ViZ3JvdXBzID0gW10sXG4gICAgICBzdWJncm91cCxcbiAgICAgIHN1Ym5vZGUsXG4gICAgICB1cGdyb3VwLFxuICAgICAgZ3JvdXAsXG4gICAgICBub2RlO1xuXG4gIGZvciAodmFyIGogPSAtMSwgbSA9IHRoaXMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIHVwZ3JvdXAgPSAoZ3JvdXAgPSB0aGlzW2pdKS51cGRhdGU7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgc3ViZ3JvdXAucGFyZW50Tm9kZSA9IGdyb3VwLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSA9IC0xLCBuID0gZ3JvdXAubGVuZ3RoOyArK2kgPCBuOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKHVwZ3JvdXBbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuY2FsbChncm91cC5wYXJlbnROb2RlLCBub2RlLl9fZGF0YV9fLCBpLCBqKSk7XG4gICAgICAgIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZDNfc2VsZWN0aW9uKHN1Ymdyb3Vwcyk7XG59O1xuXG5kM19zZWxlY3Rpb25fZW50ZXJQcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgYmVmb3JlID0gZDNfc2VsZWN0aW9uX2VudGVySW5zZXJ0QmVmb3JlKHRoaXMpO1xuICByZXR1cm4gZDNfc2VsZWN0aW9uUHJvdG90eXBlLmluc2VydC5jYWxsKHRoaXMsIG5hbWUsIGJlZm9yZSk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25fZW50ZXJJbnNlcnRCZWZvcmUoZW50ZXIpIHtcbiAgdmFyIGkwLCBqMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKGQsIGksIGopIHtcbiAgICB2YXIgZ3JvdXAgPSBlbnRlcltqXS51cGRhdGUsXG4gICAgICAgIG4gPSBncm91cC5sZW5ndGgsXG4gICAgICAgIG5vZGU7XG4gICAgaWYgKGogIT0gajApIGowID0gaiwgaTAgPSAwO1xuICAgIGlmIChpID49IGkwKSBpMCA9IGkgKyAxO1xuICAgIHdoaWxlICghKG5vZGUgPSBncm91cFtpMF0pICYmICsraTAgPCBuKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbn1cblxuLy8gaW1wb3J0IFwiLi4vdHJhbnNpdGlvbi90cmFuc2l0aW9uXCI7XG5cbmQzX3NlbGVjdGlvblByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpZCA9IGQzX3RyYW5zaXRpb25Jbmhlcml0SWQgfHwgKytkM190cmFuc2l0aW9uSWQsXG4gICAgICBzdWJncm91cHMgPSBbXSxcbiAgICAgIHN1Ymdyb3VwLFxuICAgICAgbm9kZSxcbiAgICAgIHRyYW5zaXRpb24gPSBkM190cmFuc2l0aW9uSW5oZXJpdCB8fCB7dGltZTogRGF0ZS5ub3coKSwgZWFzZTogZDNfZWFzZV9jdWJpY0luT3V0LCBkZWxheTogMCwgZHVyYXRpb246IDI1MH07XG5cbiAgZm9yICh2YXIgaiA9IC0xLCBtID0gdGhpcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgc3ViZ3JvdXBzLnB1c2goc3ViZ3JvdXAgPSBbXSk7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSB0aGlzW2pdLCBpID0gLTEsIG4gPSBncm91cC5sZW5ndGg7ICsraSA8IG47KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBkM190cmFuc2l0aW9uTm9kZShub2RlLCBpLCBpZCwgdHJhbnNpdGlvbik7XG4gICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkM190cmFuc2l0aW9uKHN1Ymdyb3VwcywgaWQpO1xufTtcbi8vIGltcG9ydCBcIi4uL3RyYW5zaXRpb24vdHJhbnNpdGlvblwiO1xuXG5kM19zZWxlY3Rpb25Qcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZDNfc2VsZWN0aW9uX2ludGVycnVwdCk7XG59O1xuXG5mdW5jdGlvbiBkM19zZWxlY3Rpb25faW50ZXJydXB0KCkge1xuICB2YXIgbG9jayA9IHRoaXMuX190cmFuc2l0aW9uX187XG4gIGlmIChsb2NrKSArK2xvY2suYWN0aXZlO1xufVxuXG4vLyBUT0RPIGZhc3Qgc2luZ2xldG9uIGltcGxlbWVudGF0aW9uP1xuZDMuc2VsZWN0ID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgZ3JvdXAgPSBbdHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3Qobm9kZSwgZDNfZG9jdW1lbnQpIDogbm9kZV07XG4gIGdyb3VwLnBhcmVudE5vZGUgPSBkM19kb2N1bWVudEVsZW1lbnQ7XG4gIHJldHVybiBkM19zZWxlY3Rpb24oW2dyb3VwXSk7XG59O1xuXG5kMy5zZWxlY3RBbGwgPSBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgZ3JvdXAgPSBkM19hcnJheSh0eXBlb2Ygbm9kZXMgPT09IFwic3RyaW5nXCIgPyBkM19zZWxlY3RBbGwobm9kZXMsIGQzX2RvY3VtZW50KSA6IG5vZGVzKTtcbiAgZ3JvdXAucGFyZW50Tm9kZSA9IGQzX2RvY3VtZW50RWxlbWVudDtcbiAgcmV0dXJuIGQzX3NlbGVjdGlvbihbZ3JvdXBdKTtcbn07XG5cbnZhciBkM19zZWxlY3Rpb25Sb290ID0gZDMuc2VsZWN0KGQzX2RvY3VtZW50RWxlbWVudCk7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShkMyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZDM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kMyA9IGQzO1xuICB9XG59KCk7XG4iLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLnhociA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgZHN2ID0gZnVuY3Rpb24oZGVsaW1pdGVyKSB7XG4gICAgdmFyIHJlRm9ybWF0ID0gbmV3IFJlZ0V4cChcIltcXFwiXCIgKyBkZWxpbWl0ZXIgKyBcIlxcbl1cIiksXG4gICAgICAgIGRlbGltaXRlckNvZGUgPSBkZWxpbWl0ZXIuY2hhckNvZGVBdCgwKTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlKHRleHQsIGYpIHtcbiAgICAgIHZhciBvO1xuICAgICAgcmV0dXJuIHBhcnNlUm93cyh0ZXh0LCBmdW5jdGlvbihyb3csIGkpIHtcbiAgICAgICAgaWYgKG8pIHJldHVybiBvKHJvdywgaSAtIDEpO1xuICAgICAgICB2YXIgYSA9IG5ldyBGdW5jdGlvbihcImRcIiwgXCJyZXR1cm4ge1wiICsgcm93Lm1hcChmdW5jdGlvbihuYW1lLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgXCI6IGRbXCIgKyBpICsgXCJdXCI7XG4gICAgICAgIH0pLmpvaW4oXCIsXCIpICsgXCJ9XCIpO1xuICAgICAgICBvID0gZiA/IGZ1bmN0aW9uKHJvdywgaSkgeyByZXR1cm4gZihhKHJvdyksIGkpOyB9IDogYTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUm93cyh0ZXh0LCBmKSB7XG4gICAgICB2YXIgRU9MID0ge30sIC8vIHNlbnRpbmVsIHZhbHVlIGZvciBlbmQtb2YtbGluZVxuICAgICAgICAgIEVPRiA9IHt9LCAvLyBzZW50aW5lbCB2YWx1ZSBmb3IgZW5kLW9mLWZpbGVcbiAgICAgICAgICByb3dzID0gW10sIC8vIG91dHB1dCByb3dzXG4gICAgICAgICAgTiA9IHRleHQubGVuZ3RoLFxuICAgICAgICAgIEkgPSAwLCAvLyBjdXJyZW50IGNoYXJhY3RlciBpbmRleFxuICAgICAgICAgIG4gPSAwLCAvLyB0aGUgY3VycmVudCBsaW5lIG51bWJlclxuICAgICAgICAgIHQsIC8vIHRoZSBjdXJyZW50IHRva2VuXG4gICAgICAgICAgZW9sOyAvLyBpcyB0aGUgY3VycmVudCB0b2tlbiBmb2xsb3dlZCBieSBFT0w/XG5cbiAgICAgIGZ1bmN0aW9uIHRva2VuKCkge1xuICAgICAgICBpZiAoSSA+PSBOKSByZXR1cm4gRU9GOyAvLyBzcGVjaWFsIGNhc2U6IGVuZCBvZiBmaWxlXG4gICAgICAgIGlmIChlb2wpIHJldHVybiBlb2wgPSBmYWxzZSwgRU9MOyAvLyBzcGVjaWFsIGNhc2U6IGVuZCBvZiBsaW5lXG5cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBxdW90ZXNcbiAgICAgICAgdmFyIGogPSBJO1xuICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGopID09PSAzNCkge1xuICAgICAgICAgIHZhciBpID0gajtcbiAgICAgICAgICB3aGlsZSAoaSsrIDwgTikge1xuICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpKSA9PT0gMzQpIHtcbiAgICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpICsgMSkgIT09IDM0KSBicmVhaztcbiAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBJID0gaSArIDI7XG4gICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoaSArIDEpO1xuICAgICAgICAgIGlmIChjID09PSAxMykge1xuICAgICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoaSArIDIpID09PSAxMCkgKytJO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMTApIHtcbiAgICAgICAgICAgIGVvbCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGogKyAxLCBpKS5yZXBsYWNlKC9cIlwiL2csIFwiXFxcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbW1vbiBjYXNlOiBmaW5kIG5leHQgZGVsaW1pdGVyIG9yIG5ld2xpbmVcbiAgICAgICAgd2hpbGUgKEkgPCBOKSB7XG4gICAgICAgICAgdmFyIGMgPSB0ZXh0LmNoYXJDb2RlQXQoSSsrKSwgayA9IDE7XG4gICAgICAgICAgaWYgKGMgPT09IDEwKSBlb2wgPSB0cnVlOyAvLyBcXG5cbiAgICAgICAgICBlbHNlIGlmIChjID09PSAxMykgeyBlb2wgPSB0cnVlOyBpZiAodGV4dC5jaGFyQ29kZUF0KEkpID09PSAxMCkgKytJLCArK2s7IH0gLy8gXFxyfFxcclxcblxuICAgICAgICAgIGVsc2UgaWYgKGMgIT09IGRlbGltaXRlckNvZGUpIGNvbnRpbnVlO1xuICAgICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGosIEkgLSBrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZTogbGFzdCB0b2tlbiBiZWZvcmUgRU9GXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKGopO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAoKHQgPSB0b2tlbigpKSAhPT0gRU9GKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIHdoaWxlICh0ICE9PSBFT0wgJiYgdCAhPT0gRU9GKSB7XG4gICAgICAgICAgYS5wdXNoKHQpO1xuICAgICAgICAgIHQgPSB0b2tlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmICYmIChhID0gZihhLCBuKyspKSA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgcm93cy5wdXNoKGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQocm93cykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocm93c1swXSkpIHJldHVybiBmb3JtYXRSb3dzKHJvd3MpOyAvLyBkZXByZWNhdGVkOyB1c2UgZm9ybWF0Um93c1xuICAgICAgdmFyIGZpZWxkU2V0ID0gT2JqZWN0LmNyZWF0ZShudWxsKSwgZmllbGRzID0gW107XG5cbiAgICAgIC8vIENvbXB1dGUgdW5pcXVlIGZpZWxkcyBpbiBvcmRlciBvZiBkaXNjb3ZlcnkuXG4gICAgICByb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgICAgIGZvciAodmFyIGZpZWxkIGluIHJvdykge1xuICAgICAgICAgIGlmICghKChmaWVsZCArPSBcIlwiKSBpbiBmaWVsZFNldCkpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkU2V0W2ZpZWxkXSA9IGZpZWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gW2ZpZWxkcy5tYXAoZm9ybWF0VmFsdWUpLmpvaW4oZGVsaW1pdGVyKV0uY29uY2F0KHJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gZmllbGRzLm1hcChmdW5jdGlvbihmaWVsZCkge1xuICAgICAgICAgIHJldHVybiBmb3JtYXRWYWx1ZShyb3dbZmllbGRdKTtcbiAgICAgICAgfSkuam9pbihkZWxpbWl0ZXIpO1xuICAgICAgfSkpLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0Um93cyhyb3dzKSB7XG4gICAgICByZXR1cm4gcm93cy5tYXAoZm9ybWF0Um93KS5qb2luKFwiXFxuXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFJvdyhyb3cpIHtcbiAgICAgIHJldHVybiByb3cubWFwKGZvcm1hdFZhbHVlKS5qb2luKGRlbGltaXRlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VmFsdWUodGV4dCkge1xuICAgICAgcmV0dXJuIHJlRm9ybWF0LnRlc3QodGV4dCkgPyBcIlxcXCJcIiArIHRleHQucmVwbGFjZSgvXFxcIi9nLCBcIlxcXCJcXFwiXCIpICsgXCJcXFwiXCIgOiB0ZXh0O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwYXJzZTogcGFyc2UsXG4gICAgICBwYXJzZVJvd3M6IHBhcnNlUm93cyxcbiAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgZm9ybWF0Um93czogZm9ybWF0Um93c1xuICAgIH07XG4gIH1cblxuICB2YXIgdHN2ID0gZHN2KFwiXFx0XCIpO1xuXG4gIGZ1bmN0aW9uIHJlc3BvbnNlT2YoZHN2LCByb3cpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgcmV0dXJuIGRzdi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCwgcm93KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZml4Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIHJlcXVlc3QpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yID09IG51bGwgPyByZXF1ZXN0IDogbnVsbCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc1Jlc3BvbnNlKHJlcXVlc3QpIHtcbiAgICB2YXIgdHlwZSA9IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICAgIHJldHVybiB0eXBlICYmIHR5cGUgIT09IFwidGV4dFwiXG4gICAgICAgID8gcmVxdWVzdC5yZXNwb25zZSAvLyBudWxsIG9uIGVycm9yXG4gICAgICAgIDogcmVxdWVzdC5yZXNwb25zZVRleHQ7IC8vIFwiXCIgb24gZXJyb3JcbiAgfVxuXG4gIGZ1bmN0aW9uIERpc3BhdGNoKHR5cGVzKSB7XG4gICAgdmFyIGkgPSAtMSxcbiAgICAgICAgbiA9IHR5cGVzLmxlbmd0aCxcbiAgICAgICAgY2FsbGJhY2tzQnlUeXBlID0ge30sXG4gICAgICAgIGNhbGxiYWNrQnlOYW1lID0ge30sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhhdC5vbiA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICB0eXBlID0gcGFyc2VUeXBlKHR5cGUpO1xuXG4gICAgICAvLyBSZXR1cm4gdGhlIGN1cnJlbnQgY2FsbGJhY2ssIGlmIGFueS5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gKGNhbGxiYWNrID0gY2FsbGJhY2tCeU5hbWVbdHlwZS5uYW1lXSkgJiYgY2FsbGJhY2sudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVk4oCmXG4gICAgICBpZiAodHlwZS50eXBlKSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja3NCeVR5cGVbdHlwZS50eXBlXSxcbiAgICAgICAgICAgIGNhbGxiYWNrMCA9IGNhbGxiYWNrQnlOYW1lW3R5cGUubmFtZV0sXG4gICAgICAgICAgICBpO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgY3VycmVudCBjYWxsYmFjaywgaWYgYW55LCB1c2luZyBjb3B5LW9uLXJlbW92ZS5cbiAgICAgICAgaWYgKGNhbGxiYWNrMCkge1xuICAgICAgICAgIGNhbGxiYWNrMC52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgaSA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrMCk7XG4gICAgICAgICAgY2FsbGJhY2tzQnlUeXBlW3R5cGUudHlwZV0gPSBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCwgaSkuY29uY2F0KGNhbGxiYWNrcy5zbGljZShpICsgMSkpO1xuICAgICAgICAgIGRlbGV0ZSBjYWxsYmFja0J5TmFtZVt0eXBlLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBuZXcgY2FsbGJhY2ssIGlmIGFueS5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2sgPSB7dmFsdWU6IGNhbGxiYWNrfTtcbiAgICAgICAgICBjYWxsYmFja0J5TmFtZVt0eXBlLm5hbWVdID0gY2FsbGJhY2s7XG4gICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgaWYgYSBudWxsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJlbW92ZSBhbGwgY2FsbGJhY2tzIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIG90aGVyVHlwZSBpbiBjYWxsYmFja3NCeVR5cGUpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sgPSBjYWxsYmFja0J5TmFtZVtvdGhlclR5cGUgKyB0eXBlLm5hbWVdKSB7XG4gICAgICAgICAgICBjYWxsYmFjay52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tzID0gY2FsbGJhY2tzQnlUeXBlW290aGVyVHlwZV0sIGkgPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBjYWxsYmFja3NCeVR5cGVbb3RoZXJUeXBlXSA9IGNhbGxiYWNrcy5zbGljZSgwLCBpKS5jb25jYXQoY2FsbGJhY2tzLnNsaWNlKGkgKyAxKSk7XG4gICAgICAgICAgICBkZWxldGUgY2FsbGJhY2tCeU5hbWVbY2FsbGJhY2submFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGF0O1xuICAgIH07XG5cbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgdHlwZSA9IHR5cGVzW2ldICsgXCJcIjtcbiAgICAgIGlmICghdHlwZSB8fCAodHlwZSBpbiB0aGF0KSkgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBvciBkdXBsaWNhdGUgdHlwZTogXCIgKyB0eXBlKTtcbiAgICAgIGNhbGxiYWNrc0J5VHlwZVt0eXBlXSA9IFtdO1xuICAgICAgdGhhdFt0eXBlXSA9IGFwcGxpZXIodHlwZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VUeXBlKHR5cGUpIHtcbiAgICAgIHZhciBpID0gKHR5cGUgKz0gXCJcIikuaW5kZXhPZihcIi5cIiksIG5hbWUgPSB0eXBlO1xuICAgICAgaWYgKGkgPj0gMCkgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSk7IGVsc2UgbmFtZSArPSBcIi5cIjtcbiAgICAgIGlmICh0eXBlICYmICFjYWxsYmFja3NCeVR5cGUuaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICAgIHJldHVybiB7dHlwZTogdHlwZSwgbmFtZTogbmFtZX07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbGllcih0eXBlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBjYWxsYmFja3NCeVR5cGVbdHlwZV0sIC8vIERlZmVuc2l2ZSByZWZlcmVuY2U7IGNvcHktb24tcmVtb3ZlLlxuICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgICBjYWxsYmFja1ZhbHVlLFxuICAgICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgICAgbiA9IGNhbGxiYWNrcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tWYWx1ZSA9IChjYWxsYmFjayA9IGNhbGxiYWNrc1tpXSkudmFsdWUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrVmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwYXRjaChhcmd1bWVudHMpO1xuICB9XG5cbiAgZGlzcGF0Y2gucHJvdG90eXBlID0gRGlzcGF0Y2gucHJvdG90eXBlOyAvLyBhbGxvdyBpbnN0YW5jZW9mXG5cbiAgdmFyIHhociA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICB2YXIgeGhyLFxuICAgICAgICBldmVudCA9IGRpc3BhdGNoKFwiYmVmb3Jlc2VuZFwiLCBcInByb2dyZXNzXCIsIFwibG9hZFwiLCBcImVycm9yXCIpLFxuICAgICAgICBtaW1lVHlwZSxcbiAgICAgICAgaGVhZGVycyA9IG5ldyBNYXAsXG4gICAgICAgIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QsXG4gICAgICAgIHJlc3BvbnNlLFxuICAgICAgICByZXNwb25zZVR5cGU7XG5cbiAgICAvLyBJZiBJRSBkb2VzIG5vdCBzdXBwb3J0IENPUlMsIHVzZSBYRG9tYWluUmVxdWVzdC5cbiAgICBpZiAodHlwZW9mIFhEb21haW5SZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICYmICEoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiByZXF1ZXN0KVxuICAgICAgICAmJiAvXihodHRwKHMpPzopP1xcL1xcLy8udGVzdCh1cmwpKSByZXF1ZXN0ID0gbmV3IFhEb21haW5SZXF1ZXN0O1xuXG4gICAgXCJvbmxvYWRcIiBpbiByZXF1ZXN0XG4gICAgICAgID8gcmVxdWVzdC5vbmxvYWQgPSByZXF1ZXN0Lm9uZXJyb3IgPSByZXNwb25kXG4gICAgICAgIDogcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHsgcmVxdWVzdC5yZWFkeVN0YXRlID4gMyAmJiByZXNwb25kKCk7IH07XG5cbiAgICBmdW5jdGlvbiByZXNwb25kKCkge1xuICAgICAgdmFyIHN0YXR1cyA9IHJlcXVlc3Quc3RhdHVzLCByZXN1bHQ7XG4gICAgICBpZiAoIXN0YXR1cyAmJiBoYXNSZXNwb25zZShyZXF1ZXN0KVxuICAgICAgICAgIHx8IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwXG4gICAgICAgICAgfHwgc3RhdHVzID09PSAzMDQpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3BvbnNlLmNhbGwoeGhyLCByZXF1ZXN0KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBldmVudC5lcnJvci5jYWxsKHhociwgZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQubG9hZC5jYWxsKHhociwgcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50LmVycm9yLmNhbGwoeGhyLCByZXF1ZXN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXF1ZXN0Lm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICBldmVudC5wcm9ncmVzcy5jYWxsKHhociwgZSk7XG4gICAgfTtcblxuICAgIHhociA9IHtcbiAgICAgIGhlYWRlcjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICAgICAgbmFtZSA9IChuYW1lICsgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gaGVhZGVycy5nZXQobmFtZSk7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSBoZWFkZXJzLmRlbGV0ZShuYW1lKTtcbiAgICAgICAgZWxzZSBoZWFkZXJzLnNldChuYW1lLCB2YWx1ZSArIFwiXCIpO1xuICAgICAgICByZXR1cm4geGhyO1xuICAgICAgfSxcblxuICAgICAgLy8gSWYgbWltZVR5cGUgaXMgbm9uLW51bGwgYW5kIG5vIEFjY2VwdCBoZWFkZXIgaXMgc2V0LCBhIGRlZmF1bHQgaXMgdXNlZC5cbiAgICAgIG1pbWVUeXBlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBtaW1lVHlwZTtcbiAgICAgICAgbWltZVR5cGUgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHZhbHVlICsgXCJcIjtcbiAgICAgICAgcmV0dXJuIHhocjtcbiAgICAgIH0sXG5cbiAgICAgIC8vIFNwZWNpZmllcyB3aGF0IHR5cGUgdGhlIHJlc3BvbnNlIHZhbHVlIHNob3VsZCB0YWtlO1xuICAgICAgLy8gZm9yIGluc3RhbmNlLCBhcnJheWJ1ZmZlciwgYmxvYiwgZG9jdW1lbnQsIG9yIHRleHQuXG4gICAgICByZXNwb25zZVR5cGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJlc3BvbnNlVHlwZTtcbiAgICAgICAgcmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB4aHI7XG4gICAgICB9LFxuXG4gICAgICAvLyBTcGVjaWZ5IGhvdyB0byBjb252ZXJ0IHRoZSByZXNwb25zZSBjb250ZW50IHRvIGEgc3BlY2lmaWMgdHlwZTtcbiAgICAgIC8vIGNoYW5nZXMgdGhlIGNhbGxiYWNrIHZhbHVlIG9uIFwibG9hZFwiIGV2ZW50cy5cbiAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXNwb25zZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4geGhyO1xuICAgICAgfSxcblxuICAgICAgLy8gQWxpYXMgZm9yIHNlbmQoXCJHRVRcIiwg4oCmKS5cbiAgICAgIGdldDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHhoci5zZW5kKFwiR0VUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIEFsaWFzIGZvciBzZW5kKFwiUE9TVFwiLCDigKYpLlxuICAgICAgcG9zdDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHhoci5zZW5kKFwiUE9TVFwiLCBkYXRhLCBjYWxsYmFjayk7XG4gICAgICB9LFxuXG4gICAgICAvLyBJZiBjYWxsYmFjayBpcyBub24tbnVsbCwgaXQgd2lsbCBiZSB1c2VkIGZvciBlcnJvciBhbmQgbG9hZCBldmVudHMuXG4gICAgICBzZW5kOiBmdW5jdGlvbihtZXRob2QsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikgY2FsbGJhY2sgPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgICAgICAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLmxlbmd0aCA9PT0gMSkgY2FsbGJhY2sgPSBmaXhDYWxsYmFjayhjYWxsYmFjayk7XG4gICAgICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICAgIGlmIChtaW1lVHlwZSAhPSBudWxsICYmICFoZWFkZXJzLmhhcyhcImFjY2VwdFwiKSkgaGVhZGVycy5zZXQoXCJhY2NlcHRcIiwgbWltZVR5cGUgKyBcIiwqLypcIik7XG4gICAgICAgIGlmIChyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIpIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpOyB9KTtcbiAgICAgICAgaWYgKG1pbWVUeXBlICE9IG51bGwgJiYgcmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKSByZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUobWltZVR5cGUpO1xuICAgICAgICBpZiAocmVzcG9uc2VUeXBlICE9IG51bGwpIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHhoci5vbihcImVycm9yXCIsIGNhbGxiYWNrKS5vbihcImxvYWRcIiwgZnVuY3Rpb24ocmVxdWVzdCkgeyBjYWxsYmFjayhudWxsLCByZXF1ZXN0KTsgfSk7XG4gICAgICAgIGV2ZW50LmJlZm9yZXNlbmQuY2FsbCh4aHIsIHJlcXVlc3QpO1xuICAgICAgICByZXF1ZXN0LnNlbmQoZGF0YSA9PSBudWxsID8gbnVsbCA6IGRhdGEpO1xuICAgICAgICByZXR1cm4geGhyO1xuICAgICAgfSxcblxuICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJldHVybiB4aHI7XG4gICAgICB9LFxuXG4gICAgICBvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGV2ZW50Lm9uLmFwcGx5KGV2ZW50LCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IGV2ZW50ID8geGhyIDogdmFsdWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBjYWxsYmFja1xuICAgICAgICA/IHhoci5nZXQoY2FsbGJhY2spXG4gICAgICAgIDogeGhyO1xuICB9XG5cbiAgdmFyIHhockRzdiA9IGZ1bmN0aW9uKGRlZmF1bHRNaW1lVHlwZSwgZHN2KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHVybCwgcm93LCBjYWxsYmFjaykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBjYWxsYmFjayA9IHJvdywgcm93ID0gbnVsbDtcbiAgICAgIHZhciByID0geGhyKHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKTtcbiAgICAgIHIucm93ID0gZnVuY3Rpb24oXykgeyByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHIucmVzcG9uc2UocmVzcG9uc2VPZihkc3YsIHJvdyA9IF8pKSA6IHJvdzsgfTtcbiAgICAgIHIucm93KHJvdyk7XG4gICAgICByZXR1cm4gY2FsbGJhY2sgPyByLmdldChjYWxsYmFjaykgOiByO1xuICAgIH07XG4gIH1cblxuICB2YXIgX3RzdiA9IHhockRzdihcInRleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXNcIiwgdHN2KTtcblxuICB2YXIgY3N2ID0gZHN2KFwiLFwiKTtcblxuICB2YXIgX2NzdiA9IHhockRzdihcInRleHQvY3N2XCIsIGNzdik7XG5cbiAgdmFyIHhoclR5cGUgPSBmdW5jdGlvbihkZWZhdWx0TWltZVR5cGUsIHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciByID0geGhyKHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKS5yZXNwb25zZShyZXNwb25zZSk7XG4gICAgICByZXR1cm4gY2FsbGJhY2sgPyByLmdldChjYWxsYmFjaykgOiByO1xuICAgIH07XG4gIH1cblxuICB2YXIgeG1sID0geGhyVHlwZShcImFwcGxpY2F0aW9uL3htbFwiLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VYTUw7XG4gIH0pO1xuXG4gIHZhciB0ZXh0ID0geGhyVHlwZShcInRleHQvcGxhaW5cIiwgZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgIHJldHVybiByZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgfSk7XG5cbiAgdmFyIGpzb24gPSB4aHJUeXBlKFwiYXBwbGljYXRpb24vanNvblwiLCBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICB9KTtcblxuICB2YXIgaHRtbCA9IHhoclR5cGUoXCJ0ZXh0L2h0bWxcIiwgZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gIH0pO1xuXG4gIGV4cG9ydHMueGhyID0geGhyO1xuICBleHBvcnRzLmh0bWwgPSBodG1sO1xuICBleHBvcnRzLmpzb24gPSBqc29uO1xuICBleHBvcnRzLnRleHQgPSB0ZXh0O1xuICBleHBvcnRzLnhtbCA9IHhtbDtcbiAgZXhwb3J0cy5jc3YgPSBfY3N2O1xuICBleHBvcnRzLnRzdiA9IF90c3Y7XG5cbn0pKTsiLCIvKipcbiAqIERlYm91bmNlcyBhIGZ1bmN0aW9uIGJ5IHRoZSBnaXZlbiB0aHJlc2hvbGQuXG4gKlxuICogQHNlZSBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb24gdG8gd3JhcFxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaW4gbXMgKGAxMDBgKVxuICogQHBhcmFtIHtCb29sZWFufSB3aGV0aGVyIHRvIGV4ZWN1dGUgYXQgdGhlIGJlZ2lubmluZyAoYGZhbHNlYClcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB0aHJlc2hvbGQsIGV4ZWNBc2FwKXtcbiAgdmFyIHRpbWVvdXQ7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCgpe1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSB7XG4gICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSBlbHNlIGlmIChleGVjQXNhcCkge1xuICAgICAgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgIH1cblxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiIsInZhciBwb2x5bGluZSA9IHt9O1xuXG4vLyBCYXNlZCBvZmYgb2YgW3RoZSBvZmZpY2FsIEdvb2dsZSBkb2N1bWVudF0oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL3V0aWxpdGllcy9wb2x5bGluZWFsZ29yaXRobSlcbi8vXG4vLyBTb21lIHBhcnRzIGZyb20gW3RoaXMgaW1wbGVtZW50YXRpb25dKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci9Hb29nbGVNYXBzL0VuY29kZVBvbHlsaW5lL1BvbHlsaW5lRW5jb2Rlci5qcylcbi8vIGJ5IFtNYXJrIE1jQ2x1cmVdKGh0dHA6Ly9mYWNzdGFmZi51bmNhLmVkdS9tY21jY2x1ci8pXG5cbmZ1bmN0aW9uIGVuY29kZShjb29yZGluYXRlLCBmYWN0b3IpIHtcbiAgICBjb29yZGluYXRlID0gTWF0aC5yb3VuZChjb29yZGluYXRlICogZmFjdG9yKTtcbiAgICBjb29yZGluYXRlIDw8PSAxO1xuICAgIGlmIChjb29yZGluYXRlIDwgMCkge1xuICAgICAgICBjb29yZGluYXRlID0gfmNvb3JkaW5hdGU7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICB3aGlsZSAoY29vcmRpbmF0ZSA+PSAweDIwKSB7XG4gICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgweDIwIHwgKGNvb3JkaW5hdGUgJiAweDFmKSkgKyA2Myk7XG4gICAgICAgIGNvb3JkaW5hdGUgPj49IDU7XG4gICAgfVxuICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvb3JkaW5hdGUgKyA2Myk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cblxuLy8gVGhpcyBpcyBhZGFwdGVkIGZyb20gdGhlIGltcGxlbWVudGF0aW9uIGluIFByb2plY3QtT1NSTVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL0Rlbm5pc09TUk0vUHJvamVjdC1PU1JNLVdlYi9ibG9iL21hc3Rlci9XZWJDb250ZW50L3JvdXRpbmcvT1NSTS5Sb3V0aW5nR2VvbWV0cnkuanNcbnBvbHlsaW5lLmRlY29kZSA9IGZ1bmN0aW9uKHN0ciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgbGF0ID0gMCxcbiAgICAgICAgbG5nID0gMCxcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBbXSxcbiAgICAgICAgc2hpZnQgPSAwLFxuICAgICAgICByZXN1bHQgPSAwLFxuICAgICAgICBieXRlID0gbnVsbCxcbiAgICAgICAgbGF0aXR1ZGVfY2hhbmdlLFxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlLFxuICAgICAgICBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpO1xuXG4gICAgLy8gQ29vcmRpbmF0ZXMgaGF2ZSB2YXJpYWJsZSBsZW5ndGggd2hlbiBlbmNvZGVkLCBzbyBqdXN0IGtlZXBcbiAgICAvLyB0cmFjayBvZiB3aGV0aGVyIHdlJ3ZlIGhpdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuIEluIGVhY2hcbiAgICAvLyBsb29wIGl0ZXJhdGlvbiwgYSBzaW5nbGUgY29vcmRpbmF0ZSBpcyBkZWNvZGVkLlxuICAgIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcblxuICAgICAgICAvLyBSZXNldCBzaGlmdCwgcmVzdWx0LCBhbmQgYnl0ZVxuICAgICAgICBieXRlID0gbnVsbDtcbiAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGJ5dGUgPSBzdHIuY2hhckNvZGVBdChpbmRleCsrKSAtIDYzO1xuICAgICAgICAgICAgcmVzdWx0IHw9IChieXRlICYgMHgxZikgPDwgc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCArPSA1O1xuICAgICAgICB9IHdoaWxlIChieXRlID49IDB4MjApO1xuXG4gICAgICAgIGxhdGl0dWRlX2NoYW5nZSA9ICgocmVzdWx0ICYgMSkgPyB+KHJlc3VsdCA+PiAxKSA6IChyZXN1bHQgPj4gMSkpO1xuXG4gICAgICAgIHNoaWZ0ID0gcmVzdWx0ID0gMDtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBieXRlID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgrKykgLSA2MztcbiAgICAgICAgICAgIHJlc3VsdCB8PSAoYnl0ZSAmIDB4MWYpIDw8IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgKz0gNTtcbiAgICAgICAgfSB3aGlsZSAoYnl0ZSA+PSAweDIwKTtcblxuICAgICAgICBsb25naXR1ZGVfY2hhbmdlID0gKChyZXN1bHQgJiAxKSA/IH4ocmVzdWx0ID4+IDEpIDogKHJlc3VsdCA+PiAxKSk7XG5cbiAgICAgICAgbGF0ICs9IGxhdGl0dWRlX2NoYW5nZTtcbiAgICAgICAgbG5nICs9IGxvbmdpdHVkZV9jaGFuZ2U7XG5cbiAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbbGF0IC8gZmFjdG9yLCBsbmcgLyBmYWN0b3JdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG59O1xuXG5wb2x5bGluZS5lbmNvZGUgPSBmdW5jdGlvbihjb29yZGluYXRlcywgcHJlY2lzaW9uKSB7XG4gICAgaWYgKCFjb29yZGluYXRlcy5sZW5ndGgpIHJldHVybiAnJztcblxuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uIHx8IDUpLFxuICAgICAgICBvdXRwdXQgPSBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMF0sIGZhY3RvcikgKyBlbmNvZGUoY29vcmRpbmF0ZXNbMF1bMV0sIGZhY3Rvcik7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhID0gY29vcmRpbmF0ZXNbaV0sIGIgPSBjb29yZGluYXRlc1tpIC0gMV07XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVswXSAtIGJbMF0sIGZhY3Rvcik7XG4gICAgICAgIG91dHB1dCArPSBlbmNvZGUoYVsxXSAtIGJbMV0sIGZhY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSB1bmRlZmluZWQpIG1vZHVsZS5leHBvcnRzID0gcG9seWxpbmU7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBzbGljZSA9IFtdLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIHF1ZXVlKHBhcmFsbGVsaXNtKSB7XG4gICAgdmFyIHEsXG4gICAgICAgIHRhc2tzID0gW10sXG4gICAgICAgIHN0YXJ0ZWQgPSAwLCAvLyBudW1iZXIgb2YgdGFza3MgdGhhdCBoYXZlIGJlZW4gc3RhcnRlZCAoYW5kIHBlcmhhcHMgZmluaXNoZWQpXG4gICAgICAgIGFjdGl2ZSA9IDAsIC8vIG51bWJlciBvZiB0YXNrcyBjdXJyZW50bHkgYmVpbmcgZXhlY3V0ZWQgKHN0YXJ0ZWQgYnV0IG5vdCBmaW5pc2hlZClcbiAgICAgICAgcmVtYWluaW5nID0gMCwgLy8gbnVtYmVyIG9mIHRhc2tzIG5vdCB5ZXQgZmluaXNoZWRcbiAgICAgICAgcG9wcGluZywgLy8gaW5zaWRlIGEgc3luY2hyb25vdXMgdGFzayBjYWxsYmFjaz9cbiAgICAgICAgZXJyb3IgPSBudWxsLFxuICAgICAgICBhd2FpdCA9IG5vb3AsXG4gICAgICAgIGFsbDtcblxuICAgIGlmICghcGFyYWxsZWxpc20pIHBhcmFsbGVsaXNtID0gSW5maW5pdHk7XG5cbiAgICBmdW5jdGlvbiBwb3AoKSB7XG4gICAgICB3aGlsZSAocG9wcGluZyA9IHN0YXJ0ZWQgPCB0YXNrcy5sZW5ndGggJiYgYWN0aXZlIDwgcGFyYWxsZWxpc20pIHtcbiAgICAgICAgdmFyIGkgPSBzdGFydGVkKyssXG4gICAgICAgICAgICB0ID0gdGFza3NbaV0sXG4gICAgICAgICAgICBhID0gc2xpY2UuY2FsbCh0LCAxKTtcbiAgICAgICAgYS5wdXNoKGNhbGxiYWNrKGkpKTtcbiAgICAgICAgKythY3RpdmU7XG4gICAgICAgIHRbMF0uYXBwbHkobnVsbCwgYSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbGJhY2soaSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUsIHIpIHtcbiAgICAgICAgLS1hY3RpdmU7XG4gICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmIChlICE9IG51bGwpIHtcbiAgICAgICAgICBlcnJvciA9IGU7IC8vIGlnbm9yZSBuZXcgdGFza3MgYW5kIHNxdWVsY2ggYWN0aXZlIGNhbGxiYWNrc1xuICAgICAgICAgIHN0YXJ0ZWQgPSByZW1haW5pbmcgPSBOYU47IC8vIHN0b3AgcXVldWVkIHRhc2tzIGZyb20gc3RhcnRpbmdcbiAgICAgICAgICBub3RpZnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXNrc1tpXSA9IHI7XG4gICAgICAgICAgaWYgKC0tcmVtYWluaW5nKSBwb3BwaW5nIHx8IHBvcCgpO1xuICAgICAgICAgIGVsc2Ugbm90aWZ5KCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgICAgaWYgKGVycm9yICE9IG51bGwpIGF3YWl0KGVycm9yKTtcbiAgICAgIGVsc2UgaWYgKGFsbCkgYXdhaXQoZXJyb3IsIHRhc2tzKTtcbiAgICAgIGVsc2UgYXdhaXQuYXBwbHkobnVsbCwgW2Vycm9yXS5jb25jYXQodGFza3MpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcSA9IHtcbiAgICAgIGRlZmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgIHRhc2tzLnB1c2goYXJndW1lbnRzKTtcbiAgICAgICAgICArK3JlbWFpbmluZztcbiAgICAgICAgICBwb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH0sXG4gICAgICBhd2FpdDogZnVuY3Rpb24oZikge1xuICAgICAgICBhd2FpdCA9IGY7XG4gICAgICAgIGFsbCA9IGZhbHNlO1xuICAgICAgICBpZiAoIXJlbWFpbmluZykgbm90aWZ5KCk7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSxcbiAgICAgIGF3YWl0QWxsOiBmdW5jdGlvbihmKSB7XG4gICAgICAgIGF3YWl0ID0gZjtcbiAgICAgICAgYWxsID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFyZW1haW5pbmcpIG5vdGlmeSgpO1xuICAgICAgICByZXR1cm4gcTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbm9vcCgpIHt9XG5cbiAgcXVldWUudmVyc2lvbiA9IFwiMS4wLjdcIjtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBxdWV1ZTsgfSk7XG4gIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gcXVldWU7XG4gIGVsc2UgdGhpcy5xdWV1ZSA9IHF1ZXVlO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzeGhyID0gcmVxdWlyZSgnZDMteGhyJyk7XG5cbmZ1bmN0aW9uIGQzcG9zdCh1cmwsIHJlcURhdGEsIGNhbGxiYWNrLCBjb3JzKSB7XG4gICAgdmFyIHNlbnQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY29ycyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIG0gPSB1cmwubWF0Y2goL15cXHMqaHR0cHM/OlxcL1xcL1teXFwvXSovKTtcbiAgICAgICAgY29ycyA9IG0gJiYgKG1bMF0gIT09IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lICtcbiAgICAgICAgICAgICAgICAobG9jYXRpb24ucG9ydCA/ICc6JyArIGxvY2F0aW9uLnBvcnQgOiAnJykpO1xuICAgIH1cblxuICAgIHZhciByZXNwRGF0YTtcblxuICAgIGQzeGhyLnhocih1cmwpXG4gICAgICAgIC5oZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgICAgIC5wb3N0KFxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHJlcURhdGEpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVyciwgcmF3RGF0YSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BEYXRhID0gcmF3RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlcnIsIHJlc3BEYXRhLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgKTtcblxuICAgIGZ1bmN0aW9uIGlzU3VjY2Vzc2Z1bChzdGF0dXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgIH1cblxuICAgIHJldHVybiByZXNwRGF0YTtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGQzcG9zdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKSxcbiAgICBwb2x5bGluZSA9IHJlcXVpcmUoJ3BvbHlsaW5lJyksXG4gICAgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKSxcbiAgICBxdWV1ZSA9IHJlcXVpcmUoJ3F1ZXVlLWFzeW5jJyk7XG5cbnZhciBEaXJlY3Rpb25zID0gTC5DbGFzcy5leHRlbmQoe1xuICAgIGluY2x1ZGVzOiBbTC5NaXhpbi5FdmVudHNdLFxuXG4gICAgb3B0aW9uczoge1xuICAgICAgICB1bml0czogJ2ltcGVyaWFsJ1xuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFVSTF9URU1QTEFURTogJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQvZGlyZWN0aW9ucy97cHJvZmlsZX0ve3dheXBvaW50c30uanNvbj9pbnN0cnVjdGlvbnM9aHRtbCZnZW9tZXRyeT1wb2x5bGluZSZhY2Nlc3NfdG9rZW49e3Rva2VufScsXG4gICAgICAgIE1NUlBfQVBJX1RFTVBMQVRFOiAnaHR0cDovL2x1bGl1Lm1lL21tcnAvYXBpL3YxJyxcbiAgICAgICAgR0VPQ09ERVJfVEVNUExBVEU6ICdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L2dlb2NvZGUvbWFwYm94LnBsYWNlcy97cXVlcnl9Lmpzb24/cHJveGltaXR5PXtwcm94aW1pdHl9JmFjY2Vzc190b2tlbj17dG9rZW59J1xuICAgIH0sXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gW107XG4gICAgICAgIHRoaXMucHJvZmlsZSA9IHtcbiAgICAgICAgICAgIFwiYXZhaWxhYmxlX3B1YmxpY19tb2Rlc1wiOiBbXSxcbiAgICAgICAgICAgIFwiY2FuX3VzZV90YXhpXCI6ICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiaGFzX2JpY3ljbGVcIjogICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiaGFzX21vdG9yY3ljbGVcIjogICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiaGFzX3ByaXZhdGVfY2FyXCI6ICAgICAgICB0cnVlLFxuICAgICAgICAgICAgXCJuZWVkX3BhcmtpbmdcIjogICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBcIm9iamVjdGl2ZVwiOiAgICAgICAgICAgICAgXCJmYXN0ZXN0XCIsXG4gICAgICAgICAgICBcImRyaXZpbmdfZGlzdGFuY2VfbGltaXRcIjogNTAwLFxuICAgICAgICAgICAgXCJzb3VyY2VcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImNvb3JkaW5hdGVcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ4XCI6IDAuMCxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IDAuMCxcbiAgICAgICAgICAgICAgICAgICAgXCJzcmlkXCI6IDQzMjZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0YXJnZXRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImNvb3JkaW5hdGVcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ4XCI6IDAuMCxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IDAuMCxcbiAgICAgICAgICAgICAgICAgICAgXCJzcmlkXCI6IDQzMjZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGdldE9yaWdpbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW47XG4gICAgfSxcblxuICAgIGdldERlc3RpbmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIH0sXG5cbiAgICBzZXRPcmlnaW46IGZ1bmN0aW9uIChvcmlnaW4pIHtcbiAgICAgICAgb3JpZ2luID0gdGhpcy5fbm9ybWFsaXplV2F5cG9pbnQob3JpZ2luKTtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgICAgdGhpcy5maXJlKCdvcmlnaW4nLCB7b3JpZ2luOiBvcmlnaW59KTtcblxuICAgICAgICBpZiAoIW9yaWdpbikge1xuICAgICAgICAgICAgdGhpcy5fdW5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb2ZpbGUuc291cmNlLnZhbHVlLnggPSB0aGlzLm9yaWdpbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXTtcbiAgICAgICAgdGhpcy5wcm9maWxlLnNvdXJjZS52YWx1ZS55ID0gdGhpcy5vcmlnaW4uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV07XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldERlc3RpbmF0aW9uOiBmdW5jdGlvbiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgZGVzdGluYXRpb24gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludChkZXN0aW5hdGlvbik7XG5cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiBkZXN0aW5hdGlvbn0pO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3VubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9maWxlLnRhcmdldC52YWx1ZS54ID0gdGhpcy5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXTtcbiAgICAgICAgdGhpcy5wcm9maWxlLnRhcmdldC52YWx1ZS55ID0gdGhpcy5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlc1sxXTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZ2V0UHJvZmlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vcmV0dXJuIHRoaXMucHJvZmlsZSB8fCB0aGlzLm9wdGlvbnMucHJvZmlsZSB8fCAnbWFwYm94LmRyaXZpbmcnO1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9maWxlO1xuICAgIH0sXG5cbiAgICBzZXRQcm9maWxlOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLnByb2ZpbGVba2V5XSA9IHZhbHVlO1xuICAgICAgICAvL3RoaXMuZmlyZSgncHJvZmlsZScsIHtwcm9maWxlOiBwcm9maWxlfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBnZXRXYXlwb2ludHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2F5cG9pbnRzO1xuICAgIH0sXG5cbiAgICBzZXRXYXlwb2ludHM6IGZ1bmN0aW9uICh3YXlwb2ludHMpIHtcbiAgICAgICAgdGhpcy5fd2F5cG9pbnRzID0gd2F5cG9pbnRzLm1hcCh0aGlzLl9ub3JtYWxpemVXYXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBhZGRXYXlwb2ludDogZnVuY3Rpb24gKGluZGV4LCB3YXlwb2ludCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAwLCB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVtb3ZlV2F5cG9pbnQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLl93YXlwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNldFdheXBvaW50OiBmdW5jdGlvbiAoaW5kZXgsIHdheXBvaW50KSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50c1tpbmRleF0gPSB0aGlzLl9ub3JtYWxpemVXYXlwb2ludCh3YXlwb2ludCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvID0gdGhpcy5vcmlnaW4sXG4gICAgICAgICAgICBkID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IGQ7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBvO1xuICAgICAgICB0aGlzLl93YXlwb2ludHMucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMuZmlyZSgnb3JpZ2luJywge29yaWdpbjogdGhpcy5vcmlnaW59KVxuICAgICAgICAgICAgLmZpcmUoJ2Rlc3RpbmF0aW9uJywge2Rlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9ufSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHNlbGVjdFJvdXRlOiBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgdGhpcy5maXJlKCdzZWxlY3RSb3V0ZScsIHtyb3V0ZTogcm91dGV9KTtcbiAgICB9LFxuXG4gICAgaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFJvdXRlJywge3JvdXRlOiByb3V0ZX0pO1xuICAgIH0sXG5cbiAgICBoaWdobGlnaHRTdGVwOiBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2hpZ2hsaWdodFN0ZXAnLCB7c3RlcDogc3RlcH0pO1xuICAgIH0sXG5cbiAgICBxdWVyeVVSTDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvL3ZhciB0ZW1wbGF0ZSA9IERpcmVjdGlvbnMuVVJMX1RFTVBMQVRFLFxuICAgICAgICAgICAgLy90b2tlbiA9IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiB8fCBMLm1hcGJveC5hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgIC8vcHJvZmlsZSA9IHRoaXMuZ2V0UHJvZmlsZSgpLFxuICAgICAgICAgICAgLy9wb2ludHMgPSBbdGhpcy5vcmlnaW5dLmNvbmNhdCh0aGlzLl93YXlwb2ludHMpLmNvbmNhdChbdGhpcy5kZXN0aW5hdGlvbl0pLm1hcChmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiBwb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgIC8vfSkuam9pbignOycpO1xuXG4gICAgICAgIC8vaWYgKEwubWFwYm94LmZlZWRiYWNrKSB7XG4gICAgICAgICAgICAvL0wubWFwYm94LmZlZWRiYWNrLnJlY29yZCh7ZGlyZWN0aW9uczogcHJvZmlsZSArICc7JyArIHBvaW50c30pO1xuICAgICAgICAvL31cblxuICAgICAgICAvL3JldHVybiBMLlV0aWwudGVtcGxhdGUodGVtcGxhdGUsIHtcbiAgICAgICAgICAgIC8vdG9rZW46IHRva2VuLFxuICAgICAgICAgICAgLy9wcm9maWxlOiBwcm9maWxlLFxuICAgICAgICAgICAgLy93YXlwb2ludHM6IHBvaW50c1xuICAgICAgICAvL30pO1xuICAgICAgICByZXR1cm4gRGlyZWN0aW9ucy5NTVJQX0FQSV9URU1QTEFURTtcbiAgICB9LFxuXG4gICAgcXVlcnlhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yaWdpbigpICYmIHRoaXMuZ2V0RGVzdGluYXRpb24oKTtcbiAgICB9LFxuXG4gICAgcXVlcnk6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGlmICghb3B0cykgb3B0cyA9IHt9O1xuICAgICAgICBpZiAoIXRoaXMucXVlcnlhYmxlKCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLl9xdWVyeSkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnkuYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZXF1ZXN0cyAmJiB0aGlzLl9yZXF1ZXN0cy5sZW5ndGgpIHRoaXMuX3JlcXVlc3RzLmZvckVhY2goZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICB2YXIgcSA9IHF1ZXVlKCk7XG5cbiAgICAgICAgdmFyIHB0cyA9IFt0aGlzLm9yaWdpbiwgdGhpcy5kZXN0aW5hdGlvbl0uY29uY2F0KHRoaXMuX3dheXBvaW50cyk7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHRzKSB7XG4gICAgICAgICAgICBpZiAoIXB0c1tpXS5nZW9tZXRyeS5jb29yZGluYXRlcykge1xuICAgICAgICAgICAgICAgIHEuZGVmZXIoTC5iaW5kKHRoaXMuX2dlb2NvZGUsIHRoaXMpLCBwdHNbaV0sIG9wdHMucHJveGltaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHEuYXdhaXQoTC5iaW5kKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcmUoJ2Vycm9yJywge2Vycm9yOiBlcnIubWVzc2FnZX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVxRGF0YSA9IHtcImlkXCI6IDEsIFwianNvbnJwY1wiOiBcIjIuMFwiLCBcIm1ldGhvZFwiOiBcIm1tcnAuZmluZE11bHRpbW9kYWxQYXRoc1wifTtcbiAgICAgICAgICAgIHJlcURhdGEucGFyYW1zID0gW3RoaXMucHJvZmlsZV07XG5cbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5ID0gcmVxdWVzdCh0aGlzLnF1ZXJ5VVJMKCksIHJlcURhdGEsIEwuYmluZChmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maXJlKCdlcnJvcicsIHtlcnJvcjogZXJyLm1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMgPSByZXNwO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9ucy5yb3V0ZXMuZm9yRWFjaChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGUuZ2VvbWV0cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb2x5bGluZS5kZWNvZGUocm91dGUuZ2VvbWV0cnksIDYpLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5yZXZlcnNlKCk7IH0pXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3JpZ2luLnByb3BlcnRpZXMubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuZGlyZWN0aW9ucy5vcmlnaW47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zLm9yaWdpbiA9IHRoaXMub3JpZ2luO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbi5wcm9wZXJ0aWVzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMuZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZSgnbG9hZCcsIHRoaXMuZGlyZWN0aW9ucyk7XG4gICAgICAgICAgICB9LCB0aGlzKSwgdGhpcyk7XG4gICAgICAgIH0sIHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX2dlb2NvZGU6IGZ1bmN0aW9uKHdheXBvaW50LCBwcm94aW1pdHksIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVxdWVzdHMpIHRoaXMuX3JlcXVlc3RzID0gW107XG4gICAgICAgIHRoaXMuX3JlcXVlc3RzLnB1c2gocmVxdWVzdChMLlV0aWwudGVtcGxhdGUoRGlyZWN0aW9ucy5HRU9DT0RFUl9URU1QTEFURSwge1xuICAgICAgICAgICAgcXVlcnk6IHdheXBvaW50LnByb3BlcnRpZXMucXVlcnksXG4gICAgICAgICAgICB0b2tlbjogdGhpcy5vcHRpb25zLmFjY2Vzc1Rva2VuIHx8IEwubWFwYm94LmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgcHJveGltaXR5OiBwcm94aW1pdHkgPyBbcHJveGltaXR5LmxuZywgcHJveGltaXR5LmxhdF0uam9pbignLCcpIDogJydcbiAgICAgICAgfSksIEwuYmluZChmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcmVzcC5mZWF0dXJlcyB8fCAhcmVzcC5mZWF0dXJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKFwiTm8gcmVzdWx0cyBmb3VuZCBmb3IgcXVlcnkgXCIgKyB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcmVzcC5mZWF0dXJlc1swXS5jZW50ZXI7XG4gICAgICAgICAgICB3YXlwb2ludC5wcm9wZXJ0aWVzLm5hbWUgPSByZXNwLmZlYXR1cmVzWzBdLnBsYWNlX25hbWU7XG5cbiAgICAgICAgICAgIHJldHVybiBjYigpO1xuICAgICAgICB9LCB0aGlzKSkpO1xuICAgIH0sXG5cbiAgICBfdW5sb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3dheXBvaW50cyA9IFtdO1xuICAgICAgICBkZWxldGUgdGhpcy5kaXJlY3Rpb25zO1xuICAgICAgICB0aGlzLmZpcmUoJ3VubG9hZCcpO1xuICAgIH0sXG5cbiAgICBfbm9ybWFsaXplV2F5cG9pbnQ6IGZ1bmN0aW9uICh3YXlwb2ludCkge1xuICAgICAgICBpZiAoIXdheXBvaW50IHx8IHdheXBvaW50LnR5cGUgPT09ICdGZWF0dXJlJykge1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzLFxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuXG4gICAgICAgIGlmICh3YXlwb2ludCBpbnN0YW5jZW9mIEwuTGF0TG5nKSB7XG4gICAgICAgICAgICB3YXlwb2ludCA9IHdheXBvaW50LndyYXAoKTtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gcHJvcGVydGllcy5xdWVyeSA9IFt3YXlwb2ludC5sbmcsIHdheXBvaW50LmxhdF07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdheXBvaW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcHJvcGVydGllcy5xdWVyeSA9IHdheXBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlczogY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG4gICAgICAgIH07XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgRGlyZWN0aW9ucyhvcHRpb25zKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWVycm9ycycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignbG9hZCB1bmxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1lcnJvci1hY3RpdmUnLCBmYWxzZSlcbiAgICAgICAgICAgIC5odG1sKCcnKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2Vycm9yJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29udGFpbmVyXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWVycm9yLWFjdGl2ZScsIHRydWUpXG4gICAgICAgICAgICAuaHRtbCgnJylcbiAgICAgICAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWVycm9yJylcbiAgICAgICAgICAgIC50ZXh0KGUuZXJyb3IpO1xuXG4gICAgICAgIGNvbnRhaW5lclxuICAgICAgICAgICAgLmluc2VydCgnc3BhbicsICdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1lcnJvci1pY29uJyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGR1cmF0aW9uOiBmdW5jdGlvbiAocykge1xuICAgICAgICB2YXIgbSA9IE1hdGguZmxvb3IocyAvIDYwKSxcbiAgICAgICAgICAgIGggPSBNYXRoLmZsb29yKG0gLyA2MCk7XG4gICAgICAgIHMgJT0gNjA7XG4gICAgICAgIG0gJT0gNjA7XG4gICAgICAgIGlmIChoID09PSAwICYmIG0gPT09IDApIHJldHVybiBzICsgJyBzJztcbiAgICAgICAgaWYgKGggPT09IDApIHJldHVybiBtICsgJyBtaW4nO1xuICAgICAgICByZXR1cm4gaCArICcgaCAnICsgbSArICcgbWluJztcbiAgICB9LFxuXG4gICAgaW1wZXJpYWw6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHZhciBtaSA9IG0gLyAxNjA5LjM0NDtcbiAgICAgICAgaWYgKG1pID49IDEwMCkgcmV0dXJuIG1pLnRvRml4ZWQoMCkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDEwKSAgcmV0dXJuIG1pLnRvRml4ZWQoMSkgKyAnIG1pJztcbiAgICAgICAgaWYgKG1pID49IDAuMSkgcmV0dXJuIG1pLnRvRml4ZWQoMikgKyAnIG1pJztcbiAgICAgICAgcmV0dXJuIChtaSAqIDUyODApLnRvRml4ZWQoMCkgKyAnIGZ0JztcbiAgICB9LFxuXG4gICAgbWV0cmljOiBmdW5jdGlvbiAobSkge1xuICAgICAgICBpZiAobSA+PSAxMDAwMDApIHJldHVybiAobSAvIDEwMDApLnRvRml4ZWQoMCkgKyAnIGttJztcbiAgICAgICAgaWYgKG0gPj0gMTAwMDApICByZXR1cm4gKG0gLyAxMDAwKS50b0ZpeGVkKDEpICsgJyBrbSc7XG4gICAgICAgIGlmIChtID49IDEwMCkgICAgcmV0dXJuIChtIC8gMTAwMCkudG9GaXhlZCgyKSArICcga20nO1xuICAgICAgICByZXR1cm4gbS50b0ZpeGVkKDApICsgJyBtJztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgPSByZXF1aXJlKCcuLi9saWIvZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuICAgIHZhciBvcmlnQ2hhbmdlID0gZmFsc2UsXG4gICAgICAgIGRlc3RDaGFuZ2UgPSBmYWxzZTtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLWlucHV0cycsIHRydWUpO1xuXG4gICAgdmFyIHB1YmxpY1RyYW5zaXRTZWxlY3Rpb24gPSBbXTtcblxuICAgIHZhciBmb3JtID0gY29udGFpbmVyLmFwcGVuZCgnZm9ybScpXG4gICAgICAgIC5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZDMuZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9yaWdDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0T3JpZ2luKG9yaWdpbklucHV0LnByb3BlcnR5KCd2YWx1ZScpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGVzdENoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScpKTtcblxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLnF1ZXJ5KHsgcHJveGltaXR5OiBtYXAuZ2V0Q2VudGVyKCkgfSk7XG5cbiAgICAgICAgICAgICAgICBvcmlnQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVzdENoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHZhciBvcmlnaW4gPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLW9yaWdpbicpO1xuXG4gICAgb3JpZ2luLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWZvcm0tbGFiZWwnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbnMuZ2V0T3JpZ2luKCkgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhkaXJlY3Rpb25zLmdldE9yaWdpbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1kZXBhcnQtaWNvbicpO1xuXG4gICAgdmFyIG9yaWdpbklucHV0ID0gb3JpZ2luLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21tcnAtb3JpZ2luLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1N0YXJ0JylcbiAgICAgICAgLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFvcmlnQ2hhbmdlKSBvcmlnQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICBvcmlnaW4uYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtaWNvbiBtYXBib3gtY2xvc2UtaWNvbicpXG4gICAgICAgIC5hdHRyKCd0aXRsZScsICdDbGVhciB2YWx1ZScpXG4gICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldE9yaWdpbih1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgIGZvcm0uYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LXJldmVyc2UtaWNvbiBtYXBib3gtZGlyZWN0aW9ucy1yZXZlcnNlLWlucHV0JylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ1JldmVyc2Ugb3JpZ2luICYgZGVzdGluYXRpb24nKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5yZXZlcnNlKCkucXVlcnkoKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgZGVzdGluYXRpb24gPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWRlc3RpbmF0aW9uJyk7XG5cbiAgICBkZXN0aW5hdGlvbi5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1mb3JtLWxhYmVsJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkgaW5zdGFuY2VvZiBMLkxhdExuZykge1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhkaXJlY3Rpb25zLmdldERlc3RpbmF0aW9uKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLWljb24gbWFwYm94LWFycml2ZS1pY29uJyk7XG5cbiAgICB2YXIgZGVzdGluYXRpb25JbnB1dCA9IGRlc3RpbmF0aW9uLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21tcnAtZGVzdGluYXRpb24taW5wdXQnKVxuICAgICAgICAuYXR0cigncGxhY2Vob2xkZXInLCAnRW5kJylcbiAgICAgICAgLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFkZXN0Q2hhbmdlKSBkZXN0Q2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICBkZXN0aW5hdGlvbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC1jbG9zZS1pY29uJylcbiAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0NsZWFyIHZhbHVlJylcbiAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbnMuc2V0RGVzdGluYXRpb24odW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgY2FyX3Byb2ZpbGUgPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21tcnAtY2FyLXByb2ZpbGVzJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGUnKTtcblxuICAgIGNhcl9wcm9maWxlLmFwcGVuZCgnaDMnKVxuICAgICAgICAuYXR0cigndmFsdWUnLCAnRFJJVklORycpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICdtYXJnaW46IDVweCAwcHggMHB4IDVweCcpXG4gICAgICAgIC50ZXh0KCdEUklWSU5HIE9QVElPTlMnKTtcblxuICAgIGNhcl9wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdjaGVja2JveCcpXG4gICAgICAgIC5hdHRyKCduYW1lJywgJ3Byb2ZpbGUnKVxuICAgICAgICAuYXR0cignaWQnLCAnbW1ycC1wcm9maWxlLXByaXZhdGUtY2FyJylcbiAgICAgICAgLnByb3BlcnR5KCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGNhclBhcmtpbmcucHJvcGVydHkoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNhclBhcmtpbmcucHJvcGVydHkoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaXNEcml2aW5nRGlzdExpbWl0ZWQucHJvcGVydHkoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUxpbWl0LnByb3BlcnR5KCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhclBhcmtpbmcucHJvcGVydHkoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2FyUGFya2luZy5wcm9wZXJ0eSgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZUxpbWl0LnByb3BlcnR5KCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRQcm9maWxlKCdoYXNfcHJpdmF0ZV9jYXInLCB0aGlzLmNoZWNrZWQpO1xuICAgICAgICB9KTtcblxuICAgIGNhcl9wcm9maWxlLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignZm9yJywgJ21tcnAtcHJvZmlsZS1wcml2YXRlLWNhcicpXG4gICAgICAgIC50ZXh0KCdQcml2YXRlIGNhciBhdmFpbGFibGUgb24gZGVwYXJ0dXJlJyk7XG5cbiAgICB2YXIgY2FyUGFya2luZyA9IGNhcl9wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdjaGVja2JveCcpXG4gICAgICAgIC5hdHRyKCduYW1lJywgJ3Byb2ZpbGUnKVxuICAgICAgICAuYXR0cignaWQnLCAnbW1ycC1wcm9maWxlLWNhci1wYXJraW5nJylcbiAgICAgICAgLnByb3BlcnR5KCdjaGVja2VkJywgdHJ1ZSlcbiAgICAgICAgLnByb3BlcnR5KCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldFByb2ZpbGUoJ25lZWRfcGFya2luZycsIHRoaXMuY2hlY2tlZCk7XG4gICAgICAgIH0pO1xuXG4gICAgY2FyX3Byb2ZpbGUuYXBwZW5kKCdsYWJlbCcpXG4gICAgICAgIC5hdHRyKCdmb3InLCAnbW1ycC1wcm9maWxlLWNhci1wYXJraW5nJylcbiAgICAgICAgLnRleHQoJ05lZWQgcGFya2luZyBmb3IgdGhlIGNhcicpO1xuXG4gICAgdmFyIGlzRHJpdmluZ0Rpc3RMaW1pdGVkID0gY2FyX3Byb2ZpbGUuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAnZHJpdmluZy1wcm9maWxlJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2RyaXZpbmctZGlzdGFuY2UtbGltaXQnKVxuICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCB0cnVlKVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2VMaW1pdC5wcm9wZXJ0eSgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGlzdGFuY2VMaW1pdC5wcm9wZXJ0eSgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICBjYXJfcHJvZmlsZS5hcHBlbmQoJ2xhYmVsJylcbiAgICAgICAgLmF0dHIoJ2ZvcicsICdkcml2aW5nLWRpc3RhbmNlLWxpbWl0JylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3dpZHRoOiAxNTBweCcpXG4gICAgICAgIC50ZXh0KCdEaXN0YW5jZSBsaW1pdCAoa20pOiAnKTtcblxuICAgIHZhciBkaXN0YW5jZUxpbWl0ID0gY2FyX3Byb2ZpbGUuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ251bWJlcicpXG4gICAgICAgIC5hdHRyKCdtaW4nLCAnMTAnKVxuICAgICAgICAuYXR0cignbWF4JywgJzI2MTcnKVxuICAgICAgICAucHJvcGVydHkoJ3ZhbHVlJywgJzUwMCcpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtbXJwLWRyaXZpbmctZGlzdGFuY2UtbGltaXQnKVxuICAgICAgICAuYXR0cignc3R5bGUnLCAnd2lkdGg6IDgwcHg7cGFkZGluZy1sZWZ0OiAxMHB4O3BhZGRpbmctdG9wOiAycHg7cGFkZGluZy1ib3R0b206IDJweDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMSk7aGVpZ2h0OiAzMHB4O3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7Jyk7XG5cbiAgICB2YXIgcHVibGljX3Byb2ZpbGUgPSBmb3JtLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21tcnAtcHVibGljLXByb2ZpbGVzJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcGJveC1kaXJlY3Rpb25zLXByb2ZpbGUnKTtcblxuICAgIHB1YmxpY19wcm9maWxlLmFwcGVuZCgnaDMnKVxuICAgICAgICAuYXR0cigndmFsdWUnLCAnUFVCTElDIFRSQU5TSVQnKVxuICAgICAgICAuYXR0cignc3R5bGUnLCAnbWFyZ2luOiA1cHggMHB4IDBweCA1cHgnKVxuICAgICAgICAudGV4dCgnUFVCTElDIFRSQU5TSVQgUFJFRkVSRU5DRVMnKTtcblxuICAgIHZhciBwdWJsaWNfcHJvZmlsZXMgPSBwdWJsaWNfcHJvZmlsZS5zZWxlY3RBbGwoJ3NwYW4nKVxuICAgICAgICAuZGF0YShbXG4gICAgICAgICAgICBbJ21tcnAuc3VidXJiYW4nLCAnc3VidXJiYW4nLCAnU3VidXJiYW4nXSxcbiAgICAgICAgICAgIFsnbW1ycC51bmRlcmdyb3VuZCcsICd1bmRlcmdyb3VuZCcsICdVbmRlcmdyb3VuZCddLFxuICAgICAgICAgICAgWydtbXJwLnRyYW0nLCAndHJhbScsICdUcmFtJ11dKVxuICAgICAgICAuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdzcGFuJyk7XG5cbiAgICBwdWJsaWNfcHJvZmlsZXMuYXBwZW5kKCdpbnB1dCcpXG4gICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAncHJvZmlsZScpXG4gICAgICAgIC5hdHRyKCdpZCcsIGZ1bmN0aW9uIChkKSB7IHJldHVybiAnbW1ycC1wcm9maWxlLScgKyBkWzFdOyB9KVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcHVibGljVHJhbnNpdFNlbGVjdGlvbi5wdXNoKGRbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gcHVibGljVHJhbnNpdFNlbGVjdGlvbi5pbmRleE9mKGRbMV0pO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY1RyYW5zaXRTZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgcHVibGljX3Byb2ZpbGVzLmFwcGVuZCgnbGFiZWwnKVxuICAgICAgICAuYXR0cignZm9yJywgZnVuY3Rpb24gKGQpIHsgcmV0dXJuICdtbXJwLXByb2ZpbGUtJyArIGRbMV07IH0pXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7IHJldHVybiBkWzJdOyB9KTtcblxuICAgIHB1YmxpY19wcm9maWxlLmFwcGVuZCgnaW5wdXQnKVxuICAgICAgICAuYXR0cigndHlwZScsICdidXR0b24nKVxuICAgICAgICAuYXR0cigndmFsdWUnLCAnRmluZCBtdWx0aW1vZGFsIHBhdGhzJylcbiAgICAgICAgLmF0dHIoJ25hbWUnLCAnZmluZCBwYXRocycpXG4gICAgICAgIC5hdHRyKCdpZCcsICdmaW5kLW1tcGF0aHMnKVxuICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgIGlmIChpc0RyaXZpbmdEaXN0TGltaXRlZC5wcm9wZXJ0eSgnY2hlY2tlZCcpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5zZXRQcm9maWxlKCdkcml2aW5nX2Rpc3RhbmNlX2xpbWl0JywgZGlzdGFuY2VMaW1pdC5wcm9wZXJ0eSgndmFsdWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNldFByb2ZpbGUoJ2F2YWlsYWJsZV9wdWJsaWNfbW9kZXMnLCBwdWJsaWNUcmFuc2l0U2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRpcmVjdGlvbnMuZ2V0UHJvZmlsZSgpKSk7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0KHdheXBvaW50KSB7XG4gICAgICAgIGlmICghd2F5cG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSBlbHNlIGlmICh3YXlwb2ludC5wcm9wZXJ0aWVzLm5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5wcm9wZXJ0aWVzLm5hbWU7XG4gICAgICAgIH0gZWxzZSBpZiAod2F5cG9pbnQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHZhciBwcmVjaXNpb24gPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoTWF0aC5sb2cobWFwLmdldFpvb20oKSkgLyBNYXRoLkxOMikpO1xuICAgICAgICAgICAgcmV0dXJuIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLnRvRml4ZWQocHJlY2lzaW9uKSArICcsICcgK1xuICAgICAgICAgICAgICAgICAgIHdheXBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLnRvRml4ZWQocHJlY2lzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3YXlwb2ludC5wcm9wZXJ0aWVzLnF1ZXJ5IHx8ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlyZWN0aW9uc1xuICAgICAgICAub24oJ29yaWdpbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBvcmlnaW5JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5vcmlnaW4pKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdkZXN0aW5hdGlvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigncHJvZmlsZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBwcm9maWxlcy5zZWxlY3RBbGwoJ2lucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcGVydHkoJ2NoZWNrZWQnLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZFswXSA9PT0gZS5wcm9maWxlOyB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG9yaWdpbklucHV0LnByb3BlcnR5KCd2YWx1ZScsIGZvcm1hdChlLm9yaWdpbikpO1xuICAgICAgICAgICAgZGVzdGluYXRpb25JbnB1dC5wcm9wZXJ0eSgndmFsdWUnLCBmb3JtYXQoZS5kZXN0aW5hdGlvbikpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBjb250cm9sO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzID0gcmVxdWlyZSgnLi4vbGliL2QzJyksXG4gICAgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkaXJlY3Rpb25zKSB7XG4gICAgdmFyIGNvbnRyb2wgPSB7fSwgbWFwO1xuXG4gICAgY29udHJvbC5hZGRUbyA9IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgIG1hcCA9IF87XG4gICAgICAgIHJldHVybiBjb250cm9sO1xuICAgIH07XG5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoTC5Eb21VdGlsLmdldChjb250YWluZXIpKVxuICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtaW5zdHJ1Y3Rpb25zJywgdHJ1ZSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29udGFpbmVyLmh0bWwoJycpO1xuICAgIH0pO1xuXG4gICAgZGlyZWN0aW9ucy5vbignc2VsZWN0Um91dGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcm91dGUgPSBlLnJvdXRlO1xuXG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcblxuICAgICAgICB2YXIgc3RlcHMgPSBjb250YWluZXIuYXBwZW5kKCdvbCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcHMnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmRhdGEocm91dGUuc3RlcHMpXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwJyk7XG5cbiAgICAgICAgc3RlcHMuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdtYXBib3gtZGlyZWN0aW9ucy1pY29uIG1hcGJveC0nICsgc3RlcC5tYW5ldXZlci50eXBlLnJlcGxhY2UoL1xccysvZywgJy0nKS50b0xvd2VyQ2FzZSgpICsgJy1pY29uJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBib3gtZGlyZWN0aW9ucy1zdGVwLW1hbmV1dmVyJylcbiAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uIChzdGVwKSB7IHJldHVybiBzdGVwLm1hbmV1dmVyLmluc3RydWN0aW9uOyB9KTtcblxuICAgICAgICBzdGVwcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtc3RlcC1kaXN0YW5jZScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGVwLmRpc3RhbmNlID8gZm9ybWF0W2RpcmVjdGlvbnMub3B0aW9ucy51bml0c10oc3RlcC5kaXN0YW5jZSkgOiAnJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoc3RlcCkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRTdGVwKHN0ZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGVwcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFN0ZXAobnVsbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0ZXBzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBtYXAucGFuVG8oTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKHN0ZXAubWFuZXV2ZXIubG9jYXRpb24uY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG5cbnZhciBMYXllciA9IEwuTGF5ZXJHcm91cC5leHRlbmQoe1xuICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcmVhZG9ubHk6IGZhbHNlXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpcmVjdGlvbnMsIG9wdGlvbnMpIHtcbiAgICAgICAgTC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zID0gZGlyZWN0aW9ucyB8fCBuZXcgTC5EaXJlY3Rpb25zKCk7XG4gICAgICAgIEwuTGF5ZXJHcm91cC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzKTtcblxuICAgICAgICB0aGlzLl9kcmFnID0gZGVib3VuY2UoTC5iaW5kKHRoaXMuX2RyYWcsIHRoaXMpLCAxMDApO1xuXG4gICAgICAgIHRoaXMub3JpZ2luTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBkcmFnZ2FibGU6ICF0aGlzLm9wdGlvbnMucmVhZG9ubHksXG4gICAgICAgICAgICBpY29uOiBMLm1hcGJveC5tYXJrZXIuaWNvbih7XG4gICAgICAgICAgICAgICAgJ21hcmtlci1zaXplJzogJ21lZGl1bScsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1jb2xvcic6ICcjM0JCMkQwJyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLXN5bWJvbCc6ICdhJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTWFya2VyID0gTC5tYXJrZXIoWzAsIDBdLCB7XG4gICAgICAgICAgICBkcmFnZ2FibGU6ICF0aGlzLm9wdGlvbnMucmVhZG9ubHksXG4gICAgICAgICAgICBpY29uOiBMLm1hcGJveC5tYXJrZXIuaWNvbih7XG4gICAgICAgICAgICAgICAgJ21hcmtlci1zaXplJzogJ21lZGl1bScsXG4gICAgICAgICAgICAgICAgJ21hcmtlci1jb2xvcic6ICcjNDQ0JyxcbiAgICAgICAgICAgICAgICAnbWFya2VyLXN5bWJvbCc6ICdiJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkub24oJ2RyYWcnLCB0aGlzLl9kcmFnLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnN0ZXBNYXJrZXIgPSBMLm1hcmtlcihbMCwgMF0sIHtcbiAgICAgICAgICAgIGljb246IEwuZGl2SWNvbih7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbWFwYm94LW1hcmtlci1kcmFnLWljb24gbWFwYm94LW1hcmtlci1kcmFnLWljb24tc3RlcCcsXG4gICAgICAgICAgICAgICAgaWNvblNpemU6IG5ldyBMLlBvaW50KDEyLCAxMilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZHJhZ01hcmtlciA9IEwubWFya2VyKFswLCAwXSwge1xuICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgaWNvbjogdGhpcy5fd2F5cG9pbnRJY29uKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kcmFnTWFya2VyXG4gICAgICAgICAgICAub24oJ2RyYWdzdGFydCcsIHRoaXMuX2RyYWdTdGFydCwgdGhpcylcbiAgICAgICAgICAgIC5vbignZHJhZycsIHRoaXMuX2RyYWcsIHRoaXMpXG4gICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICB0aGlzLnJvdXRlTGF5ZXIgPSBMLmdlb0pzb24oKTtcbiAgICAgICAgdGhpcy5yb3V0ZUhpZ2hsaWdodExheWVyID0gTC5nZW9Kc29uKCk7XG5cbiAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMgPSBbXTtcbiAgICB9LFxuXG4gICAgb25BZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBMLkxheWVyR3JvdXAucHJvdG90eXBlLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVhZG9ubHkpIHtcbiAgICAgICAgICB0aGlzLl9tYXBcbiAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX2NsaWNrLCB0aGlzKVxuICAgICAgICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zXG4gICAgICAgICAgICAub24oJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignZGVzdGluYXRpb24nLCB0aGlzLl9kZXN0aW5hdGlvbiwgdGhpcylcbiAgICAgICAgICAgIC5vbignbG9hZCcsIHRoaXMuX2xvYWQsIHRoaXMpXG4gICAgICAgICAgICAub24oJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vbignc2VsZWN0Um91dGUnLCB0aGlzLl9zZWxlY3RSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0Um91dGUnLCB0aGlzLl9oaWdobGlnaHRSb3V0ZSwgdGhpcylcbiAgICAgICAgICAgIC5vbignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbnNcbiAgICAgICAgICAgIC5vZmYoJ29yaWdpbicsIHRoaXMuX29yaWdpbiwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ2Rlc3RpbmF0aW9uJywgdGhpcy5fZGVzdGluYXRpb24sIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdsb2FkJywgdGhpcy5fbG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3VubG9hZCcsIHRoaXMuX3VubG9hZCwgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ3NlbGVjdFJvdXRlJywgdGhpcy5fc2VsZWN0Um91dGUsIHRoaXMpXG4gICAgICAgICAgICAub2ZmKCdoaWdobGlnaHRSb3V0ZScsIHRoaXMuX2hpZ2hsaWdodFJvdXRlLCB0aGlzKVxuICAgICAgICAgICAgLm9mZignaGlnaGxpZ2h0U3RlcCcsIHRoaXMuX2hpZ2hsaWdodFN0ZXAsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX21hcFxuICAgICAgICAgICAgLm9mZignY2xpY2snLCB0aGlzLl9jbGljaywgdGhpcylcbiAgICAgICAgICAgIC5vZmYoJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlbW92ZSwgdGhpcyk7XG5cbiAgICAgICAgTC5MYXllckdyb3VwLnByb3RvdHlwZS5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBfY2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJlY3Rpb25zLmdldE9yaWdpbigpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihlLmxhdGxuZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2RpcmVjdGlvbnMuZ2V0RGVzdGluYXRpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5zZXREZXN0aW5hdGlvbihlLmxhdGxuZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9ucy5xdWVyeWFibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5xdWVyeSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9tb3VzZW1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJvdXRlTGF5ZXIgfHwgIXRoaXMuaGFzTGF5ZXIodGhpcy5yb3V0ZUxheWVyKSB8fCB0aGlzLl9jdXJyZW50V2F5cG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHAgPSB0aGlzLl9yb3V0ZVBvbHlsaW5lKCkuY2xvc2VzdExheWVyUG9pbnQoZS5sYXllclBvaW50KTtcblxuICAgICAgICBpZiAoIXAgfHwgcC5kaXN0YW5jZSA+IDE1KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVMYXllcih0aGlzLmRyYWdNYXJrZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG0gPSB0aGlzLl9tYXAucHJvamVjdChlLmxhdGxuZyksXG4gICAgICAgICAgICBvID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy5vcmlnaW5NYXJrZXIuZ2V0TGF0TG5nKCkpLFxuICAgICAgICAgICAgZCA9IHRoaXMuX21hcC5wcm9qZWN0KHRoaXMuZGVzdGluYXRpb25NYXJrZXIuZ2V0TGF0TG5nKCkpO1xuXG4gICAgICAgIGlmIChvLmRpc3RhbmNlVG8obSkgPCAxNSB8fCBkLmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kcmFnTWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5fbWFwLnByb2plY3QodGhpcy53YXlwb2ludE1hcmtlcnNbaV0uZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgaWYgKGkgIT09IHRoaXMuX2N1cnJlbnRXYXlwb2ludCAmJiB3LmRpc3RhbmNlVG8obSkgPCAxNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUxheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdNYXJrZXIuc2V0TGF0TG5nKHRoaXMuX21hcC5sYXllclBvaW50VG9MYXRMbmcocCkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuZHJhZ01hcmtlcik7XG4gICAgfSxcblxuICAgIF9vcmlnaW46IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUub3JpZ2luICYmIGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbk1hcmtlci5zZXRMYXRMbmcoTC5HZW9KU09OLmNvb3Jkc1RvTGF0TG5nKGUub3JpZ2luLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMub3JpZ2luTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5vcmlnaW5NYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kZXN0aW5hdGlvbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5kZXN0aW5hdGlvbiAmJiBlLmRlc3RpbmF0aW9uLmdlb21ldHJ5LmNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5kZXN0aW5hdGlvbi5nZW9tZXRyeS5jb29yZGluYXRlcykpO1xuICAgICAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRlc3RpbmF0aW9uTWFya2VyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy5kZXN0aW5hdGlvbk1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuZHJhZ01hcmtlcikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFdheXBvaW50ID0gdGhpcy5fZmluZFdheXBvaW50SW5kZXgoZS50YXJnZXQuZ2V0TGF0TG5nKCkpO1xuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9ucy5hZGRXYXlwb2ludCh0aGlzLl9jdXJyZW50V2F5cG9pbnQsIGUudGFyZ2V0LmdldExhdExuZygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRXYXlwb2ludCA9IHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kcmFnOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBsYXRMbmcgPSBlLnRhcmdldC5nZXRMYXRMbmcoKTtcblxuICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMub3JpZ2luTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldE9yaWdpbihsYXRMbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmRlc3RpbmF0aW9uTWFya2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldERlc3RpbmF0aW9uKGxhdExuZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnNldFdheXBvaW50KHRoaXMuX2N1cnJlbnRXYXlwb2ludCwgbGF0TG5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5YWJsZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnF1ZXJ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RyYWdFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50V2F5cG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIF9yZW1vdmVXYXlwb2ludDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb25zLnJlbW92ZVdheXBvaW50KHRoaXMud2F5cG9pbnRNYXJrZXJzLmluZGV4T2YoZS50YXJnZXQpKS5xdWVyeSgpO1xuICAgIH0sXG5cbiAgICBfbG9hZDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLl9vcmlnaW4oZSk7XG4gICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uKGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdheXBvaW50TGF0TG5nKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS53YXlwb2ludHNbaV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGwgPSBNYXRoLm1pbih0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGgsIGUud2F5cG9pbnRzLmxlbmd0aCksXG4gICAgICAgICAgICBpID0gMDtcblxuICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmdcbiAgICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMud2F5cG9pbnRNYXJrZXJzW2ldLnNldExhdExuZyh3YXlwb2ludExhdExuZyhpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgbmV3XG4gICAgICAgIGZvciAoOyBpIDwgZS53YXlwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3YXlwb2ludE1hcmtlciA9IEwubWFya2VyKHdheXBvaW50TGF0TG5nKGkpLCB7XG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiAhdGhpcy5vcHRpb25zLnJlYWRvbmx5LFxuICAgICAgICAgICAgICAgIGljb246IHRoaXMuX3dheXBvaW50SWNvbigpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2F5cG9pbnRNYXJrZXJcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5fcmVtb3ZlV2F5cG9pbnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnc3RhcnQnLCB0aGlzLl9kcmFnU3RhcnQsIHRoaXMpXG4gICAgICAgICAgICAgICAgLm9uKCdkcmFnJywgdGhpcy5fZHJhZywgdGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLl9kcmFnRW5kLCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy53YXlwb2ludE1hcmtlcnMucHVzaCh3YXlwb2ludE1hcmtlcik7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHdheXBvaW50TWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBvbGRcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXllcih0aGlzLndheXBvaW50TWFya2Vyc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGggPSBlLndheXBvaW50cy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF91bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVMYXllcik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy53YXlwb2ludE1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTGF5ZXIodGhpcy53YXlwb2ludE1hcmtlcnNbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZWxlY3RSb3V0ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnJvdXRlTGF5ZXJcbiAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAuYWRkRGF0YShlLnJvdXRlLmdlb21ldHJ5KTtcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnJvdXRlTGF5ZXIpO1xuICAgIH0sXG5cbiAgICBfaGlnaGxpZ2h0Um91dGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVIaWdobGlnaHRMYXllclxuICAgICAgICAgICAgICAgIC5jbGVhckxheWVycygpXG4gICAgICAgICAgICAgICAgLmFkZERhdGEoZS5yb3V0ZS5nZW9tZXRyeSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMucm91dGVIaWdobGlnaHRMYXllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZ2hsaWdodFN0ZXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc3RlcCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwTWFya2VyLnNldExhdExuZyhMLkdlb0pTT04uY29vcmRzVG9MYXRMbmcoZS5zdGVwLm1hbmV1dmVyLmxvY2F0aW9uLmNvb3JkaW5hdGVzKSk7XG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKHRoaXMuc3RlcE1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JvdXRlUG9seWxpbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZUxheWVyLmdldExheWVycygpWzBdO1xuICAgIH0sXG5cbiAgICBfZmluZFdheXBvaW50SW5kZXg6IGZ1bmN0aW9uKGxhdExuZykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHRoaXMuX2ZpbmROZWFyZXN0Um91dGVTZWdtZW50KGxhdExuZyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLl9maW5kTmVhcmVzdFJvdXRlU2VnbWVudCh0aGlzLndheXBvaW50TWFya2Vyc1tpXS5nZXRMYXRMbmcoKSk7XG4gICAgICAgICAgICBpZiAocyA+IHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLndheXBvaW50TWFya2Vycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIF9maW5kTmVhcmVzdFJvdXRlU2VnbWVudDogZnVuY3Rpb24obGF0TG5nKSB7XG4gICAgICAgIHZhciBtaW4gPSBJbmZpbml0eSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgcCA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0TG5nKSxcbiAgICAgICAgICAgIHBvc2l0aW9ucyA9IHRoaXMuX3JvdXRlUG9seWxpbmUoKS5fb3JpZ2luYWxQb2ludHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkID0gTC5MaW5lVXRpbC5fc3FDbG9zZXN0UG9pbnRPblNlZ21lbnQocCwgcG9zaXRpb25zW2kgLSAxXSwgcG9zaXRpb25zW2ldLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChkIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgbWluID0gZDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcblxuICAgIF93YXlwb2ludEljb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTC5kaXZJY29uKHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcGJveC1tYXJrZXItZHJhZy1pY29uJyxcbiAgICAgICAgICAgIGljb25TaXplOiBuZXcgTC5Qb2ludCgxMiwgMTIpXG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRpcmVjdGlvbnMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IExheWVyKGRpcmVjdGlvbnMsIG9wdGlvbnMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQzcG9zdCA9IHJlcXVpcmUoJy4vZDNfcG9zdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgcmVxRGF0YSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZDNwb3N0KHVybCwgcmVxRGF0YSwgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICBpZiAoZXJyICYmIGVyci50eXBlID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyICYmICFlcnIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3AgPSByZXNwIHx8IGVycjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZSk7XG4gICAgICAgICAgICBhbGVydChcInBhcnNlZCByZXNwb25zZSBib2R5IGluIHJlcXVlc3QuanM6IFwiICsgSlNPTi5zdHJpbmdpZnkocmVzcCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3ApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlc3AuZXJyb3IpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkMyA9IHJlcXVpcmUoJy4uL2xpYi9kMycpLFxuICAgIGZvcm1hdCA9IHJlcXVpcmUoJy4vZm9ybWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGlyZWN0aW9ucykge1xuICAgIHZhciBjb250cm9sID0ge30sIG1hcCwgc2VsZWN0aW9uID0gMDtcblxuICAgIGNvbnRyb2wuYWRkVG8gPSBmdW5jdGlvbiAoXykge1xuICAgICAgICBtYXAgPSBfO1xuICAgICAgICByZXR1cm4gY29udHJvbDtcbiAgICB9O1xuXG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KEwuRG9tVXRpbC5nZXQoY29udGFpbmVyKSlcbiAgICAgICAgLmNsYXNzZWQoJ21hcGJveC1kaXJlY3Rpb25zLXJvdXRlcycsIHRydWUpO1xuXG4gICAgZGlyZWN0aW9ucy5vbignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRhaW5lci5odG1sKCcnKTtcbiAgICB9KTtcblxuICAgIGRpcmVjdGlvbnMub24oJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb250YWluZXIuaHRtbCgnJyk7XG5cbiAgICAgICAgdmFyIHJvdXRlcyA9IGNvbnRhaW5lci5hcHBlbmQoJ3VsJylcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5kYXRhKGUucm91dGVzKVxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUnKTtcblxuICAgICAgICByb3V0ZXMuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtaGVhZGluZycpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuICdSb3V0ZSAnICsgKGUucm91dGVzLmluZGV4T2Yocm91dGUpICsgMSk7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtc3VtbWFyeScpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlLnN1bW1hcnk7IH0pO1xuXG4gICAgICAgIHJvdXRlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtZGV0YWlscycpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0W2RpcmVjdGlvbnMub3B0aW9ucy51bml0c10ocm91dGUuZGlzdGFuY2UpICsgJywgJyArIGZvcm1hdC5kdXJhdGlvbihyb3V0ZS5kdXJhdGlvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9ucy5oaWdobGlnaHRSb3V0ZShyb3V0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlcy5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLmhpZ2hsaWdodFJvdXRlKG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb25zLnNlbGVjdFJvdXRlKHJvdXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlyZWN0aW9ucy5zZWxlY3RSb3V0ZShlLnJvdXRlc1swXSk7XG4gICAgfSk7XG5cbiAgICBkaXJlY3Rpb25zLm9uKCdzZWxlY3RSb3V0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXBib3gtZGlyZWN0aW9ucy1yb3V0ZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgnbWFwYm94LWRpcmVjdGlvbnMtcm91dGUtYWN0aXZlJywgZnVuY3Rpb24gKHJvdXRlKSB7IHJldHVybiByb3V0ZSA9PT0gZS5yb3V0ZTsgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udHJvbDtcbn07XG4iXX0=
;