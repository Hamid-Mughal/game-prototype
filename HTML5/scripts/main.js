"use strict";
function r(e, a, b, d) {
  e.A.lc(e.ab, a, b, d, void 0);
}
function D(e, a, b, d) {
  e.A.ra
    ? r(e, a, b, d)
    : e.A.hf()._OnMessageFromDOM({
        type: "event",
        component: e.ab,
        handler: a,
        dispatchOpts: d || null,
        data: b,
        responseId: null,
      });
}
function F(e, a, b) {
  e.A.C(e.ab, a, b);
}
function H(e, a) {
  for (const [b, d] of a) F(e, b, d);
}
function I(e) {
  e.Qb || (e.A.Te(e.ce), (e.Qb = !0));
}
window.sa = class {
  constructor(e, a) {
    this.A = e;
    this.ab = a;
    this.Qb = !1;
    this.ce = () => this.va();
  }
  fd() {}
  va() {}
};
function J(e) {
  -1 !== e.Ra && (self.clearTimeout(e.Ra), (e.Ra = -1));
}
window.Ke = class {
  constructor(e, a) {
    this.Mc = e;
    this.vg = a;
    this.Ra = -1;
    this.Rb = -Infinity;
    this.de = () => {
      this.Ra = -1;
      this.Rb = Date.now();
      this.gb = !0;
      this.Mc();
      this.gb = !1;
    };
    this.Ld = this.gb = !1;
  }
  c() {
    J(this);
    this.de = this.Mc = null;
  }
};
("use strict");
function M(e, a) {
  F(e, "get-element", (b) => {
    const d = e.ca.get(b.elementId);
    return a(d, b);
  });
}
window.Og = class extends self.sa {
  constructor(e, a) {
    super(e, a);
    this.ca = new Map();
    this.Lc = !0;
    H(this, [
      [
        "create",
        () => {
          throw Error("required override");
        },
      ],
      [
        "destroy",
        (b) => {
          {
            b = b.elementId;
            const d = this.ca.get(b);
            this.Lc && d.parentElement.removeChild(d);
            this.ca.delete(b);
          }
        },
      ],
      [
        "set-visible",
        (b) => {
          this.Lc &&
            (this.ca.get(b.elementId).style.display = b.isVisible
              ? ""
              : "none");
        },
      ],
      [
        "update-position",
        (b) => {
          if (this.Lc) {
            var d = this.ca.get(b.elementId);
            d.style.left = b.left + "px";
            d.style.top = b.top + "px";
            d.style.width = b.width + "px";
            d.style.height = b.height + "px";
            b = b.fontSize;
            null !== b && (d.style.fontSize = b + "em");
          }
        },
      ],
      [
        "update-state",
        (b) => {
          this.ca.get(b.elementId);
          throw Error("required override");
        },
      ],
      ["focus", (b) => this.Fc(b)],
      [
        "set-css-style",
        (b) => {
          this.ca.get(b.elementId).style[b.prop] = b.val;
        },
      ],
      [
        "set-attribute",
        (b) => {
          this.ca.get(b.elementId).setAttribute(b.name, b.val);
        },
      ],
      [
        "remove-attribute",
        (b) => {
          this.ca.get(b.elementId).removeAttribute(b.name);
        },
      ],
    ]);
    M(this, (b) => b);
  }
  Fc(e) {
    var a = this.ca.get(e.elementId);
    e.focus ? a.focus() : a.blur();
  }
};
("use strict");
{
  const e = /(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(
    navigator.userAgent
  );
  let a = 0;
  function b(h) {
    const c = document.createElement("script");
    c.async = !1;
    c.type = "module";
    return h.Fg
      ? new Promise((k) => {
          const l = "c3_resolve_" + a;
          ++a;
          self[l] = k;
          c.textContent = h.Ig + `\n\nself["${l}"]();`;
          document.head.appendChild(c);
        })
      : new Promise((k, l) => {
          c.onload = k;
          c.onerror = l;
          c.src = h;
          document.head.appendChild(c);
        });
  }
  let d = !1,
    g = !1;
  function m() {
    if (!d) {
      try {
        new Worker("blob://", {
          get type() {
            g = !0;
          },
        });
      } catch (h) {}
      d = !0;
    }
    return g;
  }
  let p = new Audio();
  const x = {
    "audio/webm; codecs=opus": !!p.canPlayType("audio/webm; codecs=opus"),
    "audio/ogg; codecs=opus": !!p.canPlayType("audio/ogg; codecs=opus"),
    "audio/webm; codecs=vorbis": !!p.canPlayType("audio/webm; codecs=vorbis"),
    "audio/ogg; codecs=vorbis": !!p.canPlayType("audio/ogg; codecs=vorbis"),
    "audio/mp4": !!p.canPlayType("audio/mp4"),
    "audio/mpeg": !!p.canPlayType("audio/mpeg"),
  };
  p = null;
  async function A(h) {
    h = await B(h);
    return new TextDecoder("utf-8").decode(h);
  }
  function B(h) {
    return new Promise((c, k) => {
      const l = new FileReader();
      l.onload = (n) => c(n.target.result);
      l.onerror = (n) => k(n);
      l.readAsArrayBuffer(h);
    });
  }
  const v = [];
  let w = 0;
  window.RealFile = window.File;
  const C = [],
    G = new Map(),
    y = new Map();
  let K = 0;
  const E = [];
  self.runOnStartup = function (h) {
    if ("function" !== typeof h)
      throw Error("runOnStartup called without a function");
    E.push(h);
  };
  const L = new Set(["cordova", "playable-ad", "instant-games"]);
  let f = !1;
  window.fa = class h {
    constructor(c) {
      this.ra = c.Kg;
      this.pa = null;
      this.F = "";
      this.Zb = c.Hg;
      this.ub = {};
      this.Ka = this.tb = null;
      this.Ob = [];
      this.ib = this.K = this.Pa = null;
      this.Oa = -1;
      this.Ag = () => this.Gf();
      this.Na = [];
      this.u = c.ee;
      !this.ra ||
        ("undefined" !== typeof OffscreenCanvas &&
          navigator.userActivation &&
          m()) ||
        (this.ra = !1);
      L.has(this.u) &&
        this.ra &&
        (console.warn(
          "[C3 runtime] Worker mode is enabled and supported, but is currently disabled in WebViews. Reverting to DOM mode."
        ),
        (this.ra = !1));
      this.Tb = this.ia = null;
      ("html5" !== this.u && "playable-ad" !== this.u) ||
        "file" !== location.protocol.substr(0, 4) ||
        alert(
          "Exported games won't work until you upload them. (When running on the file: protocol, browsers block many features from working for security reasons.)"
        );
      this.C("runtime", "cordova-fetch-local-file", (k) => this.qf(k));
      this.C("runtime", "create-job-worker", () => this.rf());
      "cordova" === this.u
        ? document.addEventListener("deviceready", () => this.yd(c))
        : this.yd(c);
    }
    c() {
      this.rc();
      this.pa && (this.pa = this.pa.onmessage = null);
      this.tb && (this.tb.terminate(), (this.tb = null));
      this.Ka && (this.Ka.c(), (this.Ka = null));
      this.K && (this.K.parentElement.removeChild(this.K), (this.K = null));
    }
    od() {
      return e && "cordova" === this.u;
    }
    kc() {
      return (e && L.has(this.u)) || navigator.standalone;
    }
    async yd(c) {
      "macos-wkwebview" === this.u && this.Jc({ type: "ready" });
      if ("playable-ad" === this.u) {
        this.ia = self.c3_base64files;
        this.Tb = {};
        await this.Ye();
        for (let l = 0, n = c.Sa.length; l < n; ++l) {
          var k = c.Sa[l].toLowerCase();
          this.Tb.hasOwnProperty(k)
            ? (c.Sa[l] = { Fg: !0, Ig: this.Tb[k] })
            : this.ia.hasOwnProperty(k) &&
              (c.Sa[l] = URL.createObjectURL(this.ia[k]));
        }
      }
      c.Bg
        ? (this.F = c.Bg)
        : ((k = location.origin),
          (this.F = ("null" === k ? "file:///" : k) + location.pathname),
          (k = this.F.lastIndexOf("/")),
          -1 !== k && (this.F = this.F.substr(0, k + 1)));
      c.Mg && (this.ub = c.Mg);
      k = new MessageChannel();
      this.pa = k.port1;
      this.pa.onmessage = (l) => this._OnMessageFromRuntime(l.data);
      window.c3_addPortMessageHandler &&
        window.c3_addPortMessageHandler((l) => this.Cf(l));
      this.ib = new self.Ge(this);
      await N(this.ib);
      "object" === typeof window.StatusBar && window.StatusBar.hide();
      "object" === typeof window.AndroidFullScreen &&
        window.AndroidFullScreen.immersiveMode();
      this.ra ? await this.kf(c, k.port2) : await this.jf(c, k.port2);
    }
    uc(c) {
      c = this.ub.hasOwnProperty(c)
        ? this.ub[c]
        : c.endsWith("/workermain.js") &&
          this.ub.hasOwnProperty("workermain.js")
        ? this.ub["workermain.js"]
        : "playable-ad" === this.u && this.ia.hasOwnProperty(c.toLowerCase())
        ? this.ia[c.toLowerCase()]
        : c;
      c instanceof Blob && (c = URL.createObjectURL(c));
      return c;
    }
    async dc(c, k, l) {
      if (c.startsWith("blob:")) return new Worker(c, l);
      if (this.od() && "file:" === location.protocol)
        return (
          (c = await this.vb(this.Zb + c)),
          new Worker(
            URL.createObjectURL(
              new Blob([c], { type: "application/javascript" })
            ),
            l
          )
        );
      c = new URL(c, k);
      if (location.origin !== c.origin) {
        c = await fetch(c);
        if (!c.ok) throw Error("failed to fetch worker script");
        c = await c.blob();
        return new Worker(URL.createObjectURL(c), l);
      }
      return new Worker(c, l);
    }
    ya() {
      return Math.max(window.innerWidth, 1);
    }
    xa() {
      return Math.max(window.innerHeight, 1);
    }
    xd(c) {
      var k = this.ib;
      return {
        baseUrl: this.F,
        windowInnerWidth: this.ya(),
        windowInnerHeight: this.xa(),
        devicePixelRatio: window.devicePixelRatio,
        isFullscreen: h.Va(),
        projectData: c.Tg,
        previewImageBlobs: window.cr_previewImageBlobs || this.ia,
        previewProjectFileBlobs: window.cr_previewProjectFileBlobs,
        previewProjectFileSWUrls: window.cr_previewProjectFiles,
        swClientId: window.Rg || "",
        exportType: c.ee,
        isDebug: -1 < self.location.search.indexOf("debug"),
        ife: !!self.Sg,
        jobScheduler: {
          inputPort: k.Sc,
          outputPort: k.$c,
          maxNumWorkers: k.xg,
        },
        supportedAudioFormats: x,
        opusWasmScriptUrl:
          window.cr_opusWasmScriptUrl || this.Zb + "opus.wasm.js",
        opusWasmBinaryUrl:
          window.cr_opusWasmBinaryUrl || this.Zb + "opus.wasm.wasm",
        isiOSCordova: this.od(),
        isiOSWebView: this.kc(),
        isFBInstantAvailable: "undefined" !== typeof self.FBInstant,
      };
    }
    async kf(c, k) {
      var l = this.uc(c.Lg);
      this.tb = await this.dc(l, this.F, { type: "module", name: "Runtime" });
      this.K = document.createElement("canvas");
      this.K.style.display = "none";
      l = this.K.transferControlToOffscreen();
      document.body.appendChild(this.K);
      window.c3canvas = this.K;
      this.tb.postMessage(
        Object.assign(this.xd(c), {
          type: "init-runtime",
          isInWorker: !0,
          messagePort: k,
          canvas: l,
          workerDependencyScripts: c.ed || [],
          engineScripts: c.Sa,
          projectScripts: c.ge,
          mainProjectScript: c.fe,
          projectScriptsStatus: self.C3_ProjectScriptsStatus,
        }),
        [k, l, ...O(this.ib)]
      );
      this.Ob = C.map((n) => new n(this));
      this.wd();
      self.c3_callFunction = (n, t) => this.Pa.lf(n, t);
      "preview" === this.u &&
        (self.goToLastErrorScript = () =>
          this.lc("runtime", "go-to-last-error-script"));
    }
    async jf(c, k) {
      this.K = document.createElement("canvas");
      this.K.style.display = "none";
      document.body.appendChild(this.K);
      window.c3canvas = this.K;
      this.Ob = C.map((q) => new q(this));
      this.wd();
      var l = c.Sa.map((q) =>
        "string" === typeof q ? new URL(q, this.F).toString() : q
      );
      Array.isArray(c.ed) && l.unshift(...c.ed);
      l = await Promise.all(l.map((q) => this.yc(q)));
      await Promise.all(l.map((q) => b(q)));
      l = self.C3_ProjectScriptsStatus;
      const n = c.fe,
        t = c.ge;
      for (let [q, u] of t)
        if ((u || (u = q), q === n))
          try {
            (u = await this.yc(u)),
              await b(u),
              "preview" !== this.u ||
                l[q] ||
                this.Gd(q, "main script did not run to completion");
          } catch (z) {
            this.Gd(q, z);
          }
        else if (
          "scriptsInEvents.js" === q ||
          q.endsWith("/scriptsInEvents.js")
        )
          (u = await this.yc(u)), await b(u);
      "preview" === this.u && "object" !== typeof self.Ng.Pg
        ? (this.Hb(),
          console.error(
            "[C3 runtime] Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."
          ),
          alert(
            "Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."
          ))
        : ((c = Object.assign(this.xd(c), {
            isInWorker: !1,
            messagePort: k,
            canvas: this.K,
            runOnStartupFunctions: E,
          })),
          this.Ad(),
          (this.Ka = self.C3_CreateRuntime(c)),
          await self.C3_InitRuntime(this.Ka, c));
    }
    Gd(c, k) {
      this.Hb();
      console.error(`[Preview] Failed to load project main script (${c}): `, k);
      alert(
        `Failed to load project main script (${c}). Check all your JavaScript code has valid syntax. Press F12 and check the console for error details.`
      );
    }
    Ad() {
      this.Hb();
    }
    Hb() {
      const c = window.Cg;
      c && (c.parentElement.removeChild(c), (window.Cg = null));
    }
    async rf() {
      const c = await P(this.ib);
      return { outputPort: c, transferables: [c] };
    }
    hf() {
      if (this.ra) throw Error("not available in worker mode");
      return this.Ka;
    }
    lc(c, k, l, n, t) {
      this.pa.postMessage(
        {
          type: "event",
          component: c,
          handler: k,
          dispatchOpts: n || null,
          data: l,
          responseId: null,
        },
        t
      );
    }
    pd(c, k, l, n, t) {
      const q = K++,
        u = new Promise((z, V) => {
          y.set(q, { resolve: z, reject: V });
        });
      this.pa.postMessage(
        {
          type: "event",
          component: c,
          handler: k,
          dispatchOpts: n || null,
          data: l,
          responseId: q,
        },
        t
      );
      return u;
    }
    ["_OnMessageFromRuntime"](c) {
      const k = c.type;
      if ("event" === k) return this.wf(c);
      if ("result" === k) this.Jf(c);
      else if ("runtime-ready" === k) this.Kf();
      else if ("alert-error" === k) this.Hb(), alert(c.message);
      else if ("creating-runtime" === k) this.Ad();
      else throw Error(`unknown message '${k}'`);
    }
    wf(c) {
      const k = c.component,
        l = c.handler,
        n = c.data,
        t = c.responseId;
      if ((c = G.get(k)))
        if ((c = c.get(l))) {
          var q = null;
          try {
            q = c(n);
          } catch (u) {
            console.error(`Exception in '${k}' handler '${l}':`, u);
            null !== t && this.Gb(t, !1, "" + u);
            return;
          }
          if (null === t) return q;
          q && q.then
            ? q
                .then((u) => this.Gb(t, !0, u))
                .catch((u) => {
                  console.error(`Rejection from '${k}' handler '${l}':`, u);
                  this.Gb(t, !1, "" + u);
                })
            : this.Gb(t, !0, q);
        } else console.warn(`[DOM] No handler '${l}' for component '${k}'`);
      else console.warn(`[DOM] No event handlers for component '${k}'`);
    }
    Gb(c, k, l) {
      let n;
      l && l.transferables && (n = l.transferables);
      this.pa.postMessage(
        { type: "result", responseId: c, isOk: k, result: l },
        n
      );
    }
    Jf(c) {
      const k = c.responseId,
        l = c.isOk;
      c = c.result;
      const n = y.get(k);
      l ? n.resolve(c) : n.reject(c);
      y.delete(k);
    }
    C(c, k, l) {
      let n = G.get(c);
      n || ((n = new Map()), G.set(c, n));
      if (n.has(k))
        throw Error(`[DOM] Component '${c}' already has handler '${k}'`);
      n.set(k, l);
    }
    static Ea(c) {
      if (C.includes(c)) throw Error("DOM handler already added");
      C.push(c);
    }
    wd() {
      for (const c of this.Ob)
        if ("runtime" === c.ab) {
          this.Pa = c;
          return;
        }
      throw Error("cannot find runtime DOM handler");
    }
    Cf(c) {
      this.lc("debugger", "message", c);
    }
    Kf() {
      for (const c of this.Ob) c.fd();
    }
    static Va() {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        f
      );
    }
    static Ib(c) {
      f = !!c;
    }
    Te(c) {
      this.Na.push(c);
      this.Ic();
    }
    Wf(c) {
      c = this.Na.indexOf(c);
      if (-1 === c) throw Error("invalid callback");
      this.Na.splice(c, 1);
      this.Na.length || this.rc();
    }
    Ic() {
      -1 === this.Oa &&
        this.Na.length &&
        (this.Oa = requestAnimationFrame(this.Ag));
    }
    rc() {
      -1 !== this.Oa && (cancelAnimationFrame(this.Oa), (this.Oa = -1));
    }
    Gf() {
      this.Oa = -1;
      for (const c of this.Na) c();
      this.Ic();
    }
    wa(c) {
      this.Pa.wa(c);
    }
    Ga(c) {
      this.Pa.Ga(c);
    }
    Hc() {
      this.Pa.Hc();
    }
    Bb(c) {
      this.Pa.Bb(c);
    }
    Fe() {
      return !!x["audio/webm; codecs=opus"];
    }
    async tg(c) {
      c = await this.pd("runtime", "opus-decode", { arrayBuffer: c }, null, [
        c,
      ]);
      return new Float32Array(c);
    }
    Ee(c) {
      return (
        /^(?:[a-z\-]+:)?\/\//.test(c) ||
        "data:" === c.substr(0, 5) ||
        "blob:" === c.substr(0, 5)
      );
    }
    nd(c) {
      return !this.Ee(c);
    }
    async yc(c) {
      return "cordova" === this.u &&
        (c.startsWith("file:") || ("file:" === location.protocol && this.nd(c)))
        ? (c.startsWith(this.F) && (c = c.substr(this.F.length)),
          (c = await this.vb(c)),
          URL.createObjectURL(
            new Blob([c], { type: "application/javascript" })
          ))
        : c;
    }
    async qf(c) {
      const k = c.filename;
      switch (c.as) {
        case "text":
          return await this.xe(k);
        case "buffer":
          return await this.vb(k);
        default:
          throw Error("unsupported type");
      }
    }
    jd(c) {
      const k =
        window.cordova.file.applicationDirectory + "www/" + c.toLowerCase();
      return new Promise((l, n) => {
        window.resolveLocalFileSystemURL(
          k,
          (t) => {
            t.file(l, n);
          },
          n
        );
      });
    }
    async xe(c) {
      c = await this.jd(c);
      return await A(c);
    }
    sc() {
      if (v.length && !(8 <= w)) {
        w++;
        var c = v.shift();
        this.Ze(c.filename, c.Jg, c.Eg);
      }
    }
    vb(c) {
      return new Promise((k, l) => {
        v.push({
          filename: c,
          Jg: (n) => {
            w--;
            this.sc();
            k(n);
          },
          Eg: (n) => {
            w--;
            this.sc();
            l(n);
          },
        });
        this.sc();
      });
    }
    async Ze(c, k, l) {
      try {
        const n = await this.jd(c),
          t = await B(n);
        k(t);
      } catch (n) {
        l(n);
      }
    }
    Jc(c) {
      if ("windows-webview2" === this.u)
        window.chrome.webview.postMessage(JSON.stringify(c));
      else if ("macos-wkwebview" === this.u)
        window.webkit.messageHandlers.C3Wrapper.postMessage(JSON.stringify(c));
      else throw Error("cannot send wrapper message");
    }
    async Ye() {
      const c = [];
      for (const [k, l] of Object.entries(this.ia)) c.push(this.Xe(k, l));
      await Promise.all(c);
    }
    async Xe(c, k) {
      if ("object" === typeof k)
        (this.ia[c] = new Blob([k.str], { type: k.type })),
          (this.Tb[c] = k.str);
      else {
        let l = await this.ff(k);
        l || (l = this.af(k));
        this.ia[c] = l;
      }
    }
    async ff(c) {
      try {
        return await (await fetch(c)).blob();
      } catch (k) {
        return (
          console.warn(
            "Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.",
            k
          ),
          null
        );
      }
    }
    af(c) {
      c = this.Qf(c);
      return this.We(c.data, c.Gg);
    }
    Qf(c) {
      var k = c.indexOf(",");
      if (0 > k) throw new URIError("expected comma in data: uri");
      var l = c.substring(k + 1);
      k = c.substring(5, k).split(";");
      c = k[0] || "";
      const n = k[2];
      l = "base64" === k[1] || "base64" === n ? atob(l) : decodeURIComponent(l);
      return { Gg: c, data: l };
    }
    We(c, k) {
      var l = c.length;
      let n = l >> 2,
        t = new Uint8Array(l),
        q = new Uint32Array(t.buffer, 0, n),
        u,
        z;
      for (z = u = 0; u < n; ++u)
        q[u] =
          c.charCodeAt(z++) |
          (c.charCodeAt(z++) << 8) |
          (c.charCodeAt(z++) << 16) |
          (c.charCodeAt(z++) << 24);
      for (l &= 3; l--; ) (t[z] = c.charCodeAt(z)), ++z;
      return new Blob([t], { type: k });
    }
  };
}
("use strict");
{
  const e = self.fa;
  function a(f) {
    return (
      (f.sourceCapabilities && f.sourceCapabilities.firesTouchEvents) ||
      (f.originalEvent &&
        f.originalEvent.sourceCapabilities &&
        f.originalEvent.sourceCapabilities.firesTouchEvents)
    );
  }
  const b = new Map([
      ["OSLeft", "MetaLeft"],
      ["OSRight", "MetaRight"],
    ]),
    d = { dispatchRuntimeEvent: !0, dispatchUserScriptEvent: !0 },
    g = { dispatchUserScriptEvent: !0 },
    m = { dispatchRuntimeEvent: !0 };
  function p(f) {
    return new Promise((h, c) => {
      const k = document.createElement("link");
      k.onload = () => h(k);
      k.onerror = (l) => c(l);
      k.rel = "stylesheet";
      k.href = f;
      document.head.appendChild(k);
    });
  }
  function x(f) {
    return new Promise((h, c) => {
      const k = new Image();
      k.onload = () => h(k);
      k.onerror = (l) => c(l);
      k.src = f;
    });
  }
  async function A(f) {
    f = URL.createObjectURL(f);
    try {
      return await x(f);
    } finally {
      URL.revokeObjectURL(f);
    }
  }
  function B(f) {
    return new Promise((h, c) => {
      let k = new FileReader();
      k.onload = (l) => h(l.target.result);
      k.onerror = (l) => c(l);
      k.readAsText(f);
    });
  }
  async function v(f, h, c) {
    if (!/firefox/i.test(navigator.userAgent)) return await A(f);
    var k = await B(f);
    k = new DOMParser().parseFromString(k, "image/svg+xml");
    const l = k.documentElement;
    if (l.hasAttribute("width") && l.hasAttribute("height")) {
      const n = l.getAttribute("width"),
        t = l.getAttribute("height");
      if (!n.includes("%") && !t.includes("%")) return await A(f);
    }
    l.setAttribute("width", h + "px");
    l.setAttribute("height", c + "px");
    k = new XMLSerializer().serializeToString(k);
    f = new Blob([k], { type: "image/svg+xml" });
    return await A(f);
  }
  function w(f) {
    do {
      if (f.parentNode && f.hasAttribute("contenteditable")) return !0;
      f = f.parentNode;
    } while (f);
    return !1;
  }
  const C = new Set(["input", "textarea", "datalist", "select"]),
    G = new Set(["canvas", "body", "html"]);
  function y(f) {
    G.has(f.target.tagName.toLowerCase()) && f.preventDefault();
  }
  function K(f) {
    (f.metaKey || f.ctrlKey) && f.preventDefault();
  }
  self.C3_GetSvgImageSize = async function (f) {
    f = await A(f);
    if (0 < f.width && 0 < f.height) return [f.width, f.height];
    {
      f.style.position = "absolute";
      f.style.left = "0px";
      f.style.top = "0px";
      f.style.visibility = "hidden";
      document.body.appendChild(f);
      const h = f.getBoundingClientRect();
      document.body.removeChild(f);
      return [h.width, h.height];
    }
  };
  self.C3_RasterSvgImageBlob = async function (f, h, c, k, l) {
    f = await v(f, h, c);
    const n = document.createElement("canvas");
    n.width = k;
    n.height = l;
    n.getContext("2d").drawImage(f, 0, 0, h, c);
    return n;
  };
  let E = !1;
  document.addEventListener("pause", () => (E = !0));
  document.addEventListener("resume", () => (E = !1));
  function L() {
    try {
      return window.parent && window.parent.document.hasFocus();
    } catch (f) {
      return !1;
    }
  }
  e.Ea(
    class extends self.sa {
      constructor(f) {
        super(f, "runtime");
        this.Qd = !0;
        this.Qa = -1;
        this.bd = "any";
        this.Hd = this.Id = !1;
        this.Wc = this.qb = this.Aa = null;
        f.C("canvas", "update-size", (k) => this.Nf(k));
        f.C("runtime", "invoke-download", (k) => this.Af(k));
        f.C("runtime", "raster-svg-image", (k) => this.Hf(k));
        f.C("runtime", "get-svg-image-size", (k) => this.yf(k));
        f.C("runtime", "set-target-orientation", (k) => this.Lf(k));
        f.C("runtime", "register-sw", () => this.If());
        f.C("runtime", "post-to-debugger", (k) => this.Cd(k));
        f.C("runtime", "go-to-script", (k) => this.Cd(k));
        f.C("runtime", "before-start-ticking", () => this.pf());
        f.C("runtime", "debug-highlight", (k) => this.sf(k));
        f.C("runtime", "enable-device-orientation", () => this.Ve());
        f.C("runtime", "enable-device-motion", () => this.Ue());
        f.C("runtime", "add-stylesheet", (k) => this.nf(k));
        f.C("runtime", "alert", (k) => this.zc(k));
        f.C("runtime", "hide-cordova-splash", () => this.zf());
        const h = new Set(["input", "textarea", "datalist"]);
        window.addEventListener("contextmenu", (k) => {
          const l = k.target;
          h.has(l.tagName.toLowerCase()) || w(l) || k.preventDefault();
        });
        const c = f.K;
        window.addEventListener("selectstart", y);
        window.addEventListener("gesturehold", y);
        c.addEventListener("selectstart", y);
        c.addEventListener("gesturehold", y);
        window.addEventListener("touchstart", y, { passive: !1 });
        "undefined" !== typeof PointerEvent
          ? (window.addEventListener("pointerdown", y, { passive: !1 }),
            c.addEventListener("pointerdown", y))
          : c.addEventListener("touchstart", y);
        this.nb = 0;
        window.addEventListener("mousedown", (k) => {
          1 === k.button && k.preventDefault();
        });
        window.addEventListener("mousewheel", K, { passive: !1 });
        window.addEventListener("wheel", K, { passive: !1 });
        window.addEventListener("resize", () => this.Of());
        window.addEventListener("fullscreenchange", () => this.Xa());
        window.addEventListener("webkitfullscreenchange", () => this.Xa());
        window.addEventListener("mozfullscreenchange", () => this.Xa());
        window.addEventListener("fullscreenerror", (k) => this.Bc(k));
        window.addEventListener("webkitfullscreenerror", (k) => this.Bc(k));
        window.addEventListener("mozfullscreenerror", (k) => this.Bc(k));
        f.kc() &&
          window.addEventListener("focusout", () => {
            {
              const n = document.activeElement;
              if (n) {
                var k = n.tagName.toLowerCase();
                var l = new Set(
                  "email number password search tel text url".split(" ")
                );
                k =
                  "textarea" === k
                    ? !0
                    : "input" === k
                    ? l.has(n.type.toLowerCase() || "text")
                    : w(n);
              } else k = !1;
            }
            k || (document.scrollingElement.scrollTop = 0);
          });
        self.C3WrapperOnMessage = (k) => this.Pf(k);
        this.La = new Set();
        this.Ub = new WeakSet();
        this.oa = !1;
      }
      pf() {
        "cordova" === this.A.u
          ? (document.addEventListener("pause", () => this.Gc(!0)),
            document.addEventListener("resume", () => this.Gc(!1)))
          : document.addEventListener("visibilitychange", () =>
              this.Gc(document.hidden)
            );
        return { isSuspended: !(!document.hidden && !E) };
      }
      fd() {
        window.addEventListener("focus", () => this.Za("window-focus"));
        window.addEventListener("blur", () => {
          this.Za("window-blur", { parentHasFocus: L() });
          this.nb = 0;
        });
        window.addEventListener("focusin", (h) => {
          h = h.target;
          (C.has(h.tagName.toLowerCase()) || w(h)) && this.Za("keyboard-blur");
        });
        window.addEventListener("keydown", (h) => this.Bd("keydown", h));
        window.addEventListener("keyup", (h) => this.Bd("keyup", h));
        window.addEventListener("dblclick", (h) => this.Dc("dblclick", h, d));
        window.addEventListener("wheel", (h) => this.Ef(h));
        "undefined" !== typeof PointerEvent
          ? (window.addEventListener("pointerdown", (h) => {
              this.vc(h);
              this.Ya("pointerdown", h);
            }),
            this.A.ra &&
            "undefined" !== typeof window.onpointerrawupdate &&
            self === self.top
              ? ((this.qb = new self.Ke(() => this.df(), 5)),
                (this.qb.Ld = !0),
                window.addEventListener("pointerrawupdate", (h) => this.Ff(h)))
              : window.addEventListener("pointermove", (h) =>
                  this.Ya("pointermove", h)
                ),
            window.addEventListener("pointerup", (h) =>
              this.Ya("pointerup", h)
            ),
            window.addEventListener("pointercancel", (h) =>
              this.Ya("pointercancel", h)
            ))
          : (window.addEventListener("mousedown", (h) => {
              this.vc(h);
              this.Ec("pointerdown", h);
            }),
            window.addEventListener("mousemove", (h) =>
              this.Ec("pointermove", h)
            ),
            window.addEventListener("mouseup", (h) => this.Ec("pointerup", h)),
            window.addEventListener("touchstart", (h) => {
              this.vc(h);
              this.Fb("pointerdown", h);
            }),
            window.addEventListener("touchmove", (h) =>
              this.Fb("pointermove", h)
            ),
            window.addEventListener("touchend", (h) => this.Fb("pointerup", h)),
            window.addEventListener("touchcancel", (h) =>
              this.Fb("pointercancel", h)
            ));
        const f = () => this.Hc();
        window.addEventListener("pointerup", f, !0);
        window.addEventListener("touchend", f, !0);
        window.addEventListener("click", f, !0);
        window.addEventListener("keydown", f, !0);
        window.addEventListener("gamepadconnected", f, !0);
      }
      Za(f, h) {
        r(this, f, h || null, m);
      }
      ya() {
        return this.A.ya();
      }
      xa() {
        return this.A.xa();
      }
      Of() {
        const f = this.ya(),
          h = this.xa();
        this.Za("window-resize", {
          innerWidth: f,
          innerHeight: h,
          devicePixelRatio: window.devicePixelRatio,
          isFullscreen: e.Va(),
        });
        this.A.kc() &&
          (-1 !== this.Qa && clearTimeout(this.Qa), this.Dd(f, h, 0));
      }
      Xf(f, h, c) {
        -1 !== this.Qa && clearTimeout(this.Qa);
        this.Qa = setTimeout(() => this.Dd(f, h, c), 48);
      }
      Dd(f, h, c) {
        const k = this.ya(),
          l = this.xa();
        this.Qa = -1;
        k != f || l != h
          ? this.Za("window-resize", {
              innerWidth: k,
              innerHeight: l,
              devicePixelRatio: window.devicePixelRatio,
              isFullscreen: e.Va(),
            })
          : 10 > c && this.Xf(k, l, c + 1);
      }
      Lf(f) {
        this.bd = f.targetOrientation;
      }
      pg() {
        const f = this.bd;
        if (screen.orientation && screen.orientation.lock)
          screen.orientation
            .lock(f)
            .catch((h) =>
              console.warn("[Construct 3] Failed to lock orientation: ", h)
            );
        else
          try {
            let h = !1;
            screen.lockOrientation
              ? (h = screen.lockOrientation(f))
              : screen.webkitLockOrientation
              ? (h = screen.webkitLockOrientation(f))
              : screen.mozLockOrientation
              ? (h = screen.mozLockOrientation(f))
              : screen.msLockOrientation && (h = screen.msLockOrientation(f));
            h || console.warn("[Construct 3] Failed to lock orientation");
          } catch (h) {
            console.warn("[Construct 3] Failed to lock orientation: ", h);
          }
      }
      Xa() {
        const f = e.Va();
        f && "any" !== this.bd && this.pg();
        r(this, "fullscreenchange", {
          isFullscreen: f,
          innerWidth: this.ya(),
          innerHeight: this.xa(),
        });
      }
      Bc(f) {
        console.warn("[Construct 3] Fullscreen request failed: ", f);
        r(this, "fullscreenerror", {
          isFullscreen: e.Va(),
          innerWidth: this.ya(),
          innerHeight: this.xa(),
        });
      }
      Gc(f) {
        f ? this.A.rc() : this.A.Ic();
        r(this, "visibilitychange", { hidden: f });
      }
      Bd(f, h) {
        "Backspace" === h.key && y(h);
        const c = b.get(h.code) || h.code;
        D(
          this,
          f,
          {
            code: c,
            key: h.key,
            which: h.which,
            repeat: h.repeat,
            altKey: h.altKey,
            ctrlKey: h.ctrlKey,
            metaKey: h.metaKey,
            shiftKey: h.shiftKey,
            timeStamp: h.timeStamp,
          },
          d
        );
      }
      Ef(f) {
        r(
          this,
          "wheel",
          {
            clientX: f.clientX,
            clientY: f.clientY,
            pageX: f.pageX,
            pageY: f.pageY,
            deltaX: f.deltaX,
            deltaY: f.deltaY,
            deltaZ: f.deltaZ,
            deltaMode: f.deltaMode,
            timeStamp: f.timeStamp,
          },
          d
        );
      }
      Dc(f, h, c) {
        a(h) ||
          D(
            this,
            f,
            {
              button: h.button,
              buttons: h.buttons,
              clientX: h.clientX,
              clientY: h.clientY,
              pageX: h.pageX,
              pageY: h.pageY,
              timeStamp: h.timeStamp,
            },
            c
          );
      }
      Ec(f, h) {
        if (!a(h)) {
          var c = this.nb;
          "pointerdown" === f && 0 !== c
            ? (f = "pointermove")
            : "pointerup" === f && 0 !== h.buttons && (f = "pointermove");
          D(
            this,
            f,
            {
              pointerId: 1,
              pointerType: "mouse",
              button: h.button,
              buttons: h.buttons,
              lastButtons: c,
              clientX: h.clientX,
              clientY: h.clientY,
              pageX: h.pageX,
              pageY: h.pageY,
              width: 0,
              height: 0,
              pressure: 0,
              tangentialPressure: 0,
              tiltX: 0,
              tiltY: 0,
              twist: 0,
              timeStamp: h.timeStamp,
            },
            d
          );
          this.nb = h.buttons;
          this.Dc(h.type, h, g);
        }
      }
      Ya(f, h) {
        if (this.qb && "pointermove" !== f) {
          var c = this.qb;
          c.gb || (J(c), (c.Rb = Date.now()));
        }
        c = 0;
        "mouse" === h.pointerType && (c = this.nb);
        D(
          this,
          f,
          {
            pointerId: h.pointerId,
            pointerType: h.pointerType,
            button: h.button,
            buttons: h.buttons,
            lastButtons: c,
            clientX: h.clientX,
            clientY: h.clientY,
            pageX: h.pageX,
            pageY: h.pageY,
            width: h.width || 0,
            height: h.height || 0,
            pressure: h.pressure || 0,
            tangentialPressure: h.tangentialPressure || 0,
            tiltX: h.tiltX || 0,
            tiltY: h.tiltY || 0,
            twist: h.twist || 0,
            timeStamp: h.timeStamp,
          },
          d
        );
        "mouse" === h.pointerType &&
          ((c = "mousemove"),
          "pointerdown" === f
            ? (c = "mousedown")
            : "pointerup" === f && (c = "mouseup"),
          this.Dc(c, h, g),
          (this.nb = h.buttons));
      }
      Ff(f) {
        this.Wc = f;
        f = this.qb;
        if (-1 === f.Ra) {
          var h = Date.now(),
            c = h - f.Rb,
            k = f.vg;
          c >= k && f.Ld
            ? ((f.Rb = h), (f.gb = !0), f.Mc(), (f.gb = !1))
            : (f.Ra = self.setTimeout(f.de, Math.max(k - c, 4)));
        }
      }
      df() {
        this.Ya("pointermove", this.Wc);
        this.Wc = null;
      }
      Fb(f, h) {
        for (let c = 0, k = h.changedTouches.length; c < k; ++c) {
          const l = h.changedTouches[c];
          D(
            this,
            f,
            {
              pointerId: l.identifier,
              pointerType: "touch",
              button: 0,
              buttons: 0,
              lastButtons: 0,
              clientX: l.clientX,
              clientY: l.clientY,
              pageX: l.pageX,
              pageY: l.pageY,
              width: 2 * (l.radiusX || l.webkitRadiusX || 0),
              height: 2 * (l.radiusY || l.webkitRadiusY || 0),
              pressure: l.force || l.webkitForce || 0,
              tangentialPressure: 0,
              tiltX: 0,
              tiltY: 0,
              twist: l.rotationAngle || 0,
              timeStamp: h.timeStamp,
            },
            d
          );
        }
      }
      vc(f) {
        window !== window.top && window.focus();
        this.zd(f.target) &&
          document.activeElement &&
          !this.zd(document.activeElement) &&
          document.activeElement.blur();
      }
      zd(f) {
        return (
          !f ||
          f === document ||
          f === window ||
          f === document.body ||
          "canvas" === f.tagName.toLowerCase()
        );
      }
      Ve() {
        this.Id ||
          ((this.Id = !0),
          window.addEventListener("deviceorientation", (f) => this.uf(f)),
          window.addEventListener("deviceorientationabsolute", (f) =>
            this.vf(f)
          ));
      }
      Ue() {
        this.Hd ||
          ((this.Hd = !0),
          window.addEventListener("devicemotion", (f) => this.tf(f)));
      }
      uf(f) {
        r(
          this,
          "deviceorientation",
          {
            absolute: !!f.absolute,
            alpha: f.alpha || 0,
            beta: f.beta || 0,
            gamma: f.gamma || 0,
            timeStamp: f.timeStamp,
            webkitCompassHeading: f.webkitCompassHeading,
            webkitCompassAccuracy: f.webkitCompassAccuracy,
          },
          d
        );
      }
      vf(f) {
        r(
          this,
          "deviceorientationabsolute",
          {
            absolute: !!f.absolute,
            alpha: f.alpha || 0,
            beta: f.beta || 0,
            gamma: f.gamma || 0,
            timeStamp: f.timeStamp,
          },
          d
        );
      }
      tf(f) {
        let h = null;
        var c = f.acceleration;
        c && (h = { x: c.x || 0, y: c.y || 0, z: c.z || 0 });
        c = null;
        var k = f.accelerationIncludingGravity;
        k && (c = { x: k.x || 0, y: k.y || 0, z: k.z || 0 });
        k = null;
        const l = f.rotationRate;
        l &&
          (k = { alpha: l.alpha || 0, beta: l.beta || 0, gamma: l.gamma || 0 });
        r(
          this,
          "devicemotion",
          {
            acceleration: h,
            accelerationIncludingGravity: c,
            rotationRate: k,
            interval: f.interval,
            timeStamp: f.timeStamp,
          },
          d
        );
      }
      Nf(f) {
        const h = this.A.K;
        h.style.width = f.styleWidth + "px";
        h.style.height = f.styleHeight + "px";
        h.style.marginLeft = f.marginLeft + "px";
        h.style.marginTop = f.marginTop + "px";
        this.Qd && ((h.style.display = ""), (this.Qd = !1));
      }
      Af(f) {
        const h = f.url;
        f = f.filename;
        const c = document.createElement("a"),
          k = document.body;
        c.textContent = f;
        c.href = h;
        c.download = f;
        k.appendChild(c);
        c.click();
        k.removeChild(c);
      }
      async Hf(f) {
        var h = f.imageBitmapOpts;
        f = await self.C3_RasterSvgImageBlob(
          f.blob,
          f.imageWidth,
          f.imageHeight,
          f.surfaceWidth,
          f.surfaceHeight
        );
        h = h ? await createImageBitmap(f, h) : await createImageBitmap(f);
        return { imageBitmap: h, transferables: [h] };
      }
      async yf(f) {
        return await self.C3_GetSvgImageSize(f.blob);
      }
      async nf(f) {
        await p(f.url);
      }
      Hc() {
        var f = [...this.La];
        this.La.clear();
        if (!this.oa)
          for (const h of f)
            (f = h.play()) &&
              f.catch(() => {
                this.Ub.has(h) || this.La.add(h);
              });
      }
      wa(f) {
        if ("function" !== typeof f.play) throw Error("missing play function");
        this.Ub.delete(f);
        let h;
        try {
          h = f.play();
        } catch (c) {
          this.La.add(f);
          return;
        }
        h &&
          h.catch(() => {
            this.Ub.has(f) || this.La.add(f);
          });
      }
      Ga(f) {
        this.La.delete(f);
        this.Ub.add(f);
      }
      Bb(f) {
        this.oa = !!f;
      }
      zf() {
        navigator.splashscreen &&
          navigator.splashscreen.hide &&
          navigator.splashscreen.hide();
      }
      sf(f) {
        if (f.show) {
          this.Aa ||
            ((this.Aa = document.createElement("div")),
            (this.Aa.id = "inspectOutline"),
            document.body.appendChild(this.Aa));
          var h = this.Aa;
          h.style.display = "";
          h.style.left = f.left - 1 + "px";
          h.style.top = f.top - 1 + "px";
          h.style.width = f.width + 2 + "px";
          h.style.height = f.height + 2 + "px";
          h.textContent = f.name;
        } else this.Aa && (this.Aa.style.display = "none");
      }
      If() {
        window.C3_RegisterSW && window.C3_RegisterSW();
      }
      Cd(f) {
        window.c3_postToMessagePort &&
          ((f.from = "runtime"), window.c3_postToMessagePort(f));
      }
      lf(f, h) {
        return this.A.pd(
          this.ab,
          "js-invoke-function",
          { name: f, params: h },
          void 0,
          void 0
        );
      }
      zc(f) {
        alert(f.message);
      }
      Pf(f) {
        "entered-fullscreen" === f
          ? (e.Ib(!0), this.Xa())
          : "exited-fullscreen" === f
          ? (e.Ib(!1), this.Xa())
          : console.warn("Unknown wrapper message: ", f);
      }
    }
  );
}
("use strict");
async function N(e) {
  if (e.ug) throw Error("already initialised");
  e.ug = !0;
  var a = e.Yb.uc("dispatchworker.js");
  e.Oc = await e.Yb.dc(a, e.F, { name: "DispatchWorker" });
  a = new MessageChannel();
  e.Sc = a.port1;
  e.Oc.postMessage({ type: "_init", "in-port": a.port2 }, [a.port2]);
  e.$c = await P(e);
}
function O(e) {
  return [e.Sc, e.$c];
}
async function P(e) {
  const a = e.Sd.length;
  var b = e.Yb.uc("jobworker.js");
  b = await e.Yb.dc(b, e.F, { name: "JobWorker" + a });
  const d = new MessageChannel(),
    g = new MessageChannel();
  e.Oc.postMessage({ type: "_addJobWorker", port: d.port1 }, [d.port1]);
  b.postMessage(
    {
      type: "init",
      number: a,
      "dispatch-port": d.port2,
      "output-port": g.port2,
    },
    [d.port2, g.port2]
  );
  e.Sd.push(b);
  return g.port1;
}
self.Ge = class {
  constructor(e) {
    this.Yb = e;
    this.F = e.F;
    this.F = "preview" === e.u ? this.F + "c3/workers/" : this.F + e.Zb;
    this.xg = Math.min(navigator.hardwareConcurrency || 2, 16);
    this.Oc = null;
    this.Sd = [];
    this.$c = this.Sc = null;
  }
};
("use strict");
window.C3_IsSupported &&
  (window.c3_runtimeInterface = new self.fa({
    Kg: !1,
    Lg: "workermain.js",
    Sa: ["scripts/c3runtime.js"],
    ge: [],
    fe: "",
    Hg: "scripts/",
    ed: [],
    ee: "html5",
  }));
