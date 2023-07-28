#!/bin/sh

MY_PATH="`dirname \"$0\"`"

mkdir -p $MY_PATH/bin/
g++ -o $MY_PATH/bin/RedDotAPI $MY_PATH/RedDotAPI.cc
