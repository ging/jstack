#!/bin/bash

java -jar compiler.jar --js ../src/JSTACK.js --js ../src/JSTACK.Comm.js --js ../src/JSTACK.Utils.js --js ../src/JSTACK.Keystone.js --js ../src/JSTACK.Nova.js --js ../src/JSTACK.Glance.js --js_output_file ../release/jstack.js --formatting pretty_print 


#--compilation_level ADVANCED_OPTIMIZATIONS
#cat ../src/JSTACK.js > ../release/jstack.js
#cat ../src/JSTACK.Comm.js >> ../release/jstack.js
#cat ../src/JSTACK.Utils.js >> ../release/jstack.js
#cat ../src/JSTACK.Keystone.js >> ../release/jstack.js
#cat ../src/JSTACK.Nova.js >> ../release/jstack.js
#cat ../src/JSTACK.Glance.js >> ../release/jstack.js