("use strict");
async function Q(e, a) {
  a = a.type;
  let b = !0;
  0 === a ? (b = await R()) : 1 === a && (b = await S());
  r(e, "permission-result", { type: a, result: b });
}
async function R() {
  if (
    !self.DeviceOrientationEvent ||
    !self.DeviceOrientationEvent.requestPermission
  )
    return !0;
  try {
    return (
      "granted" === (await self.DeviceOrientationEvent.requestPermission())
    );
  } catch (e) {
    return (
      console.warn("[Touch] Failed to request orientation permission: ", e), !1
    );
  }
}
async function S() {
  if (!self.DeviceMotionEvent || !self.DeviceMotionEvent.requestPermission)
    return !0;
  try {
    return "granted" === (await self.DeviceMotionEvent.requestPermission());
  } catch (e) {
    return console.warn("[Touch] Failed to request motion permission: ", e), !1;
  }
}
self.fa.Ea(
  class extends self.sa {
    constructor(e) {
      super(e, "touch");
      F(this, "request-permission", (a) => Q(this, a));
    }
  }
);
("use strict");
async function T(e) {
  if (!e.Ca)
    try {
      (e.Ca = await navigator.wakeLock.request("screen")),
        e.Ca.addEventListener("release", () => {
          console.log("[Construct 3] Screen wake lock released");
          e.Ca = null;
          r(e, "wake-lock-released");
        }),
        console.log("[Construct 3] Screen wake lock acquired"),
        r(e, "wake-lock-acquired");
    } catch (a) {
      console.warn("[Construct 3] Failed to acquire screen wake lock: ", a),
        r(e, "wake-lock-error");
    }
}
function U() {
  var e = document.body;
  const a = e.style;
  a.setProperty("--temp-sai-top", "env(safe-area-inset-top)");
  a.setProperty("--temp-sai-right", "env(safe-area-inset-right)");
  a.setProperty("--temp-sai-bottom", "env(safe-area-inset-bottom)");
  a.setProperty("--temp-sai-left", "env(safe-area-inset-left)");
  e = getComputedStyle(e);
  e = [
    e.getPropertyValue("--temp-sai-top"),
    e.getPropertyValue("--temp-sai-right"),
    e.getPropertyValue("--temp-sai-bottom"),
    e.getPropertyValue("--temp-sai-left"),
  ].map((b) => {
    b = parseInt(b, 10);
    return isFinite(b) ? b : 0;
  });
  a.removeProperty("--temp-sai-top");
  a.removeProperty("--temp-sai-right");
  a.removeProperty("--temp-sai-bottom");
  a.removeProperty("--temp-sai-left");
  return e;
}
self.fa.Ea(
  class extends self.sa {
    constructor(e) {
      super(e, "platform-info");
      H(this, [
        ["get-initial-state", () => this.Cc()],
        ["request-wake-lock", () => T(this)],
        [
          "release-wake-lock",
          () => {
            this.Ca && (this.Ca.release(), (this.Ca = null));
          },
        ],
      ]);
      window.addEventListener("resize", () => {
        r(this, "window-resize", {
          windowOuterWidth: window.outerWidth,
          windowOuterHeight: window.outerHeight,
          safeAreaInset: U(),
        });
      });
      this.Ca = null;
    }
    Cc() {
      return {
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowOuterWidth: window.outerWidth,
        windowOuterHeight: window.outerHeight,
        safeAreaInset: U(),
        supportsWakeLock: !!navigator.wakeLock,
      };
    }
  }
);
("use strict");
function aa(e) {
  window.C3_RegisterSW &&
    window.OfflineClientInfo &&
    window.OfflineClientInfo.SetMessageCallback((a) =>
      r(e, "sw-message", a.data)
    );
}
function ba(e) {
  e = e.orientation;
  if (screen.orientation && screen.orientation.lock)
    screen.orientation
      .lock(e)
      .catch((a) =>
        console.warn("[Construct 3] Failed to lock orientation: ", a)
      );
  else
    try {
      let a = !1;
      screen.lockOrientation
        ? (a = screen.lockOrientation(e))
        : screen.webkitLockOrientation
        ? (a = screen.webkitLockOrientation(e))
        : screen.mozLockOrientation
        ? (a = screen.mozLockOrientation(e))
        : screen.msLockOrientation && (a = screen.msLockOrientation(e));
      a || console.warn("[Construct 3] Failed to lock orientation");
    } catch (a) {
      console.warn("[Construct 3] Failed to lock orientation: ", a);
    }
}
self.fa.Ea(
  class extends self.sa {
    constructor(e) {
      super(e, "browser");
      this.u = "";
      H(this, [
        ["get-initial-state", (a) => this.Cc(a)],
        ["ready-for-sw-messages", () => aa(this)],
        ["alert", (a) => this.zc(a)],
        [
          "close",
          () => {
            navigator.app && navigator.app.exitApp
              ? navigator.app.exitApp()
              : navigator.device && navigator.device.exitApp
              ? navigator.device.exitApp()
              : window.close();
          },
        ],
        ["set-focus", (a) => this.Fc(a)],
        [
          "vibrate",
          (a) => {
            navigator.vibrate && navigator.vibrate(a.pattern);
          },
        ],
        ["lock-orientation", (a) => ba(a)],
        [
          "unlock-orientation",
          () => {
            try {
              screen.orientation && screen.orientation.unlock
                ? screen.orientation.unlock()
                : screen.unlockOrientation
                ? screen.unlockOrientation()
                : screen.webkitUnlockOrientation
                ? screen.webkitUnlockOrientation()
                : screen.mozUnlockOrientation
                ? screen.mozUnlockOrientation()
                : screen.msUnlockOrientation && screen.msUnlockOrientation();
            } catch (a) {}
          },
        ],
        [
          "navigate",
          (a) => {
            var b = a.type;
            if ("back" === b)
              navigator.app && navigator.app.backHistory
                ? navigator.app.backHistory()
                : window.history.back();
            else if ("forward" === b) window.history.forward();
            else if ("reload" === b) location.reload();
            else if ("url" === b) {
              b = a.url;
              var d = a.target;
              a = a.exportType;
              "windows-uwp" === a && "undefined" !== typeof Windows
                ? Windows.System.Launcher.launchUriAsync(
                    new Windows.Foundation.Uri(b)
                  )
                : self.cordova && self.cordova.InAppBrowser
                ? self.cordova.InAppBrowser.open(b, "_system")
                : "preview" === a || "windows-webview2" === a
                ? window.open(b, "_blank")
                : this.Qg ||
                  (2 === d
                    ? (window.top.location = b)
                    : 1 === d
                    ? (window.parent.location = b)
                    : (window.location = b));
            } else
              "new-window" === b &&
                ((b = a.url),
                (d = a.tag),
                "windows-uwp" === a.exportType && "undefined" !== typeof Windows
                  ? Windows.System.Launcher.launchUriAsync(
                      new Windows.Foundation.Uri(b)
                    )
                  : self.cordova && self.cordova.InAppBrowser
                  ? self.cordova.InAppBrowser.open(b, "_system")
                  : window.open(b, d));
          },
        ],
        [
          "request-fullscreen",
          (a) => {
            if ("windows-webview2" === this.u || "macos-wkwebview" === this.u)
              self.fa.Ib(!0),
                this.A.Jc({ type: "set-fullscreen", fullscreen: !0 });
            else {
              const b = { navigationUI: "auto" };
              a = a.navUI;
              1 === a
                ? (b.navigationUI = "hide")
                : 2 === a && (b.navigationUI = "show");
              a = document.documentElement;
              a.requestFullscreen
                ? a.requestFullscreen(b)
                : a.mozRequestFullScreen
                ? a.mozRequestFullScreen(b)
                : a.msRequestFullscreen
                ? a.msRequestFullscreen(b)
                : a.webkitRequestFullScreen &&
                  ("undefined" !== typeof Element.ALLOW_KEYBOARD_INPUT
                    ? a.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
                    : a.webkitRequestFullScreen());
            }
          },
        ],
        [
          "exit-fullscreen",
          () => {
            "windows-webview2" === this.u || "macos-wkwebview" === this.u
              ? (self.fa.Ib(!1),
                this.A.Jc({ type: "set-fullscreen", fullscreen: !1 }))
              : document.exitFullscreen
              ? document.exitFullscreen()
              : document.mozCancelFullScreen
              ? document.mozCancelFullScreen()
              : document.msExitFullscreen
              ? document.msExitFullscreen()
              : document.webkitCancelFullScreen &&
                document.webkitCancelFullScreen();
          },
        ],
        [
          "set-hash",
          (a) => {
            location.hash = a.hash;
          },
        ],
      ]);
      window.addEventListener("online", () => {
        r(this, "online-state", { isOnline: !0 });
      });
      window.addEventListener("offline", () => {
        r(this, "online-state", { isOnline: !1 });
      });
      window.addEventListener("hashchange", () => {
        r(this, "hashchange", { location: location.toString() });
      });
      document.addEventListener("backbutton", () => {
        r(this, "backbutton");
      });
      "undefined" !== typeof Windows &&
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().addEventListener(
          "backrequested",
          (a) => {
            a.handled = !0;
            r(this, "backbutton");
          }
        );
    }
    Cc(e) {
      this.u = e.exportType;
      return {
        location: location.toString(),
        isOnline: !!navigator.onLine,
        referrer: document.referrer,
        title: document.title,
        isCookieEnabled: !!navigator.cookieEnabled,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowOuterWidth: window.outerWidth,
        windowOuterHeight: window.outerHeight,
        isScirraArcade: "undefined" !== typeof window.is_scirra_arcade,
      };
    }
    zc(e) {
      alert(e.message);
    }
    Fc(e) {
      e = e.isFocus;
      if ("nwjs" === this.u) {
        const a = "nwjs" === this.u ? nw.Window.get() : null;
        e ? a.focus() : a.blur();
      } else e ? window.focus() : window.blur();
    }
  }
);
("use strict");
async function ca(e) {
  var a = W(e.index);
  if (a && (a = a.vibrationActuator) && a.playEffect)
    try {
      await a.playEffect("dual-rumble", {
        duration: e.duration,
        startDelay: 0,
        weakMagnitude: e.weakMag,
        strongMagnitude: e.strongMag,
      });
    } catch (b) {
      console.warn("[Gamepad] Failed to vibrate gamepad: ", b);
    }
}
function X() {
  return Array.from(navigator.getGamepads()).filter((e) => e && e.connected);
}
function W(e) {
  for (const a of X()) if (a.index === e) return a;
  return null;
}
self.fa.Ea(
  class extends self.sa {
    constructor(e) {
      super(e, "gamepad");
      this.Rd = !!navigator.getGamepads;
      this.Uc = !1;
      F(this, "is-supported", () => this.Rd);
      F(this, "ready", () => {
        this.Uc = !0;
        for (const a of X())
          r(this, "gamepad-connected", { index: a.index, id: a.id });
        this.Rd && I(this);
      });
      F(this, "vibrate", (a) => ca(a));
      F(this, "reset-vibrate", (a) => {
        (a = W(a.index)) && (a = a.vibrationActuator) && a.reset && a.reset();
      });
      window.addEventListener("gamepadconnected", (a) => {
        this.Uc &&
          ((a = a.gamepad),
          r(this, "gamepad-connected", { index: a.index, id: a.id }));
      });
      window.addEventListener("gamepaddisconnected", (a) => {
        this.Uc && r(this, "gamepad-disconnected", { index: a.gamepad.index });
      });
      window.addEventListener("unload", () => {
        for (const a of X()) {
          const b = a.vibrationActuator;
          b && b.reset && b.reset();
        }
      });
    }
    va() {
      var e = X();
      e.length &&
        ((e = e.map((a) => ({
          index: a.index,
          id: a.id,
          buttons: a.buttons.map((b) => ({
            pressed: b.pressed,
            value: b.value,
          })),
          axes: a.axes,
        }))),
        r(this, "input-update", e));
    }
  }
);
("use strict");
{
  const e = 180 / Math.PI;
  self.da = class extends self.sa {
    constructor(a) {
      super(a, "audio");
      this.Nb = this.f = null;
      this.Pb = this.Rc = !1;
      this.qa = () => this.qg();
      this.aa = [];
      this.D = [];
      this.ha = null;
      this.Td = "";
      this.Ud = -1;
      this.pb = new Map();
      this.Xc = 1;
      this.oa = !1;
      this.cd = 0;
      this.ac = 1;
      this.Pc = 0;
      this.Wd = "HRTF";
      this.Md = "inverse";
      this.Xd = 600;
      this.Vd = 1e4;
      this.Zd = 1;
      this.Od = this.ad = !1;
      this.be = this.A.Fe();
      this.ba = new Map();
      this.Ia = new Set();
      this.Tc = !1;
      this.Yc = "";
      this.Ba = null;
      self.C3Audio_OnMicrophoneStream = (b, d) => this.Df(b, d);
      this.Mb = null;
      self.C3Audio_GetOutputStream = () => this.xf();
      self.C3Audio_DOMInterface = this;
      H(this, [
        ["create-audio-context", (b) => this.$e(b)],
        ["play", (b) => this.Rf(b)],
        ["stop", (b) => this.ng(b)],
        ["stop-all", () => this.og()],
        ["set-paused", (b) => this.gg(b)],
        ["set-volume", (b) => this.lg(b)],
        ["fade-volume", (b) => this.ef(b)],
        ["set-master-volume", (b) => this.eg(b)],
        ["set-muted", (b) => this.fg(b)],
        ["set-silent", (b) => this.ig(b)],
        ["set-looping", (b) => this.dg(b)],
        ["set-playback-rate", (b) => this.hg(b)],
        ["seek", (b) => this.Yf(b)],
        ["preload", (b) => this.Sf(b)],
        ["unload", (b) => this.rg(b)],
        ["unload-all", () => this.sg()],
        ["set-suspended", (b) => this.jg(b)],
        ["add-effect", (b) => this.ud(b)],
        ["set-effect-param", (b) => this.ag(b)],
        ["remove-effects", (b) => this.Uf(b)],
        ["tick", (b) => this.Mf(b)],
        ["load-state", (b) => this.Bf(b)],
      ]);
    }
    async $e(a) {
      a.isiOSCordova && (this.ad = !0);
      this.cd = a.timeScaleMode;
      this.Wd = ["equalpower", "HRTF", "soundfield"][a.panningModel];
      this.Md = ["linear", "inverse", "exponential"][a.distanceModel];
      this.Xd = a.refDistance;
      this.Vd = a.maxDistance;
      this.Zd = a.rolloffFactor;
      var b = { latencyHint: a.latencyHint };
      this.be || (b.sampleRate = 48e3);
      if ("undefined" !== typeof AudioContext) this.f = new AudioContext(b);
      else if ("undefined" !== typeof webkitAudioContext)
        this.f = new webkitAudioContext(b);
      else throw Error("Web Audio API not supported");
      this.vd();
      this.f.onstatechange = () => {
        "running" !== this.f.state && this.vd();
      };
      this.Nb = this.f.createGain();
      this.Nb.connect(this.f.destination);
      b = a.listenerPos;
      this.f.listener.setPosition(b[0], b[1], b[2]);
      this.f.listener.setOrientation(0, 0, 1, 0, -1, 0);
      self.C3_GetAudioContextCurrentTime = () => this.ec();
      try {
        await Promise.all(
          a.preloadList.map((d) => this.Db(d.originalUrl, d.url, d.type, !1))
        );
      } catch (d) {
        console.error("[Construct 3] Preloading sounds failed: ", d);
      }
      return { sampleRate: this.f.sampleRate };
    }
    vd() {
      this.Pb ||
        ((this.Rc = !1),
        window.addEventListener("pointerup", this.qa, !0),
        window.addEventListener("touchend", this.qa, !0),
        window.addEventListener("click", this.qa, !0),
        window.addEventListener("keydown", this.qa, !0),
        (this.Pb = !0));
    }
    bf() {
      this.Pb &&
        ((this.Rc = !0),
        window.removeEventListener("pointerup", this.qa, !0),
        window.removeEventListener("touchend", this.qa, !0),
        window.removeEventListener("click", this.qa, !0),
        window.removeEventListener("keydown", this.qa, !0),
        (this.Pb = !1));
    }
    qg() {
      if (!this.Rc) {
        var a = this.f;
        "suspended" === a.state && a.resume && a.resume();
        var b = a.createBuffer(1, 220, 22050),
          d = a.createBufferSource();
        d.buffer = b;
        d.connect(a.destination);
        d.start(0);
        "running" === a.state && this.bf();
      }
    }
    W() {
      return this.f;
    }
    ec() {
      return this.f.currentTime;
    }
    ta() {
      return this.Nb;
    }
    ld(a) {
      return (a = this.ba.get(a.toLowerCase())) ? a[0].P() : this.ta();
    }
    he(a, b) {
      a = a.toLowerCase();
      let d = this.ba.get(a);
      d || ((d = []), this.ba.set(a, d));
      b.cg(d.length);
      b.kg(a);
      d.push(b);
      this.Fd(a);
    }
    Fd(a) {
      let b = this.ta();
      const d = this.ba.get(a);
      if (d && d.length) {
        b = d[0].P();
        for (let g = 0, m = d.length; g < m; ++g) {
          const p = d[g];
          g + 1 === m ? p.S(this.ta()) : p.S(d[g + 1].P());
        }
      }
      for (const g of this.ma(a)) g.Le(b);
      this.Ba && this.Yc === a && (this.Ba.disconnect(), this.Ba.connect(b));
    }
    xb() {
      return this.Xc;
    }
    yb() {
      return this.oa;
    }
    bg() {
      this.Od = !0;
    }
    ze(a, b) {
      return b
        ? this.A.tg(a).then((d) => {
            const g = this.f.createBuffer(1, d.length, 48e3);
            g.getChannelData(0).set(d);
            return g;
          })
        : new Promise((d, g) => {
            this.f.decodeAudioData(a, d, g);
          });
    }
    wa(a) {
      this.A.wa(a);
    }
    Ga(a) {
      this.A.Ga(a);
    }
    qd(a) {
      let b = 0;
      for (let d = 0, g = this.D.length; d < g; ++d) {
        const m = this.D[d];
        this.D[b] = m;
        m.L === a ? m.c() : ++b;
      }
      this.D.length = b;
    }
    Me() {
      let a = 0;
      for (let b = 0, d = this.aa.length; b < d; ++b) {
        const g = this.aa[b];
        this.aa[a] = g;
        g.ua() ? g.c() : ++a;
      }
      this.aa.length = a;
    }
    *ma(a) {
      if (a) for (const b of this.D) self.da.Ae(b.Z, a) && (yield b);
      else this.ha && !this.ha.T() && (yield this.ha);
    }
    async Db(a, b, d, g, m) {
      for (const p of this.aa) if (p.Ua() === b) return await Y(p), p;
      if (m) return null;
      g && (this.ad || this.Od) && this.Me();
      m = "audio/webm; codecs=opus" === d && !this.be;
      g && m && this.bg();
      a =
        !g || this.ad || m
          ? new self.ve(this, a, b, d, g, m)
          : new self.te(this, a, b, d, g);
      this.aa.push(a);
      await Y(a);
      return a;
    }
    async tc(a, b, d, g, m) {
      for (const p of this.D)
        if (p.Ua() === b && (p.cc() || m)) return p.Oe(g), p;
      a = await this.Db(a, b, d, m);
      g = "html5" === a.Kc ? new self.ue(a.i, a, g) : new self.we(a.i, a, g);
      this.D.push(g);
      return g;
    }
    Se(a) {
      let b = this.pb.get(a);
      if (!b) {
        let d = null;
        b = { dd: 0, promise: new Promise((g) => (d = g)), resolve: d };
        this.pb.set(a, b);
      }
      b.dd++;
    }
    Vf(a) {
      const b = this.pb.get(a);
      if (!b) throw Error("expected pending tag");
      b.dd--;
      0 === b.dd && (b.resolve(), this.pb.delete(a));
    }
    qc(a) {
      a || (a = this.Td);
      return (a = this.pb.get(a)) ? a.promise : Promise.resolve();
    }
    Eb() {
      if (0 < this.Ia.size) I(this);
      else
        for (const a of this.D)
          if (a.md()) {
            I(this);
            break;
          }
    }
    va() {
      for (var a of this.Ia) a.va();
      a = this.ec();
      for (var b of this.D) b.va(a);
      b = this.D.filter((d) => d.md()).map((d) => d.Ta());
      r(this, "state", {
        tickCount: this.Ud,
        audioInstances: b,
        analysers: [...this.Ia].map((d) => d.Ce()),
      });
      0 === b.length &&
        0 === this.Ia.size &&
        this.Qb &&
        (this.A.Wf(this.ce), (this.Qb = !1));
    }
    mc(a, b, d) {
      r(this, "trigger", { type: a, tag: b, aiid: d });
    }
    async Rf(a) {
      const b = a.originalUrl,
        d = a.url,
        g = a.type,
        m = a.isMusic,
        p = a.tag,
        x = a.isLooping,
        A = a.vol,
        B = a.pos,
        v = a.panning;
      let w = a.off;
      0 < w &&
        !a.trueClock &&
        (this.f.getOutputTimestamp
          ? ((a = this.f.getOutputTimestamp()),
            (w = w - a.performanceTime / 1e3 + a.contextTime))
          : (w = w - performance.now() / 1e3 + this.f.currentTime));
      this.Td = p;
      this.Se(p);
      try {
        (this.ha = await this.tc(b, d, g, p, m)),
          v
            ? (this.ha.Ab(!0),
              this.ha.Ne(
                v.x,
                v.y,
                v.angle,
                v.innerAngle,
                v.outerAngle,
                v.outerGain
              ),
              v.hasOwnProperty("uid") && this.ha.Pe(v.uid))
            : this.ha.Ab(!1),
          this.ha.Play(x, A, B, w);
      } catch (C) {
        console.error("[Construct 3] Audio: error starting playback: ", C);
        return;
      } finally {
        this.Vf(p);
      }
      I(this);
    }
    ng(a) {
      a = a.tag;
      for (const b of this.ma(a)) b.na();
    }
    og() {
      for (const a of this.D) a.na();
    }
    gg(a) {
      const b = a.tag;
      a = a.paused;
      for (const d of this.ma(b)) a ? d.Wa() : d.zb();
      this.Eb();
    }
    lg(a) {
      const b = a.tag;
      a = a.vol;
      for (const d of this.ma(b)) d.Cb(a);
    }
    async ef(a) {
      const b = a.tag,
        d = a.vol,
        g = a.duration;
      a = a.stopOnEnd;
      await this.qc(b);
      for (const m of this.ma(b)) m.Be(d, g, a);
      this.Eb();
    }
    eg(a) {
      this.Xc = a.vol;
      for (const b of this.D) b.Kb();
    }
    fg(a) {
      const b = a.tag;
      a = a.isMuted;
      for (const d of this.ma(b)) d.rd(a);
    }
    ig(a) {
      this.oa = a.isSilent;
      this.A.Bb(this.oa);
      for (const b of this.D) b.Jb();
    }
    dg(a) {
      const b = a.tag;
      a = a.isLooping;
      for (const d of this.ma(b)) d.oc(a);
    }
    async hg(a) {
      const b = a.tag;
      a = a.rate;
      await this.qc(b);
      for (const d of this.ma(b)) d.td(a);
    }
    async Yf(a) {
      const b = a.tag;
      a = a.pos;
      await this.qc(b);
      for (const d of this.ma(b)) d.nc(a);
    }
    async Sf(a) {
      const b = a.originalUrl,
        d = a.url,
        g = a.type;
      a = a.isMusic;
      try {
        await this.tc(b, d, g, "", a);
      } catch (m) {
        console.error("[Construct 3] Audio: error preloading: ", m);
      }
    }
    async rg(a) {
      if ((a = await this.Db("", a.url, a.type, a.isMusic, !0)))
        a.c(), (a = this.aa.indexOf(a)), -1 !== a && this.aa.splice(a, 1);
    }
    sg() {
      for (const a of this.aa) a.c();
      this.aa.length = 0;
    }
    jg(a) {
      a = a.isSuspended;
      !a && this.f.resume && this.f.resume();
      for (const b of this.D) b.pc(a);
      a && this.f.suspend && this.f.suspend();
    }
    Mf(a) {
      this.ac = a.timeScale;
      this.Pc = a.gameTime;
      this.Ud = a.tickCount;
      if (0 !== this.cd) for (var b of this.D) b.Ha();
      (b = a.listenerPos) && this.f.listener.setPosition(b[0], b[1], b[2]);
      for (const d of a.instPans) {
        a = d.uid;
        for (const g of this.D) g.ga === a && g.sd(d.x, d.y, d.angle);
      }
    }
    async ud(a) {
      var b = a.type;
      const d = a.tag;
      var g = a.params;
      if ("filter" === b) g = new self.ne(this, ...g);
      else if ("delay" === b) g = new self.le(this, ...g);
      else if ("convolution" === b) {
        b = null;
        try {
          b = await this.Db(a.bufferOriginalUrl, a.bufferUrl, a.bufferType, !1);
        } catch (m) {
          console.log("[Construct 3] Audio: error loading convolution: ", m);
          return;
        }
        g = new self.ke(this, b.$, ...g);
        g.Zf(a.bufferOriginalUrl, a.bufferType);
      } else if ("flanger" === b) g = new self.oe(this, ...g);
      else if ("phaser" === b) g = new self.qe(this, ...g);
      else if ("gain" === b) g = new self.pe(this, ...g);
      else if ("tremolo" === b) g = new self.se(this, ...g);
      else if ("ringmod" === b) g = new self.re(this, ...g);
      else if ("distortion" === b) g = new self.me(this, ...g);
      else if ("compressor" === b) g = new self.je(this, ...g);
      else if ("analyser" === b) g = new self.ie(this, ...g);
      else throw Error("invalid effect type");
      this.he(d, g);
      this.Ed();
    }
    ag(a) {
      const b = a.index,
        d = a.param,
        g = a.value,
        m = a.ramp,
        p = a.time;
      a = this.ba.get(a.tag);
      !a || 0 > b || b >= a.length || (a[b].X(d, g, m, p), this.Ed());
    }
    Uf(a) {
      a = a.tag.toLowerCase();
      const b = this.ba.get(a);
      if (b && b.length) {
        for (const d of b) d.c();
        this.ba.delete(a);
        this.Fd(a);
      }
    }
    Re(a) {
      this.Ia.add(a);
      this.Eb();
    }
    Tf(a) {
      this.Ia.delete(a);
    }
    Ed() {
      this.Tc || ((this.Tc = !0), Promise.resolve().then(() => this.cf()));
    }
    cf() {
      const a = {};
      for (const [b, d] of this.ba) a[b] = d.map((g) => g.Ta());
      r(this, "fxstate", { fxstate: a });
      this.Tc = !1;
    }
    async Bf(a) {
      const b = a.saveLoadMode;
      if (3 !== b)
        for (var d of this.D)
          (d.ua() && 1 === b) || ((d.ua() || 2 !== b) && d.na());
      for (const g of this.ba.values()) for (const m of g) m.c();
      this.ba.clear();
      this.ac = a.timeScale;
      this.Pc = a.gameTime;
      d = a.listenerPos;
      this.f.listener.setPosition(d[0], d[1], d[2]);
      this.oa = a.isSilent;
      this.A.Bb(this.oa);
      this.Xc = a.masterVolume;
      d = [];
      for (const g of Object.values(a.effects))
        d.push(Promise.all(g.map((m) => this.ud(m))));
      await Promise.all(d);
      await Promise.all(a.playing.map((g) => this.mf(g, b)));
      this.Eb();
    }
    async mf(a, b) {
      if (3 !== b) {
        var d = a.bufferOriginalUrl,
          g = a.bufferUrl,
          m = a.bufferType,
          p = a.isMusic,
          x = a.tag,
          A = a.isLooping,
          B = a.volume,
          v = a.playbackTime;
        if (!p || 1 !== b)
          if (p || 2 !== b) {
            b = null;
            try {
              b = await this.tc(d, g, m, x, p);
            } catch (w) {
              console.error(
                "[Construct 3] Audio: error loading audio state: ",
                w
              );
              return;
            }
            b.Je(a.pan);
            b.Play(A, B, v, 0);
            a.isPlaying || b.Wa();
            b.xc(a);
          }
      }
    }
    Df(a, b) {
      this.Ba && this.Ba.disconnect();
      this.Yc = b.toLowerCase();
      this.Ba = this.f.createMediaStreamSource(a);
      this.Ba.connect(this.ld(this.Yc));
    }
    xf() {
      this.Mb ||
        ((this.Mb = this.f.createMediaStreamDestination()),
        this.Nb.connect(this.Mb));
      return this.Mb.stream;
    }
    static Ae(a, b) {
      return a.length !== b.length
        ? !1
        : a === b
        ? !0
        : a.toLowerCase() === b.toLowerCase();
    }
    static Qe(a) {
      return a * e;
    }
    static ye(a) {
      return Math.pow(10, a / 20);
    }
    static kd(a) {
      return Math.max(Math.min(self.da.ye(a), 1), 0);
    }
    static Ie(a) {
      return (Math.log(a) / Math.log(10)) * 20;
    }
    static He(a) {
      return self.da.Ie(Math.max(Math.min(a, 1), 0));
    }
    static Dg(a, b) {
      return 1 - Math.exp(-b * a);
    }
  };
  self.fa.Ea(self.da);
}
("use strict");
function Y(e) {
  e.Sb || (e.Sb = e.wc());
  return e.Sb;
}
self.gd = class {
  constructor(e, a, b, d, g) {
    this.i = e;
    this.zg = a;
    this.Da = b;
    this.R = d;
    this.wg = g;
    this.Kc = "";
    this.Sb = null;
  }
  c() {
    this.Sb = this.i = null;
  }
  wc() {}
  W() {
    return this.i.W();
  }
  hc() {
    return this.zg;
  }
  Ua() {
    return this.Da;
  }
  fc() {
    return this.R;
  }
  ua() {
    return this.wg;
  }
  ea() {}
};
("use strict");
self.te = class extends self.gd {
  constructor(e, a, b, d, g) {
    super(e, a, b, d, g);
    this.Kc = "html5";
    this.J = new Audio();
    this.J.crossOrigin = "anonymous";
    this.J.autoplay = !1;
    this.J.preload = "auto";
    this.jb = this.kb = null;
    this.J.addEventListener("canplaythrough", () => !0);
    this.ob = this.W().createGain();
    this.mb = null;
    this.J.addEventListener("canplay", () => {
      this.kb && (this.kb(), (this.jb = this.kb = null));
      !this.mb &&
        this.J &&
        ((this.mb = this.W().createMediaElementSource(this.J)),
        this.mb.connect(this.ob));
    });
    this.onended = null;
    this.J.addEventListener("ended", () => {
      if (this.onended) this.onended();
    });
    this.J.addEventListener("error", (m) => {
      console.error(`[Construct 3] Audio '${this.Da}' error: `, m);
      this.jb && (this.jb(m), (this.jb = this.kb = null));
    });
  }
  c() {
    this.i.qd(this);
    this.ob.disconnect();
    this.ob = null;
    this.mb.disconnect();
    this.mb = null;
    this.J && !this.J.paused && this.J.pause();
    this.J = this.onended = null;
    super.c();
  }
  wc() {
    return new Promise((e, a) => {
      this.kb = e;
      this.jb = a;
      this.J.src = this.Da;
    });
  }
  O() {
    return this.J;
  }
  ea() {
    return this.J.duration;
  }
};
("use strict");
async function ea(e) {
  if (e.za) return e.za;
  var a = e.i.A;
  if ("cordova" === a.u && a.nd(e.Da) && "file:" === location.protocol)
    e.za = await a.vb(e.Da);
  else {
    a = await fetch(e.Da);
    if (!a.ok)
      throw Error(`error fetching audio data: ${a.status} ${a.statusText}`);
    e.za = await a.arrayBuffer();
  }
}
async function ha(e) {
  if (e.$) return e.$;
  e.$ = await e.i.ze(e.za, e.yg);
  e.za = null;
}
self.ve = class extends self.gd {
  constructor(e, a, b, d, g, m) {
    super(e, a, b, d, g);
    this.Kc = "webaudio";
    this.$ = this.za = null;
    this.yg = !!m;
  }
  c() {
    this.i.qd(this);
    this.$ = this.za = null;
    super.c();
  }
  async wc() {
    try {
      await ea(this), await ha(this);
    } catch (e) {
      console.error(`[Construct 3] Failed to load audio '${this.Da}': `, e);
    }
  }
  ea() {
    return this.$ ? this.$.duration : 0;
  }
};
("use strict");
{
  let e = 0;
  self.hd = class {
    constructor(a, b, d) {
      this.i = a;
      this.L = b;
      this.Z = d;
      this.Lb = e++;
      this.M = this.W().createGain();
      this.M.connect(this.ta());
      this.B = null;
      this.hb = !1;
      this.ka = [0, 0, 0];
      this.ja = [0, 0, 0];
      this.H = !0;
      this.V = this.la = this.G = !1;
      this.sb = 1;
      this.Ja = !1;
      this.Y = 1;
      a = this.i.cd;
      this.Vc = (1 === a && !this.ua()) || 2 === a;
      this.eb = this.ga = -1;
      this.ae = !1;
    }
    c() {
      this.L = this.i = null;
      this.B && (this.B.disconnect(), (this.B = null));
      this.M.disconnect();
      this.M = null;
    }
    W() {
      return this.i.W();
    }
    ta() {
      return this.i.ld(this.Z);
    }
    xb() {
      return this.i.xb();
    }
    wb() {
      return this.Vc ? this.i.Pc : performance.now() / 1e3;
    }
    hc() {
      return this.L.hc();
    }
    Ua() {
      return this.L.Ua();
    }
    fc() {
      return this.L.fc();
    }
    ua() {
      return this.L.ua();
    }
    Oe(a) {
      this.Z = a;
    }
    T() {}
    cc() {}
    IsPlaying() {
      return !this.H && !this.G && !this.T();
    }
    md() {
      return !this.H && !this.T();
    }
    Fa() {}
    ea() {
      return this.L.ea();
    }
    Play() {}
    na() {}
    Wa() {}
    zb() {}
    Cb(a) {
      this.sb = a;
      this.M.gain.cancelScheduledValues(0);
      this.eb = -1;
      this.M.gain.value = this.ic();
    }
    Be(a, b, d) {
      if (!this.Ja) {
        a *= this.xb();
        var g = this.M.gain;
        g.cancelScheduledValues(0);
        var m = this.i.ec();
        b = m + b;
        g.setValueAtTime(g.value, m);
        g.linearRampToValueAtTime(a, b);
        this.sb = a;
        this.eb = b;
        this.ae = d;
      }
    }
    Kb() {
      this.Cb(this.sb);
    }
    va(a) {
      -1 !== this.eb &&
        a >= this.eb &&
        ((this.eb = -1),
        this.ae && this.na(),
        this.i.mc("fade-ended", this.Z, this.Lb));
    }
    ic() {
      const a = this.sb * this.xb();
      return isFinite(a) ? a : 0;
    }
    rd(a) {
      a = !!a;
      this.Ja !== a && ((this.Ja = a), this.Jb());
    }
    yb() {
      return this.i.yb();
    }
    Jb() {}
    oc() {}
    td(a) {
      this.Y !== a && ((this.Y = a), this.Ha());
    }
    Ha() {}
    nc() {}
    pc() {}
    Ab(a) {
      a = !!a;
      this.hb !== a &&
        ((this.hb = a)
          ? (this.B ||
              ((this.B = this.W().createPanner()),
              (this.B.panningModel = this.i.Wd),
              (this.B.distanceModel = this.i.Md),
              (this.B.refDistance = this.i.Xd),
              (this.B.maxDistance = this.i.Vd),
              (this.B.rolloffFactor = this.i.Zd)),
            this.M.disconnect(),
            this.M.connect(this.B),
            this.B.connect(this.ta()))
          : (this.B.disconnect(),
            this.M.disconnect(),
            this.M.connect(this.ta())));
    }
    Ne(a, b, d, g, m, p) {
      this.hb &&
        (this.sd(a, b, d),
        (a = self.da.Qe),
        (this.B.coneInnerAngle = a(g)),
        (this.B.coneOuterAngle = a(m)),
        (this.B.coneOuterGain = p));
    }
    sd(a, b, d) {
      this.hb &&
        ((this.ka[0] = a),
        (this.ka[1] = b),
        (this.ka[2] = 0),
        (this.ja[0] = Math.cos(d)),
        (this.ja[1] = Math.sin(d)),
        (this.ja[2] = 0),
        this.B.setPosition(...this.ka),
        this.B.setOrientation(...this.ja));
    }
    Pe(a) {
      this.ga = a;
    }
    jc() {}
    Le(a) {
      const b = this.B || this.M;
      b.disconnect();
      b.connect(a);
    }
    Ta() {
      return {
        aiid: this.Lb,
        tag: this.Z,
        duration: this.ea(),
        volume: this.sb,
        isPlaying: this.IsPlaying(),
        playbackTime: this.Fa(),
        playbackRate: this.Y,
        uid: this.ga,
        bufferOriginalUrl: this.hc(),
        bufferUrl: "",
        bufferType: this.fc(),
        isMusic: this.ua(),
        isLooping: this.V,
        isMuted: this.Ja,
        resumePosition: this.jc(),
        pan: this.De(),
      };
    }
    xc(a) {
      this.td(a.playbackRate);
      this.rd(a.isMuted);
    }
    De() {
      if (!this.B) return null;
      const a = this.B;
      return {
        pos: this.ka,
        orient: this.ja,
        cia: a.coneInnerAngle,
        coa: a.coneOuterAngle,
        cog: a.coneOuterGain,
        uid: this.ga,
      };
    }
    Je(a) {
      if (a) {
        this.Ab(!0);
        a = this.B;
        var b = a.pos;
        this.ka[0] = b[0];
        this.ka[1] = b[1];
        this.ka[2] = b[2];
        b = a.orient;
        this.ja[0] = b[0];
        this.ja[1] = b[1];
        this.ja[2] = b[2];
        a.setPosition(...this.ka);
        a.setOrientation(...this.ja);
        a.coneInnerAngle = a.cia;
        a.coneOuterAngle = a.coa;
        a.coneOuterGain = a.cog;
        this.ga = a.uid;
      } else this.Ab(!1);
    }
  };
}
("use strict");
self.ue = class extends self.hd {
  constructor(e, a, b) {
    super(e, a, b);
    this.L.ob.connect(this.M);
    this.L.onended = () => this.Ac();
  }
  c() {
    this.na();
    this.L.ob.disconnect();
    super.c();
  }
  O() {
    return this.L.O();
  }
  Ac() {
    this.H = !0;
    this.ga = -1;
    this.i.mc("ended", this.Z, this.Lb);
  }
  T() {
    return this.O().ended;
  }
  cc() {
    return this.H ? !0 : this.T();
  }
  Fa(e) {
    let a = this.O().currentTime;
    e && (a *= this.Y);
    this.V || (a = Math.min(a, this.ea()));
    return a;
  }
  Play(e, a, b) {
    const d = this.O();
    1 !== d.playbackRate && (d.playbackRate = 1);
    d.loop !== e && (d.loop = e);
    this.Cb(a);
    d.muted && (d.muted = !1);
    if (d.currentTime !== b)
      try {
        d.currentTime = b;
      } catch (g) {
        console.warn(
          `[Construct 3] Exception seeking audio '${this.L.Ua()}' to position '${b}': `,
          g
        );
      }
    this.i.wa(d);
    this.G = this.H = !1;
    this.V = e;
    this.Y = 1;
  }
  na() {
    const e = this.O();
    e.paused || e.pause();
    this.i.Ga(e);
    this.H = !0;
    this.G = !1;
    this.ga = -1;
  }
  Wa() {
    if (!(this.G || this.H || this.T())) {
      var e = this.O();
      e.paused || e.pause();
      this.i.Ga(e);
      this.G = !0;
    }
  }
  zb() {
    !this.G || this.H || this.T() || (this.i.wa(this.O()), (this.G = !1));
  }
  Jb() {
    this.O().muted = this.Ja || this.yb();
  }
  oc(e) {
    e = !!e;
    this.V !== e && ((this.V = e), (this.O().loop = e));
  }
  Ha() {
    let e = this.Y;
    this.Vc && (e *= this.i.ac);
    try {
      this.O().playbackRate = e;
    } catch (a) {
      console.warn(`[Construct 3] Unable to set playback rate '${e}':`, a);
    }
  }
  nc(e) {
    if (!this.H && !this.T())
      try {
        this.O().currentTime = e;
      } catch (a) {
        console.warn(`[Construct 3] Error seeking audio to '${e}': `, a);
      }
  }
  jc() {
    return this.Fa();
  }
  pc(e) {
    e
      ? this.IsPlaying()
        ? (this.O().pause(), (this.la = !0))
        : (this.la = !1)
      : this.la && (this.i.wa(this.O()), (this.la = !1));
  }
};
("use strict");
function Z(e) {
  e.j && e.j.disconnect();
  e.j = null;
  e.$a = null;
}
self.we = class extends self.hd {
  constructor(e, a, b) {
    super(e, a, b);
    this.j = null;
    this.Vb = (d) => this.Ac(d);
    this.Qc = !0;
    this.$a = null;
    this.N = this.$b = 0;
    this.Zc = 1;
  }
  c() {
    this.na();
    Z(this);
    this.Vb = null;
    super.c();
  }
  Ac(e) {
    this.G ||
      this.la ||
      e.target !== this.$a ||
      ((this.H = this.Qc = !0),
      (this.ga = -1),
      Z(this),
      this.i.mc("ended", this.Z, this.Lb));
  }
  T() {
    return (!this.H && this.j && this.j.loop) || this.G ? !1 : this.Qc;
  }
  cc() {
    return !this.j || this.H ? !0 : this.T();
  }
  Fa(e) {
    let a;
    a = this.G ? this.N : this.wb() - this.$b;
    e && (a *= this.Y);
    this.V || (a = Math.min(a, this.ea()));
    return a;
  }
  Play(e, a, b, d) {
    this.Zc = 1;
    this.Cb(a);
    Z(this);
    this.j = this.W().createBufferSource();
    this.j.buffer = this.L.$;
    this.j.connect(this.M);
    this.$a = this.j;
    this.j.onended = this.Vb;
    this.j.loop = e;
    this.j.start(d, b);
    this.G = this.H = this.Qc = !1;
    this.V = e;
    this.Y = 1;
    this.$b = this.wb() - b;
  }
  na() {
    if (this.j)
      try {
        this.j.stop(0);
      } catch (e) {}
    this.H = !0;
    this.G = !1;
    this.ga = -1;
  }
  Wa() {
    this.G ||
      this.H ||
      this.T() ||
      ((this.N = this.Fa(!0)),
      this.V && (this.N %= this.ea()),
      (this.G = !0),
      this.j.stop(0));
  }
  zb() {
    !this.G ||
      this.H ||
      this.T() ||
      (Z(this),
      (this.j = this.W().createBufferSource()),
      (this.j.buffer = this.L.$),
      this.j.connect(this.M),
      (this.$a = this.j),
      (this.j.onended = this.Vb),
      (this.j.loop = this.V),
      this.Kb(),
      this.Ha(),
      (this.$b = this.wb() - this.N / (this.Y || 0.001)),
      this.j.start(0, this.N),
      (this.G = !1));
  }
  ic() {
    return super.ic() * this.Zc;
  }
  Jb() {
    this.Zc = this.Ja || this.yb() ? 0 : 1;
    this.Kb();
  }
  oc(e) {
    e = !!e;
    this.V !== e && ((this.V = e), this.j && (this.j.loop = e));
  }
  Ha() {
    let e = this.Y;
    this.Vc && (e *= this.i.ac);
    this.j && (this.j.playbackRate.value = e);
  }
  nc(e) {
    this.H ||
      this.T() ||
      (this.G ? (this.N = e) : (this.Wa(), (this.N = e), this.zb()));
  }
  jc() {
    return this.N;
  }
  pc(e) {
    e
      ? this.IsPlaying()
        ? ((this.la = !0),
          (this.N = this.Fa(!0)),
          this.V && (this.N %= this.ea()),
          this.j.stop(0))
        : (this.la = !1)
      : this.la &&
        (Z(this),
        (this.j = this.W().createBufferSource()),
        (this.j.buffer = this.L.$),
        this.j.connect(this.M),
        (this.$a = this.j),
        (this.j.onended = this.Vb),
        (this.j.loop = this.V),
        this.Kb(),
        this.Ha(),
        (this.$b = this.wb() - this.N / (this.Y || 0.001)),
        this.j.start(0, this.N),
        (this.la = !1));
  }
  xc(e) {
    super.xc(e);
    this.N = e.resumePosition;
  }
};
("use strict");
{
  class e {
    constructor(a) {
      this.i = a;
      this.f = a.W();
      this.Pd = -1;
      this.R = this.Z = "";
      this.g = null;
    }
    c() {
      this.f = null;
    }
    cg(a) {
      this.Pd = a;
    }
    kg(a) {
      this.Z = a;
    }
    o() {
      return this.f.createGain();
    }
    P() {}
    S() {}
    m(a, b, d, g) {
      a.cancelScheduledValues(0);
      if (0 === g) a.value = b;
      else {
        var m = this.f.currentTime;
        g += m;
        switch (d) {
          case 0:
            a.setValueAtTime(b, g);
            break;
          case 1:
            a.setValueAtTime(a.value, m);
            a.linearRampToValueAtTime(b, g);
            break;
          case 2:
            a.setValueAtTime(a.value, m), a.exponentialRampToValueAtTime(b, g);
        }
      }
    }
    Ta() {
      return { type: this.R, tag: this.Z, params: this.g };
    }
  }
  self.ne = class extends e {
    constructor(a, b, d, g, m, p, x) {
      super(a);
      this.R = "filter";
      this.g = [b, d, g, m, p, x];
      this.l = this.o();
      this.b = this.o();
      this.b.gain.value = x;
      this.a = this.o();
      this.a.gain.value = 1 - x;
      this.v = this.f.createBiquadFilter();
      this.v.type = b;
      this.v.frequency.value = d;
      this.v.detune.value = g;
      this.v.Q.value = m;
      this.v.gain.vlaue = p;
      this.l.connect(this.v);
      this.l.connect(this.a);
      this.v.connect(this.b);
    }
    c() {
      this.l.disconnect();
      this.v.disconnect();
      this.b.disconnect();
      this.a.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[5] = b;
          this.m(this.b.gain, b, d, g);
          this.m(this.a.gain, 1 - b, d, g);
          break;
        case 1:
          this.g[1] = b;
          this.m(this.v.frequency, b, d, g);
          break;
        case 2:
          this.g[2] = b;
          this.m(this.v.detune, b, d, g);
          break;
        case 3:
          this.g[3] = b;
          this.m(this.v.Q, b, d, g);
          break;
        case 4:
          (this.g[4] = b), this.m(this.v.gain, b, d, g);
      }
    }
  };
  self.le = class extends e {
    constructor(a, b, d, g) {
      super(a);
      this.R = "delay";
      this.g = [b, d, g];
      this.l = this.o();
      this.b = this.o();
      this.b.gain.value = g;
      this.a = this.o();
      this.a.gain.value = 1 - g;
      this.lb = this.o();
      this.U = this.f.createDelay(b);
      this.U.delayTime.value = b;
      this.cb = this.o();
      this.cb.gain.value = d;
      this.l.connect(this.lb);
      this.l.connect(this.a);
      this.lb.connect(this.b);
      this.lb.connect(this.U);
      this.U.connect(this.cb);
      this.cb.connect(this.lb);
    }
    c() {
      this.l.disconnect();
      this.b.disconnect();
      this.a.disconnect();
      this.lb.disconnect();
      this.U.disconnect();
      this.cb.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      const m = self.da.kd;
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[2] = b;
          this.m(this.b.gain, b, d, g);
          this.m(this.a.gain, 1 - b, d, g);
          break;
        case 4:
          this.g[1] = m(b);
          this.m(this.cb.gain, m(b), d, g);
          break;
        case 5:
          (this.g[0] = b), this.m(this.U.delayTime, b, d, g);
      }
    }
  };
  self.ke = class extends e {
    constructor(a, b, d, g) {
      super(a);
      this.R = "convolution";
      this.g = [d, g];
      this.Kd = this.Jd = "";
      this.l = this.o();
      this.b = this.o();
      this.b.gain.value = g;
      this.a = this.o();
      this.a.gain.value = 1 - g;
      this.bb = this.f.createConvolver();
      this.bb.normalize = d;
      this.bb.buffer = b;
      this.l.connect(this.bb);
      this.l.connect(this.a);
      this.bb.connect(this.b);
    }
    c() {
      this.l.disconnect();
      this.bb.disconnect();
      this.b.disconnect();
      this.a.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          (b = Math.max(Math.min(b / 100, 1), 0)),
            (this.g[1] = b),
            this.m(this.b.gain, b, d, g),
            this.m(this.a.gain, 1 - b, d, g);
      }
    }
    Zf(a, b) {
      this.Jd = a;
      this.Kd = b;
    }
    Ta() {
      const a = super.Ta();
      a.bufferOriginalUrl = this.Jd;
      a.bufferUrl = "";
      a.bufferType = this.Kd;
      return a;
    }
  };
  self.oe = class extends e {
    constructor(a, b, d, g, m, p) {
      super(a);
      this.R = "flanger";
      this.g = [b, d, g, m, p];
      this.l = this.o();
      this.a = this.o();
      this.a.gain.value = 1 - p / 2;
      this.b = this.o();
      this.b.gain.value = p / 2;
      this.fb = this.o();
      this.fb.gain.value = m;
      this.U = this.f.createDelay(b + d);
      this.U.delayTime.value = b;
      this.s = this.f.createOscillator();
      this.s.frequency.value = g;
      this.I = this.o();
      this.I.gain.value = d;
      this.l.connect(this.U);
      this.l.connect(this.a);
      this.U.connect(this.b);
      this.U.connect(this.fb);
      this.fb.connect(this.U);
      this.s.connect(this.I);
      this.I.connect(this.U.delayTime);
      this.s.start(0);
    }
    c() {
      this.s.stop(0);
      this.l.disconnect();
      this.U.disconnect();
      this.s.disconnect();
      this.I.disconnect();
      this.a.disconnect();
      this.b.disconnect();
      this.fb.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[4] = b;
          this.m(this.b.gain, b / 2, d, g);
          this.m(this.a.gain, 1 - b / 2, d, g);
          break;
        case 6:
          this.g[1] = b / 1e3;
          this.m(this.I.gain, b / 1e3, d, g);
          break;
        case 7:
          this.g[2] = b;
          this.m(this.s.frequency, b, d, g);
          break;
        case 8:
          (this.g[3] = b / 100), this.m(this.fb.gain, b / 100, d, g);
      }
    }
  };
  self.qe = class extends e {
    constructor(a, b, d, g, m, p, x) {
      super(a);
      this.R = "phaser";
      this.g = [b, d, g, m, p, x];
      this.l = this.o();
      this.a = this.o();
      this.a.gain.value = 1 - x / 2;
      this.b = this.o();
      this.b.gain.value = x / 2;
      this.v = this.f.createBiquadFilter();
      this.v.type = "allpass";
      this.v.frequency.value = b;
      this.v.detune.value = d;
      this.v.Q.value = g;
      this.s = this.f.createOscillator();
      this.s.frequency.value = p;
      this.I = this.o();
      this.I.gain.value = m;
      this.l.connect(this.v);
      this.l.connect(this.a);
      this.v.connect(this.b);
      this.s.connect(this.I);
      this.I.connect(this.v.frequency);
      this.s.start(0);
    }
    c() {
      this.s.stop(0);
      this.l.disconnect();
      this.v.disconnect();
      this.s.disconnect();
      this.I.disconnect();
      this.a.disconnect();
      this.b.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[5] = b;
          this.m(this.b.gain, b / 2, d, g);
          this.m(this.a.gain, 1 - b / 2, d, g);
          break;
        case 1:
          this.g[0] = b;
          this.m(this.v.frequency, b, d, g);
          break;
        case 2:
          this.g[1] = b;
          this.m(this.v.detune, b, d, g);
          break;
        case 3:
          this.g[2] = b;
          this.m(this.v.Q, b, d, g);
          break;
        case 6:
          this.g[3] = b;
          this.m(this.I.gain, b, d, g);
          break;
        case 7:
          (this.g[4] = b), this.m(this.s.frequency, b, d, g);
      }
    }
  };
  self.pe = class extends e {
    constructor(a, b) {
      super(a);
      this.R = "gain";
      this.g = [b];
      this.h = this.o();
      this.h.gain.value = b;
    }
    c() {
      this.h.disconnect();
      super.c();
    }
    S(a) {
      this.h.disconnect();
      this.h.connect(a);
    }
    P() {
      return this.h;
    }
    X(a, b, d, g) {
      const m = self.da.kd;
      switch (a) {
        case 4:
          (this.g[0] = m(b)), this.m(this.h.gain, m(b), d, g);
      }
    }
  };
  self.se = class extends e {
    constructor(a, b, d) {
      super(a);
      this.R = "tremolo";
      this.g = [b, d];
      this.h = this.o();
      this.h.gain.value = 1 - d / 2;
      this.s = this.f.createOscillator();
      this.s.frequency.value = b;
      this.I = this.o();
      this.I.gain.value = d / 2;
      this.s.connect(this.I);
      this.I.connect(this.h.gain);
      this.s.start(0);
    }
    c() {
      this.s.stop(0);
      this.s.disconnect();
      this.I.disconnect();
      this.h.disconnect();
      super.c();
    }
    S(a) {
      this.h.disconnect();
      this.h.connect(a);
    }
    P() {
      return this.h;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[1] = b;
          this.m(this.h.gain, 1 - b / 2, d, g);
          this.m(this.I.gain, b / 2, d, g);
          break;
        case 7:
          (this.g[0] = b), this.m(this.s.frequency, b, d, g);
      }
    }
  };
  self.re = class extends e {
    constructor(a, b, d) {
      super(a);
      this.R = "ringmod";
      this.g = [b, d];
      this.l = this.o();
      this.b = this.o();
      this.b.gain.value = d;
      this.a = this.o();
      this.a.gain.value = 1 - d;
      this.rb = this.o();
      this.rb.gain.value = 0;
      this.s = this.f.createOscillator();
      this.s.frequency.value = b;
      this.s.connect(this.rb.gain);
      this.s.start(0);
      this.l.connect(this.rb);
      this.l.connect(this.a);
      this.rb.connect(this.b);
    }
    c() {
      this.s.stop(0);
      this.s.disconnect();
      this.rb.disconnect();
      this.l.disconnect();
      this.b.disconnect();
      this.a.disconnect();
      super.c();
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          b = Math.max(Math.min(b / 100, 1), 0);
          this.g[1] = b;
          this.m(this.b.gain, b, d, g);
          this.m(this.a.gain, 1 - b, d, g);
          break;
        case 7:
          (this.g[0] = b), this.m(this.s.frequency, b, d, g);
      }
    }
  };
  self.me = class extends e {
    constructor(a, b, d, g, m, p) {
      super(a);
      this.R = "distortion";
      this.g = [b, d, g, m, p];
      this.l = this.o();
      this.Xb = this.o();
      this.Wb = this.o();
      this.$f(g, m);
      this.b = this.o();
      this.b.gain.value = p;
      this.a = this.o();
      this.a.gain.value = 1 - p;
      this.bc = this.f.createWaveShaper();
      this.Nc = new Float32Array(65536);
      this.gf(b, d);
      this.bc.curve = this.Nc;
      this.l.connect(this.Xb);
      this.l.connect(this.a);
      this.Xb.connect(this.bc);
      this.bc.connect(this.Wb);
      this.Wb.connect(this.b);
    }
    c() {
      this.l.disconnect();
      this.Xb.disconnect();
      this.bc.disconnect();
      this.Wb.disconnect();
      this.b.disconnect();
      this.a.disconnect();
      super.c();
    }
    $f(a, b) {
      0.01 > a && (a = 0.01);
      this.Xb.gain.value = a;
      this.Wb.gain.value = Math.pow(1 / a, 0.6) * b;
    }
    gf(a, b) {
      for (let d = 0; 32768 > d; ++d) {
        let g = d / 32768;
        g = this.mg(g, a, b);
        this.Nc[32768 + d] = g;
        this.Nc[32768 - d - 1] = -g;
      }
    }
    mg(a, b, d) {
      d = 1.05 * d * b - b;
      const g = 0 > a ? -a : a;
      return (g < b ? g : b + d * self.da.Dg(g - b, 1 / d)) * (0 > a ? -1 : 1);
    }
    S(a) {
      this.b.disconnect();
      this.b.connect(a);
      this.a.disconnect();
      this.a.connect(a);
    }
    P() {
      return this.l;
    }
    X(a, b, d, g) {
      switch (a) {
        case 0:
          (b = Math.max(Math.min(b / 100, 1), 0)),
            (this.g[4] = b),
            this.m(this.b.gain, b, d, g),
            this.m(this.a.gain, 1 - b, d, g);
      }
    }
  };
  self.je = class extends e {
    constructor(a, b, d, g, m, p) {
      super(a);
      this.R = "compressor";
      this.g = [b, d, g, m, p];
      this.h = this.f.createDynamicsCompressor();
      this.h.threshold.value = b;
      this.h.knee.value = d;
      this.h.ratio.value = g;
      this.h.attack.value = m;
      this.h.release.value = p;
    }
    c() {
      this.h.disconnect();
      super.c();
    }
    S(a) {
      this.h.disconnect();
      this.h.connect(a);
    }
    P() {
      return this.h;
    }
    X() {}
  };
  self.ie = class extends e {
    constructor(a, b, d) {
      super(a);
      this.R = "analyser";
      this.g = [b, d];
      this.h = this.f.createAnalyser();
      this.h.fftSize = b;
      this.h.smoothingTimeConstant = d;
      this.Nd = new Float32Array(this.h.frequencyBinCount);
      this.$d = new Uint8Array(b);
      this.Yd = this.Ma = 0;
      this.i.Re(this);
    }
    c() {
      this.i.Tf(this);
      this.h.disconnect();
      super.c();
    }
    va() {
      this.h.getFloatFrequencyData(this.Nd);
      this.h.getByteTimeDomainData(this.$d);
      const a = this.h.fftSize;
      let b = (this.Ma = 0);
      for (var d = 0; d < a; ++d) {
        let g = (this.$d[d] - 128) / 128;
        0 > g && (g = -g);
        this.Ma < g && (this.Ma = g);
        b += g * g;
      }
      d = self.da.He;
      this.Ma = d(this.Ma);
      this.Yd = d(Math.sqrt(b / a));
    }
    S(a) {
      this.h.disconnect();
      this.h.connect(a);
    }
    P() {
      return this.h;
    }
    X() {}
    Ce() {
      return {
        tag: this.Z,
        index: this.Pd,
        peak: this.Ma,
        rms: this.Yd,
        binCount: this.h.frequencyBinCount,
        freqBins: this.Nd,
      };
    }
  };
}
