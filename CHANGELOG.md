# Check File Dependencies Changelog

## 6.0.0
- Dropping support for Node 18 and 20
- Add support for node 22+
- Updated most dependencies
  - Acorn 8.10.0 -> 8.15.0
  - Acorn-walk 8.2.0 -> 8.3.4
  - escodegen 1.8.1 -> 2.1.0
  - got 6.7.1 -> 11.8.5
  - parents no change
  - resolve 1.2.0 -> 1.22.10
  - semver 5.3.0 -> 7.7.2
  - tar 6.1.11 -> 6.2.1
- Update dev dependency tape 4.6.3 -> 5.9.0

## 5.0.0

- Drop support for node 12 and 14
- Add support for node 18 and 20
- Add filename to parsing error raised by acorn when attempting to parse invalid Javascript
- Update acorn to v8.x
  - This introduces a dependency to acorn-walk

## 4.0.0

- Drop support for node 6 and 8
- Add support for node 12 and 14
- Security Vulnerability Fix
  - npm audit fix
    - minimist
    - minimatch
  - Update tar from 2.2.2 to 6.1.11

## 3.2.1

- tar@2.2.2 and fstream@1.0.12 according to security alerts

## 3.2.0

- Add support for `!#/usr/bin/env node` or `hasbang` scripts.

## 3.1.0

- Adds support for @org dependencies, subdir dependencies and escm 9.

## 3.0.0

- This is the first version in the changelog. This module is designed to throw errors if any of the dependencies of a single node file are not currently loaded.
