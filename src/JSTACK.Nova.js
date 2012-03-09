JSTACK.Nova = (function(JS, undefined) {

    var params = {
        url : undefined,
    }

    var _check = function() {
        if(params.url != undefined)
            return true;
        if(JS.Keystone != undefined && JS.Keystone.params.currentstate == JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("nova");
            params.url = service.endpoints[0].adminURL;
            return true;
        } else {
            return false;
        }
    }
    var getserverlist = function(detailed, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers';
        if(detailed != undefined & detailed) {
            url += '/detail';
        }

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    var getserverdetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    var getserverips = function(id, networkID, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id + '/ips';

        if(networkID != undefined) {
            url += '/' + networkID;
        }

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    var updateserver = function(id, name, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        if(name == undefined)
            return;

        var data = {
            "server" : {
                "name" : name,
            },
        };

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.put(url, data, JS.Keystone.params.token, _onOk, _onError);
    }
    var createserver = function(name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
        if(!_check())
            return;
        var data = {
            "server" : {
                "name" : name,
                "imageRef" : imageRef,
                "flavorRef" : flavorRef
            }
        };

        if(key_name != undefined) {
            data.server.key_name = key_name;
        }

        if(user_data != undefined) {
            data.server.user_data = JS.Utils.encode(user_data);
        }

        if(security_groups != undefined) {
            var groups = [];

            for(var i in security_groups) {
                var group = {
                    "name" : security_groups[i]
                };
                groups.push(group);
            }

            data.server.security_groups = groups;
        }

        if(min_count == undefined) {
            min_count = 1;
        }

        data.server.min_count = min_count;

        if(max_count == undefined) {
            max_count = 1;
        }

        data.server.max_count = max_count;

        if(availability_zone != undefined) {
            data.server.availability_zone = JS.Utils.encode(availability_zone);
        }

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.post(params.url + '/servers', data, JS.Keystone.params.token, _onOK, _onError);

    }
    var deleteserver = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.del(url, JS.Keystone.params.token, _onOk, _onError);
    }
    var _postAction = function(id, data, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id + '/action';

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.post(url, data, JS.Keystone.params.token, _onOk, _onError);
    }
    var changepasswordserver = function(id, adminPass, callback) {
        if(adminPass == undefined)
            return;

        var data = {
            "changePassword" : {
                "adminPass" : adminPass,
            },
        };

        _postAction(id, data, callback);
    }
    var rebootserverhard = function(id, callback) {
        _postAction(id, {
            "reboot" : {
                "type" : "HARD"
            }
        }, callback);
    }
    var rebootserversoft = function(id, callback) {
        _postAction(id, {
            "reboot" : {
                "type" : "SOFT"
            }
        }, callback);
    }
    var resizeserver = function(id, flavorRef, callback) {
        _postAction(id, {
            "resize" : {
                "flavorRef" : flavorRef
            }
        }, callback);
    }
    var confirmresizedserver = function(id, callback) {
        _postAction(id, {
            "confirmResize" : null
        }, callback);
    }
    var createimage = function(id, name, metadata, callback) {
        var data = {
            "createImage" : {
                'name' : name,
            }
        };

        data.creageImage.metadata = {};

        if(metadata != undefined) {
            data.creageImage.metadata = metadata;
        }

        _postAction(id, data, callback);
    }
    var getflavorlist = function(detailed, callback) {
        if(!_check())
            return;
        var url = params.url + '/flavors';
        if(detailed != undefined & detailed) {
            url += '/detail';
        }

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    var getflavordetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/flavors/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    var getimagelist = function(detailed, callback) {
        if(!_check())
            return;
        var url = params.url + '/images';
        if(detailed != undefined & detailed) {
            url += '/detail';
        }

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    var getimagedetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/images/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    var deleteimage = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/images/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(result) {
            //TODO
        }
        JS.Comm.del(url, JS.Keystone.params.token, _onOK, _onError);
    }
    return {
        getserverlist : getserverlist,
        getserverdetail : getserverdetail,
        getserverips : getserverips,
        updateserver : updateserver,
        createserver : createserver,
        deleteserver : deleteserver,
        changepasswordserver : changepasswordserver,
        rebootserverhard : rebootserverhard,
        rebootserversoft : rebootserversoft,
        resizeserver : resizeserver,
        confirmresizedserver : confirmresizedserver,
        createimage : createimage,
        getflavorlist : getflavorlist,
        getflavordetail : getflavordetail,
        getimagelist : getimagelist,
        getimagedetail : getimagedetail,
        deleteimage : deleteimage,
    }

})(JSTACK);
