JSTACK.Comm = (function(JS,undefined){
	
	var _send = function(method, url, data, token, callBackOK, callbackError) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function() {
			
  			if (xhr.readyState == 4) {
  				switch(xhr.status) {
  					case 200:case 201:case 202:
  					case 203:case 204:case 205:
	  					var result = undefined;
		  				if (xhr.responseText != undefined && 
		  					xhr.responseText != '') {
		  					result = JSON.parse(xhr.responseText);
		  				}
		  				callBackOK(result);
		  				break;
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
		
		if (token != undefined) {
			xhr.setRequestHeader('X-Auth-Token', token);
		}
		
		var body;
		
		if (data != undefined) {
			body = JSON.stringify(data);
			xhr.send(body);
		} else {
			xhr.send();
		}
	}
	
	var get = function (url, token, callbackOK, callbackError) {
		_send("GET", url, undefined, token, callbackOK, callbackError);
	}
	
	var post = function (url, data, token, callbackOK, callbackError) {
		_send("POST", url, data, token, callbackOK, callbackError);
	}
	
	var put = function (url, data, token, callbackOK, callbackError) {
		_send("PUT", url, data, token, callbackOK, callbackError);
	}
	
	var del = function (url, token, callbackOK, callbackError) {
		_send("DELETE", url, undefined, token, callbackOK, callbackError);
	}
	
	return {
		get		:get,
		post	:post,
		put		:put,
		del		:del
	}
}) (JSTACK);
	