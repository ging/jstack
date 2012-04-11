var JSTACK = JSTACK || {};
JSTACK.VERSION = "0.1";
JSTACK.AUTHORS = "GING";
JSTACK.Comm = function(d, c) {
  var e = function(g, d, b, a, f, i) {
    var e = new XMLHttpRequest;
    e.open(g, d, !0);
    e.setRequestHeader("Content-Type", "application/json");
    e.onreadystatechange = function() {
      if(4 == e.readyState) {
        switch(e.status) {
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
            e.responseText != c && "" != e.responseText && (a = JSON.parse(e.responseText));
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
            i(e.status + " Error")
        }
      }
    };
    a != c && e.setRequestHeader("X-Auth-Token", a);
    b != c ? (g = JSON.stringify(b), e.send(g)) : e.send()
  };
  return{get:function(g, d, b, a) {
    e("GET", g, c, d, b, a)
  }, post:function(c, d, b, a, f) {
    e("POST", c, d, b, a, f)
  }, put:function(c, d, b, a, f) {
    e("PUT", c, d, b, a, f)
  }, del:function(d, h, b, a) {
    e("DELETE", d, c, h, b, a)
  }}
}(JSTACK);
JSTACK.Utils = function(d) {
  return{encode:function(c) {
    var e = "", g, h, b, a, f, i, k = 0, c = c.replace(/\r\n/g, "\n");
    h = "";
    for(b = 0;b < c.length;b++) {
      a = c.charCodeAt(b), 128 > a ? h += String.fromCharCode(a) : (127 < a && 2048 > a ? h += String.fromCharCode(a >> 6 | 192) : (h += String.fromCharCode(a >> 12 | 224), h += String.fromCharCode(a >> 6 & 63 | 128)), h += String.fromCharCode(a & 63 | 128))
    }
    for(c = h;k < c.length;) {
      g = c.charCodeAt(k++), h = c.charCodeAt(k++), b = c.charCodeAt(k++), a = g >> 2, g = (g & 3) << 4 | h >> 4, f = (h & 15) << 2 | b >> 6, i = b & 63, isNaN(h) ? f = i = 64 : isNaN(b) && (i = 64), e = e + d.Utils._keyStr.charAt(a) + Base64._keyStr.charAt(g) + d.Utils._keyStr.charAt(f) + Base64._keyStr.charAt(i)
    }
    return e
  }, decode:function(c) {
    for(var e = "", g, h, b, a, f, i = 0, c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");i < c.length;) {
      g = d.Utils._keyStr.indexOf(c.charAt(i++)), h = d.Utils._keyStr.indexOf(c.charAt(i++)), a = d.Utils._keyStr.indexOf(c.charAt(i++)), f = d.Utils._keyStr.indexOf(c.charAt(i++)), g = g << 2 | h >> 4, h = (h & 15) << 4 | a >> 2, b = (a & 3) << 6 | f, e += String.fromCharCode(g), 64 != a && (e += String.fromCharCode(h)), 64 != f && (e += String.fromCharCode(b))
    }
    c = e;
    e = "";
    for(f = c1 = c2 = a = 0;a < c.length;) {
      f = c.charCodeAt(a), 128 > f ? (e += String.fromCharCode(f), a++) : 191 < f && 224 > f ? (c2 = c.charCodeAt(a + 1), e += String.fromCharCode((f & 31) << 6 | c2 & 63), a += 2) : (c2 = c.charCodeAt(a + 1), c3 = c.charCodeAt(a + 2), e += String.fromCharCode((f & 15) << 12 | (c2 & 63) << 6 | c3 & 63), a += 3)
    }
    return e
  }}
}(JSTACK);
JSTACK.Keystone = function(d, c) {
  var e = {DISCONNECTED:0, AUTHENTICATING:1, AUTHENTICATED:2, AUTHENTICATION_ERROR:3}, g = {url:c, currentstate:c, access:c, token:c};
  return{STATES:e, params:g, init:function(d) {
    g.url = d;
    g.access = c;
    g.token = c;
    g.currentstate = e.DISCONNECTED
  }, authenticate:function(h, b, a, f, i, k) {
    var j = {}, j = a != c ? {auth:{token:{id:a}}} : {auth:{passwordCredentials:{username:h, password:b}}};
    f !== c && (j.auth.tenantId = f);
    g.currentstate = e.AUTHENTICATING;
    d.Comm.post(g.url + "tokens", j, c, function(a) {
      g.currentstate = d.Keystone.STATES.AUTHENTICATED;
      g.access = a.access;
      g.token = g.access.token.id;
      i != c && i(a)
    }, function(a) {
      g.currentstate = e.AUTHENTICATION_ERROR;
      k(a)
    })
  }, gettenants:function(e) {
    g.currentstate == d.Keystone.STATES.AUTHENTICATED && d.Comm.get(g.url + "tenants", g.token, function(b) {
      e != c && e(b)
    }, function(b) {
      throw Error(b);
    })
  }, getservice:function(d) {
    if(g.currentstate != e.AUTHENTICATED) {
      return c
    }
    for(var b in g.access.serviceCatalog) {
      var a = g.access.serviceCatalog[b];
      if(d == a.type) {
        return a
      }
    }
    return c
  }, getservicelist:function() {
    return g.currentstate != e.AUTHENTICATED ? c : g.access.serviceCatalog
  }}
}(JSTACK);
JSTACK.Nova = function(d, c) {
  var e = c, g = function() {
    return e != c ? !0 : d.Keystone != c && d.Keystone.params.currentstate == d.Keystone.STATES.AUTHENTICATED ? (e = d.Keystone.getservice("compute").endpoints[0].adminURL, !0) : !1
  }, h = function(b, a, f) {
    g() && d.Comm.post(e + "/servers/" + b + "/action", a, d.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  };
  return{getserverlist:function(b, a) {
    if(g()) {
      var f = e + "/servers";
      b != c & b && (f += "/detail");
      d.Comm.get(f, d.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getserverdetail:function(b, a) {
    g() && d.Comm.get(e + "/servers/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getserverips:function(b, a, f) {
    g() && (b = e + "/servers/" + b + "/ips", a != c && (b += "/" + a), d.Comm.get(b, d.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    }))
  }, updateserver:function(b, a, f) {
    g() && a != c && d.Comm.put(e + "/servers/" + b, {server:{name:a}}, d.Keystone.params.token, function(a) {
      f != c && f(a)
    }, function(a) {
      throw Error(a);
    })
  }, createserver:function(b, a, f, i, h, j, l, m, n, o) {
    if(g()) {
      b = {server:{name:b, imageRef:a, flavorRef:f}};
      i != c && (b.server.key_name = i);
      h != c && (b.server.user_data = d.Utils.encode(h));
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
      n != c && (b.server.availability_zone = d.Utils.encode(n));
      d.Comm.post(e + "/servers", b, d.Keystone.params.token, function(a) {
        o != c && o(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteserver:function(b, a) {
    g() && d.Comm.del(e + "/servers/" + b, d.Keystone.params.token, function(b) {
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
      var f = e + "/flavors";
      b != c & b && (f += "/detail");
      d.Comm.get(f, d.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getflavordetail:function(b, a) {
    g() && d.Comm.get(e + "/flavors/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, createflavor:function(b, a, f, h, k, j, l, m, n) {
    if(g()) {
      var o = e + "/flavors", b = {flavor:{name:b, ram:a, vcpus:f, disk:h, id:k, swap:0, "OS-FLV-EXT-DATA:ephemeral":0, rxtx_factor:0}};
      j != c && (b.flavor["OS-FLV-EXT-DATA:ephemeral"] = j);
      l != c && (b.flavor.swap = l);
      m != c && (b.flavor.rxtx_factor = m);
      d.Comm.post(o, b, d.Keystone.params.token, function(a) {
        n != c && n(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteflavor:function(b, a) {
    g() && d.Comm.del(e + "/flavors/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getimagelist:function(b, a) {
    if(g()) {
      var f = e + "/images";
      b != c & b && (f += "/detail");
      d.Comm.get(f, d.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getimagedetail:function(b, a) {
    g() && d.Comm.get(e + "/images/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, deleteimage:function(b, a) {
    g() && d.Comm.del(e + "/images/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getkeypairlist:function(b) {
    g() && d.Comm.get(e + "/os-keypairs", d.Keystone.params.token, function(a) {
      b != c && b(a)
    }, function(a) {
      throw Error(a);
    })
  }, createkeypair:function(b, a, f) {
    if(g()) {
      var h = e + "/os-keypairs", b = {keypair:{name:b}};
      a != c && (b.keypair.public_key = public_key);
      d.Comm.post(h, b, d.Keystone.params.token, function(a) {
        f != c && f(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deletekeypair:function(b, a) {
    g() && d.Comm.del(e + "/os-keypairs/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }}
}(JSTACK);

