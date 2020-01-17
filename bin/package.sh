#!/usr/bin/env bash

set -e

cp package.json dist/
cp yarn.lock dist/
cd dist
yarn install --production
cd ..
cdk --profile __STACK__ synth > cloudformation.yaml
