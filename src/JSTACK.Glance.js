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
    var params, check, getVersion, configure, getimagelist, getimagedetail, updateimage;

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
    check = function(region) {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("image");
            params.url = JSTACK.Comm.getEndpoint(service, region, params.endpointType);
            return true;
        }
        return false;
    };

    // Function `getVersion` returns the version of Glance API server is using.
    getVersion = function(region) {
        if (!check(region)) {
            return 0;
        }
        var service = JS.Keystone.getservice("image");
        params.url = JSTACK.Comm.getEndpoint(service, region, params.endpointType);
        if (params.url.match(/v1/)) {
            return 1;
        } else if (params.url.match(/v2/)) {
            return 2;
        }
        return 0;
    }

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
    getimagelist = function(detailed, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/images';
        if (detailed !== undefined && detailed && url.match(/v1/)) {
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
    getimagedetail = function(id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/images/' + id;

        onOK = function(result, headers) {
            if (callback !== undefined) {
                switch(getVersion(region)) {
                    case 1:
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
                        break;
                    case 2:
                        callback(result);
                        break;
                    default:
                        break;
                }
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        switch(getVersion(region)) {
            case 1:
                JS.Comm.head(url, JS.Keystone.params.token, onOK, onError);
                break;
            case 2:
                JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
                break;
            default:
                break;
        }
    };

    // This operation updates details of the image specified by its `id`.
    // In [Update Image Details](http://api.openstack.org/api-ref.html)
    // there is more information.
    updateimage = function(id, name, visibility, properties, callback, error, region) {
        var url, onOK, onError;
        var headers = {};
        var prefix = "x-image-meta-";
        if (!check(region)) {
            return;
        }
        url = params.url + '/images/' + id;
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
        switch(getVersion(region)) {
            case 1:
                if (name) {
                    headers[prefix+'name'] = name;
                }
                if (visibility === "public") {
                    headers[prefix+'is_public'] = "true";
                } else {
                    headers[prefix+'is_public'] = "false";
                }
                properties = properties || {};
                for (var propKey in properties) {
                    headers[prefix+"property-"+propKey] = properties[propKey];
                }
                JS.Comm.put(url, undefined, JS.Keystone.params.token, onOK, onError, headers);
                break;
            case 2:
                var data = [];
                if (name) {
                    data.push({op: "replace", path: "/name", value: name});
                }
                if (visibility) {
                    data.push({op: "replace", path: "/visibility", value: visibility});
                }
                JS.Comm.patch(url, data, JS.Keystone.params.token, onOK, onError, headers);
            default:
            break;
        }
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        configure: configure,
        getimagelist: getimagelist,
        getimagedetail: getimagedetail,
        updateimage: updateimage,
        getVersion: getVersion
    };

}(JSTACK));