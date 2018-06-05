#!/bin/bash
set -e # Exit with nonzero exit code if anything fails
yarn test --forceExit --maxWorkers=4 --no-watchman

