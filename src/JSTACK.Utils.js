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

JSTACK.Utils = (function(JS, undefined) {

    "use strict";

    var keyStr, utf8_encode, utf8_decode, encode, decode;

    // private property
    keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // private method for UTF-8 encoding
    utf8_encode = function (string) {
        var utftext = "", n, c;

        string = string.replace(/\r\n/g, "\n");

        for (n = 0; n < string.length; n = n + 1) {

            c = string.charCodeAt(n);

            if (c < 128) {
                utftext = utftext + String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext = utftext + String.fromCharCode((c >> 6) | 192);
                utftext = utftext + String.fromCharCode((c & 63) | 128);
            } else {
                utftext = utftext + String.fromCharCode((c >> 12) | 224);
                utftext = utftext + String.fromCharCode(((c >> 6) & 63) | 128);
                utftext = utftext + String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string = string + String.fromCharCode(c);
                i = i + 1;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string = string + String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i = i + 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i = i + 3;
            }

        }
        return string;
    };

    // public method for encoding
    encode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i = i + 1);
            chr2 = input.charCodeAt(i = i + 1);
            chr3 = input.charCodeAt(i = i + 1);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);

        }

        return output;
    };

    // public method for decoding
    decode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc2 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc3 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));
            enc4 = JS.Utils.keyStr.indexOf(input.charAt(i = i + 1));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = utf8_decode(output);

        return output;
    };

    return {
        encode : encode,
        decode : decode
    };
}(JSTACK));