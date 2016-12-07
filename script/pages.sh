#!/bin/sh

rm -rf public coverage docs node_modules

npm install

mkdir public

npm run coverage

mv coverage public/

npm run document

mv docs public/

npm run pages-index

exit 0

