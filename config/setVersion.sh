#!/bin/bash

MY_PATH="`dirname \"$0\"`"

# Use current git head
# git rev-parse --short HEAD > $MY_PATH/version.tmp

# Use unixtime
date +%s > $MY_PATH/version.tmp
