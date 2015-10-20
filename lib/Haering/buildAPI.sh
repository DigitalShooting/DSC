#!/bin/bash

MY_PATH="`dirname \"$0\"`"

mkdir -p $MY_PATH/API/bin/
g++ -o $MY_PATH/API/bin/HaeringAPI $MY_PATH/API/HaeringAPI.cc
