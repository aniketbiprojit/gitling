#!/bin/bash
npx tsc -p .
npx minify ./build/index.js > ./build/index.min.js
mv ./build/index.min.js ./build/index.js