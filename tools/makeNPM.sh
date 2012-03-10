#!/bin/bash

echo 'var XMLHttpRequest = require("./xmlhttprequest").XMLHttpRequest;' > ../npm/jstack.js
cat ../release/jstack.js >> ../npm/jstack.js
echo 'module.exports = JSTACK;' >> ../npm/jstack.js
