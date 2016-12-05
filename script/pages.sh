#!/bin/sh

rm -rf public coverage

npm install

npm test

mkdir public

mv coverage public/

npm run pages-index

exit 0

