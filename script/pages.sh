#!/bin/sh

rm -rf public coverage

npm test

mkdir public

mv coverage public/

npm run pages-index

exit 0

