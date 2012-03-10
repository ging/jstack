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

var JSTACK = require('./jstack');

var printAll = function(result) {console.log(JSON.stringify(result,null,4));}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
}

var exitApp = function() {
    console.log('Usage: jstack [-u|--username] username [-p|--password] password [-l|--url] keystone-url [-t|--tenant] tenant action [arguments]');
    console.log();
    console.log('Username, password, tenant and keystone-url can be also stored in environment variables:');
    console.log('          OS_USERNAME : username');
    console.log('          OS_PASSWORD : password');
    console.log('          OS_TENANT   : tenant');
    console.log('          OS_URL      : keystone url');
    console.log();
    console.log('Available actions:');
    console.log('          server-list');
    console.log('          image-list');
    console.log('          flavor-list');
    console.log('          server-details [-i|--id] server_id');

    process.exit(1);
}

var username = undefined;
var password = undefined;
var tenant = undefined;
var url = undefined;
var action = undefined;
var id = undefined;

username = process.env.OS_USERNAME;
password = process.env.OS_PASSWORD;
tenant = process.env.OS_TENANT;
url = process.env.OS_URL;

for (var i=2;i<process.argv.length;i++) {
  switch( process.argv[i]) {
    case '-h':
    case '--help':
        exitApp();
        break;
    case '-u':
    case '--username':
          i++;
          username = process.argv[i];
          break;
    case '-p':
    case '--password':
          i++;
          password = process.argv[i];
          break;
    case '-t':
    case '--tenant':
         i++;
         tenant = process.argv[i];
         break;
    case '-l':
    case '--url':
         i++;
         url = process.argv[i];
         break;
    case '-a':
    case '--action':
         i++;
         action = process.argv[i];
         break;
    default:
         if (process.argv[i].startsWith('-')) {
             exitApp();
         }
         action = process.argv[i];
         for (var j=i;j<process.argv.length;j++) {
             switch(process.argv[j]) {
                 case '-i':
                 case '--id':
                    j++;
                    id = process.argv[j];
                    break;
             }
         }
         i = process.argv.length;
  }
}

if (username == undefined || password == undefined || url == undefined) {
	exitApp();
}

if (tenant == undefined) {
        console.log('No tenant');
        process.exit(1);
}

if (action == undefined) {
        console.log('No action');
        process.exit(1);
}

JSTACK.Keystone.init(url);

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

var makeHeaders = function(structure) {
    var line1 = '+';
    var line2 = '|';
    for(var header in structure){
        var size = structure[header].length;
        line1 += Array(size).join('-') + '+';
        line2 += header + Array(size-header.length).join(' ') + '|';
    }
    var rtnHeader = line1 + '\n' + line2 + '\n' + line1 ;
    return rtnHeader; 
}

var makeRow = function(structure, data) {
    var line1 = '+';
    var line2 = '|';
    for(var header in structure){
        var field = structure[header].field;
        var size = structure[header].length;
        var cell = (data[field] == undefined) ? ' ' : data[field] + '';
        line1 += Array(size).join('-') + '+';
        line2 += cell + Array(size-cell.length).join(' ') + '|';
    }
    var rtnHeader = line2;
    return rtnHeader;
}

var makeTable = function(structure, data) {
    text = makeHeaders(structure) + '\n';
    for (var index in data) {
        var input = data[index];
        text += makeRow(structure,input) + '\n';    
    }
    return text;
}

String.prototype.splice = function( idx, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(s.length)));
};

var authenticated = function(result) {
  switch(action) {
      case 'server-list':
          var onserverlist = function(result) {
              //  var createserver = function(name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
              for (var index in result.servers) {
                  var server = result.servers[index];
                  server.image_id = server.image.id;
                  server.flavor_id = server.flavor.id;
              }
              var structure = {
                  "ID": {length:4, field:"id"}, 
                  "USER_ID": {length:11, field:"user_id"}, 
                  "TENANT_ID": {length:11, field:"tenant_id"}, 
                  "NAME": {length:28, field:"name"}, 
                  "STATUS": {length:10, field:"status"}, 
                  "PROGRESS": {length:23, field:"progress"}, 
                  "IMAGE": {length:7, field:"image_id"}, 
                  "FLAVOR": {length:8, field:"flavor_id"}, 
                  "KEY_NAME": {length:10, field:"key_name"}, 
                  "CREATED": {length:23, field:"created"}, 
                  "UPDATED": {length:23, field:"updated"}, 
              }
              var table = makeTable(structure, result.servers);
              console.log(table);
          }
          if (id == undefined) {
              JSTACK.Nova.getserverlist(true, onserverlist);
          } else {
              JSTACK.Nova.getserverdetail(id, onserverlist);
          }
          break;
      case 'image-list':
            var onserverlist = function(result) {
                //  var createserver = function(name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
                for (var index in result.images) {
                  var image = result.images[index];
                  image.architecture = image.metadata.architecture;
                }
                var structure = {
                    "ID": {length:4, field:"id"}, 
                    "NAME": {length:28, field:"name"}, 
                    "STATUS": {length:10, field:"status"}, 
                    "PROGRESS": {length:23, field:"progress"}, 
                    "CREATED": {length:23, field:"created"}, 
                    "UPDATED": {length:23, field:"updated"}, 
                    "ARCHITECTURE": {length:15, field:"architecture"}, 
                }
                var table = makeTable(structure, result.images);
                console.log(table);
            }
            JSTACK.Nova.getimagelist(true, onserverlist);
            break;
        case 'flavor-list':
              var onserverlist = function(result) {
                  //  var createserver = function(name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
                  var structure = {
                      "ID": {length:4, field:"id"}, 
                      "NAME": {length:28, field:"name"}, 
                      "RAM": {length:10, field:"ram"}, 
                      "DISK": {length:23, field:"disk"}, 
                      "VCPUS": {length:23, field:"vcpus"}, 
                  }
                  var table = makeTable(structure, result.flavors);
                  console.log(table);
              }
              JSTACK.Nova.getflavorlist(true, onserverlist);
              break;
        case 'server-detail':
              var onserverlist = function(result) {
                  //  var createserver = function(name, imageRef, flavorRef, key_name, user_data, security_groups, min_count, max_count, availability_zone, callback) {
                  var server = result.server;
                  server.image_id = server.image.id;
                  server.flavor_id = server.flavor.id;
                  var structure = {
                      "ID": {length:4, field:"id"}, 
                      "USER_ID": {length:11, field:"user_id"}, 
                      "TENANT_ID": {length:11, field:"tenant_id"}, 
                      "NAME": {length:28, field:"name"}, 
                      "STATUS": {length:10, field:"status"}, 
                      "PROGRESS": {length:23, field:"progress"}, 
                      "IMAGE": {length:7, field:"image_id"}, 
                      "FLAVOR": {length:8, field:"flavor_id"}, 
                      "KEY_NAME": {length:10, field:"key_name"}, 
                      "CREATED": {length:23, field:"created"}, 
                      "UPDATED": {length:23, field:"updated"}, 
                  }
                  var data = {servers:[server]}
                  var table = makeTable(structure, data.servers);
                  console.log(table);
              }
              if (id == undefined) {
                  exitApp();
              } else {
                  JSTACK.Nova.getserverdetail(id, onserverlist);
              }
              break;
  }
}

JSTACK.Keystone.authenticate(username, password, tenant, authenticated);
