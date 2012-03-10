#!/bin/bash

TARGET=../npm/package/lib/jstack.js

current_dir=`pwd`

echo 'var XMLHttpRequest = require("./../vendor/xmlhttprequest").XMLHttpRequest;' > ../npm/package/lib/jstack.js
cat ../release/jstack.js >> ../npm/package/lib/jstack.js
echo 'module.exports = JSTACK;' >> ../npm/package/lib/jstack.js

cd ../npm/

tar -czvf package.tgz package/

cd $current_dir