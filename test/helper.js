var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

describe("Helper Class", function() {
  var element, flickable, helper, spoofUserAgent;

  element = document.createElement("div");
  element.style.width = "100px";
  element.style.height = "100px";
  flickable = new window.Flickable(element, {});
  helper = flickable.helper;
  spoofUserAgent = function(ua) {
    var _navigator;

    _navigator = window.navigator;
    window.navigator = new Object();
    window.navigator.__proto__ = _navigator;
    return window.navigator.__defineGetter__("userAgent", function() {
      return ua;
    });
  };
  describe(".getPage()", function() {
    var el, moveEvent;

    el = $("<div>");
    moveEvent = __indexOf.call(window, "ontouchstart") >= 0 ? "touchmove" : "mousemove";
    it("click イベントが発火しただけだし pageX は 0 が返ってくる", function() {
      el.on("click", function(event) {
        return expect(helper.getPage(event, "pageX")).to.be(0);
      });
      return el.click();
    });
    it("" + moveEvent + " イベントが発火しただけだし pageY は 0 が返ってくる", function() {
      el.on(moveEvent, function(event) {
        return expect(helper.getPage(event, "pageY")).to.be(0);
      });
      return el.click();
    });
    return it("全く関係ない load イベントとかで取得しようとしても undefined とかじゃね シラネ", function() {
      var evt;

      evt = document.createEvent("Event");
      evt.initEvent("load", false, false);
      return expect(helper.getPage(evt, "pageX")).to.be.a("undefined");
    });
  });
  describe(".hasProp()", function() {
    it("先行実装な CSS Property の配列を渡すと存在するかチェケラする。今どき transform ならあるよね", function() {
      var props;

      props = ["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"];
      return expect(helper.hasProp(props)).to.be["true"];
    });
    it("svgMatrixZ とかいうイミフな String を渡したら当然 false が返ってくる", function() {
      var prop;

      prop = "svgMatrixZ";
      return expect(helper.hasProp(prop)).to.be["false"];
    });
    return it("Array でも String でもないのを渡されても困るので TypeError を投げる", function() {
      return (expect(function() {
        return helper.hasProp(void 0);
      })).to.throwException(function(err) {
        return expect(err).to.be.a(TypeError);
      });
    });
  });
  describe(".setStyle()", function() {
    var el;

    el = document.createElement("div");
    beforeEach(function(done) {
      el.removeAttribute("style");
      helper.saveProp = {};
      return done();
    });
    it("display: none; を追加したから style=\"diplay: none;\" ってなってるはず", function() {
      helper.setStyle(el, {
        display: "none"
      });
      return expect(el.getAttribute("style")).to.be("display: none; ");
    });
    it("プロパティ複数指定したら、指定した順番に style 属性に入ってるはず", function() {
      helper.setStyle(el, {
        display: "none",
        width: "100px",
        height: "100px",
        margin: "0px auto"
      });
      return expect(el.getAttribute("style")).to.be("display: none; width: 100px; height: 100px; margin-top: 0px; margin-right: auto; margin-bottom: 0px; margin-left: auto; ");
    });
    return it("prefix が必要なやつはプロパティはよしなに prefix つけて、よしなに纏めてくれるはず", function() {
      helper.setStyle(el, {
        width: "100px",
        height: "100px",
        transform: "translate(0, 0)",
        transitionTimingFunction: "ease",
        transitionDuration: "0ms"
      });
      return expect(el.getAttribute("style")).to.be("width: 100px; height: 100px; -webkit-transform: translate(0px, 0px); -webkit-transition-timing-function: ease; -webkit-transition-duration: 0ms; ");
    });
  });
  describe(".getCSSVal()", function() {
    var fn;

    fn = function(arg) {
      return helper.getCSSVal(arg);
    };
    it("仮に webkit だとしたら、transform を入れると \"-webkit-transform\" が返ってくる", function() {
      expect(fn("transform")).to.be.a("string");
      return expect(fn("transform")).to.be("-webkit-transform");
    });
    it("width とか prefix なしで余裕なプロパティいれるとありのまま木の実ナナで返ってくる", function() {
      expect(fn("width")).to.be.a("string");
      return expect(fn("width")).to.be("width");
    });
    return it("うっかり配列とか入れたら TypeError 投げつけて激おこプンプン丸", function() {
      return (expect(function() {
        return fn([1, 2, 3]);
      })).to.throwException(function(err) {
        return expect(err).to.be.a(TypeError);
      });
    });
  });
  describe(".ucFirst()", function() {
    it("\"webkitTransform\" とか渡すと \"WebkitTransform\" で返ってくる", function() {
      expect(helper.ucFirst("webkitTransform")).to.be.a("string");
      return expect(helper.ucFirst("webkitTransform")).to.be("WebkitTransform");
    });
    it("String だけどアルファベットじゃない君 (\"123\") はありのままの君", function() {
      expect(helper.ucFirst("123")).to.be.a("string");
      return expect(helper.ucFirst("123")).to.be("123");
    });
    return it("String じゃないものだったら TypeError 投げる", function() {
      return (expect(function() {
        return helper.ucFirst([1, 2, 3]);
      })).to.throwException(function(err) {
        return expect(err).to.be.a(TypeError);
      });
    });
  });
  describe(".triggerEvent()", function() {
    var el;

    el = document.createElement("div");
    it("hoge イベントでも意味なく発火させてみる", function() {
      var eventName, firedFlag,
        _this = this;

      eventName = "hoge";
      this.event = null;
      firedFlag = false;
      el.addEventListener(eventName, function(event) {
        _this.event = event;
        return firedFlag = true;
      }, false);
      helper.triggerEvent(el, eventName, true, false);
      expect(this.event.type).to.be(eventName);
      expect(this.event.bubbles).to.be["true"];
      expect(this.event.cancelable).to.be["false"];
      expect(this.event.data).to.be.a("undefined");
      return expect(firedFlag).to.be["true"];
    });
    it("event 発火と同時にひっさげた data がちゃんと取得できるかな", function() {
      var eventName, firedFlag,
        _this = this;

      eventName = "dataTest";
      this.event = null;
      firedFlag = false;
      el.addEventListener(eventName, function(event) {
        _this.event = event;
        return firedFlag = true;
      }, false);
      helper.triggerEvent(el, eventName, true, false, {
        id: 300,
        name: "山田太郎",
        hasYaruki: null
      });
      expect(this.event.type).to.be(eventName);
      expect(this.event.bubbles).to.be["true"];
      expect(this.event.cancelable).to.be["false"];
      expect(this.event.id).to.be(300);
      expect(this.event.name).to.be("山田太郎");
      expect(this.event.hasYaruki).to.be["null"];
      return expect(firedFlag).to.be["true"];
    });
    return it("対象となる要素の指定がちゃんとされてないと Error を投げる", function() {
      var eventName, firedFlag,
        _this = this;

      eventName = "errTest";
      this.event = null;
      firedFlag = false;
      el.addEventListener(eventName, function(event) {
        _this.event = event;
        return firedFlag = true;
      }, false);
      return (expect(function() {
        return helper.triggerEvent("el", eventName, true, false);
      })).to.throwError();
    });
  });
  describe(".checkBrowser()", function() {
    var fn;

    fn = function(arg) {
      return helper.checkBrowser[arg];
    };
    context("iOS 6.1.3 で試してみました", function() {
      spoofUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329");
      it("name: \"ios\" が返ってくる", function() {
        expect(helper.checkBrowser().name).to.be.a("string");
        return expect(helper.checkBrowser().name).to.be("ios");
      });
      it("version: 6.1 が返ってくる", function() {
        expect(helper.checkBrowser().version).to.be.a("number");
        return expect(helper.checkBrowser().version).to.be(6.1);
      });
      return it("特にレガシーなわけでもないので isLegacy: false が返ってくる", function() {
        return expect(helper.checkBrowser().isLegacy).to.be["false"];
      });
    });
    context("Android 4.0.2 で試してみました", function() {
      before(function() {
        return spoofUserAgent("Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30");
      });
      it("name: \"android\" が返ってくる", function() {
        expect(helper.checkBrowser().name).to.be.a("string");
        return expect(helper.checkBrowser().name).to.be("android");
      });
      it("version: 4 が返ってくる", function() {
        expect(helper.checkBrowser().version).to.be.a("number");
        return expect(helper.checkBrowser().version).to.be(4);
      });
      return it("特にレガシーなわけでもないので isLegacy: false が返ってくる", function() {
        return expect(helper.checkBrowser().isLegacy).to.be["false"];
      });
    });
    return context("Android 2.3.6 で試してみました", function() {
      before(function() {
        return spoofUserAgent("Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1");
      });
      it("name: \"android\" が返ってくる", function() {
        expect(helper.checkBrowser().name).to.be.a("string");
        return expect(helper.checkBrowser().name).to.be("android");
      });
      it("version: 2.3 が返ってくる", function() {
        expect(helper.checkBrowser().version).to.be.a("number");
        return expect(helper.checkBrowser().version).to.be(2.3);
      });
      return it("Android 2.x とかレガシーでとてもク◯ソなので isLegacy: true が返ってくる", function() {
        return expect(helper.checkBrowser().isLegacy).to.be["true"];
      });
    });
  });
  describe(".checkSupport()", function() {
    var fn, hasTouch;

    fn = helper.checkSupport();
    hasTouch = fn.touch;
    return context("WebKit 前提でございやんす", function() {
      if (hasTouch) {
        it("タッチイベントもってるから touch: true が返ってくる", function() {
          return expect(fn.touch).to.be["true"];
        });
      } else {
        it("タッチイベントもってないから touch: false が返ってくる", function() {
          return expect(fn.touch).to.be["false"];
        });
      }
      it("天下の WebKit さんなら Transform3d くらい対応してるはず", function() {
        return expect(fn.transform3d).to.be["true"];
      });
      return it("Transform3d に対応してる、すなわち cssAnimation: true が返ってくる", function() {
        return expect(fn.cssAnimation).to.be["true"];
      });
    });
  });
  describe(".checkTouchEvents()", function() {
    var fn, hasTouch;

    fn = helper.checkTouchEvents();
    hasTouch = helper.checkSupport().touch;
    if (hasTouch) {
      return context("タッチイベント持っていますね", function() {
        it("なもんで start: \"touchstart\" が返ってくる", function() {
          return expect(fn.start).to.be("touchstart");
        });
        it("なもんで move: \"touchmove\" が返ってくる", function() {
          return expect(helper.checkTouchEvents().move).to.be("touchmove");
        });
        return it("なもんで end: \"touchend\" が返ってくる", function() {
          return expect(fn.end).to.be("touchend");
        });
      });
    } else {
      return context("タッチイベント持ってませんね", function() {
        it("なもんで start: \"mousedown\" が返ってくる", function() {
          return expect(fn.start).to.be("mousedown");
        });
        it("なもんで move: \"mousemove\" が返ってくる", function() {
          return expect(fn.move).to.be("mousemove");
        });
        return it("なもんで end: \"mouseup\" が返ってくる", function() {
          return expect(fn.end).to.be("mouseup");
        });
      });
    }
  });
  describe(".getElementWidth()", function() {
    var el, fn;

    el = document.createElement("div");
    fn = function(arg) {
      return helper.getElementWidth(arg);
    };
    beforeEach(function(done) {
      el.style = "";
      return done();
    });
    context("width: 100px; な要素の幅を取得すると", function() {
      before(function() {
        return el.style.width = "100px";
      });
      return it("Number で 100 が返ってくる", function() {
        expect(fn(el)).to.be.a("number");
        return expect(fn(el)).to.be(100);
      });
    });
    context("width: 80px; padding-right: 10px; な要素だと", function() {
      before(function() {
        el.style.width = "80px";
        return el.style.paddingRight = "10px";
      });
      return it("幅 80 と padding の 10 足して 90 が返ってくる。", function() {
        expect(fn(el)).to.be.a("number");
        return expect(fn(el)).to.be(90);
      });
    });
    return context("width: 80px; padding-right: 10px; -webkit-box-sizing: border-box; box-sizing: border-box; な要素を取得すると", function() {
      before(function() {
        el.style.width = "80px";
        el.style.paddingRight = "10px";
        el.style.webkitBoxSizing = "border-box";
        return el.style.boxSizing = "border-box";
      });
      return it("90 なのかなーと思いきや box-sizing: border-box; の効能で 80 が返ってくる。", function() {
        expect(fn(el)).to.be.a("number");
        return expect(fn(el)).to.be(80);
      });
    });
  });
  return describe(".getTransitionEndEventName()", function() {
    return context("Google Chrome だと", function() {
      before(function() {
        return spoofUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.65 Safari/537.31");
      });
      return it("\"webkitTransitionEnd\" が返ってくる", function() {
        expect(helper.getTransitionEndEventName()).to.be.a("string");
        return expect(helper.getTransitionEndEventName()).to.be("webkitTransitionEnd");
      });
    });
  });
});
