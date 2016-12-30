#!/bin/sh

rm -rf public coverage docs node_modules

npm install

mkdir public

npm run coverage

mv coverage public/

npm run document

mv docs public/

mkdir public/img

cp img/dependencies.svg public/img/
cp img/dependencies-test.svg public/img/

npm run readme

npm run pages-index

exit 0

