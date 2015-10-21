#!/bin/bash

MY_PATH="`dirname \"$0\"`"

mkdir -p $MY_PATH/bin/
g++ -o $MY_PATH/bin/HaeringAPI $MY_PATH/HaeringAPI.cc
