#!/bin/bash
OUTPUT=../release/jstack.js
rm $OUTPUT
cat ../src/JSTACK.js >> $OUTPUT
cat ../src/JSTACK.Comm.js >> $OUTPUT
cat ../src/JSTACK.Utils.js >> $OUTPUT
cat ../src/JSTACK.Keystone.js >> $OUTPUT
cat ../src/JSTACK.Nova.js >> $OUTPUT
cat ../src/JSTACK.Nova.Volume.js >> $OUTPUT
cat ../src/JSTACK.Glance.js >> $OUTPUT