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

// Keystone API Module
// -------------------

// This file provides functions to access Keystone API's operations,
// such as authenticate and  gettenants.

JSTACK.Keystone = (function (JS, undefined) {

    "use strict";

    var params, STATES, init, authenticate, gettenants, getendpoint, getservicelist, getservice, createuser, edituser, getusers, getusersfortenant, getuser, deleteuser, getroles, getuserroles, adduserrole, removeuserrole, createtenant, edittenant, deletetenant;

    // `STATES` defines different authentication states. This
    // can be useful for applications to know when they can
    // access to authentication tokens.

    STATES = {
        DISCONNECTED : 0,
        AUTHENTICATING : 1,
        AUTHENTICATED : 2,
        AUTHENTICATION_ERROR : 3
    };

    // `params` stores info about Keystone service:
    params = {
        // * **url** points to Keystone location. Typically it could be http://host:5000/
        url : undefined,
        // * **currentstate** stores the state of this API based on options given by `STATES`
        currentstate : undefined,
        // * **access** stores the last information retreived during last successful authentication
        access : undefined,
        // * **token** gives the authentication info obtained during last successful authentication
        token : undefined
    };

    // We need to initialize this API by passing the Keystone's URL. This URL usually follows the next
    // pattern: http://host:5000/
    // This API will initialize parameters such as `currentstate`, `token` and `access`.
    init = function (keystoneUrl, adminUrl) {
        console.log("Admin URL" + adminUrl);
        params.url = keystoneUrl;
        params.adminUrl = adminUrl;
        params.access = undefined;
        params.token = undefined;
        params.currentstate = STATES.DISCONNECTED;
    };
    // Authentication function
    // ------------------------
    // This API offers Keystone authentication.
    authenticate = function (username, password, token, tenant, callback, error) {
        var credentials = {}, onOK, onError;
        // This authentication needs a `username`, a `password`. Or a `token`.
        if (token !== undefined) {
            credentials = {
                "auth" : {
                    "token" : {
                        "id" : token
                    }
                }
            };
        } else {
            credentials = {
                "auth" : {
                    "passwordCredentials" : {
                        "username" : username,
                        "password" : password
                    }
                }
            };
        }

        // User also can provide a `tenant`.
        if (tenant !== undefined) {
            credentials.auth.tenantId = tenant;
        }

        // During authentication the state will be `AUTHENTICATION`.
        params.currentstate = STATES.AUTHENTICATING;

        // Once Keystone server sends a response to this API client it will call the function
        // `callback` with the result, if provided. It also updates the state to `AUTHENTICATED`
        // and stores result in `access`.
        onOK = function (result) {
            params.currentstate = JS.Keystone.STATES.AUTHENTICATED;
            params.access = result.access;
            params.token = params.access.token.id;
            if (callback !== undefined) {
                callback(result);
            }
        };

        // In case of an error the state will be `AUTHENTICATION_ERROR` and it throws the corresponding
        // error with its description.
        onError = function (message) {
            params.currentstate = STATES.AUTHENTICATION_ERROR;
            error(message);
        };

        // A typical response would be:
        //
        //     {
        //        "token": {
        //            "expires": "2012-03-10T15:41:58.905480",
        //            "id": "d1eb612e-24fa-48b3-93d4-fc6c90379078",
        //            "tenant": {
        //                "id": "2",
        //                "name": "demo"
        //            }
        //        },
        //        "serviceCatalog": [
        //              {
        //                "endpoints": [
        //                    {
        //                        "adminURL": "http://host.name:8774/v1.1/2",
        //                        "region": "nova",
        //                        "internalURL": "http://host.name:8774/v1.1/2",
        //                        "publicURL": "http://host.name:80/v1.1/2"
        //                    }
        //                ],
        //                "type": "compute",
        //                "name": "nova"
        //            },
        //        ],
        //        "user": {
        //            "id": "1",
        //            "roles": [
        //                {
        //                    "tenantId": "2",
        //                    "id": "1",
        //                    "name": "Admin"
        //                },
        //                {
        //                    "id": "1",
        //                    "name": "Admin"
        //                },
        //            ],
        //            "name": "admin"
        //        }
        //       }
        JS.Comm.post(params.url + "tokens", credentials, undefined, onOK, onError);
    };

    // Retreiving service information
    // ------------------------------
    // The user can also obtain information about each service which is configured in Keystone.
    getservice = function (name) {
        var index, service;

        // Only if the client is currently authenticated.
        if (params.currentstate !== STATES.AUTHENTICATED) {
            return undefined;
        }

        for (index in params.access.serviceCatalog) {
            if (params.access.serviceCatalog[index] !== undefined) {
                service = params.access.serviceCatalog[index];
                if (name === service.type) {
                    // This function will return an object with the next structure:
                    //
                    //     service: {
                    //          endpoints: [
                    //               {
                    //               adminURL: "http://host.name:8774/v1.1/2",
                    //               internalURL: "http://host.name:8774/v1.1/2",
                    //               publicURL: "http://host.name:80/v1.1/2",
                    //               region: "nova"
                    //               },
                    //               name: "nova",
                    //               type: "compute"
                    //          ]
                    //     }
                    //
                    return service;
                }
            }
        }
        return undefined;
    };

    // Retreiving endpoint information
    // ------------------------------
    // The user can also obtain information about each service which is configured in Keystone.
    getendpoint = function (region, type) {
        var serv = getservice(type) || {};
        var endpoint;
        for (var e in serv.endpoints) {
            if (serv.endpoints[e].region === region) {
                endpoint = serv.endpoints[e];
                break;
            }
        }
        return endpoint;
    };

    // The user can also obtain information about all services configured in Keystone.
    getservicelist = function () {
        // Only if the client is currently authenticated.
        if (params.currentstate !== STATES.AUTHENTICATED) {
            return undefined;
        }
        return params.access.serviceCatalog;
    };

    // Tenant information function
    // ---------------------------
    // User can obtain information about available tenants.
    gettenants = function (callback, admin, error) {
        var onOK, onError;

        // Only when the user is already authenticated.
        //if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            // This function will return tenant information following next pattern:
            //
            //         tenants: {
            //                links: [
            //                        {       href: "http://host.name:5000/tenants",
            //                                rel: "prev"
            //                        }
            //                ],
            //                values: [
            //                        {
            //                                description: "test",
            //                                enabled: true,
            //                                id: "3",
            //                                name: "test"
            //                        },
            //                        {
            //                                description: "None",
            //                                enabled: true,
            //                                id: "2",
            //                                name: "demo"
            //                        },
            //                        {
            //                                description: "None",
            //                                enabled: true,
            //                                id: "1",
            //                                name: "admin"
            //                        }
            //                ]
            //         }
            //
            onOK = function (result) {
                if (callback !== undefined) {
                    callback(result);
                }
            };

            onError = function (result) {
                // If error occurs it will send its description.
                if (error !== undefined) {
                    error(result);
                }
            };

            var url = params.url;
            if (admin) {
                url = params.adminUrl
            }

            JS.Comm.get(url + "tenants", params.token, onOK, onError);
        //}
    };


    createuser = function(username, password, tenant_id, email, enabled, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
           var data = {"user": {"name": username,
                               "password": password,
                               "tenantId": tenant_id,
                               "email": email,
                               "enabled": enabled}};
           JS.Comm.post(params.adminUrl + "users", data, params.token, onOk, onError);
        }
    };

    edituser = function(id, username, password, tenant_id, email, enabled, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
           var data = {"user": {"name": username,
                               "tenantId": tenant_id,
                               "email": email,
                               "enabled": enabled}};

            if (password !== undefined) {
                data.user.password = password;
            }
           JS.Comm.put(params.adminUrl + "users/" + id, data, params.token, onOk, onError);
        }
    };

    getusers = function(onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            JS.Comm.get(params.adminUrl + "users", params.token, onOk, onError);
        }
    };

    getusersfortenant = function(tenant_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            JS.Comm.get(params.adminUrl + "tenants/" + tenant_id + "/users", params.token, onOk, onError);
        }
    };

    getuser = function(user_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            JS.Comm.get(params.adminUrl + "users/" + user_id, params.token, onOk, onError);
        }
    };

    getroles = function(onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            JS.Comm.get(params.adminUrl + "OS-KSADM/roles", params.token, onOk, onError);
        }
    };

    deleteuser = function(user_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            JS.Comm.del(params.adminUrl + "users/" + user_id, params.token, onOk, onError);
        }
    };

    getuserroles = function(user_id, tenant_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var route = "";
            if (tenant_id !== undefined) {
                route = params.adminUrl + "tenants/" + tenant_id + "/users/" + user_id + "/roles";
            } else {
                route = params.adminUrl + "users/" + user_id + "/roles";
            }
            JS.Comm.get(route, params.token, onOk, onError);
        }
    };

    adduserrole = function(user_id, role_id, tenant_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var route = "";
            if (tenant_id !== undefined) {
                route = params.adminUrl + "tenants/" + tenant_id + "/users/" + user_id + "/roles/OS-KSADM/" + role_id;
            } else {
                route = params.adminUrl + "users/" + user_id + "/roles/OS-KSADM/" + role_id;
            }
            JS.Comm.put(route, {}, params.token, onOk, onError);
        }
    };

    removeuserrole = function(user_id, role_id, tenant_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var route = "";
            if (tenant_id !== undefined) {
                route = params.adminUrl + "tenants/" + tenant_id + "/users/" + user_id + "/roles/OS-KSADM/" + role_id;
            } else {
                route = params.adminUrl + "users/" + user_id + "/roles/OS-KSADM/" + role_id;
            }
            JS.Comm.del(route, params.token, onOk, onError);
        }
    };

    createtenant = function(name, description, enabled, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
           var data = {"tenant": {"name": name,
                             "description": description,
                             "enabled": enabled}};
           JS.Comm.post(params.adminUrl + "tenants", data, params.token, onOk, onError);
        }
    };

    edittenant = function(id, name, description, enabled, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
           var data = {"tenant": {"id": id,
                            "name": name,
                            "description": description,
                            "enabled": enabled}};
           JS.Comm.put(params.adminUrl + "tenants/" + id, data, params.token, onOk, onError);
        }
    };

    deletetenant = function(tenant_id, onOk, onError) {
        if (params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
           JS.Comm.del(params.adminUrl + "tenants/" + tenant_id, params.token, onOk, onError);
        }
    };

    // Public Functions and Variables
    // ---------------------------
    // This is the list of available public functions and variables
    return {
        // Variables:
        STATES : STATES,
        params : params,
        // Functions:
        init : init,
        authenticate : authenticate,
        gettenants : gettenants,
        getendpoint: getendpoint,
        getservice : getservice,
        getservicelist : getservicelist,
        createuser : createuser,
        edituser : edituser,
        getusers : getusers,
        getusersfortenant : getusersfortenant,
        getuser : getuser,
        deleteuser : deleteuser,
        getuserroles : getuserroles,
        getroles : getroles,
        adduserrole : adduserrole,
        removeuserrole : removeuserrole,
        createtenant : createtenant,
        edittenant: edittenant,
        deletetenant : deletetenant
    };
}(JSTACK));