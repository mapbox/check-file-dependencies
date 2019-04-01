#!/usr/bin/env node
'use strict';
const foo = 'bar';
const main = module.exports = () => console.log(foo);

if (require.main === module) {
  main();
}