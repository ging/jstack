#!/bin/bash

TARGET=../npm/package/lib/jstack.js

current_dir=`pwd`

# License
echo '/*' > $TARGET
cat ../LICENSE >> $TARGET
echo '*/' >> $TARGET

# Body
echo 'var XMLHttpRequest = require("./../vendor/xmlhttprequest").XMLHttpRequest;' >> $TARGET
cat ../release/jstack.js >> $TARGET
echo 'module.exports = JSTACK;' >> $TARGET

cp ../LICENSE ../npm/package/

#cd ../npm/

#tar -czvf package.tgz package/

#cd $current_dir
