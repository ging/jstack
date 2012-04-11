/*
The MIT License

Copyright (c) 2012 Universidad Politecnica de Madrid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JStack Nova Module
// ------------------

// This module provides Nova API functions. 
JSTACK.Nova = (function(JS, undefined) {

    // This modules stores the `url`to which it will send every
    // request.
    var params = {
        url     : undefined,
        state   : undefined
    }
    
    // Private functions
    // -----------------
    
    // Function `_check` internally confirms that Keystone module is 
    // authenticated and it has the URL of the Nova service.
    var _check = function() {
        if(params.url != undefined)
            return true;
        if(JS.Keystone != undefined && JS.Keystone.params.currentstate == JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("compute");
            params.url = service.endpoints[0].adminURL;
            return true;
        } else {
            return false;
        }
    }
    
    // This function is used internally to send Actions to server identified
    // with `id`. In `data` we pass the corresponding information about the 
    // action.
    var _postAction = function(id, data, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id + '/action';

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.post(url, data, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // Public functions
    // ----------------
    //
    // **Server Operations**
    
    //
    // This operation provides a list of servers associated with the account. In 
    // [Create Server List](http://docs.openstack.org/api/openstack-compute/2/content/List_Servers-d1e2078.html)
    // there is more information about the JSON object that is returned.
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
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation returns the details of a specific server by its `id`. In 
    // [Get Server Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Server_Details-d1e2623.html)
    // there is more information about the JSON object that is returned.
    var getserverdetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // This operation returns the ip address of a specific server by its `id`. 
    // In 
    // [List Addresses](http://docs.openstack.org/api/openstack-compute/2/content/List_Addresses-d1e3014.html)
    // and in 
    // [List Addresses by Network](http://docs.openstack.org/api/openstack-compute/2/content/List_Addresses_by_Network-d1e3118.html)
    // there is more information about the JSON object that is returned.
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
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // This operation updates the the `name` of the server given by its `id`. In 
    // [Server Update](http://docs.openstack.org/api/openstack-compute/2/content/ServerUpdate.html)
    // there is more information about the JSON object that is returned.
    var updateserver = function(id, name, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        if(name == undefined)
            return;

        var data = {
            "server" : {
                "name" : name
            }
        }

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.put(url, data, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // This operation asynchronously provisions a new server. The progress of 
    // this operation depends on several factors including location of the 
    // requested image, network i/o, host load, and the selected flavor. The 
    // progress of the request can be checked by performing a `getserverdetail`, 
    // which will return a progress attribute (0-100% completion).
    // 
    // Arguments in this function are: 
    //
    // a. Mandatory
    //
    // * The `name` we want to put to the new server
    //
    // * The `imageRef`, that is the id of the image we will 
    // instantiate
    // 
    // * The `flavorReg`, that is the id of the flavor we will use
    //
    // b. Optional
    //
    // * The `key_name` that corresponds to the name of the key we will 
    // later use to access the instance by SSH (default is None)
    //
    // * Some raw data as `user_data` (default is None)
    // 
    // * An array with names of the `security_groups` in which we want to 
    // put our instance (default is none)
    //
    // * The minimum number of instances to be started as `min_count` (
    // default is 1)
    //
    // * The maximum number of instances as `max_count` (default is 1)
    //
    // * And the `availability_zone` (default is None)
    //    
    // In [Create Servers](http://docs.openstack.org/api/openstack-compute/2/content/CreateServers.html)
    // there is more information about the JSON object that is returned.
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
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.post(params.url + '/servers', data, JS.Keystone.params.token, _onOK, _onError);

    }
    
    // This operation deletes a cloud server instance from the system. 
    // In [Delete Server](http://docs.openstack.org/api/openstack-compute/2/content/Delete_Server-d1e2883.html)
    // there is more information.
    var deleteserver = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/servers/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.del(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // **Server Actions**
    //
    // Take a look at `_postAction` for detailed information about requests. 
    
    //
    // This operation changes the server's administrator password.
    // In [Change Password](http://docs.openstack.org/api/openstack-compute/2/content/Change_Password-d1e3234.html)
    // there is more information.
    var changepasswordserver = function(id, adminPass, callback) {
        if(adminPass == undefined)
            return;

        var data = {
            "changePassword" : {
                "adminPass" : adminPass
            }
        };

        _postAction(id, data, callback);
    }
    
    // This operation allows for a hard reboot that is the equivalent of power 
    // cycling the server.
    var rebootserverhard = function(id, callback) {
        _postAction(id, {
            "reboot" : {
                "type" : "HARD"
            }
        }, callback);
    }
    
    // This operation allows for a soft reboot, which allows for a graceful 
    // shutdown of all processes.
    // In [Reboot Server](http://docs.openstack.org/api/openstack-compute/2/content/Reboot_Server-d1e3371.html)
    // there is more information about hard and soft reboots.
    var rebootserversoft = function(id, callback) {
        _postAction(id, {
            "reboot" : {
                "type" : "SOFT"
            }
        }, callback);
    }
    
    // The resize function converts an existing server to a different flavor, 
    // in essence, scaling the server up or down. The original server is saved 
    // for a period of time to allow rollback if there is a problem. All resizes 
    // should be tested and explicitly confirmed with `confirmresizedserver`, at
    // which time the original server is removed. All resizes are automatically 
    // confirmed after 24 hours if they are not explicitly confirmed or reverted.
    // In [Resize Server](http://docs.openstack.org/api/openstack-compute/2/content/Resize_Server-d1e3707.html)
    // there is more information.
    var resizeserver = function(id, flavorRef, callback) {
        _postAction(id, {
            "resize" : {
                "flavorRef" : flavorRef
            }
        }, callback);
    }
    
    // During a resize operation, the original server is saved for a period of 
    // time to allow roll back if there is a problem. Once the newly resized 
    // server is tested and has been confirmed to be functioning properly, use 
    // this operation to confirm the resize. After confirmation, the original 
    // server is removed and cannot be rolled back to. All resizes are 
    // automatically confirmed after 24 hours if they are not explicitly 
    // confirmed or reverted.
    // In [Confirm Resized Server](http://docs.openstack.org/api/openstack-compute/2/content/Confirm_Resized_Server-d1e3868.html)
    // there is more information.
    var confirmresizedserver = function(id, callback) {
        _postAction(id, {
            "confirmResize" : null
        }, callback);
    }
    
    // In [Revert Resized Server](http://docs.openstack.org/api/openstack-compute/2/content/Revert_Resized_Server-d1e4024.html)
    // there is more information.
    var revertresizedserver = function(id, callback) {
        _postAction(id, {
            "revertResize" : null
        }, callback);
    }
    
    // This action creates a new image for the given server. Once complete, a 
    // new image will be available that can be used to rebuild or create servers.
    // In [Create Image](http://docs.openstack.org/api/openstack-compute/2/content/Create_Image-d1e4655.html)
    // there is more information.
    var createimage = function(id, name, metadata, callback) {
        var data = {
            "createImage" : {
                'name' : name
            }
        };

        data.creageImage.metadata = {};

        if(metadata != undefined) {
            data.creageImage.metadata = metadata;
        }

        _postAction(id, data, callback);
    }
    
    // **Flavor Operations**
    
    // This operation will list all available flavors. 
    // In [List Flavors](http://docs.openstack.org/api/openstack-compute/2/content/List_Flavors-d1e4188.html)
    // there is more information.
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
        var _onError = function(message) {
            throw Error(message);
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation returns details of the specified flavor.
    // In [Get Flavor Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Flavor_Details-d1e4317.html)
    // there is more information.
    var getflavordetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/flavors/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation creates a new flavor, using information given in arguments:
    // the `name` of the new flavor, the number of MB of `ram`, the `id` of the new 
    // flavor, the number of GB of root `disk`, the number of GB of `ephemeral` disk,
    // the number of MB of `swap` space, and the `rxtx_factor`.
    // Arguments `ephemeral`, `swap`, `rxtx_factor` and `callback` are optional. 
    var createflavor = function( name, ram, vcpus, disk, flavorid, ephemeral, swap, rxtx_factor, callback) {
        if(!_check())
            return;
        var url = params.url + '/flavors';
        var data = { "flavor": {
                "name": name,
                "ram": ram,
                "vcpus": vcpus,
                "disk": disk,
                "id": flavorid,
                "swap": 0,
                "OS-FLV-EXT-DATA:ephemeral": 0,
                "rxtx_factor": 0
            }
        };
 
        if(ephemeral != undefined) {
            data.flavor["OS-FLV-EXT-DATA:ephemeral"] = ephemeral;
        }
        
        if(swap != undefined) {
            data.flavor.swap = swap;
        }
        
        if(rxtx_factor != undefined) {
            data.flavor.rxtx_factor = rxtx_factor;
        }

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }
        JS.Comm.post(url, data, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation deletes flavor, specified by its `id`.
    // In [Get Flavor Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Flavor_Details-d1e4317.html)
    // there is more information.
    var deleteflavor = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/flavors/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }
        
        JS.Comm.del(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // **Image Operations**
    
    // This operation will list all images visible by the account.
    // In-flight images will have the status attribute set to SAVING and the 
    // conditional progress element (0-100% completion) will also be returned. 
    // Other possible values for the status attribute include: UNKNOWN, ACTIVE, 
    // SAVING, ERROR, and DELETED. Images with an ACTIVE status are available 
    // for install.
    // In [List Images](http://docs.openstack.org/api/openstack-compute/2/content/List_Images-d1e4435.html)
    // there is more information.
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
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation returns details of the image specified by its `id`.
    // In [Get Image Details](http://docs.openstack.org/api/openstack-compute/2/content/Get_Image_Details-d1e4848.html)
    // there is more information.
    var getimagedetail = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/images/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation deletes an image from the system, specified by its `id`.
    // Images are immediately removed. Currently, there are no state transitions 
    // to track the delete operation.
    // In [Delete Image](http://docs.openstack.org/api/openstack-compute/2/content/Delete_Image-d1e4957.html)
    // there is more information.
    var deleteimage = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/images/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }
        JS.Comm.del(url, JS.Keystone.params.token, _onOK, _onError);
    }

    // This operation retrieves a list of available Key-pairs.
    var getkeypairlist = function(callback) {
        if(!_check())
            return;
        var url = params.url + '/os-keypairs';

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }
                
        JS.Comm.get(url, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation retrieves a list of available Key-pairs.
    var createkeypair = function(name, pubkey, callback) {
        if(!_check())
            return;
        var url = params.url + '/os-keypairs';

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }
        
        var body = {'keypair': {'name': name}};
        
        if (pubkey != undefined) {
            body['keypair']['public_key'] = public_key
            
        }    
        
        JS.Comm.post(url, body, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // This operation retrieves a list of available Key-pairs.
    var deletekeypair = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/os-keypairs/' + id;

        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }
        
        JS.Comm.del(url, JS.Keystone.params.token, _onOK, _onError);
    }
        
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {
        
        // Functions: 
        getserverlist           : getserverlist,
        getserverdetail         : getserverdetail,
        getserverips            : getserverips,
        updateserver            : updateserver,
        createserver            : createserver,
        deleteserver            : deleteserver,
        changepasswordserver    : changepasswordserver,
        rebootserverhard        : rebootserverhard,
        rebootserversoft        : rebootserversoft,
        resizeserver            : resizeserver,
        confirmresizedserver    : confirmresizedserver,
        revertresizedserver     : revertresizedserver,
        createimage             : createimage,
        getflavorlist           : getflavorlist,
        getflavordetail         : getflavordetail,
        createflavor            : createflavor,
        deleteflavor            : deleteflavor,
        getimagelist            : getimagelist,
        getimagedetail          : getimagedetail,
        deleteimage             : deleteimage,
        getkeypairlist          : getkeypairlist,
        createkeypair           : createkeypair,
        deletekeypair           : deletekeypair
    }

})(JSTACK);
