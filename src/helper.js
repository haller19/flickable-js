// Generated by CoffeeScript 1.6.2
define(function() {
  return (function(global, document) {
    "use strict";
    var Helper;

    return Helper = (function() {
      function Helper() {
        this.div = document.createElement("div");
        this.prefixes = ["webkit", "moz", "o", "ms"];
        this.saveProp = {};
      }

      Helper.prototype.getPage = function(event, page) {
        if (event.changedTouches) {
          return event.changedTouches[0][page];
        } else {
          return event[page];
        }
      };

      Helper.prototype.hasProp = function(props) {
        var prop, _i, _len;

        if (props instanceof Array) {
          for (_i = 0, _len = props.length; _i < _len; _i++) {
            prop = props[_i];
            if (this.div.style[prop] !== void 0) {
              return true;
            }
          }
          return false;
        } else if (typeof props === "string") {
          if (this.div.style[prop] !== void 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return null;
        }
      };

      Helper.prototype.setStyle = function(element, styles) {
        var hasSaveProp, prop, set, style, _results,
          _this = this;

        style = element.style;
        hasSaveProp = this.saveProp[prop];
        set = function(style, prop, val) {
          var prefix, _i, _len, _prop, _ref;

          if (hasSaveProp) {
            return style[hasSaveProp] = val;
          } else if (style[prop] !== void 0) {
            _this.saveProp[prop] = prop;
            return style[prop] = val;
          } else {
            _ref = _this.prefixes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prefix = _ref[_i];
              _prop = _this.ucFirst(prefix) + _this.ucFirst(prop);
              if (style[_prop] !== void 0) {
                _this.saveProp[prop] = _prop;
                style[_prop] = val;
                return true;
              }
            }
            return false;
          }
        };
        _results = [];
        for (prop in styles) {
          _results.push(set(style, prop, styles[prop]));
        }
        return _results;
      };

      Helper.prototype.getCSSVal = function(prop) {
        var prefix, ret, _i, _len, _prop, _ref;

        if (typeof prop !== "string") {
          return null;
        } else if (this.div.style[prop] !== void 0) {
          return prop;
        } else {
          _ref = this.prefixes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prefix = _ref[_i];
            _prop = this.ucFirst(prefix) + this.ucFirst(prop);
            if (this.div.style[_prop] !== void 0) {
              ret = "-" + prefix + "-" + prop;
            }
          }
          return ret;
        }
      };

      Helper.prototype.ucFirst = function(str) {
        if (typeof str === "string") {
          return str.charAt(0).toUpperCase() + str.substr(1);
        } else {
          return null;
        }
      };

      Helper.prototype.triggerEvent = function(element, type, bubbles, cancelable, data) {
        var d, event;

        event = document.createElement("Event");
        event.initEvent(type, bubbles, cancelable);
        if (data) {
          for (d in data) {
            event[d] = data[d];
          }
        }
        return element.dispatchEvent(event);
      };

      Helper.prototype.checkBrowser = function() {
        var android, browserName, browserVersion, ios, ua;

        ua = global.navigator.userAgent.toLowerCase();
        ios = ua.match(/(?:iphone\sos|ip[oa]d.*os)\s([\d_]+)/);
        android = ua.match(/(android)\s+([\d.]+)/);
        browserName = (function() {
          if (!!ios) {
            return "ios";
          } else if (!!android) {
            return "android";
          } else {
            return "pc";
          }
        })();
        browserVersion = (function() {
          var version;

          if (!ios && !android) {
            return null;
          }
          version = (ios || android).pop().split(/\D/).join(".");
          return parseFloat(version);
        })();
        return {
          name: browserName,
          version: browserVersion,
          isLegacy: !!android && browserVersion < 3
        };
      };

      Helper.prototype.checkSupport = function() {
        var hasTransform, hasTransform3d, hasTransition;

        hasTransform3d = this.hasProp(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "msPerspective", "OPerspective"]);
        hasTransform = this.hasProp(["transformProperty", "WebkitTransform", "MozTransform", "msTransform", "OTransform"]);
        hasTransition = this.hasProp(["transitionProperty", "WebkitTransitionProperty", "MozTransitionProperty", "msTransitionProperty", "OTransitionProperty"]);
        return {
          touch: "ontouchstart" in global,
          eventListener: "addEventListener" in global,
          transform3d: hasTransform3d,
          transform: hasTransform,
          transition: hasTransition,
          cssAnimation: (function() {
            if (hasTransform3d || hasTransform && hasTransition) {
              return true;
            } else {
              return false;
            }
          })()
        };
      };

      Helper.prototype.checkTouchEvents = function() {
        var hasTouch;

        hasTouch = this.checkSupport.touch;
        return {
          touchStart: hasTouch ? "touchstart" : "mousedown",
          touchMove: hasTouch ? "touchmove" : "mousemove",
          touchEnd: hasTouch ? "touchend" : "mouseup"
        };
      };

      return Helper;

    })();
  })(this, this.document);
});
