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

// JStack Nova Volume Module
// ------------------

// Allows you to manage volumes and snapshots that can be used with the Compute API.
JSTACK.Nova.Volume = (function(JS, undefined) {

    // This modules stores the `url` to which it will send every
    // request.
    var params = {
        url     : undefined,
        state   : undefined
    }
    
    // Private functions
    // -----------------
    
    // Function `_check` internally confirms that Keystone module is 
    // authenticated and it has the URL of the Volume service.
    var _check = function() {
        if(JS.Keystone != undefined && JS.Keystone.params.currentstate == JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("volume");
            params.url = service.endpoints[0].adminURL;
            return true;
        } else {
            return false;
        }
    }
    
    // Public functions
    // ----------------
    //
    // **Volume Operations**
    
    //
    // View a list of simple Volume entities. In 
    // [Requesting a List of Volumes](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var getvolumelist = function(detailed, callback) {
        if(!_check())
            return;
        var url = params.url + '/volumes';
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
    
    // Create a Volume.
    // Arguments in this function are: 
    //
    // a. Mandatory
    //
    // * The `size` of volume in GB
    //
    // b. Optional
    //
    // * The `name` of the volume
    // 
    // * The `description` of the volume
    //
    var createvolume = function(size, name, description, callback) {
        if(!_check())
            return;
            
        var data = {"volume":{ "size": size }};
        
        if(name != undefined) {
            data.volume.display_name = name;
        }
        
        if(description != undefined) {
            data.volume.display_description = description;
        }
        
        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.post(params.url + '/volumes', data, JS.Keystone.params.token, _onOK, _onError);
        
    }
    
    // Delete a Volume entitiy. In 
    // [Deleting a Volume](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var deletevolume = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/volumes/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.del(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // Get a Volume entitiy. In 
    // [Retrieving a Volume](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var getvolume = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/volumes/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // **Snapshot Operations**
    
    //
    // View a list of simple Snapshot entities. In 
    // [Requesting a List of Snapshots](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var getsnapshotlist = function(detailed, callback) {
        if(!_check())
            return;
        var url = params.url + '/snapshots';
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
    
    // Create a Volume Snapshot.
    // Arguments in this function are: 
    //
    // a. Mandatory
    //
    // * The `volume_id` of the volume
    //
    // b. Optional
    //
    // * The `name` of the snapshot
    // 
    // * The `description` of the snapshot
    //
    var createsnapshot = function(volume_id, name, description, callback) {
        if(!_check())
            return;
            
        var data = {"snapshot": { "volume_id": volume_id, "force": true}};
        
        if(name != undefined) {
            data.snapshot.display_name = name;
        }
        
        if(description != undefined) {
            data.snapshot.display_description = description;
        }
        
        var _onOK = function(result) {
            if(callback != undefined)
                callback(result);
        }
        
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.post(params.url + '/snapshots', data, JS.Keystone.params.token, _onOK, _onError);
    }
    
    // Delete a Snapshot entitiy. In 
    // [Retrieving a Snapshot](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var deletesnapshot = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/snapshots/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.del(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // Get a Snapshot entitiy. In 
    // [Retrieving a Snapshot](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    var getsnapshot = function(id, callback) {
        if(!_check())
            return;
        var url = params.url + '/snapshots/' + id;

        var _onOk = function(result) {
            if(callback != undefined)
                callback(result);
        }
        var _onError = function(message) {
            throw Error(message);
        }

        JS.Comm.get(url, JS.Keystone.params.token, _onOk, _onError);
    }
    
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {
        
        // Functions: 
        getvolumelist            : getvolumelist,
        createvolume             : createvolume,
        deletevolume             : deletevolume,
        getvolume                : getvolume,
        getsnapshotlist          : getsnapshotlist,
        createsnapshot           : createsnapshot,
        deletesnapshot           : deletesnapshot,
        getsnapshot              : getsnapshot
    }

})(JSTACK);
