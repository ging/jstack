JSTACK.Keystone = (function(JS,undefined){
	
	var STATES = {
    	DISCONNECTED 			: 0,
    	AUTHENTICATING 			: 1,
    	AUTHENTICATED 			: 2,
    	AUTHENTICATION_ERROR	: 3
	}
	
	var params = {
		url				: undefined,
		currentstate 	: undefined,
		access			: undefined,
		token			: undefined
	}
	
	var init = function(keystoneUrl) {
		params.url= keystoneUrl;
		params.access = undefined;
		params.currentstate = STATES.DISCONNECTED;
	}
	
	var authenticate = function(username, password, tenant, callback) {
		var credentials = {
    		"auth":{
		        "passwordCredentials":{
        	    	"username":username,
            		"password":password
        		}
    		}
		};
		
		if (tenant !== 'undefined') {
			credentials.auth.tenantId = tenant;
		}
		params.currentstate = STATES.AUTHENTICATING;
		
		var _onOK = function (result) {
			params.currentstate = JS.Keystone.STATES.AUTHENTICATED;
			params.access = result.access;
			params.token = params.access.token.id;
			if (callback != undefined)
				callback(result);
		}
		
		var _onError = function (message) {
			params.currentstate = STATES.AUTHENTICATION_ERROR;
			//TODO 
			throw Error(message);
		}
		
		JS.Comm.post(params.url + "tokens", credentials, undefined, _onOK, _onError);
	}
	

	/*
	service:
		endpoints: [
			{adminURL: "http://138.4.24.120:8774/v1.1/2",
			internalURL: "http://138.4.24.120:8774/v1.1/2",
			publicURL: "http://138.4.24.120:80/v1.1/2",
			region: "nova"}
			],
		name: "nova",
		type: "compute"
	*/
	var getservice = function (name) {
		if (params.currentstate != STATES.AUTHENTICATED) {
			return undefined;
		}
		for (var index in params.access.serviceCatalog) {
			var service = params.access.serviceCatalog[index];
			if (name == service.name) {
				return service;
			}
		}
		return undefined;
	}
	
	/*
	 tenants: {
		links: [
			{	href: "http://138.4.24.120:5000/tenants?'marker=2&limit=10'",
				rel: "prev"
			}
		],
		values: [
			{
				description: "test",
				enabled: true,
				id: "3",
				name: "test"
			},
			{
				description: "None",
				enabled: true,
				id: "2",
				name: "demo"
			},
			{
				description: "None",
				enabled: true,
				id: "1",
				name: "admin"
			}
		]
		}
	 */
	var gettenants = function (callback) {
		if (params.currentstatus == JS.Keystone.STATES.AUTHENTICATED) {
			
			var _onOK = function (result) {
				if (callback != undefined)
					callback(result);
			}
		
			var _onError = function (result) {
				//TODO
			}
			
			JS.Comm.get(params.url + "tenants", params.token, _onOK, _onError);
		}
	}
	
	return {
		init				: init,
		STATES				: STATES,
		params				: params,
		authenticate		: authenticate,
		gettenants			: gettenants,
		getservice			: getservice
	};
}) (JSTACK);