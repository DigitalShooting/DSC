#!/bin/sh

rm -r frontend/
wget -O frontend.tar.xz https://gitlab.com/digitalshooting/dsc-frontend/-/jobs/artifacts/master/raw/dsc-frontend.tar.xz?job=build
mkdir frontend
tar -xf frontend.tar.xz -C frontend/
rm frontend.tar.xz
