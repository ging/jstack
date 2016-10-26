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

// JStack Murano Module
// ------------------

JSTACK.Murano = (function (JS, undefined) {

    "use strict";
    var params, check, configure, getTemplateList, createTemplate, 
        getTemplate, deleteTemplate, createService,
        updateBlueprintTemplateTier, deleteTemplateTier, 
        getBlueprintInstanceList, getBlueprintInstance, launchBlueprintInstance, stopBlueprintInstance,
        getPackages, getPackage, getTask;
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
    // authenticated and it has the URL of the Volume service.
    check = function (region) {
        if (JS.Keystone !== undefined && JS.Keystone.params.currentstate === JS.Keystone.STATES.AUTHENTICATED) {
            var service = JS.Keystone.getservice("application-catalog");
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


    //-----------------------------------------------
    // Blueprint Catalogue
    //-----------------------------------------------

    // var getBlueprintCatalogList = function (callback, callbackError) {

    //     check();

    //     sendRequest('GET', 'catalog/org/' + orgName + '/environment', undefined, function (resp) {
    //         var bpList = x2js.xml_str2json(resp);
    //         callback(bpList.environmentDtoes.environmentDto_asArray);
    //     }, callbackError);
    // };

    // var getBlueprintCatalog = function (bp_id, callback, callbackError) {

    //     check();
    //     sendRequest('GET', 'catalog/org/' + orgName + '/environment/' + bp_id, undefined, function (resp) {
    //         var bp = x2js.xml_str2json(resp);
    //         callback(bp.environmentDto);
    //     }, callbackError);
    // };

    //-----------------------------------------------
    // Templates
    //-----------------------------------------------

    getTemplateList = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/templates';

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result.templates);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    getTemplate = function (id, callback, error, region) {

        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/templates/' + id;

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

    createTemplate = function (name, description, callback, error, region) {
        var url, onOk, onError, data;
        if (!check(region)) {
            return;
        }

        url = params.url + '/templates';

        data = {
            "name": name,
            "description_text": description
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

        JS.Comm.post(url, data, JS.Keystone.params.token, onOk, onError);

    };

    deleteTemplate = function (id, callback, error, region) {
        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/templates/' + id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOk, onError);
    };

    createService = function (template_id, service, instance, callback, error, region) {

        var url, onOk, onError, data;
        if (!check(region)) {
            return;
        }

        url = params.url + '/templates/' + template_id + '/services';

        var id = '_' + service.id;

        // instance can be an id (if it already exists) or an object if it is new
        data = {
            "instance": instance, 

            "name": service.name,
            "?": {  
                "type": service.fully_qualified_name,
                "id": service.id
            }
        }

        data['?'][id] = {
            "name": service.name,
        };

        for (var a in service.attributes_asArray) {
            data[service.attributes_asArray[a].key] = service.attributes_asArray[a].value;
        }

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

       JS.Comm.post(url, data, JS.Keystone.params.token, onOk, onError);

    };

    // var updateBlueprintTemplateTier = function (bp_id, tier, callback, callbackError, region) {

    //     var url, onOk, onError, data;
    //     if (!check(region)) {
    //         return;
    //     }

    //     url = params.url + '/templates/' + id + '/services';

    //     console.log('tier', tier);

    //     data = {
    //         "instance": {
    //             "flavor": tier.flavour, 
    //             "keypair": tier.keypair, 
    //             "image": tier.image, 
    //             "?": {
    //                 "type": "io.murano.resources.ConfLangInstance",         
    //                 "id":  "5843836d2a4145f0895d7e66ee8ccf43"
    //             }, 
    //             "name": tier.name
    //         }, 
    //         "name": tier.name,
    //         "?": {  
    //             "_26411a1861294160833743e45d0eaad9": {
    //                 "name": "orion"
    //             },
    //             "type": "io.murano.conflang.test.PuppetExample",    
    //             "id": "190c8705-5784-4782-83d7-0ab55a1449aa"
    //         }
    //     }

    //     onOk = function (result) {
    //         if (callback !== undefined) {
    //             callback(result);
    //         }
    //     };
    //     onError = function (message) {
    //         if (error !== undefined) {
    //             error(message);
    //         }
    //     };

    //    JS.Comm.put(url, data, JS.Keystone.params.token, onOk, onError);
    // };

    var deleteTemplateTier = function (bp_id, service_id, callback, error, region) {

        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/templates/' + bp_id + '/services/' + service_id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOk, onError);
    };

    // var getTemplateTierProductList = function (bp_id, tier_id, callback, callbackError) {

    //     check();

    //     sendRequest('GET', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id + '/tier/' + tier_id + '/productRelease', undefined, function (resp) {
    //         var bpt = x2js.xml_str2json(resp);
    //         callback(bpt.tierDtos);
    //     }, callbackError);
    // };

    // var addBlueprintTemplateTierProduct = function (bp_id, tier_id, product, callback, callbackError) {

    //     check();

    //     var p = {productReleaseDtos: product};

    //     var xmlProd = xmlHead + x2js.json2xml_str(p);

    //     sendRequest('POST', 'catalog/org/' + orgName + '/vdc/' + vdc_id + '/environment/' + bp_id + '/tier/' + tier_id + '/productRelease', xmlProd, function (resp) {
    //         callback(resp);
    //     }, callbackError);
    // };


    //-----------------------------------------------
    // Blueprint Instances
    //-----------------------------------------------

    getBlueprintInstanceList = function (callback, error, region) {

        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/environments';

        onOK = function(result) {
            if (callback !== undefined) {
                for (var e in result.environments) {
                    result.environments[e].blueprintName = result.environments[e].name;
                    result.environments[e].taskId = result.environments[e].id;
                }
                callback(result.environments);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    getBlueprintInstance = function (id, callback, error, region) {

        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/environments/' + id;

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

    launchBlueprintInstance = function (id, name, callback, error, region) {

        var url, onOk, onError, data;
        if (!check(region)) {
            return;
        }

        url = params.url + '/templates/' + id + '/create-environment';

        data = {
            "name": name,
            "region": region,
            "defaultNetworks": {
                "environment": {
                    "internalNetworkName": "node-int-net-01",
                    "?": {
                        "type": "io.murano.resources.ExistingNeutronNetwork",
                        "id": JSTACK.Utils.guid()
                    }
                }
            }
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

        JS.Comm.post(url, data, JS.Keystone.params.token, function (result) {
            var url2 = params.url + '/environments/' + result.environment_id + '/sessions/' + result.session_id + '/deploy';
            JS.Comm.post(url2, undefined, JS.Keystone.params.token, onOk, onError);
        }, onError);
    };

    stopBlueprintInstance = function (id, callback, error, region) {

        var url, onOk, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/environments/' + id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOk, onError);
    };

    // var addVMToTier = function (bp_id, tierDto, callback, callbackError) {

    //     check();

    //     var t = {tierDto: tierDto};

    //     var xmlTier = xmlHead + x2js.json2xml_str(t);

    //     sendRequest('POST', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance/' + bp_id + '/tierInstance', xmlTier, function (resp) {
    //         callback(resp);
    //     }, callbackError);
    // };

    // var removeVMFromTier = function (bp_id, inst_id, callback, callbackError) {

    //     check();

    //     sendRequest('DELETE', 'envInst/org/' + orgName + '/vdc/' + vdc_id + '/environmentInstance/' + bp_id + '/tierInstance/' + inst_id, undefined, function (resp) {
    //         callback(resp);
    //     }, callbackError);
    // };

    //Task Management

    var getTask = function (id, callback, error, region) {

        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/environments/' + id + '/deployments';

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result.deployments[0]);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    // var getTasks = function (callback, callbackError) {

    //     check();

    //     sendRequest('GET', 'vdc/' + vdc_id + '/task', undefined, function (resp) {
    //         var task = x2js.xml_str2json(resp);
    //         callback(task.tasks);
    //     }, callbackError);
    // };


    // SDC

    getPackages = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/catalog/packages?limit=100';

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result.packages);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    getPackage = function(id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + '/catalog/packages/' + id + '/download';

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

    return {
        getTemplateList: getTemplateList,
        createTemplate: createTemplate,
        getTemplate: getTemplate,
        deleteTemplate: deleteTemplate,
        createService: createService,
        //updateBlueprintTemplateTier: updateBlueprintTemplateTier, 
        deleteTemplateTier: deleteTemplateTier,
        getBlueprintInstanceList: getBlueprintInstanceList,
        getBlueprintInstance: getBlueprintInstance,
        launchBlueprintInstance: launchBlueprintInstance,
        stopBlueprintInstance: stopBlueprintInstance,
        getPackages: getPackages,
        getPackage: getPackage,
        getTask: getTask
    };

}(JSTACK));