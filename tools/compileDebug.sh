#!/bin/bash
OUTPUT=../release/jstack.js
rm $OUTPUT
cat ../src/JSTACK.js >> $OUTPUT
cat ../src/JSTACK.Comm.js >> $OUTPUT
cat ../src/JSTACK.Utils.js >> $OUTPUT
cat ../src/JSTACK.Keystone.js >> $OUTPUT
cat ../src/JSTACK.Nova.js >> $OUTPUT
cat ../src/JSTACK.Swift.js >> $OUTPUT
cat ../src/JSTACK.Cinder.js >> $OUTPUT
cat ../src/JSTACK.Glance.js >> $OUTPUT
cat ../src/JSTACK.Neutron.js >> $OUTPUT