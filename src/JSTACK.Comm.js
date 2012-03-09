// JSTACK Communication Module
// ---------------------------

// This module provides functions to send GET, POST, PUT and DELETE HTTP requests
// to OpenStack components. It is compatible with the token-based authentication
// proposed by Keystone.

JSTACK.Comm = (function(JS, undefined) {

    // Private functions
    // -----------------

    // Function `_send` is internally used to make detailed low-level requests
    // to components.
    var _send = function(method, url, data, token, callBackOK, callbackError) {

        // This function receives a `method` that can be "GET", "POST", "PUT", or
        // "DELETE". It also receives the `url` to which it has to send the request,
        // the `data` to be sent, that has to be a JSON object, the ´token´ to
        // authenticate the request, and success and error callbacks.
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {

            if(xhr.readyState == 4) {
                switch(xhr.status) {

                    // In case of successful response it calls the `callbackOK` function.
                    case 100:
                    case 200:
                    case 201:
                    case 202:
                    case 203:
                    case 204:
                    case 205:
                        var result = undefined;
                        if(xhr.responseText != undefined && xhr.responseText != '') {
                            result = JSON.parse(xhr.responseText);
                        }
                        callBackOK(result);
                        break;

                    // In case of error it sends an error message to `callbackError`.
                    case 400:
                        callbackError("400 Bad Request");
                        break;
                    case 401:
                        callbackError("401 Unauthorized");
                        break;
                    case 403:
                        callbackError("403 Forbidden");
                        break;
                    default:
                        callbackError(xhr.status + " Error");
                }
            }
        }
        if(token != undefined) {
            xhr.setRequestHeader('X-Auth-Token', token);
        }

        var body;

        if(data != undefined) {
            body = JSON.stringify(data);
            xhr.send(body);
        } else {
            xhr.send();
        }
    }
    // Public functions
    // ----------------

    // * Function *get* receives the `url`, the authentication token
    // (which is optional), and callbacks. It sends a HTTP GET request,
    // so it does not send any data.
    var get = function(url, token, callbackOK, callbackError) {
        _send("GET", url, undefined, token, callbackOK, callbackError);
    }
    // * Function *post* receives the `url`, the authentication token
    // (which is optional), the data to be sent (a JSON Object), and
    // callbacks. It sends a HTTP POST request.
    var post = function(url, data, token, callbackOK, callbackError) {
        _send("POST", url, data, token, callbackOK, callbackError);
    }
    // * Function *put* receives the same parameters as post. It sends
    // a HTTP PUT request.
    var put = function(url, data, token, callbackOK, callbackError) {
        _send("PUT", url, data, token, callbackOK, callbackError);
    }
    // * Function *del* receives the same paramaters as get. It sends a
    // HTTP DELETE request.
    var del = function(url, token, callbackOK, callbackError) {
        _send("DELETE", url, undefined, token, callbackOK, callbackError);
    }
    return {
        get : get,
        post : post,
        put : put,
        del : del
    }
})(JSTACK);
