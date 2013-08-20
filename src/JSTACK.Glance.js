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

// JStack Glance Module
// ------------------

// This module provides Glance API functions.
JSTACK.Glance = (function(JS, undefined) {
    "use strict";
    var params, check, configure, getimagelist, getimagedetail, updateimage;

    // This modules stores the `url`to which it will send every
    // request.
    params = {
        url: undefined,
        state: undefined,
        endpointType: "publicURL"
    };

    // Private functions
    // -----------------

    // Function `check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Glance service.
    check = function() {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("image");
            params.url = service.endpoints[0][params.endpointType];
            return true;
        }
        return false;
    };
    // Public functions
    // ----------------
    //

    // This function sets the endpoint type for making requests to Glance.
    // It could take one of the following values:
    // * "adminURL"
    // * "internalURL"
    // * "publicURL"
    // You can use this function to change the default endpointURL, which is publicURL.
    configure = function(endpointType) {
        if (endpointType === "adminURL" || endpointType === "internalURL" || endpointType === "publicURL") {
            params.endpointType = endpointType;
        }
    };

    // **Image Operations**

    //
    // This operation provides a list of images associated with the account. In
    // [Requesting a List of Public VM Images](http://docs.openstack.org/cactus/openstack-compute/admin/content/requesting-vm-list.html)
    // there is more information about the JSON object that is returned.
    getimagelist = function(detailed, callback, error) {
        var url, onOK, onError;
        if (!check()) {
            return;
        }
        url = params.url + '/images';
        if (detailed !== undefined && detailed) {
            url += '/detail';
        }

        url += '?limit=100';

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    //
    // This operation provides a list of images associated with the account. In
    // [Requesting a List of Public VM Images](http://docs.openstack.org/cactus/openstack-compute/admin/content/requesting-vm-list.html)
    // there is more information about the JSON object that is returned.
    getimagedetail = function(id, callback, error) {
        var url, onOK, onError;
        if (!check()) {
            return;
        }
        url = params.url + '/images/' + id;

        onOK = function(result, headers) {
            if (callback !== undefined) {
                var model = {};
                var heads = headers.split("\r\n");
                heads.forEach(function(head) {
                    if (head.indexOf('x-image-meta') === -1) {
                        return;
                    }
                    var reg = head.match(/^([\w\d\-\_]*)\: (.*)$/);
                    var value = reg[1];
                    var key = reg[2];
                    var data = value.split('-');
                    var attr = data[data.length - 1];
                    model[attr] = key;
                });
                callback(model, headers);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.head(url, JS.Keystone.params.token, onOK, onError);
    };

    // This operation updates details of the image specified by its `id`.
    // In [Update Image Details](http://api.openstack.org/api-ref.html)
    // there is more information.
    updateimage = function(id, name, is_public, min_ram, min_disk, properties, callback, error) {
        var url, onOK, onError;
        var headers = {};
        var prefix = "x-image-meta-";
        if (!check()) {
            return;
        }
        url = params.url + '/images/' + id;

        if (name) {headers[prefix+'name'] = name};
        if (is_public) {headers[prefix+'is_public'] = is_public};
        if (min_ram) {headers[prefix+'min_ram'] = min_ram};
        if (min_disk) {headers[prefix+'min_disk'] = min_disk};
        for (var propKey in properties) {
            headers[prefix+"property-"+propKey] = properties[propKey];
        }

        var data = undefined;

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };
        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError, headers);
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        configure: configure,
        getimagelist: getimagelist,
        getimagedetail: getimagedetail,
        updateimage: updateimage
    };

}(JSTACK));