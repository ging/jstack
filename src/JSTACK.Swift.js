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

// JStack Swift Module
// ------------------

JSTACK.Swift = (function (JS, undefined) {
    "use strict";
    var params, check, configure, getcontainerlist, createcontainer, deletecontainer, getobjectlist,
        copyobject, uploadobject, downloadobject, deleteobject;
    // This modules stores the `url` to which it will send every
    // request.
    params = {
        url : undefined,
        state : undefined,
        endpointType : "publicURL"
    };

    // Private functions
    // -----------------

    // Function `check` internally confirms that Keystone module is
    // authenticated and it has the URL of the Swift service.
    check = function (region) {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("object-store");
            if (service) {
                params.url = JSTACK.Comm.getEndpoint(service, region, params.endpointType);
                return true;
            }
            return false;
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
    configure = function (endpointType) {
        if (endpointType === "adminURL" || endpointType === "internalURL" || endpointType === "publicURL") {
            params.endpointType = endpointType;
        }
    };


    // **Container Operations**

    //
    // View a list of simple Container entities. In
    // [Requesting Account details and a List of Containers](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    getcontainerlist = function (callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url;

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Listed your containers");
        JS.Comm.get(url, JS.Keystone.params.token, onOk, onError);
    };
    // Create a Container.
    // Argument in this function is:
    //
    // * The `container` container's name
    createcontainer = function (container, callback, error, region) {
        var url, onOk, onError, data;
        if (!check(region)) {
            return;
        }
        url = params.url + "/" + container;
        data = {
            metadata: {}
        };

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Created new container ", container);
        JS.Comm.put(url, data, JSTACK.Keystone.params.token, onOk, onError);
    };
    // Delete a Container entitiy. In
    // [Deleting a Container](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    // Argument in this function is:
    //
    // * The `container` container's name
    deletecontainer = function (container, callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/' + container;

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Deleted container ", container);
        JS.Comm.del(url, JS.Keystone.params.token, onOk, onError);
    };


    // **Objects Operations**

    //
    // View a list of simple Object entities. In
    // [Requesting Container details and a List of Objects](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    // Argument in this function is:
    //
    // * The `container` of the container
    getobjectlist = function (container, callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/' + container;

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };
        
        //console.log("Listed container ", container, " objects");
        JS.Comm.get(url, JS.Keystone.params.token, onOk, onError);
    };
    

    // Copies an Object to another Object in the Object store. In
    // [Requesting a Copy of Object](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    // Argument in this function is:
    //
    // * The `sourceContainer` name of the source Container
    //
    // * The `sourceObject` name of the source Object
    //
    // * The `targetContainer` name of the target container
    //
    // * The `targetObject` name of the targetObject
    copyobject = function (sourceContainer, sourceObject, targetContainer, targetObject, callback, error, region) {
        var url, src, onOk, onError;
        var headers = {};

        if (!check(region)) {
            return;
        }

        src = '/' + sourceContainer + '/' + sourceObject;
        url = params.url + '/' + targetContainer + '/' + targetObject;

        headers["X-Copy-From"] = src;
        headers["Content-Length"] = "0";
        console.log("Edited header content: " + headers);

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Copied object ", sourceObject, " from container ", sourceContainer, " to object ", targetObject, " in container ", targetContainer);
        JS.Comm.put(url, undefined, JS.Keystone.params.token, onOk, onError, headers);
    };
    // Upload an Object.
    // Arguments in this function are:
    //
    // * The `container`  name of the container in which the objects
    //   is going to be upload.
    //
    // * The `object` object's name
    //
    // * The `fileData` data to be uploaded
    //
    // * The `fileType` of the object
    //
    uploadobject = function (container, object, fileData, fileType, callback, error, region) {
        var url, onOk, onError, data;
        if (!check(region)) {
            return;
        }

        url = params.url + '/' + container + '/' + object;

        data = {
            "mimeType": fileType,
            "metadata": {},
            "valuetransferencoding": "base64",
            "value": fileData
        };

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Uploaded object ", object, " to container ", container);
        JS.Comm.put(url, data, JS.Keystone.params.token, onOk, onError);
    };
    // Download an Object. In
    // [Get Object content](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    // Argument in this function is:
    //
    // * The `container` container's name in which is the object located
    //
    // * The `object` name of the object 
    downloadobject = function (container, object, callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/' + container + '/' + object;

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Downloaded object ", object, " from container ", container);
        JS.Comm.get(url, JS.Keystone.params.token, onOk, onError);
    };
    // Permantly delete an Object. In
    // [Delete Object](http://api.openstack.org/)
    // there is more information about the JSON object that is returned.
    //
    // * The `container` container's name in which is the object located
    //
    // * The `object` name of the object 
    deleteobject = function (container, object, callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/' + container + '/' + object;

        onOk = function (result) {
            if (callback !== undefined) {
                callback(result);
            }
        };
        onError = function (message) {
            if (error !== undefined) {
                error(message);
            }
        };

        //console.log("Deleted object ", object, " from container ", container);
        JS.Comm.del(url, JS.Keystone.params.token, onOk, onError);
    };
    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {

        // Functions:
        configure : configure,
        getcontainerlist : getcontainerlist,
        createcontainer : createcontainer,
        deletecontainer : deletecontainer,
        getobjectlist : getobjectlist,
        copyobject : copyobject,
        uploadobject : uploadobject,
        downloadobject : downloadobject,
        deleteobject : deleteobject
    };

}(JSTACK));