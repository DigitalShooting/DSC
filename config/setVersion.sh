#!/bin/bash

MY_PATH="`dirname \"$0\"`"

git rev-parse --short HEAD > $MY_PATH/version.tmp
