var XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest;
var JSTACK = JSTACK || {};
JSTACK.VERSION = "0.1";
JSTACK.AUTHORS = "GING";
JSTACK.Comm = function(h, c) {
  var d = function(g, e, b, a, f, i) {
    var d = new XMLHttpRequest;
    d.open(g, e, !0);
    d.setRequestHeader("Content-Type", "application/json");
    d.onreadystatechange = function() {
      if(4 == d.readyState) {
        switch(d.status) {
          case 100:
          ;
          case 200:
          ;
          case 201:
          ;
          case 202:
          ;
          case 203:
          ;
          case 204:
          ;
          case 205:
            var a = c;
            d.responseText != c && "" != d.responseText && (a = JSON.parse(d.responseText));
            f(a);
            break;
          case 400:
            i("400 Bad Request");
            break;
          case 401:
            i("401 Unauthorized");
            break;
          case 403:
            i("403 Forbidden");
            break;
          default:
            i(d.status + " Error")
        }
      }
    };
    a != c && d.setRequestHeader("X-Auth-Token", a);
    b != c ? (g = JSON.stringify(b), d.send(g)) : d.send()
  };
  return{get:function(g, e, b, a) {
    d("GET", g, c, e, b, a)
  }, post:function(c, e, b, a, f) {
    d("POST", c, e, b, a, f)
  }, put:function(c, e, b, a, f) {
    d("PUT", c, e, b, a, f)
  }, del:function(g, e, b, a) {
    d("DELETE", g, c, e, b, a)
  }}
}(JSTACK);
JSTACK.Utils = function(h) {
  return{encode:function(c) {
    var d = "", g, e, b, a, f, i, j = 0, c = c.replace(/\r\n/g, "\n");
    e = "";
    for(b = 0;b < c.length;b++) {
      a = c.charCodeAt(b), 128 > a ? e += String.fromCharCode(a) : (127 < a && 2048 > a ? e += String.fromCharCode(a >> 6 | 192) : (e += String.fromCharCode(a >> 12 | 224), e += String.fromCharCode(a >> 6 & 63 | 128)), e += String.fromCharCode(a & 63 | 128))
    }
    for(c = e;j < c.length;) {
      g = c.charCodeAt(j++), e = c.charCodeAt(j++), b = c.charCodeAt(j++), a = g >> 2, g = (g & 3) << 4 | e >> 4, f = (e & 15) << 2 | b >> 6, i = b & 63, isNaN(e) ? f = i = 64 : isNaN(b) && (i = 64), d = d + h.Utils._keyStr.charAt(a) + Base64._keyStr.charAt(g) + h.Utils._keyStr.charAt(f) + Base64._keyStr.charAt(i)
    }
    return d
  }, decode:function(c) {
    for(var d = "", g, e, b, a, f, i = 0, c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");i < c.length;) {
      g = h.Utils._keyStr.indexOf(c.charAt(i++)), e = h.Utils._keyStr.indexOf(c.charAt(i++)), a = h.Utils._keyStr.indexOf(c.charAt(i++)), f = h.Utils._keyStr.indexOf(c.charAt(i++)), g = g << 2 | e >> 4, e = (e & 15) << 4 | a >> 2, b = (a & 3) << 6 | f, d += String.fromCharCode(g), 64 != a && (d += String.fromCharCode(e)), 64 != f && (d += String.fromCharCode(b))
    }
    c = d;
    d = "";
    for(f = c1 = c2 = a = 0;a < c.length;) {
      f = c.charCodeAt(a), 128 > f ? (d += String.fromCharCode(f), a++) : 191 < f && 224 > f ? (c2 = c.charCodeAt(a + 1), d += String.fromCharCode((f & 31) << 6 | c2 & 63), a += 2) : (c2 = c.charCodeAt(a + 1), c3 = c.charCodeAt(a + 2), d += String.fromCharCode((f & 15) << 12 | (c2 & 63) << 6 | c3 & 63), a += 3)
    }
    return d
  }}
}(JSTACK);
JSTACK.Keystone = function(h, c) {
  var d = {DISCONNECTED:0, AUTHENTICATING:1, AUTHENTICATED:2, AUTHENTICATION_ERROR:3}, g = {url:c, currentstate:c, access:c, token:c};
  return{STATES:d, params:g, init:function(e) {
    g.url = e;
    g.access = c;
    g.token = c;
    g.currentstate = d.DISCONNECTED
  }, authenticate:function(e, b, a, f) {
    e = {auth:{passwordCredentials:{username:e, password:b}}};
    "undefined" !== a && (e.auth.tenantId = a);
    g.currentstate = d.AUTHENTICATING;
    h.Comm.post(g.url + "tokens", e, c, function(a) {
      g.currentstate = h.Keystone.STATES.AUTHENTICATED;
      g.access = a.access;
      g.token = g.access.token.id;
      f != c && f(a)
    }, function(a) {
      g.currentstate = d.AUTHENTICATION_ERROR;
      throw Error(a);
    })
  }, gettenants:function(d) {
    g.currentstatus == h.Keystone.STATES.AUTHENTICATED && h.Comm.get(g.url + "tenants", g.token, function(b) {
      d != c && d(b)
    }, function(b) {
      throw Error(b);
    })
  }, getservice:function(e) {
    if(g.currentstate != d.AUTHENTICATED) {
      return c
    }
    for(var b in g.access.serviceCatalog) {
      var a = g.access.serviceCatalog[b];
      if(e == a.name) {
        return a
      }
    }
    return c
  }}
}(JSTACK);
JSTACK.Nova = function(h, c) {
  var d = c, g = function() {
    return d != c ? !0 : h.Keystone != c && h.Keystone.params.currentstate == h.Keystone.STATES.AUTHENTICATED ? (d = h.Keystone.getservice("nova").endpoints[0].adminURL, !0) : !1
  }, e = function(b, a, f) {
    g() && h.Comm.post(d + "/servers/" + b + "/action", a, h.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  };
  return{getserverlist:function(b, a) {
    if(g()) {
      var f = d + "/servers";
      b != c & b && (f += "/detail");
      h.Comm.get(f, h.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getserverdetail:function(b, a) {
    g() && h.Comm.get(d + "/servers/" + b, h.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getserverips:function(b, a, f) {
    g() && (b = d + "/servers/" + b + "/ips", a != c && (b += "/" + a), h.Comm.get(b, h.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    }))
  }, updateserver:function(b, a, f) {
    g() && a != c && h.Comm.put(d + "/servers/" + b, {server:{name:a}}, h.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  }, createserver:function(b, a, f, e, j, k, l, m, n, o) {
    if(g()) {
      b = {server:{name:b, imageRef:a, flavorRef:f}};
      e != c && (b.server.key_name = e);
      j != c && (b.server.user_data = h.Utils.encode(j));
      if(k != c) {
        var e = [], p;
        for(p in k) {
          e.push({name:k[p]})
        }
        b.server.security_groups = e
      }
      l == c && (l = 1);
      b.server.min_count = l;
      m == c && (m = 1);
      b.server.max_count = m;
      n != c && (b.server.availability_zone = h.Utils.encode(n));
      h.Comm.post(d + "/servers", b, h.Keystone.params.token, function(a) {
        o != c && o(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteserver:function(b, a) {
    g() && h.Comm.del(d + "/servers/" + b, h.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, changepasswordserver:function(b, a, f) {
    a != c && e(b, {changePassword:{adminPass:a}}, f)
  }, rebootserverhard:function(b, a) {
    e(b, {reboot:{type:"HARD"}}, a)
  }, rebootserversoft:function(b, a) {
    e(b, {reboot:{type:"SOFT"}}, a)
  }, resizeserver:function(b, a, c) {
    e(b, {resize:{flavorRef:a}}, c)
  }, confirmresizedserver:function(b, a) {
    e(b, {confirmResize:null}, a)
  }, revertresizedserver:function(b, a) {
    e(b, {revertResize:null}, a)
  }, createimage:function(b, a, f, d) {
    a = {createImage:{name:a}};
    a.creageImage.metadata = {};
    f != c && (a.creageImage.metadata = f);
    e(b, a, d)
  }, getflavorlist:function(b, a) {
    if(g()) {
      var f = d + "/flavors";
      b != c & b && (f += "/detail");
      h.Comm.get(f, h.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getflavordetail:function(b, a) {
    g() && h.Comm.get(d + "/flavors/" + b, h.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getimagelist:function(b, a) {
    if(g()) {
      var f = d + "/images";
      b != c & b && (f += "/detail");
      h.Comm.get(f, h.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getimagedetail:function(b, a) {
    g() && h.Comm.get(d + "/images/" + b, h.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, deleteimage:function(b, a) {
    g() && h.Comm.del(d + "/images/" + b, h.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }}
}(JSTACK);

module.exports = JSTACK;
