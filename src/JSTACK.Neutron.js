/*
The MIT License

Copyright (c) 2013 Universidad Politecnica de Madrid

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

/// JStack Neutron Module
// ------------------

JSTACK.Neutron = (function(JS, undefined) {
    "use strict";
    var params, check, configure, getnetworkslist, createnetwork, updatenetwork, getnetworkdetail, deletenetwork,
    getsubnetslist, createsubnet, updatesubnet, getsubnetdetail, deletesubnet,
    getportslist, createport, updateport, getportdetail, deleteport, getrouterslist, createrouter, updaterouter,
    getrouterdetail, deleterouter, addinterfacetorouter, removeinterfacefromrouter;

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
            var service = JS.Keystone.getservice("network");
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
    configure = function(endpointType) {
        if (endpointType === "adminURL" || endpointType === "internalURL" || endpointType === "publicURL") {
            params.endpointType = endpointType;
        }
    };

    getnetworkslist = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/networks';

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result.networks);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    createnetwork = function(name, admin_state_up, shared, tenant_id, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/networks';

        data = {
            "network" : {
            }
        };

        if (name !== undefined) {
            data.network.name = name;
        }

        if (admin_state_up !== undefined) {
            data.network.admin_state_up = admin_state_up;
        }

        if (shared !== undefined) {
            data.network.shared = shared;
        }

        if (tenant_id !== undefined) {
            data.network.tenant_id = tenant_id;
        }

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

        JS.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    getnetworkdetail = function(network_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/networks/' + network_id;

        onOK = function(result) {
            if (callback !== undefined) {
                callback(result.network);
            }
        };
        onError = function(message) {
            if (error !== undefined) {
                error(message);
            }
        };

        JS.Comm.get(url, JS.Keystone.params.token, onOK, onError);
    };

    updatenetwork = function(network_id, name, admin_state_up, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/networks/' + network_id;

        data = {
            "network" : {
            }
        };

        if (name !== undefined) {
            data.network.name = name;
        }

        if (admin_state_up !== undefined) {
            data.network.admin_state_up = admin_state_up;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    deletenetwork = function(network_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/networks/' + network_id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOK, onError);
    };

    getsubnetslist = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/subnets';

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

    createsubnet = function(network_id, cidr, name, allocation_pools, tenant_id, gateway_ip, ip_version, enable_dhcp, dns_nameservers, host_routes, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }        
        url = params.url + 'v2.0/subnets';

        data = {
            "subnet" : {
                "network_id" : network_id,
                "cidr" : cidr,
                "ip_version" : ip_version
            }
        }

        if (name !== undefined) {
            data.subnet.name = name;
        }

        if (tenant_id !== undefined) {
            data.subnet.tenant_id = tenant_id;
        }

        if (allocation_pools !== undefined) {
            data.subnet.allocation_pools = allocation_pools;
        }

        if (gateway_ip !== undefined) {
            data.subnet.gateway_ip = gateway_ip;
        }

        if (enable_dhcp !== undefined) {
            data.subnet.enable_dhcp = enable_dhcp;
        }

        if (dns_nameservers !== undefined) {
            data.subnet.dns_nameservers = dns_nameservers;
        }

        if (host_routes !== undefined) {
            data.subnet.host_routes = host_routes;
        }

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

        JS.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    getsubnetdetail = function(subnet_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/subnets/' + subnet_id;

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

    updatesubnet = function(subnet_id, name, gateway_ip, enable_dhcp, dns_nameservers, host_routes, callback, error, region) {
        var url, onOK, onError, data, i, start, end, dns_nameserver, dns_nservers = [], host_route, h_routes = [];
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/subnets/' + subnet_id;

        data = {
            "subnet" : {
            }
        }

        if (name !== undefined) {
            data.subnet.name = name;
        }

        if (gateway_ip !== undefined) {
            data.subnet.gateway_ip = gateway_ip;
        }

        if (enable_dhcp !== undefined) {
            data.subnet.enable_dhcp = enable_dhcp;
        }

        if (dns_nameservers !== undefined) {
            for (i in dns_nameservers) {
                if (dns_nameservers[i] !== undefined) {
                    dns_nameserver = dns_nameservers[i];
                    dns_nservers.push(dns_nameserver);
                }
            }
            data.subnet.dns_nameservers = dns_nservers;
        }

        if (host_routes !== undefined) {
            for (i in host_routes) {
                if (host_routes[i] !== undefined) {
                    host_route = host_routes[i];
                    h_routes.push(host_route);
                }
            }
            data.subnet.host_routes = h_routes;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    deletesubnet = function(subnet_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/subnets/' + subnet_id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOK, onError);
    };

    getportslist = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/ports';

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

    createport = function(network_id, name, fixed_ips, security_groups, admin_state_up, status, tenant_id, mac_address, callback, error, region) {
        var url, onOK, onError, data, groups = [], i, group, fixed_ip, fix_ips = [];
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/ports';

        data = {
            "port" : {
                "network_id" : network_id
            }
        };

        if (status !== undefined) {
            data.port.status = status;
        }

        if (name !== undefined) {
            data.port.name = name;
        }

        if (admin_state_up !== undefined) {
            data.port.admin_state_up = admin_state_up;
        }

        if (tenant_id !== undefined) {
            data.port.tenant_id = tenant_id;
        }

        if (mac_address !== undefined) {
            data.port.mac_address = mac_address;
        }

        if (fixed_ips !== undefined) {
            for (i in fixed_ips) {
                if (fixed_ips[i] !== undefined) {
                    fixed_ip = fixed_ips[i];
                    fix_ips.push(fixed_ip);
                }
            }

            data.port.fixed_ips = fix_ips;
        }

        if (security_groups !== undefined) {
            for (i in security_groups) {
                if (security_groups[i] !== undefined) {
                    group = security_groups[i];
                    groups.push(group);
                }
            }

            data.port.security_groups = groups;
        }

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

        JS.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    getportdetail = function(port_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/ports/' + port_id;

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

    updateport = function(port_id, name, fixed_ips, security_groups, admin_state_up, status, tenant_id, mac_address, callback, error, region) {
        var url, onOK, onError, data, groups = [], i, group, fixed_ip, fix_ips = [];
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/ports/' + port_id;

        data = {
            "port" : {
            }
        };

        if (status !== undefined) {
            data.port.status = status;
        }   

        if (name !== undefined) {
            data.port.name = name;
        }

        if (admin_state_up !== undefined) {
            data.port.admin_state_up = admin_state_up;
        }

        if (tenant_id !== undefined) {
            data.port.tenant_id = tenant_id;
        }

        if (mac_address !== undefined) {
            data.port.mac_address = mac_address;
        }

        if (fixed_ips !== undefined) {
            for (i in fixed_ips) {
                if (fixed_ips[i] !== undefined) {
                    fixed_ip = fixed_ips[i];
                    fix_ips.push(fixed_ip);
                }
            }

            data.port.fixed_ips = fix_ips;
        }

        if (security_groups !== undefined) {
            for (i in security_groups) {
                if (security_groups[i] !== undefined) {
                    group = security_groups[i];
                    groups.push(group);
                }
            }

            data.port.security_groups = groups;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    deleteport = function(port_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/ports/' + port_id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOK, onError);
    };

    getrouterslist = function(callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }

        url = params.url + 'v2.0/routers';

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

    createrouter = function(name, admin_state_up, network_id, tenant_id, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/routers';

        data = {
            "router" : {
                "external_gateway_info" : {
                }
            }
        };

        if (network_id !== undefined) {
            data.router.external_gateway_info.network_id = network_id;
        }

        if (name !== undefined) {
            data.router.name = name;
        }

        if (admin_state_up !== undefined) {
            data.router.admin_state_up = admin_state_up;
        }

        if (tenant_id !== undefined) {
            data.router.tenant_id = tenant_id;
        }

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

        JS.Comm.post(url, data, JS.Keystone.params.token, onOK, onError);
    };

    getrouterdetail = function(router_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/routers/' + router_id;

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

    updaterouter = function(router_id, network_id, name, admin_state_up, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }
        
        url = params.url + 'v2.0/routers/' + router_id;

        data = {
            "router" : {
                "external_gateway_info" : {
                }
            }
        };

        if (network_id !== undefined) {
            data.router.external_gateway_info.network_id = network_id;
        }

        if (name !== undefined) {
            data.router.name = name;
        }

        if (admin_state_up !== undefined) {
            data.router.admin_state_up = admin_state_up;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    deleterouter = function(router_id, callback, error, region) {
        var url, onOK, onError;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/routers/' + router_id;

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

        JS.Comm.del(url, JS.Keystone.params.token, onOK, onError);
    };

    addinterfacetorouter = function(router_id, subnet_id, port_id, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }
        url = params.url + 'v2.0/routers/' + router_id + '/add_router_interface';

        data = {
         
        };

        if (subnet_id !== undefined) {
            data.subnet_id = subnet_id;
        }

        if (port_id !== undefined) {
            data.port_id = port_id;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    removeinterfacefromrouter = function(router_id, port_id, subnet_id, callback, error, region) {
        var url, onOK, onError, data;
        if (!check(region)) {
            return;
        }

        data = {  
             
        };

        url = params.url + 'v2.0/routers/' + router_id + '/remove_router_interface';

        if (subnet_id !== undefined) {
            data.subnet_id = subnet_id;
        }

        if (port_id !== undefined) {
            data.port_id = port_id;
        }

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

        JS.Comm.put(url, data, JS.Keystone.params.token, onOK, onError);
    };

    // Public Functions and Variables
    // ------------------------------
    // This is the list of available public functions and variables
    return {
        params : params,
        // Functions:
        configure: configure,
        getnetworkslist : getnetworkslist,
        getnetworkdetail : getnetworkdetail,
        createnetwork : createnetwork,
        updatenetwork : updatenetwork,
        deletenetwork : deletenetwork,
        getsubnetslist : getsubnetslist,
        getsubnetdetail : getsubnetdetail,
        createsubnet : createsubnet,
        updatesubnet : updatesubnet,
        deletesubnet : deletesubnet,
        getportslist : getportslist,
        getportdetail : getportdetail,
        createport : createport,
        updateport : updateport,
        deleteport : deleteport,
        getrouterslist : getrouterslist,
        createrouter : createrouter,
        updaterouter : updaterouter,
        getrouterdetail :getrouterdetail,
        deleterouter : deleterouter,
        addinterfacetorouter : addinterfacetorouter,
        removeinterfacefromrouter : removeinterfacefromrouter
    };

}(JSTACK));