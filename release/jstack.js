var JSTACK = JSTACK || {};
JSTACK.VERSION = "0.1";
JSTACK.AUTHORS = "GING";
JSTACK.Comm = function(e, c) {
  var d = function(g, e, b, a, f, i) {
    var d = new XMLHttpRequest;
    d.open(g, e + ".json", !0);
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
  }, del:function(e, h, b, a) {
    d("DELETE", e, c, h, b, a)
  }}
}(JSTACK);
JSTACK.Utils = function(e) {
  return{encode:function(c) {
    var d = "", g, h, b, a, f, i, k = 0, c = c.replace(/\r\n/g, "\n");
    h = "";
    for(b = 0;b < c.length;b++) {
      a = c.charCodeAt(b), 128 > a ? h += String.fromCharCode(a) : (127 < a && 2048 > a ? h += String.fromCharCode(a >> 6 | 192) : (h += String.fromCharCode(a >> 12 | 224), h += String.fromCharCode(a >> 6 & 63 | 128)), h += String.fromCharCode(a & 63 | 128))
    }
    for(c = h;k < c.length;) {
      g = c.charCodeAt(k++), h = c.charCodeAt(k++), b = c.charCodeAt(k++), a = g >> 2, g = (g & 3) << 4 | h >> 4, f = (h & 15) << 2 | b >> 6, i = b & 63, isNaN(h) ? f = i = 64 : isNaN(b) && (i = 64), d = d + e.Utils._keyStr.charAt(a) + Base64._keyStr.charAt(g) + e.Utils._keyStr.charAt(f) + Base64._keyStr.charAt(i)
    }
    return d
  }, decode:function(c) {
    for(var d = "", g, h, b, a, f, i = 0, c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");i < c.length;) {
      g = e.Utils._keyStr.indexOf(c.charAt(i++)), h = e.Utils._keyStr.indexOf(c.charAt(i++)), a = e.Utils._keyStr.indexOf(c.charAt(i++)), f = e.Utils._keyStr.indexOf(c.charAt(i++)), g = g << 2 | h >> 4, h = (h & 15) << 4 | a >> 2, b = (a & 3) << 6 | f, d += String.fromCharCode(g), 64 != a && (d += String.fromCharCode(h)), 64 != f && (d += String.fromCharCode(b))
    }
    c = d;
    d = "";
    for(f = c1 = c2 = a = 0;a < c.length;) {
      f = c.charCodeAt(a), 128 > f ? (d += String.fromCharCode(f), a++) : 191 < f && 224 > f ? (c2 = c.charCodeAt(a + 1), d += String.fromCharCode((f & 31) << 6 | c2 & 63), a += 2) : (c2 = c.charCodeAt(a + 1), c3 = c.charCodeAt(a + 2), d += String.fromCharCode((f & 15) << 12 | (c2 & 63) << 6 | c3 & 63), a += 3)
    }
    return d
  }}
}(JSTACK);
JSTACK.Keystone = function(e, c) {
  var d = {DISCONNECTED:0, AUTHENTICATING:1, AUTHENTICATED:2, AUTHENTICATION_ERROR:3}, g = {url:c, currentstate:c, access:c, token:c};
  return{STATES:d, params:g, init:function(e) {
    g.url = e;
    g.access = c;
    g.token = c;
    g.currentstate = d.DISCONNECTED
  }, authenticate:function(h, b, a, f, i, k) {
    var j = {}, j = a != c ? {auth:{token:{id:a}}} : {auth:{passwordCredentials:{username:h, password:b}}};
    f !== c && (j.auth.tenantId = f);
    g.currentstate = d.AUTHENTICATING;
    e.Comm.post(g.url + "tokens", j, c, function(a) {
      g.currentstate = e.Keystone.STATES.AUTHENTICATED;
      g.access = a.access;
      g.token = g.access.token.id;
      i != c && i(a)
    }, function(a) {
      g.currentstate = d.AUTHENTICATION_ERROR;
      k(a)
    })
  }, gettenants:function(d) {
    g.currentstate == e.Keystone.STATES.AUTHENTICATED && e.Comm.get(g.url + "tenants", g.token, function(b) {
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
JSTACK.Nova = function(e, c) {
  var d = c, g = function() {
    return d != c ? !0 : e.Keystone != c && e.Keystone.params.currentstate == e.Keystone.STATES.AUTHENTICATED ? (d = e.Keystone.getservice("nova").endpoints[0].adminURL, !0) : !1
  }, h = function(b, a, f) {
    g() && e.Comm.post(d + "/servers/" + b + "/action", a, e.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  };
  return{getserverlist:function(b, a) {
    if(g()) {
      var f = d + "/servers";
      b != c & b && (f += "/detail");
      e.Comm.get(f, e.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getserverdetail:function(b, a) {
    g() && e.Comm.get(d + "/servers/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getserverips:function(b, a, f) {
    g() && (b = d + "/servers/" + b + "/ips", a != c && (b += "/" + a), e.Comm.get(b, e.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    }))
  }, updateserver:function(b, a, f) {
    g() && a != c && e.Comm.put(d + "/servers/" + b, {server:{name:a}}, e.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  }, createserver:function(b, a, f, i, h, j, l, m, n, o) {
    if(g()) {
      b = {server:{name:b, imageRef:a, flavorRef:f}};
      i != c && (b.server.key_name = i);
      h != c && (b.server.user_data = e.Utils.encode(h));
      if(j != c) {
        var i = [], p;
        for(p in j) {
          i.push({name:j[p]})
        }
        b.server.security_groups = i
      }
      l == c && (l = 1);
      b.server.min_count = l;
      m == c && (m = 1);
      b.server.max_count = m;
      n != c && (b.server.availability_zone = e.Utils.encode(n));
      e.Comm.post(d + "/servers", b, e.Keystone.params.token, function(a) {
        o != c && o(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteserver:function(b, a) {
    g() && e.Comm.del(d + "/servers/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, changepasswordserver:function(b, a, f) {
    a != c && h(b, {changePassword:{adminPass:a}}, f)
  }, rebootserverhard:function(b, a) {
    h(b, {reboot:{type:"HARD"}}, a)
  }, rebootserversoft:function(b, a) {
    h(b, {reboot:{type:"SOFT"}}, a)
  }, resizeserver:function(b, a, c) {
    h(b, {resize:{flavorRef:a}}, c)
  }, confirmresizedserver:function(b, a) {
    h(b, {confirmResize:null}, a)
  }, revertresizedserver:function(b, a) {
    h(b, {revertResize:null}, a)
  }, createimage:function(b, a, f, d) {
    a = {createImage:{name:a}};
    a.creageImage.metadata = {};
    f != c && (a.creageImage.metadata = f);
    h(b, a, d)
  }, getflavorlist:function(b, a) {
    if(g()) {
      var f = d + "/flavors";
      b != c & b && (f += "/detail");
      e.Comm.get(f, e.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getflavordetail:function(b, a) {
    g() && e.Comm.get(d + "/flavors/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getimagelist:function(b, a) {
    if(g()) {
      var f = d + "/images";
      b != c & b && (f += "/detail");
      e.Comm.get(f, e.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getimagedetail:function(b, a) {
    g() && e.Comm.get(d + "/images/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, deleteimage:function(b, a) {
    g() && e.Comm.del(d + "/images/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getkeypairlist:function(b) {
    g() && e.Comm.get(d + "/os-keypairs", e.Keystone.params.token, function(a) {
      b != c && b(a)
    }, function(a) {
      throw Error(a);
    })
  }, createkeypair:function(b, a, f) {
    if(g()) {
      var h = d + "/os-keypairs", b = {keypair:{name:b}};
      a != c && (b.keypair.public_key = public_key);
      e.Comm.post(h, b, e.Keystone.params.token, function(a) {
        f != c && f(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deletekeypair:function(b, a) {
    g() && e.Comm.del(d + "/os-keypairs/" + b, e.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }}
}(JSTACK);

